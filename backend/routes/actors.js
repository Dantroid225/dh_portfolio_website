import express from 'express';
import { getDB } from '../config/database.js';

const router = express.Router();

// GET /api/actors - Get top 50 actors using stored procedure
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute('CALL get_actor()');

    // The stored procedure returns results in the first element of the array
    const actors = rows[0];

    res.json({
      success: true,
      data: actors,
      count: actors.length,
    });
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch actors',
      error: error.message,
    });
  }
});

export default router;
