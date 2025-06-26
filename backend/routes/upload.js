import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { getDB } from '../config/database.js';
import { verifyToken } from './auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, and 3D model files
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'model/gltf+json',
    'model/gltf-binary',
    'application/octet-stream', // For .glb files
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only images, videos, and 3D models are allowed.'
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Upload single file
router.post('/single', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { originalname, filename, mimetype, size, path: filePath } = req.file;

    // Process image files with Sharp
    if (mimetype.startsWith('image/')) {
      try {
        const processedPath = path.join(
          path.dirname(filePath),
          'processed-' + filename
        );
        await sharp(filePath)
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(processedPath);

        // Replace original with processed version
        const fs = await import('fs');
        fs.unlinkSync(filePath);
        fs.renameSync(processedPath, filePath);
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue with original file if processing fails
      }
    }

    // Save file info to database
    const db = getDB();
    const [result] = await db.execute(
      `
      INSERT INTO uploads (filename, original_name, mime_type, size, path, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [filename, originalname, mimetype, size, filePath, req.user.userId]
    );

    const fileUrl = `/uploads/${filename}`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: result.insertId,
        filename,
        originalName: originalname,
        mimeType: mimetype,
        size,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
    });
  }
});

// Upload multiple files
router.post(
  '/multiple',
  verifyToken,
  upload.array('files', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded',
        });
      }

      const uploadedFiles = [];
      const db = getDB();

      for (const file of req.files) {
        const { originalname, filename, mimetype, size, path: filePath } = file;

        // Process image files
        if (mimetype.startsWith('image/')) {
          try {
            const processedPath = path.join(
              path.dirname(filePath),
              'processed-' + filename
            );
            await sharp(filePath)
              .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toFile(processedPath);

            const fs = await import('fs');
            fs.unlinkSync(filePath);
            fs.renameSync(processedPath, filePath);
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }

        // Save to database
        const [result] = await db.execute(
          `
        INSERT INTO uploads (filename, original_name, mime_type, size, path, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
          [filename, originalname, mimetype, size, filePath, req.user.userId]
        );

        uploadedFiles.push({
          id: result.insertId,
          filename,
          originalName: originalname,
          mimeType: mimetype,
          size,
          url: `/uploads/${filename}`,
          uploadedAt: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload files',
      });
    }
  }
);

// Get uploaded files
router.get('/', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT * FROM uploads 
      ORDER BY created_at DESC
    `);

    const files = rows.map(file => ({
      ...file,
      url: `/uploads/${file.filename}`,
    }));

    res.json({
      success: true,
      data: files,
      count: files.length,
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch files',
    });
  }
});

// Delete file
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    // Get file info
    const [files] = await db.execute(
      `
      SELECT * FROM uploads WHERE id = ?
    `,
      [id]
    );

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    const file = files[0];

    // Delete physical file
    const fs = await import('fs');
    const filePath = path.join(__dirname, '..', file.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await db.execute(
      `
      DELETE FROM uploads WHERE id = ?
    `,
      [id]
    );

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 50MB.',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum is 10 files.',
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
});

export default router;
