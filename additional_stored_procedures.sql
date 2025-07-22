-- =====================================================
-- Additional Stored Procedures for DH Portfolio Website (Updated)
-- =====================================================
-- These procedures provide additional functionality for common operations

USE dh_portfolio_website_db;

-- =====================================================
-- PROJECT-RELATED PROCEDURES
-- =====================================================

-- Get projects by category with pagination (Updated)
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

-- Search projects by title or description (Enhanced)
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

-- Get project statistics (Enhanced)
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

-- Get project with images
DELIMITER //
DROP PROCEDURE IF EXISTS get_project_with_images;
CREATE PROCEDURE get_project_with_images(IN p_project_id INT)
BEGIN
    -- Get project details
    SELECT 
        p.*,
        GROUP_CONCAT(pi.image_url ORDER BY pi.image_order SEPARATOR ',') as gallery_images,
        GROUP_CONCAT(pi.alt_text ORDER BY pi.image_order SEPARATOR ',') as gallery_alt_texts,
        GROUP_CONCAT(pi.caption ORDER BY pi.image_order SEPARATOR ',') as gallery_captions
    FROM projects p
    LEFT JOIN project_images pi ON p.id = pi.project_id
    WHERE p.id = p_project_id AND p.published = TRUE
    GROUP BY p.id;
END //

-- =====================================================
-- CONTACT MESSAGE PROCEDURES (Enhanced)
-- =====================================================

-- Get contact messages with pagination (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_contact_messages;
CREATE PROCEDURE get_contact_messages(IN p_limit INT, IN p_offset INT, IN p_status VARCHAR(20))
BEGIN
    IF p_limit IS NULL OR p_limit <= 0 THEN
        SET p_limit = 20;
    END IF;
    IF p_offset IS NULL OR p_offset < 0 THEN
        SET p_offset = 0;
    END IF;
    SET @where_clause = '1=1';
    IF p_status IS NOT NULL THEN
        SET @where_clause = CONCAT('status = "', p_status, '"');
    END IF;
    
    SET @sql = CONCAT('
        SELECT 
            id,
            name,
            email,
            phone,
            company,
            subject,
            message,
            status,
            priority,
            source,
            ip_address,
            created_at
        FROM contact_messages 
        WHERE ', @where_clause, '
        ORDER BY priority DESC, created_at DESC
        LIMIT ', p_limit, ' OFFSET ', p_offset
    );
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- Get contact message statistics (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_contact_stats;
CREATE PROCEDURE get_contact_stats()
BEGIN
    SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_messages,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages,
        COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_messages,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority
    FROM contact_messages;
END //
DELIMITER ;

-- Update message status (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS update_message_status;
CREATE PROCEDURE update_message_status(IN p_message_id INT, IN p_status VARCHAR(20))
BEGIN
    UPDATE contact_messages 
    SET status = p_status, updated_at = CURRENT_TIMESTAMP
    WHERE id = p_message_id;
    
    SELECT ROW_COUNT() as affected_rows;
END //
DELIMITER ;

-- =====================================================
-- USER-RELATED PROCEDURES (Enhanced)
-- =====================================================

-- Get user by username or email (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_user_by_credentials;
CREATE PROCEDURE get_user_by_credentials(IN p_username_or_email VARCHAR(255))
BEGIN
    SELECT 
        id,
        username,
        email,
        password_hash,
        role,
        first_name,
        last_name,
        avatar_url,
        bio,
        created_at,
        updated_at
    FROM users 
    WHERE username = p_username_or_email OR email = p_username_or_email
    LIMIT 1;
END //
DELIMITER ;

-- Create new user (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS create_user;
CREATE PROCEDURE create_user(IN p_username VARCHAR(255), IN p_email VARCHAR(255), IN p_password_hash VARCHAR(255), IN p_role VARCHAR(20), IN p_first_name VARCHAR(100), IN p_last_name VARCHAR(100), IN p_bio TEXT)
BEGIN
    INSERT INTO users (username, email, password_hash, role, first_name, last_name, bio)
    VALUES (p_username, p_email, p_password_hash, p_role, p_first_name, p_last_name, p_bio);
    
    SELECT LAST_INSERT_ID() as user_id;
END //
DELIMITER ;

-- =====================================================
-- SKILLS-RELATED PROCEDURES
-- =====================================================

-- Get skills by category
DELIMITER //
DROP PROCEDURE IF EXISTS get_skills_by_category;
CREATE PROCEDURE get_skills_by_category(IN p_category VARCHAR(50), IN p_featured_only BOOLEAN)
BEGIN
    SET @where_clause = '1=1';
    IF p_category IS NOT NULL THEN
        SET @where_clause = CONCAT('category = "', p_category, '"');
    END IF;
    IF p_featured_only THEN
        SET @where_clause = CONCAT(@where_clause, ' AND is_featured = TRUE');
    END IF;
    
    SET @sql = CONCAT('
        SELECT 
            id,
            name,
            category,
            proficiency,
            years_experience,
            icon_url,
            description,
            is_featured,
            skill_order
        FROM skills 
        WHERE ', @where_clause, '
        ORDER BY skill_order ASC, name ASC
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- Get skill statistics
DELIMITER //
DROP PROCEDURE IF EXISTS get_skill_stats;
CREATE PROCEDURE get_skill_stats()
BEGIN
    SELECT 
        category,
        COUNT(*) as total_skills,
        COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured_skills,
        COUNT(CASE WHEN proficiency = 'expert' THEN 1 END) as expert_skills,
        COUNT(CASE WHEN proficiency = 'advanced' THEN 1 END) as advanced_skills,
        COUNT(CASE WHEN proficiency = 'intermediate' THEN 1 END) as intermediate_skills,
        COUNT(CASE WHEN proficiency = 'beginner' THEN 1 END) as beginner_skills
    FROM skills 
    GROUP BY category;
END //
DELIMITER ;

-- =====================================================
-- TESTIMONIALS-RELATED PROCEDURES
-- =====================================================

-- Get testimonials
DELIMITER //
DROP PROCEDURE IF EXISTS get_testimonials;
CREATE PROCEDURE get_testimonials(IN p_featured_only BOOLEAN, IN p_approved_only BOOLEAN, IN p_limit INT)
BEGIN
    SET @where_clause = '1=1';
    IF p_featured_only THEN
        SET @where_clause = CONCAT(@where_clause, ' AND is_featured = TRUE');
    END IF;
    IF p_approved_only THEN
        SET @where_clause = CONCAT(@where_clause, ' AND is_approved = TRUE');
    END IF;
    
    SET @sql = CONCAT('
        SELECT 
            t.*,
            p.title as project_title,
            p.slug as project_slug
        FROM testimonials t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE ', @where_clause, '
        ORDER BY t.testimonial_order ASC, t.created_at DESC
        LIMIT ', p_limit
    );
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- =====================================================
-- BLOG-RELATED PROCEDURES
-- =====================================================

-- Get blog posts
DELIMITER //
DROP PROCEDURE IF EXISTS get_blog_posts;
CREATE PROCEDURE get_blog_posts(IN p_status VARCHAR(20), IN p_limit INT, IN p_offset INT)
BEGIN
    SELECT 
        bp.*,
        u.first_name,
        u.last_name,
        u.username as author_username
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE bp.status = p_status
    ORDER BY bp.published_at DESC, bp.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END //
DELIMITER ;

-- Get blog post by slug
DELIMITER //
DROP PROCEDURE IF EXISTS get_blog_post_by_slug;
CREATE PROCEDURE get_blog_post_by_slug(IN p_slug VARCHAR(255))
BEGIN
    SELECT 
        bp.*,
        u.first_name,
        u.last_name,
        u.username as author_username
    FROM blog_posts bp
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE bp.slug = p_slug AND bp.status = 'published';
END //
DELIMITER ;

-- =====================================================
-- UPLOAD-RELATED PROCEDURES (Enhanced)
-- =====================================================

-- Get uploads by user (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_uploads_by_user;
CREATE PROCEDURE get_uploads_by_user(IN p_user_id INT, IN p_limit INT, IN p_offset INT)
BEGIN
    SELECT 
        id,
        filename,
        original_name,
        mime_type,
        size,
        path,
        url,
        alt_text,
        uploaded_by,
        project_id,
        upload_type,
        is_public,
        created_at
    FROM uploads 
    WHERE uploaded_by = p_user_id
    ORDER BY created_at DESC
    LIMIT p_limit OFFSET p_offset;
END //
DELIMITER ;

-- Get uploads by project
DELIMITER //
DROP PROCEDURE IF EXISTS get_uploads_by_project;
CREATE PROCEDURE get_uploads_by_project(IN p_project_id INT, IN p_upload_type VARCHAR(20))
BEGIN
    SET @where_clause = 'project_id = ?';
    IF p_upload_type IS NOT NULL THEN
        SET @where_clause = CONCAT(@where_clause, ' AND upload_type = "', p_upload_type, '"');
    END IF;
    
    SET @sql = CONCAT('
        SELECT 
            id,
            filename,
            original_name,
            mime_type,
            size,
            path,
            url,
            alt_text,
            upload_type,
            is_public,
            created_at
        FROM uploads 
        WHERE ', @where_clause, '
        ORDER BY created_at ASC
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_project_id;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- Get upload statistics (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_upload_stats;
CREATE PROCEDURE get_upload_stats()
BEGIN
    SELECT 
        COUNT(*) as total_uploads,
        SUM(size) as total_size,
        COUNT(DISTINCT uploaded_by) as unique_uploaders,
        COUNT(DISTINCT project_id) as projects_with_uploads,
        COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as image_files,
        COUNT(CASE WHEN mime_type LIKE 'video/%' THEN 1 END) as video_files,
        COUNT(CASE WHEN mime_type LIKE 'model/%' THEN 1 END) as model_files,
        COUNT(CASE WHEN upload_type = 'image' THEN 1 END) as image_uploads,
        COUNT(CASE WHEN upload_type = 'video' THEN 1 END) as video_uploads,
        COUNT(CASE WHEN upload_type = 'model' THEN 1 END) as model_uploads,
        COUNT(CASE WHEN upload_type = 'document' THEN 1 END) as document_uploads
    FROM uploads;
END //
DELIMITER ;

-- =====================================================
-- ADMIN DASHBOARD PROCEDURES (Enhanced)
-- =====================================================

-- Get dashboard overview (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_dashboard_overview;
CREATE PROCEDURE get_dashboard_overview()
BEGIN
    -- Project statistics
    SELECT 
        'projects' as category,
        COUNT(*) as count
    FROM projects
    UNION ALL
    SELECT 
        'featured_projects',
        COUNT(*)
    FROM projects WHERE featured = TRUE AND published = TRUE
    UNION ALL
    SELECT 
        'published_projects',
        COUNT(*)
    FROM projects WHERE published = TRUE
    UNION ALL
    SELECT 
        'contact_messages',
        COUNT(*)
    FROM contact_messages
    UNION ALL
    SELECT 
        'unread_messages',
        COUNT(*)
    FROM contact_messages WHERE status = 'unread'
    UNION ALL
    SELECT 
        'high_priority_messages',
        COUNT(*)
    FROM contact_messages WHERE priority = 'high' AND status = 'unread'
    UNION ALL
    SELECT 
        'uploads',
        COUNT(*)
    FROM uploads
    UNION ALL
    SELECT 
        'users',
        COUNT(*)
    FROM users
    UNION ALL
    SELECT 
        'skills',
        COUNT(*)
    FROM skills
    UNION ALL
    SELECT 
        'testimonials',
        COUNT(*)
    FROM testimonials WHERE is_approved = TRUE
    UNION ALL
    SELECT 
        'blog_posts',
        COUNT(*)
    FROM blog_posts WHERE status = 'published';
END //
DELIMITER ;

-- Get recent activity (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS get_recent_activity;
CREATE PROCEDURE get_recent_activity(IN p_limit INT)
BEGIN
    (SELECT 
        'project' as type,
        id as item_id,
        title as title,
        created_at as activity_date,
        'New project created' as description,
        slug as slug
    FROM projects
    WHERE published = TRUE
    ORDER BY created_at DESC
    LIMIT p_limit)
    
    UNION ALL
    
    (SELECT 
        'contact' as type,
        id as item_id,
        CONCAT(name, ' - ', COALESCE(subject, 'No subject')) as title,
        created_at as activity_date,
        CONCAT('New contact message (', priority, ' priority)') as description,
        NULL as slug
    FROM contact_messages
    ORDER BY created_at DESC
    LIMIT p_limit)
    
    UNION ALL
    
    (SELECT 
        'upload' as type,
        id as item_id,
        original_name as title,
        created_at as activity_date,
        CONCAT('New ', upload_type, ' file uploaded') as description,
        NULL as slug
    FROM uploads
    ORDER BY created_at DESC
    LIMIT p_limit)
    
    UNION ALL
    
    (SELECT 
        'testimonial' as type,
        id as item_id,
        CONCAT(client_name, ' - ', COALESCE(client_company, 'No company')) as title,
        created_at as activity_date,
        CONCAT('New testimonial (', rating, ' stars)') as description,
        NULL as slug
    FROM testimonials
    WHERE is_approved = TRUE
    ORDER BY created_at DESC
    LIMIT p_limit)
    
    UNION ALL
    
    (SELECT 
        'blog' as type,
        id as item_id,
        title as title,
        created_at as activity_date,
        CONCAT('New blog post (', status, ')') as description,
        slug as slug
    FROM blog_posts
    ORDER BY created_at DESC
    LIMIT p_limit)
    
    ORDER BY activity_date DESC
    LIMIT p_limit;
END //
DELIMITER ;

-- =====================================================
-- UTILITY PROCEDURES (Enhanced)
-- =====================================================

-- Clean up old uploads (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS cleanup_orphaned_uploads;
CREATE PROCEDURE cleanup_orphaned_uploads(IN p_days_old INT)
BEGIN
    DELETE FROM uploads 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_old DAY)
    AND project_id IS NULL
    AND id NOT IN (
        SELECT DISTINCT u.id 
        FROM uploads u
        INNER JOIN projects p ON 
            p.thumbnail_url LIKE CONCAT('%', u.filename, '%') OR
            p.image_url LIKE CONCAT('%', u.filename, '%') OR
            p.video_url LIKE CONCAT('%', u.filename, '%') OR
            p.model_url LIKE CONCAT('%', u.filename, '%')
    );
    
    SELECT ROW_COUNT() as deleted_files;
END //
DELIMITER ;

-- Backup contact messages (Enhanced)
DELIMITER //
DROP PROCEDURE IF EXISTS archive_old_messages;
CREATE PROCEDURE archive_old_messages(IN p_days_old INT)
BEGIN
    -- Create archive table if it doesn't exist
    CREATE TABLE IF NOT EXISTS contact_messages_archive LIKE contact_messages;
    
    -- Move old messages to archive
    INSERT INTO contact_messages_archive
    SELECT * FROM contact_messages 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_old DAY)
    AND status IN ('read', 'replied', 'archived');
    
    -- Delete archived messages from main table
    DELETE FROM contact_messages 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_old DAY)
    AND status IN ('read', 'replied', 'archived');
    
    SELECT ROW_COUNT() as archived_messages;
END //
DELIMITER ;

-- Generate project slugs
DELIMITER //
DROP PROCEDURE IF EXISTS generate_project_slugs;
CREATE PROCEDURE generate_project_slugs()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE project_id INT;
    DECLARE project_title VARCHAR(255);
    DECLARE project_slug VARCHAR(255);
    DECLARE counter INT DEFAULT 1;
    
    DECLARE project_cursor CURSOR FOR 
        SELECT id, title FROM projects WHERE slug IS NULL OR slug = '';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN project_cursor;
    
    read_loop: LOOP
        FETCH project_cursor INTO project_id, project_title;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Generate slug from title
        SET project_slug = LOWER(REGEXP_REPLACE(project_title, '[^a-zA-Z0-9\\s-]', ''));
        SET project_slug = REGEXP_REPLACE(project_slug, '\\s+', '-');
        SET project_slug = TRIM(BOTH '-' FROM project_slug);
        
        -- Check if slug exists and append counter if needed
        WHILE EXISTS(SELECT 1 FROM projects WHERE slug = project_slug AND id != project_id) DO
            SET project_slug = CONCAT(project_slug, '-', counter);
            SET counter = counter + 1;
        END WHILE;
        
        -- Update project with generated slug
        UPDATE projects SET slug = project_slug WHERE id = project_id;
        
        SET counter = 1;
    END LOOP;
    
    CLOSE project_cursor;
    
    SELECT 'Project slugs generated successfully' as result;
END //
DELIMITER ;

-- =====================================================
-- END OF ADDITIONAL PROCEDURES
-- ===================================================== 