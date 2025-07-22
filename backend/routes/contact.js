import express from 'express';
import {
  contactSchemas,
  validateRequest,
  validateIdParam,
  sanitizeObject,
} from '../utils/validation.js';
import {
  createContactMessage,
  getAllContactMessages,
  getUnreadMessages,
  updateMessageStatus,
  deleteMessage,
} from '../services/databaseService.js';

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Submit contact message
router.post('/', validateRequest(contactSchemas.create), async (req, res) => {
  try {
    // Sanitize input data
    const sanitizedData = sanitizeObject(req.body);

    // Add request metadata
    const messageData = {
      ...sanitizedData,
      source: 'contact_form',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent'),
    };

    const result = await createContactMessage(messageData);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        subject: result.data.subject,
      },
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
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
