import express from 'express';
import { getDB } from '../config/database.js';

const router = express.Router();

// Submit contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    const db = getDB();
    const [result] = await db.execute(
      `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `,
      [name, email, subject || '', message]
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: {
        id: result.insertId,
        name,
        email,
        subject,
        message,
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

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

// Get unread messages (admin only)
router.get('/unread', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(`
      SELECT * FROM contact_messages 
      WHERE status = 'unread'
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unread messages',
    });
  }
});

// Update message status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be unread, read, or replied',
      });
    }

    const db = getDB();
    const [result] = await db.execute(
      `
      UPDATE contact_messages 
      SET status = ? 
      WHERE id = ?
    `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message status updated successfully',
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update message status',
    });
  }
});

// Delete message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const [result] = await db.execute(
      `
      DELETE FROM contact_messages WHERE id = ?
    `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message',
    });
  }
});

export default router;
