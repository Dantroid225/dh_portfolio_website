import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dh_portfolio_website_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

let pool;

export const connectDB = async () => {
  try {
    // Create connection pool
    pool = mysql.createPool(dbConfig);

    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();

    // Initialize database tables
    await initializeTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

export const getDB = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
};

const initializeTables = async () => {
  try {
    const connection = await pool.getConnection();

    // Create projects table (Enhanced)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        category ENUM('web', 'mobile', '3d', 'animation', 'illustration', 'game', 'other') NOT NULL,
        technologies JSON,
        tags JSON,
        client VARCHAR(255),
        client_url VARCHAR(500),
        project_url VARCHAR(500),
        github_url VARCHAR(500),
        demo_url VARCHAR(500),
        image_url VARCHAR(500),
        thumbnail_url VARCHAR(500),
        video_url VARCHAR(500),
        model_url VARCHAR(500),
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT TRUE,
        featured_order INT DEFAULT 0,
        project_order INT DEFAULT 0,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_featured (featured),
        INDEX idx_published (published),
        INDEX idx_slug (slug),
        INDEX idx_featured_order (featured_order),
        INDEX idx_project_order (project_order),
        INDEX idx_created_at (created_at),
        INDEX idx_title (title)
      )
    `);

    // Create project_images table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS project_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        caption TEXT,
        image_order INT DEFAULT 0,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_project_id (project_id),
        INDEX idx_image_order (image_order),
        INDEX idx_is_primary (is_primary)
      )
    `);

    // Create contact_messages table (Enhanced)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        source VARCHAR(100) DEFAULT 'contact_form',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_created_at (created_at),
        INDEX idx_email (email),
        INDEX idx_source (source)
      )
    `);

    // Create skills table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category ENUM('programming', 'design', '3d', 'animation', 'other') NOT NULL,
        proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
        years_experience INT DEFAULT 0,
        icon_url VARCHAR(500),
        description TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        skill_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_proficiency (proficiency),
        INDEX idx_is_featured (is_featured),
        INDEX idx_skill_order (skill_order),
        UNIQUE KEY unique_skill_name (name)
      )
    `);

    // Create testimonials table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_title VARCHAR(255),
        client_company VARCHAR(255),
        client_avatar VARCHAR(500),
        testimonial TEXT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        project_id INT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_approved BOOLEAN DEFAULT FALSE,
        testimonial_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        INDEX idx_project_id (project_id),
        INDEX idx_is_featured (is_featured),
        INDEX idx_is_approved (is_approved),
        INDEX idx_testimonial_order (testimonial_order),
        INDEX idx_rating (rating)
      )
    `);

    connection.release();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error.message);
    throw error;
  }
};

export default pool;
