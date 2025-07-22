

-- =====================================================
-- DH Portfolio Website Database Schema (Restructured)
-- =====================================================
-- This script creates all necessary tables and stored procedures
-- for the portfolio website backend and frontend functionality

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dh_portfolio_website_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE dh_portfolio_website_db;

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
-- Stores user accounts for admin access and authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =====================================================
-- 2. PROJECTS TABLE (Enhanced)
-- =====================================================
-- Stores portfolio projects with enhanced metadata
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
    
    -- Indexes for performance
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_published (published),
    INDEX idx_slug (slug),
    INDEX idx_featured_order (featured_order),
    INDEX idx_project_order (project_order),
    INDEX idx_created_at (created_at),
    INDEX idx_title (title)
);

-- =====================================================
-- 3. PROJECT_IMAGES TABLE
-- =====================================================
-- Stores multiple images per project for galleries
CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    image_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to projects table
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_project_id (project_id),
    INDEX idx_image_order (image_order),
    INDEX idx_is_primary (is_primary)
);

-- =====================================================
-- 4. CONTACT_MESSAGES TABLE (Enhanced)
-- =====================================================
-- Stores contact form submissions with enhanced tracking
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
    
    -- Indexes for performance
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email),
    INDEX idx_source (source)
);

-- =====================================================
-- 5. UPLOADS TABLE (Enhanced)
-- =====================================================
-- Stores file uploads with better organization
CREATE TABLE IF NOT EXISTS uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    path VARCHAR(500) NOT NULL,
    url VARCHAR(500),
    alt_text VARCHAR(255),
    uploaded_by INT,
    project_id INT,
    upload_type ENUM('image', 'video', 'model', 'document', 'other') DEFAULT 'other',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Indexes for performance
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_project_id (project_id),
    INDEX idx_upload_type (upload_type),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at),
    INDEX idx_mime_type (mime_type)
);

-- =====================================================
-- 6. SKILLS TABLE
-- =====================================================
-- Stores technical and creative skills
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
    
    -- Indexes for performance
    INDEX idx_category (category),
    INDEX idx_proficiency (proficiency),
    INDEX idx_is_featured (is_featured),
    INDEX idx_skill_order (skill_order),
    UNIQUE KEY unique_skill_name (name)
);

-- =====================================================
-- 7. TESTIMONIALS TABLE
-- =====================================================
-- Stores client testimonials and reviews
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
    
    -- Foreign key to projects table
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Indexes for performance
    INDEX idx_project_id (project_id),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_approved (is_approved),
    INDEX idx_testimonial_order (testimonial_order),
    INDEX idx_rating (rating)
);

-- =====================================================
-- 8. BLOG_POSTS TABLE
-- =====================================================
-- Stores blog posts and articles
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    author_id INT NOT NULL,
    featured_image VARCHAR(500),
    tags JSON,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    read_time INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key to users table
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_author_id (author_id),
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    INDEX idx_published_at (published_at),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Get featured projects with ordering
DELIMITER //
DROP PROCEDURE IF EXISTS get_featured_projects;
CREATE PROCEDURE get_featured_projects(IN p_limit INT)
BEGIN
    IF p_limit IS NULL OR p_limit <= 0 THEN
        SET p_limit = 6;
    END IF;
    SELECT 
        id,
        title,
        slug,
        short_description,
        category,
        technologies,
        tags,
        thumbnail_url,
        project_url,
        github_url,
        demo_url,
        featured_order,
        created_at
    FROM projects 
    WHERE featured = TRUE AND published = TRUE
    ORDER BY featured_order ASC, created_at DESC
    LIMIT p_limit;
END //

DELIMITER //
DROP PROCEDURE IF EXISTS get_projects_by_category;
CREATE PROCEDURE get_projects_by_category(IN p_category VARCHAR(50), IN p_limit INT, IN p_offset INT)
BEGIN
    IF p_limit IS NULL OR p_limit <= 0 THEN
        SET p_limit = 12;
    END IF;
    IF p_offset IS NULL OR p_offset < 0 THEN
        SET p_offset = 0;
    END IF;
    SELECT 
        id,
        title,
        slug,
        short_description,
        category,
        technologies,
        tags,
        thumbnail_url,
        project_url,
        github_url,
        demo_url,
        featured,
        created_at
    FROM projects 
    WHERE category = p_category AND published = TRUE
    ORDER BY project_order ASC, featured DESC, created_at DESC
    LIMIT p_limit OFFSET p_offset;
END //

DELIMITER //
DROP PROCEDURE IF EXISTS search_projects;
CREATE PROCEDURE search_projects(IN p_search_term VARCHAR(255), IN p_limit INT)
BEGIN
    IF p_limit IS NULL OR p_limit <= 0 THEN
        SET p_limit = 20;
    END IF;
    SELECT 
        id,
        title,
        slug,
        short_description,
        category,
        technologies,
        tags,
        thumbnail_url,
        project_url,
        github_url,
        demo_url,
        featured,
        created_at
    FROM projects 
    WHERE published = TRUE AND (
        title LIKE CONCAT('%', p_search_term, '%') OR
        short_description LIKE CONCAT('%', p_search_term, '%') OR
        description LIKE CONCAT('%', p_search_term, '%') OR
        JSON_SEARCH(technologies, 'one', p_search_term) IS NOT NULL OR
        JSON_SEARCH(tags, 'one', p_search_term) IS NOT NULL
    )
    ORDER BY featured DESC, created_at DESC
    LIMIT p_limit;
END //

DELIMITER //
DROP PROCEDURE IF EXISTS get_project_stats;
CREATE PROCEDURE get_project_stats()
BEGIN
    SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN featured = TRUE THEN 1 END) as featured_projects,
        COUNT(CASE WHEN published = TRUE THEN 1 END) as published_projects,
        COUNT(CASE WHEN category = 'web' THEN 1 END) as web_projects,
        COUNT(CASE WHEN category = 'mobile' THEN 1 END) as mobile_projects,
        COUNT(CASE WHEN category = '3d' THEN 1 END) as three_d_projects,
        COUNT(CASE WHEN category = 'animation' THEN 1 END) as animation_projects,
        COUNT(CASE WHEN category = 'illustration' THEN 1 END) as illustration_projects,
        COUNT(CASE WHEN category = 'game' THEN 1 END) as game_projects,
        COUNT(CASE WHEN category = 'other' THEN 1 END) as other_projects
    FROM projects;
END //

DELIMITER ;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample admin user (password: admin123)
-- Note: In production, this should be hashed with bcrypt
INSERT IGNORE INTO users (username, email, password_hash, role, first_name, last_name, bio) VALUES 
('admin', 'admin@daniel-hill.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', 'Daniel', 'Hill', 'Full-stack developer and creative technologist');

-- Insert sample projects
INSERT IGNORE INTO projects (title, slug, description, short_description, category, technologies, tags, thumbnail_url, project_url, github_url, featured, featured_order) VALUES 
(
    'Portfolio Website',
    'portfolio-website',
    'A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features include project showcase, contact form, admin panel, and 3D animations. The site demonstrates full-stack development skills with a focus on user experience and performance.',
    'Modern portfolio website showcasing full-stack development skills with React, TypeScript, and 3D animations.',
    'web',
    '["React", "TypeScript", "Tailwind CSS", "Node.js", "MySQL", "Three.js", "Framer Motion"]',
    '["portfolio", "full-stack", "react", "typescript", "3d"]',
    '/uploads/portfolio-website-thumb.jpg',
    'https://daniel-hill.com',
    'https://github.com/danhill225/portfolio',
    TRUE,
    1
),
(
    '3D Character Animation',
    '3d-character-animation',
    'A stunning 3D character animation created with Blender and After Effects. Features complex character rigging, realistic lighting, and smooth motion capture. The project showcases advanced 3D modeling and animation techniques.',
    'Advanced 3D character animation with complex rigging and realistic lighting.',
    'animation',
    '["Blender", "After Effects", "Cinema 4D", "Photoshop", "Substance Painter"]',
    '["3d", "animation", "character", "rigging", "lighting"]',
    '/uploads/3d-animation-thumb.jpg',
    'https://vimeo.com/example',
    NULL,
    TRUE,
    2
),
(
    'Mobile App Design System',
    'mobile-app-design-system',
    'A comprehensive mobile app design system with user experience focus. Includes wireframes, prototypes, design tokens, and final UI designs. The system demonstrates modern mobile design principles and accessibility standards.',
    'Comprehensive mobile app design system with UX focus and accessibility standards.',
    'mobile',
    '["Figma", "Adobe XD", "Sketch", "InVision", "Principle"]',
    '["mobile", "design-system", "ux", "accessibility", "prototyping"]',
    '/uploads/mobile-app-thumb.jpg',
    'https://dribbble.com/example',
    NULL,
    FALSE,
    0
),
(
    '3D Environment Collection',
    '3d-environment-collection',
    'A collection of high-quality 3D environments created for various projects. Includes architectural models, natural landscapes, and sci-fi environments. All models are optimized for real-time rendering and game engines.',
    'High-quality 3D environment collection optimized for real-time rendering.',
    '3d',
    '["Blender", "ZBrush", "Substance Painter", "Maya", "Unity"]',
    '["3d", "environments", "real-time", "game-ready", "architectural"]',
    '/uploads/3d-environments-thumb.jpg',
    'https://sketchfab.com/example',
    NULL,
    FALSE,
    0
),
(
    'Digital Art Series',
    'digital-art-series',
    'A series of digital illustrations showcasing artistic skills and creative vision. Various styles and techniques demonstrated including concept art, character design, and environmental illustration.',
    'Digital art series featuring concept art, character design, and environmental illustration.',
    'illustration',
    '["Photoshop", "Illustrator", "Procreate", "Krita", "Clip Studio Paint"]',
    '["digital-art", "concept-art", "character-design", "illustration"]',
    '/uploads/illustrations-thumb.jpg',
    'https://behance.net/example',
    NULL,
    FALSE,
    0
),
(
    'Interactive Game Prototype',
    'interactive-game-prototype',
    'An interactive game prototype built with Unity and C#. Features 3D environments, character controllers, and basic game mechanics. Demonstrates game development skills and understanding of player experience.',
    'Interactive 3D game prototype with custom mechanics and player experience focus.',
    'game',
    '["Unity", "C#", "Blender", "Photoshop", "Visual Studio"]',
    '["game-dev", "unity", "3d", "interactive", "prototype"]',
    '/uploads/game-prototype-thumb.jpg',
    'https://itch.io/example',
    'https://github.com/danhill225/game-prototype',
    TRUE,
    3
);

-- Insert sample skills
INSERT IGNORE INTO skills (name, category, proficiency, years_experience, is_featured, skill_order) VALUES 
('React', 'programming', 'expert', 4, TRUE, 1),
('TypeScript', 'programming', 'advanced', 3, TRUE, 2),
('Node.js', 'programming', 'advanced', 4, TRUE, 3),
('SQL', 'programming', 'expert', 5, TRUE, 4),
('C#', 'programming', 'advanced', 3, TRUE, 5),
('Blender', '3d', 'advanced', 3, TRUE, 6),
('Adobe Photoshop', 'design', 'advanced', 4, TRUE, 7),
('Unity', 'game', 'intermediate', 2, TRUE, 8),
('Figma', 'design', 'advanced', 3, FALSE, 9),
('Three.js', 'programming', 'intermediate', 2, FALSE, 10);

-- Insert sample testimonials
INSERT IGNORE INTO testimonials (client_name, client_title, client_company, testimonial, rating, is_featured, is_approved, testimonial_order) VALUES 
(
    'Sarah Johnson',
    'Creative Director',
    'Digital Studios Inc.',
    'Daniel delivered an exceptional portfolio website that perfectly captured our vision. His attention to detail and technical expertise made the project a huge success.',
    5,
    TRUE,
    TRUE,
    1
),
(
    'Michael Chen',
    'Project Manager',
    'Tech Innovations',
    'Working with Daniel was a pleasure. He consistently delivered high-quality work on time and was always responsive to feedback. Highly recommended!',
    5,
    TRUE,
    TRUE,
    2
),
(
    'Emily Rodriguez',
    'Art Director',
    'Creative Agency',
    'Daniel\'s 3D modeling and animation skills are outstanding. He brought our concepts to life with incredible attention to detail and creativity.',
    5,
    FALSE,
    TRUE,
    3
);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for featured projects
CREATE OR REPLACE VIEW featured_projects AS
SELECT 
    id,
    title,
    slug,
    short_description,
    category,
    technologies,
    tags,
    thumbnail_url,
    project_url,
    github_url,
    demo_url,
    featured_order,
    created_at
FROM projects 
WHERE featured = TRUE AND published = TRUE 
ORDER BY featured_order ASC, created_at DESC;

-- View for unread contact messages
CREATE OR REPLACE VIEW unread_messages AS
SELECT 
    id,
    name,
    email,
    phone,
    company,
    subject,
    message,
    priority,
    source,
    created_at
FROM contact_messages 
WHERE status = 'unread' 
ORDER BY priority DESC, created_at DESC;

-- View for project statistics
CREATE OR REPLACE VIEW project_statistics AS
SELECT 
    category,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN featured = TRUE THEN 1 END) as featured_count,
    COUNT(CASE WHEN published = TRUE THEN 1 END) as published_count
FROM projects 
GROUP BY category;

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

-- Trigger to update updated_at timestamp on projects
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to update updated_at timestamp on users
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to update updated_at timestamp on skills
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_skills_timestamp
BEFORE UPDATE ON skills
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to update updated_at timestamp on testimonials
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_testimonials_timestamp
BEFORE UPDATE ON testimonials
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to update updated_at timestamp on blog_posts
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_blog_posts_timestamp
BEFORE UPDATE ON blog_posts
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- =====================================================
-- INDEXES FOR OPTIMAL PERFORMANCE
-- =====================================================

-- Composite indexes for common query patterns
-- idx_projects_category_published
SET @index_name := 'idx_projects_category_published';
SET @table_name := 'projects';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_projects_category_published ON projects(category, published);

-- idx_projects_featured_published
SET @index_name := 'idx_projects_featured_published';
SET @table_name := 'projects';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_projects_featured_published ON projects(featured, published);

-- idx_projects_featured_order_published
SET @index_name := 'idx_projects_featured_order_published';
SET @table_name := 'projects';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_projects_featured_order_published ON projects(featured_order, published);

-- idx_contact_status_priority
SET @index_name := 'idx_contact_status_priority';
SET @table_name := 'contact_messages';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_contact_status_priority ON contact_messages(status, priority);

-- idx_contact_priority_created
SET @index_name := 'idx_contact_priority_created';
SET @table_name := 'contact_messages';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_contact_priority_created ON contact_messages(priority, created_at);

-- idx_uploads_project_type
SET @index_name := 'idx_uploads_project_type';
SET @table_name := 'uploads';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_uploads_project_type ON uploads(project_id, upload_type);

-- idx_skills_category_featured
SET @index_name := 'idx_skills_category_featured';
SET @table_name := 'skills';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_skills_category_featured ON skills(category, is_featured);

-- idx_testimonials_featured_approved
SET @index_name := 'idx_testimonials_featured_approved';
SET @table_name := 'testimonials';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_testimonials_featured_approved ON testimonials(is_featured, is_approved);

-- idx_blog_posts_status_published
SET @index_name := 'idx_blog_posts_status_published';
SET @table_name := 'blog_posts';
SET @sql := (
  SELECT IF(
    COUNT(1),
    CONCAT('DROP INDEX ', @index_name, ' ON ', @table_name),
    'SELECT 1'
  )
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = @table_name
    AND index_name = @index_name
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX idx_blog_posts_status_published ON blog_posts(status, published_at);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'dh_portfolio_website_db'
ORDER BY TABLE_NAME;

-- Verify stored procedures
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'dh_portfolio_website_db'
ORDER BY ROUTINE_NAME;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'project_images', COUNT(*) FROM project_images
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'uploads', COUNT(*) FROM uploads
UNION ALL
SELECT 'skills', COUNT(*) FROM skills
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts;

-- =====================================================
-- END OF SCHEMA
-- ===================================================== 