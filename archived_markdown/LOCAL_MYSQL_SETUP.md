# Local MySQL Database Setup Guide

This guide provides step-by-step instructions for setting up a local MySQL database for testing the DH Portfolio Website before deployment.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **MySQL Server** (8.0 or higher recommended)
- **MySQL Workbench** (optional but recommended for GUI management)
- **Node.js** (18.0 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation Steps

### 1. Install MySQL Server

#### Windows

1. Download MySQL Installer from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
2. Run the installer and choose "Developer Default" or "Server only"
3. Follow the installation wizard
4. Set a root password (remember this!)
5. Complete the installation

#### macOS

```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure the installation
mysql_secure_installation
```

#### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install MySQL
sudo apt install mysql-server

# Secure the installation
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database and User

#### Option A: Using MySQL Command Line

```bash
# Connect to MySQL as root
mysql -u root -p

# Create database
CREATE DATABASE dh_portfolio_website_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

# Create user for the application
CREATE USER 'dh_portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON dh_portfolio_website_db.* TO 'dh_portfolio_user'@'localhost';
FLUSH PRIVILEGES;

# Verify the user can access the database
SHOW GRANTS FOR 'dh_portfolio_user'@'localhost';

# Exit MySQL
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL instance
3. Open a new query tab
4. Run the SQL commands from Option A above
5. Execute the queries

### 3. Set Up Environment Variables

1. Copy the example environment file:

```bash
cp env.example .env
```

2. Edit the `.env` file with your local database credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dh_portfolio_website_db
DB_USER=dh_portfolio_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=dh Portfolio
VITE_APP_VERSION=1.0.0

# Admin User (will be created on first run)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@daniel-hill.com
ADMIN_PASSWORD=admin123
```

### 4. Initialize Database Schema

#### Option A: Using MySQL Command Line

```bash
# Navigate to your project directory
cd /path/to/your/dh_portfolio_website

# Run the main schema file
mysql -u dh_portfolio_user -p dh_portfolio_website_db < database_schema.sql

# Run the additional stored procedures (optional but recommended)
mysql -u dh_portfolio_user -p dh_portfolio_website_db < additional_stored_procedures.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Open the `database_schema.sql` file
4. Execute the script
5. Repeat for `additional_stored_procedures.sql`

#### Option C: Using the Application

The application will automatically create tables if they don't exist when you start the server for the first time.

### 5. Install Dependencies

```bash
# Install frontend and backend dependencies
npm install

# Install backend dependencies separately (if needed)
cd backend
npm install
cd ..
```

### 6. Create Uploads Directory

```bash
# Create uploads directory for file storage
mkdir -p backend/uploads
mkdir -p public/uploads

# Set proper permissions (Linux/macOS)
chmod 755 backend/uploads
chmod 755 public/uploads
```

### 7. Start the Application

```bash
# Start both frontend and backend in development mode
npm run dev:full

# Or start them separately:
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev
```

## 🔍 Verification Steps

### 1. Check Database Connection

The application should log "✅ MySQL database connected successfully" when starting.

### 2. Verify Tables Created

```sql
-- Connect to your database
mysql -u dh_portfolio_user -p dh_portfolio_website_db

-- Check tables
SHOW TABLES;

-- Expected output:
-- +----------------------------------+
-- | Tables_in_dh_portfolio_website_db |
-- +----------------------------------+
-- | blog_posts                       |
-- | contact_messages                 |
-- | project_images                   |
-- | projects                         |
-- | skills                           |
-- | testimonials                     |
-- | uploads                          |
-- | users                            |
-- +----------------------------------+
```

### 3. Check Sample Data

```sql
-- Check if sample data was inserted
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as project_count FROM projects;
SELECT COUNT(*) as skill_count FROM skills;
SELECT COUNT(*) as testimonial_count FROM testimonials;

-- Expected output should show sample data counts
```

### 4. Test API Endpoints

Visit `http://localhost:3000` and check:

- Home page loads correctly
- Projects are displayed
- Contact form works
- Admin panel is accessible at `/admin`

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**

- Ensure MySQL service is running
- Check if MySQL is listening on port 3306
- Verify firewall settings

#### 2. Access Denied

```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user
```

**Solution:**

- Verify username and password in `.env`
- Check if user has proper privileges
- Try connecting manually: `mysql -u username -p`

#### 3. Database Not Found

```
Error: ER_BAD_DB_ERROR: Unknown database
```

**Solution:**

- Create the database: `CREATE DATABASE dh_portfolio_website_db;`
- Check database name in `.env`

#### 4. Character Set Issues

```
Error: ER_WRONG_VALUE_FOR_TYPE: Incorrect string value
```

**Solution:**

- Ensure database uses `utf8mb4` character set
- Check table collation settings

### Debug Commands

#### Check MySQL Status

```bash
# Windows
sc query mysql

# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

#### Check MySQL Logs

```bash
# Windows
# Check MySQL error log in MySQL installation directory

# macOS/Linux
sudo tail -f /var/log/mysql/error.log
```

#### Test Database Connection

```bash
# Test connection with credentials
mysql -u dh_portfolio_user -p dh_portfolio_website_db -e "SELECT 1;"
```

## 📊 Database Management

### Useful Commands

#### Backup Database

```bash
mysqldump -u dh_portfolio_user -p dh_portfolio_website_db > backup_$(date +%Y%m%d).sql
```

#### Restore Database

```bash
mysql -u dh_portfolio_user -p dh_portfolio_website_db < backup_20231201.sql
```

#### Reset Database

```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE dh_portfolio_website_db; CREATE DATABASE dh_portfolio_website_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Re-run schema files
mysql -u dh_portfolio_user -p dh_portfolio_website_db < database_schema.sql
mysql -u dh_portfolio_user -p dh_portfolio_website_db < additional_stored_procedures.sql
```

### Performance Monitoring

#### Check Table Sizes

```sql
SELECT
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'dh_portfolio_website_db'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
```

#### Check Slow Queries

```sql
-- Enable slow query log (add to my.cnf)
-- slow_query_log = 1
-- long_query_time = 2

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

## 🔒 Security Considerations

### For Local Development

1. Use strong passwords for database users
2. Don't commit `.env` files to version control
3. Use different credentials for development and production
4. Regularly update MySQL to latest security patches

### For Production

1. Use dedicated database server
2. Implement proper backup strategies
3. Use SSL connections
4. Restrict database user privileges
5. Monitor database access logs

## 📝 Next Steps

After successful local setup:

1. **Test all features** - Ensure all functionality works as expected
2. **Add sample data** - Populate with realistic portfolio content
3. **Test file uploads** - Verify image and file upload functionality
4. **Test admin panel** - Ensure CRUD operations work correctly
5. **Performance testing** - Test with larger datasets
6. **Deployment preparation** - Prepare for production deployment

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review MySQL error logs
3. Verify all prerequisites are installed
4. Check the project's GitHub issues
5. Ensure you're using compatible versions of all software

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Workbench Guide](https://dev.mysql.com/doc/workbench/en/)
- [Node.js MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Express.js Documentation](https://expressjs.com/)

---

**Note:** This setup is for local development only. For production deployment, follow the deployment guide in `DEPLOYMENT_CHECKLIST.md`.
