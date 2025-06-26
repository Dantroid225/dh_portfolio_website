import express from 'express';
import { getDB } from '../config/database.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT * FROM projects 
      ORDER BY featured DESC, created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// Get projects by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const db = getDB();

    const [rows] = await db.execute(
      `
      SELECT * FROM projects 
      WHERE category = ? 
      ORDER BY featured DESC, created_at DESC
    `,
      [category]
    );

    res.json({
      success: true,
      data: rows,
      count: rows.length,
      category,
    });
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT * FROM projects 
      WHERE featured = true 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured projects',
    });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const [rows] = await db.execute(
      `
      SELECT * FROM projects WHERE id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// Create new project (protected route)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      technologies,
      image_url,
      video_url,
      model_url,
      live_url,
      github_url,
      featured = false,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and category are required',
      });
    }

    const db = getDB();
    const [result] = await db.execute(
      `
      INSERT INTO projects (
        title, description, category, technologies, 
        image_url, video_url, model_url, live_url, github_url, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        title,
        description,
        category,
        JSON.stringify(technologies || []),
        image_url || null,
        video_url || null,
        model_url || null,
        live_url || null,
        github_url || null,
        featured,
      ]
    );

    const [newProject] = await db.execute(
      `
      SELECT * FROM projects WHERE id = ?
    `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: newProject[0],
      message: 'Project created successfully',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
    });
  }
});

// Update project (protected route)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      technologies,
      image_url,
      video_url,
      model_url,
      live_url,
      github_url,
      featured,
    } = req.body;

    const db = getDB();

    // Check if project exists
    const [existing] = await db.execute(
      `
      SELECT id FROM projects WHERE id = ?
    `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    // Update project
    await db.execute(
      `
      UPDATE projects SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        technologies = COALESCE(?, technologies),
        image_url = COALESCE(?, image_url),
        video_url = COALESCE(?, video_url),
        model_url = COALESCE(?, model_url),
        live_url = COALESCE(?, live_url),
        github_url = COALESCE(?, github_url),
        featured = COALESCE(?, featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        title,
        description,
        category,
        JSON.stringify(technologies),
        image_url,
        video_url,
        model_url,
        live_url,
        github_url,
        featured,
        id,
      ]
    );

    const [updatedProject] = await db.execute(
      `
      SELECT * FROM projects WHERE id = ?
    `,
      [id]
    );

    res.json({
      success: true,
      data: updatedProject[0],
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
    });
  }
});

// Delete project (protected route)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const [result] = await db.execute(
      `
      DELETE FROM projects WHERE id = ?
    `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
    });
  }
});

export default router;
