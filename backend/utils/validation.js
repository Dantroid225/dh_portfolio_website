// =====================================================
// Validation Utilities for DH Portfolio Website
// =====================================================
// Comprehensive input validation and sanitization functions

import Joi from 'joi';

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

// Project validation schemas
export const projectSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 255 characters',
      'any.required': 'Title is required',
    }),
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.pattern.base':
          'Slug must contain only lowercase letters, numbers, and hyphens',
        'string.min': 'Slug cannot be empty',
        'string.max': 'Slug cannot exceed 255 characters',
        'any.required': 'Slug is required',
      }),
    description: Joi.string().min(1).max(65535).required().messages({
      'string.min': 'Description cannot be empty',
      'string.max': 'Description is too long',
      'any.required': 'Description is required',
    }),
    short_description: Joi.string().max(500).optional().messages({
      'string.max': 'Short description cannot exceed 500 characters',
    }),
    category: Joi.string()
      .valid(
        'web',
        'mobile',
        '3d',
        'animation',
        'illustration',
        'game',
        'other'
      )
      .required()
      .messages({
        'any.only':
          'Category must be one of: web, mobile, 3d, animation, illustration, game, other',
        'any.required': 'Category is required',
      }),
    technologies: Joi.array()
      .items(Joi.string().max(100))
      .max(20)
      .optional()
      .messages({
        'array.max': 'Cannot have more than 20 technologies',
      }),
    tags: Joi.array().items(Joi.string().max(50)).max(15).optional().messages({
      'array.max': 'Cannot have more than 15 tags',
    }),
    client: Joi.string().max(255).optional(),
    client_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Client URL must be a valid URL',
    }),
    project_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Project URL must be a valid URL',
    }),
    github_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'GitHub URL must be a valid URL',
    }),
    demo_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Demo URL must be a valid URL',
    }),
    image_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
    thumbnail_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Thumbnail URL must be a valid URL',
    }),
    video_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Video URL must be a valid URL',
    }),
    model_url: Joi.string().uri().max(500).optional().messages({
      'string.uri': 'Model URL must be a valid URL',
    }),
    featured: Joi.boolean().optional(),
    published: Joi.boolean().optional(),
    featured_order: Joi.number()
      .integer()
      .min(0)
      .max(1000)
      .optional()
      .messages({
        'number.min': 'Featured order must be 0 or greater',
        'number.max': 'Featured order cannot exceed 1000',
      }),
    project_order: Joi.number().integer().min(0).max(1000).optional().messages({
      'number.min': 'Project order must be 0 or greater',
      'number.max': 'Project order cannot exceed 1000',
    }),
    start_date: Joi.date().iso().optional().messages({
      'date.format': 'Start date must be a valid ISO date',
    }),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).optional().messages({
      'date.min': 'End date must be after start date',
    }),
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .min(1)
      .max(255)
      .optional(),
    description: Joi.string().min(1).max(65535).optional(),
    short_description: Joi.string().max(500).optional(),
    category: Joi.string()
      .valid(
        'web',
        'mobile',
        '3d',
        'animation',
        'illustration',
        'game',
        'other'
      )
      .optional(),
    technologies: Joi.array().items(Joi.string().max(100)).max(20).optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(15).optional(),
    client: Joi.string().max(255).optional(),
    client_url: Joi.string().uri().max(500).optional(),
    project_url: Joi.string().uri().max(500).optional(),
    github_url: Joi.string().uri().max(500).optional(),
    demo_url: Joi.string().uri().max(500).optional(),
    image_url: Joi.string().uri().max(500).optional(),
    thumbnail_url: Joi.string().uri().max(500).optional(),
    video_url: Joi.string().uri().max(500).optional(),
    model_url: Joi.string().uri().max(500).optional(),
    featured: Joi.boolean().optional(),
    published: Joi.boolean().optional(),
    featured_order: Joi.number().integer().min(0).max(1000).optional(),
    project_order: Joi.number().integer().min(0).max(1000).optional(),
    start_date: Joi.date().iso().optional(),
    end_date: Joi.date().iso().optional(),
  }),
};

// Contact message validation schemas
export const contactSchemas = {
  create: Joi.object({
    name: Joi.string()
      .min(1)
      .max(255)
      .pattern(/^[a-zA-Z\s'-]+$/)
      .required()
      .messages({
        'string.min': 'Name cannot be empty',
        'string.max': 'Name cannot exceed 255 characters',
        'string.pattern.base':
          'Name can only contain letters, spaces, hyphens, and apostrophes',
        'any.required': 'Name is required',
      }),
    email: Joi.string().email().max(255).required().messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email cannot exceed 255 characters',
      'any.required': 'Email is required',
    }),
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .max(50)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
      }),
    company: Joi.string().max(255).optional(),
    subject: Joi.string().max(255).optional(),
    message: Joi.string().min(1).max(10000).required().messages({
      'string.min': 'Message cannot be empty',
      'string.max': 'Message cannot exceed 10,000 characters',
      'any.required': 'Message is required',
    }),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid('unread', 'read', 'replied', 'archived')
      .required()
      .messages({
        'any.only': 'Status must be one of: unread, read, replied, archived',
        'any.required': 'Status is required',
      }),
    priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
      'any.only': 'Priority must be one of: low, medium, high',
    }),
  }),
};

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

/**
 * Validate request body against a schema
 * @param {Object} schema - Joi validation schema
 * @param {Object} data - Data to validate
 * @returns {Object} - Validation result with success and data/error
 */
export const validateData = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: value,
  };
};

/**
 * Validate and sanitize ID parameter
 * @param {string} id - ID to validate
 * @returns {Object} - Validation result
 */
export const validateId = id => {
  const schema = Joi.number().integer().positive().required();
  const { error, value } = schema.validate(parseInt(id));

  if (error) {
    return {
      success: false,
      error: 'Invalid ID parameter',
    };
  }

  return {
    success: true,
    data: value,
  };
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} - Validation result
 */
export const validatePagination = params => {
  const schema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
    page: Joi.number().integer().min(1).default(1),
  });

  return validateData(schema, params);
};

/**
 * Validate search parameters
 * @param {Object} params - Search parameters
 * @returns {Object} - Validation result
 */
export const validateSearch = params => {
  const schema = Joi.object({
    q: Joi.string().min(1).max(255).required(),
    category: Joi.string()
      .valid(
        'web',
        'mobile',
        '3d',
        'animation',
        'illustration',
        'game',
        'other'
      )
      .optional(),
    featured: Joi.boolean().optional(),
    limit: Joi.number().integer().min(1).max(50).default(20),
  });

  return validateData(schema, params);
};

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = input => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitize object properties recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// =====================================================
// MIDDLEWARE FUNCTIONS
// =====================================================

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware function
 */
export const validateRequest = schema => {
  return (req, res, next) => {
    const validation = validateData(schema, req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    req.body = validation.data;
    next();
  };
};

/**
 * ID parameter validation middleware
 */
export const validateIdParam = (req, res, next) => {
  const validation = validateId(req.params.id);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    });
  }

  req.params.id = validation.data;
  next();
};

/**
 * Pagination validation middleware
 */
export const validatePaginationParams = (req, res, next) => {
  const validation = validatePagination(req.query);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pagination parameters',
      details: validation.errors,
    });
  }

  req.query = { ...req.query, ...validation.data };
  next();
};

/**
 * Search validation middleware
 */
export const validateSearchParams = (req, res, next) => {
  const validation = validateSearch(req.query);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid search parameters',
      details: validation.errors,
    });
  }

  req.query = { ...req.query, ...validation.data };
  next();
};

export default {
  projectSchemas,
  contactSchemas,
  validateData,
  validateId,
  validatePagination,
  validateSearch,
  sanitizeString,
  sanitizeObject,
  validateRequest,
  validateIdParam,
  validatePaginationParams,
  validateSearchParams,
};
