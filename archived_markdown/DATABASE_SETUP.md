# Database Setup for DH Portfolio Website

This document provides instructions for setting up the database for the DH Portfolio Website using the provided SQL scripts.

## Overview

The database consists of 8 main tables:

- **users** - User accounts and authentication (Enhanced)
- **projects** - Portfolio projects with enhanced metadata
- **project_images** - Multiple images per project for galleries
- **contact_messages** - Contact form submissions with enhanced tracking
- **uploads** - File uploads with better organization
- **skills** - Technical and creative skills
- **testimonials** - Client testimonials and reviews
- **blog_posts** - Blog posts and articles

## Prerequisites

- MySQL 8.0 or higher
- MySQL client or workbench
- Database user with CREATE, INSERT, UPDATE, DELETE privileges

## Database Configuration

The database uses the following configuration (from `env.example`):

- **Database Name**: `dh_portfolio_website_db`
- **Host**: `localhost`
- **Port**: `3306`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`

## Setup Instructions

### 1. Create Database and Tables

Run the main schema file to create all tables and basic stored procedures:

```bash
mysql -u your_username -p < database_schema.sql
```

Or execute it in MySQL Workbench/phpMyAdmin.

### 2. Add Additional Stored Procedures (Optional)

For enhanced functionality, run the additional procedures:

```bash
mysql -u your_username -p < additional_stored_procedures.sql
```

### 3. Verify Installation

After running the scripts, you can verify the installation by checking:

```sql
-- Check if tables were created
SHOW TABLES;

-- Check if stored procedures were created
SHOW PROCEDURE STATUS WHERE db = 'dh_portfolio_website_db';

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
```

## Database Schema Details

### Users Table (Enhanced)

```sql
CREATE TABLE users (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Stores user accounts for admin access and authentication with enhanced profile information.

### Projects Table (Enhanced)

```sql
CREATE TABLE projects (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Stores portfolio projects with enhanced metadata including URLs, technologies, tags, client information, and ordering capabilities.

### Project Images Table

```sql
CREATE TABLE project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    image_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

**Purpose**: Stores multiple images per project for galleries and image management.

### Contact Messages Table (Enhanced)

```sql
CREATE TABLE contact_messages (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Stores contact form submissions with enhanced tracking including priority levels, source tracking, and IP/user agent information.

### Uploads Table (Enhanced)

```sql
CREATE TABLE uploads (
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
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

**Purpose**: Stores file uploads with better organization, type categorization, and project association.

### Skills Table

```sql
CREATE TABLE skills (
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
    UNIQUE KEY unique_skill_name (name)
);
```

**Purpose**: Stores technical and creative skills with proficiency levels and categorization.

### Testimonials Table

```sql
CREATE TABLE testimonials (
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
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

**Purpose**: Stores client testimonials and reviews with rating system and project association.

### Blog Posts Table

```sql
CREATE TABLE blog_posts (
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
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Purpose**: Stores blog posts and articles with content management features.

## Sample Data

### Admin User

- **Username**: `admin`
- **Email**: `admin@daniel-hill.com`
- **Password**: `admin123` (bcrypt hashed)
- **Role**: `admin`

### Sample Projects

- Portfolio Website (web, featured)
- 3D Character Animation (animation, featured)
- Mobile App Design System (mobile)
- 3D Environment Collection (3d)
- Digital Art Series (illustration)
- Interactive Game Prototype (game, featured)

### Sample Skills

- React (programming, expert)
- TypeScript (programming, advanced)
- Node.js (programming, advanced)
- SQL (programming, expert)
- C# (programming, advanced)
- Blender (3d, advanced)
- Adobe Photoshop (design, advanced)
- Unity (game, intermediate)

### Sample Testimonials

- Sarah Johnson (Creative Director, Digital Studios Inc.)
- Michael Chen (Project Manager, Tech Innovations)
- Emily Rodriguez (Art Director, Creative Agency)

## Indexes and Performance

The database includes optimized indexes for common query patterns:

- **Single indexes**: username, email, category, featured, status, priority, etc.
- **Composite indexes**: category+published, featured+published, status+priority, etc.
- **Foreign key indexes**: project_id, author_id, uploaded_by, etc.

## Views

Three views are created for common queries:

- `featured_projects` - All featured and published projects
- `unread_messages` - All unread contact messages with priority
- `project_statistics` - Project counts by category

## Triggers

Automatic timestamp updates:

- `update_projects_timestamp` - Updates `updated_at` on project changes
- `update_users_timestamp` - Updates `updated_at` on user changes
- `update_skills_timestamp` - Updates `updated_at` on skill changes
- `update_testimonials_timestamp` - Updates `updated_at` on testimonial changes
- `update_blog_posts_timestamp` - Updates `updated_at` on blog post changes

## Stored Procedures

### Core Procedures

- `get_featured_projects()` - Get featured projects with ordering
- `get_projects_by_category()` - Get projects by category with pagination
- `search_projects()` - Enhanced search across projects
- `get_project_stats()` - Get comprehensive project statistics

### Enhanced Procedures

- `get_project_with_images()` - Get project with associated images
- `get_skills_by_category()` - Get skills by category and featured status
- `get_testimonials()` - Get testimonials with filtering options
- `get_blog_posts()` - Get blog posts with author information
- `get_uploads_by_project()` - Get uploads associated with projects

### Admin Procedures

- `get_dashboard_overview()` - Get comprehensive dashboard statistics
- `get_recent_activity()` - Get recent activity across all tables
- `cleanup_orphaned_uploads()` - Clean up unused uploads
- `archive_old_messages()` - Archive old contact messages
- `generate_project_slugs()` - Generate slugs for projects without them

## Security Considerations

1. **Password Hashing**: All passwords are stored as bcrypt hashes
2. **Input Validation**: The application validates all inputs before database operations
3. **SQL Injection Prevention**: Uses parameterized queries throughout
4. **Access Control**: Role-based access control with admin/user roles
5. **Data Privacy**: Contact messages include IP tracking for spam prevention

## Backup and Maintenance

### Regular Backups

```sql
-- Create backup
mysqldump -u username -p dh_portfolio_website_db > backup_$(date +%Y%m%d).sql

-- Restore backup
mysql -u username -p dh_portfolio_website_db < backup_20231201.sql
```

### Maintenance Procedures

```sql
-- Clean up old uploads (files older than 30 days not used in projects)
CALL cleanup_orphaned_uploads(30);

-- Archive old contact messages (messages older than 1 year)
CALL archive_old_messages(365);

-- Generate slugs for projects that don't have them
CALL generate_project_slugs();
```

### Performance Monitoring

```sql
-- Check table sizes
SELECT
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'dh_portfolio_website_db'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- Check slow queries (if enabled)
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

## Troubleshooting

### Common Issues

1. **Access Denied**: Ensure your MySQL user has proper privileges
2. **Character Set Issues**: Verify utf8mb4 is used for proper emoji support
3. **Foreign Key Constraints**: Ensure referenced tables exist before creating dependent tables
4. **JSON Column Issues**: Ensure MySQL version supports JSON data type (5.7+)

### Performance Issues

1. **Slow Queries**: Check if indexes are being used with `EXPLAIN`
2. **Large Result Sets**: Implement pagination using LIMIT and OFFSET
3. **Connection Issues**: Monitor connection pool settings and limits

## Migration from Old Schema

If migrating from the previous schema:

1. **Backup existing data**
2. **Run the new schema scripts**
3. **Migrate data using provided procedures**
4. **Update application code to use new field names**
5. **Test all functionality thoroughly**

## Local Development Setup

For local development setup, see the comprehensive guide in `LOCAL_MYSQL_SETUP.md`.

---

**Note**: This schema is designed for a modern portfolio website with enhanced features for project management, content creation, and user engagement. The structure supports scalability and performance optimization for production use.
