// =====================================================
// Database Service Layer for DH Portfolio Website
// =====================================================
// Centralized database operations using stored procedures

import { getDB } from '../config/database.js';

// =====================================================
// PROJECT OPERATIONS
// =====================================================

/**
 * Get all projects with optional filtering and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Projects data
 */
export const getAllProjects = async (options = {}) => {
  const db = getDB();
  const { limit = 20, offset = 0, category, featured, published } = options;

  try {
    let query = `
      SELECT 
        id, title, slug, short_description, description, category,
        technologies, tags, client, client_url, project_url, github_url,
        demo_url, image_url, thumbnail_url, video_url, model_url,
        featured, published, featured_order, project_order,
        start_date, end_date, created_at, updated_at
      FROM projects 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      const categories = category
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);
      if (categories.length > 1) {
        query += ` AND category IN (${categories.map(() => '?').join(',')})`;
        params.push(...categories);
      } else {
        query += ' AND category = ?';
        params.push(categories[0]);
      }
    }

    if (typeof featured === 'boolean') {
      query += ' AND featured = ?';
      params.push(featured);
    }

    if (typeof published === 'boolean') {
      query += ' AND published = ?';
      params.push(published);
    }

    query +=
      ' ORDER BY featured_order ASC, project_order ASC, created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    return { success: true, data: rows, count: rows.length };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: 'Failed to fetch projects' };
  }
};

/**
 * Get featured projects using stored procedure
 * @param {number} limit - Number of projects to return
 * @returns {Promise<Object>} - Featured projects data
 */
export const getFeaturedProjects = async (limit = 6) => {
  const db = getDB();

  try {
    const [rows] = await db.execute('CALL get_featured_projects(?)', [limit]);
    return { success: true, data: rows[0], count: rows[0].length };
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return { success: false, error: 'Failed to fetch featured projects' };
  }
};

/**
 * Get projects by category using stored procedure
 * @param {string} category - Project category
 * @param {number} limit - Number of projects to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} - Projects data
 */
export const getProjectsByCategory = async (
  category,
  limit = 12,
  offset = 0
) => {
  const db = getDB();

  try {
    const [rows] = await db.execute('CALL get_projects_by_category(?, ?, ?)', [
      category,
      limit,
      offset,
    ]);
    return { success: true, data: rows[0], count: rows[0].length, category };
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    return { success: false, error: 'Failed to fetch projects by category' };
  }
};

/**
 * Search projects using stored procedure
 * @param {string} searchTerm - Search term
 * @param {number} limit - Number of results to return
 * @returns {Promise<Object>} - Search results
 */
export const searchProjects = async (searchTerm, limit = 20) => {
  const db = getDB();

  try {
    const [rows] = await db.execute('CALL search_projects(?, ?)', [
      searchTerm,
      limit,
    ]);
    return { success: true, data: rows[0], count: rows[0].length, searchTerm };
  } catch (error) {
    console.error('Error searching projects:', error);
    return { success: false, error: 'Failed to search projects' };
  }
};

/**
 * Get project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object>} - Project data
 */
export const getProjectById = async id => {
  const db = getDB();

  try {
    const [rows] = await db.execute(
      'SELECT * FROM projects WHERE id = ? AND published = TRUE',
      [id]
    );

    if (rows.length === 0) {
      return { success: false, error: 'Project not found', code: 404 };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
};

/**
 * Get project by slug
 * @param {string} slug - Project slug
 * @returns {Promise<Object>} - Project data
 */
export const getProjectBySlug = async slug => {
  const db = getDB();

  try {
    const [rows] = await db.execute(
      'SELECT * FROM projects WHERE slug = ? AND published = TRUE',
      [slug]
    );

    if (rows.length === 0) {
      return { success: false, error: 'Project not found', code: 404 };
    }

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
};

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} - Created project data
 */
export const createProject = async projectData => {
  const db = getDB();

  try {
    const {
      title,
      slug,
      description,
      short_description,
      category,
      technologies,
      tags,
      client,
      client_url,
      project_url,
      github_url,
      demo_url,
      image_url,
      thumbnail_url,
      video_url,
      model_url,
      featured = false,
      published = true,
      featured_order = 0,
      project_order = 0,
      start_date,
      end_date,
    } = projectData;

    // Check if slug already exists
    const [existing] = await db.execute(
      'SELECT id FROM projects WHERE slug = ?',
      [slug]
    );

    if (existing.length > 0) {
      return {
        success: false,
        error: 'Project with this slug already exists',
        code: 409,
      };
    }

    const [result] = await db.execute(
      `INSERT INTO projects (
        title, slug, description, short_description, category, technologies,
        tags, client, client_url, project_url, github_url, demo_url,
        image_url, thumbnail_url, video_url, model_url, featured, published,
        featured_order, project_order, start_date, end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        description,
        short_description,
        category,
        JSON.stringify(technologies || []),
        JSON.stringify(tags || []),
        client,
        client_url,
        project_url,
        github_url,
        demo_url,
        image_url,
        thumbnail_url,
        video_url,
        model_url,
        featured,
        published,
        featured_order,
        project_order,
        start_date,
        end_date,
      ]
    );

    const [newProject] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [result.insertId]
    );

    return {
      success: true,
      data: newProject[0],
      message: 'Project created successfully',
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
};

/**
 * Update project
 * @param {number} id - Project ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} - Updated project data
 */
export const updateProject = async (id, updateData) => {
  const db = getDB();

  try {
    // Check if project exists
    const [existing] = await db.execute(
      'SELECT id FROM projects WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return { success: false, error: 'Project not found', code: 404 };
    }

    // Check if slug is being updated and if it already exists
    if (updateData.slug) {
      const [slugExists] = await db.execute(
        'SELECT id FROM projects WHERE slug = ? AND id != ?',
        [updateData.slug, id]
      );

      if (slugExists.length > 0) {
        return {
          success: false,
          error: 'Project with this slug already exists',
          code: 409,
        };
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const params = [];

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'technologies' || key === 'tags') {
          updateFields.push(`${key} = ?`);
          params.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = ?`);
          params.push(value);
        }
      }
    });

    if (updateFields.length === 0) {
      return { success: false, error: 'No valid fields to update' };
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const [result] = await db.execute(
      `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    const [updatedProject] = await db.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    return {
      success: true,
      data: updatedProject[0],
      message: 'Project updated successfully',
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
};

/**
 * Delete project
 * @param {number} id - Project ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteProject = async id => {
  const db = getDB();

  try {
    const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [
      id,
    ]);

    if (result.affectedRows === 0) {
      return { success: false, error: 'Project not found', code: 404 };
    }

    return { success: true, message: 'Project deleted successfully' };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
};

/**
 * Get project statistics using stored procedure
 * @returns {Promise<Object>} - Project statistics
 */
export const getProjectStats = async () => {
  const db = getDB();

  try {
    const [rows] = await db.execute('CALL get_project_stats()');
    return { success: true, data: rows[0][0] };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return { success: false, error: 'Failed to fetch project statistics' };
  }
};

// =====================================================
// CONTACT MESSAGE OPERATIONS
// =====================================================

/**
 * Create contact message
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} - Created message data
 */
export const createContactMessage = async messageData => {
  const db = getDB();

  try {
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      source = 'contact_form',
      ip_address,
      user_agent,
    } = messageData;

    const [result] = await db.execute(
      `INSERT INTO contact_messages (
        name, email, phone, company, subject, message,
        source, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        company,
        subject,
        message,
        source,
        ip_address,
        user_agent,
      ]
    );

    const [newMessage] = await db.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [result.insertId]
    );

    return {
      success: true,
      data: newMessage[0],
      message: 'Message sent successfully',
    };
  } catch (error) {
    console.error('Error creating contact message:', error);
    return { success: false, error: 'Failed to send message' };
  }
};

/**
 * Get all contact messages
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Messages data
 */
export const getAllContactMessages = async (options = {}) => {
  const db = getDB();
  const { limit = 50, offset = 0, status, priority } = options;

  try {
    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    return { success: true, data: rows, count: rows.length };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { success: false, error: 'Failed to fetch messages' };
  }
};

/**
 * Get unread messages
 * @returns {Promise<Object>} - Unread messages data
 */
export const getUnreadMessages = async () => {
  const db = getDB();

  try {
    const [rows] = await db.execute(
      'SELECT * FROM contact_messages WHERE status = "unread" ORDER BY priority DESC, created_at DESC'
    );
    return { success: true, data: rows, count: rows.length };
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return { success: false, error: 'Failed to fetch unread messages' };
  }
};

/**
 * Update message status
 * @param {number} id - Message ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} - Update result
 */
export const updateMessageStatus = async (id, updateData) => {
  const db = getDB();

  try {
    const { status, priority } = updateData;

    const [result] = await db.execute(
      'UPDATE contact_messages SET status = ?, priority = COALESCE(?, priority), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, priority, id]
    );

    if (result.affectedRows === 0) {
      return { success: false, error: 'Message not found', code: 404 };
    }

    return { success: true, message: 'Message status updated successfully' };
  } catch (error) {
    console.error('Error updating message status:', error);
    return { success: false, error: 'Failed to update message status' };
  }
};

/**
 * Delete message
 * @param {number} id - Message ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMessage = async id => {
  const db = getDB();

  try {
    const [result] = await db.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return { success: false, error: 'Message not found', code: 404 };
    }

    return { success: true, message: 'Message deleted successfully' };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: 'Failed to delete message' };
  }
};

// =====================================================
// USER OPERATIONS
// =====================================================

export default {
  // Project operations
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

  // Contact operations
  createContactMessage,
  getAllContactMessages,
  getUnreadMessages,
  updateMessageStatus,
  deleteMessage,
};
