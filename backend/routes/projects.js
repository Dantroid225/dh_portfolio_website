import express from 'express';
import {
  projectSchemas,
  validateRequest,
  validateIdParam,
  validatePaginationParams,
  validateSearchParams,
  sanitizeObject,
} from '../utils/validation.js';
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  searchProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from '../services/databaseService.js';

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all projects with pagination and filtering
router.get('/', validatePaginationParams, async (req, res) => {
  try {
    const { limit, offset, category, featured, published } = req.query;

    const result = await getAllProjects({
      limit: parseInt(limit),
      offset: parseInt(offset),
      category,
      featured: featured === 'true',
      published: published === 'true',
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.count === parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// Get featured projects using stored procedure
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const result = await getFeaturedProjects(parseInt(limit));

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured projects',
    });
  }
});

// Get projects by category using stored procedure
router.get(
  '/category/:category',
  validatePaginationParams,
  async (req, res) => {
    try {
      const { category } = req.params;
      const { limit = 12, offset = 0 } = req.query;

      // Validate category
      const validCategories = [
        'web',
        'mobile',
        '3d',
        'animation',
        'illustration',
        'game',
        'other',
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category',
        });
      }

      const result = await getProjectsByCategory(
        category,
        parseInt(limit),
        parseInt(offset)
      );

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
        category,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: result.count === parseInt(limit),
        },
      });
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects by category',
      });
    }
  }
);

// Search projects using stored procedure
router.get('/search', validateSearchParams, async (req, res) => {
  try {
    const { q: searchTerm, limit = 20 } = req.query;

    const result = await searchProjects(searchTerm, parseInt(limit));

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
      searchTerm,
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search projects',
    });
  }
});

// Get project statistics using stored procedure
router.get('/stats', async (req, res) => {
  try {
    const result = await getProjectStats();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project statistics',
    });
  }
});

// Get single project by ID
router.get('/id/:id', validateIdParam, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProjectById(id);

    if (!result.success) {
      return res.status(result.code || 500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// Get single project by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid slug format',
      });
    }

    const result = await getProjectBySlug(slug);

    if (!result.success) {
      return res.status(result.code || 500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================

// Handle 404 for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default router;
