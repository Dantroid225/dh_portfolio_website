# Daniel Hill Portfolio Website - Deployment Guide

This guide provides step-by-step instructions for setting up and deploying the Daniel Hill Portfolio Website locally and to AWS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application Locally](#running-the-application-locally)
6. [AWS Deployment](#aws-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git**
- **MySQL** (version 8.0 or higher)
- **AWS CLI** (for deployment)
- **AWS Elastic Beanstalk CLI** (optional, for easier deployment)

### Installing Prerequisites

#### Node.js and npm

Download and install from [nodejs.org](https://nodejs.org/)

#### MySQL

- **Windows**: Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- **macOS**: Use Homebrew: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server` (Ubuntu/Debian)

#### AWS CLI

```bash
# Windows (using MSI installer)
# Download from https://aws.amazon.com/cli/

# macOS/Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dh_portfolio_website
```

### 2. Install Dependencies

```bash
# Install frontend and backend dependencies
npm install

# Install backend dependencies separately (if needed)
cd backend
npm install
cd ..
```

### 3. Database Setup

#### Create MySQL Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database and user
CREATE DATABASE dh_portfolio;
CREATE USER 'dh_portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON dh_portfolio.* TO 'dh_portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Import Database Schema

```bash
# Import the main schema
mysql -u dh_portfolio_user -p dh_portfolio < database_schema.sql

# Import additional stored procedures (if needed)
mysql -u dh_portfolio_user -p dh_portfolio < additional_stored_procedures.sql
```

### 4. Environment Configuration

#### Create Environment Files

```bash
# Copy the example environment file
cp env.example .env
```

#### Configure Environment Variables

Edit `.env` file with your local settings:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=dh_portfolio_user
DB_PASSWORD=your_secure_password
DB_NAME=dh_portfolio
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here

# Email Configuration (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional: Skip database for development
# SKIP_DB=false
```

### 5. Running the Application Locally

#### Development Mode (Recommended)

```bash
# Run both frontend and backend concurrently
npm run dev:full
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Alternative: Run Separately

```bash
# Terminal 1: Start backend
npm run server:dev

# Terminal 2: Start frontend
npm run dev
```

#### Production Build (Local Testing)

```bash
# Build the frontend
npm run build

# Start the production server
npm run server
```

### 6. Verify Installation

1. **Frontend**: Visit http://localhost:3000
2. **Backend Health Check**: Visit http://localhost:5000/api/health
3. **Database**: Check that projects and other data load correctly

## AWS Deployment

### 1. AWS Account Setup

#### Create AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Create a new account or sign in
3. Set up billing information
4. Create an IAM user with appropriate permissions

#### Configure AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (json)
```

### 2. Database Setup (AWS RDS)

#### Create RDS MySQL Instance

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "Standard create"
4. Select "MySQL"
5. Choose "Free tier" (for testing) or appropriate tier
6. Configure settings:
   - DB instance identifier: `dh-portfolio-db`
   - Master username: `admin`
   - Master password: `secure_password_here`
   - Public access: Yes (for initial setup)
   - VPC security group: Create new or use default
7. Click "Create database"

#### Import Database Schema

```bash
# Connect to your RDS instance
mysql -h your-rds-endpoint.amazonaws.com -u admin -p dh_portfolio

# Import schema
mysql -h your-rds-endpoint.amazonaws.com -u admin -p dh_portfolio < database_schema.sql
mysql -h your-rds-endpoint.amazonaws.com -u admin -p dh_portfolio < additional_stored_procedures.sql
```

### 3. Elastic Beanstalk Deployment

#### Prepare Application for Deployment

```bash
# Build the frontend
npm run build

# Create deployment package
cd backend
zip -r ../deployment-package.zip . -x "node_modules/*" "uploads/*" ".git/*"
cd ..
```

#### Deploy via AWS Console

1. Go to AWS Elastic Beanstalk Console
2. Click "Create application"
3. Application name: `dh-portfolio-backend`
4. Platform: Node.js
5. Platform branch: Node.js 18
6. Platform version: Latest
7. Upload your deployment package
8. Click "Create application"

#### Configure Environment Variables

In the Elastic Beanstalk environment:

1. Go to Configuration → Software
2. Add environment variables:
   ```
   NODE_ENV=production
   DB_HOST=your-rds-endpoint.amazonaws.com
   DB_USER=admin
   DB_PASSWORD=your_rds_password
   DB_NAME=dh_portfolio
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### 4. Frontend Deployment (S3)

#### Create S3 Bucket

1. Go to S3 Console
2. Create bucket: `dh-portfolio-frontend`
3. Uncheck "Block all public access" (we'll configure this properly)
4. Enable static website hosting

#### Configure S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dh-portfolio-frontend/*"
    }
  ]
}
```

#### Upload Frontend Files

```bash
# Build the frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://dh-portfolio-frontend --delete
```

### 5. Domain and SSL Setup

#### Register Domain (if needed)

1. Go to Route 53 or your preferred registrar
2. Register your domain (e.g., `danielhill.dev`)

#### Configure SSL Certificate

1. Go to AWS Certificate Manager
2. Request certificate for your domain
3. Validate via DNS or email
4. Attach to S3 bucket or use Route 53 for SSL termination

#### Update DNS

1. Create A record pointing to S3 bucket website endpoint
2. Create CNAME for www subdomain

### 6. Final Configuration

#### Update Environment Variables

Update your backend environment variables with the production URLs:

```
FRONTEND_URL=https://your-domain.com
```

#### Test Deployment

1. Visit your domain
2. Test all functionality
3. Check backend health: `https://your-backend.elasticbeanstalk.com/api/health`

## Troubleshooting

### Common Issues

#### Database Connection Issues

- Verify RDS security group allows connections from Elastic Beanstalk
- Check database credentials in environment variables
- Ensure database is publicly accessible (for initial setup)

#### Frontend Not Loading

- Check S3 bucket permissions
- Verify S3 bucket website hosting is enabled
- Check for CORS issues in browser console

#### Backend Deployment Failures

- Check Elastic Beanstalk logs
- Verify all environment variables are set
- Ensure deployment package includes all necessary files

#### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are in package.json

### Useful Commands

```bash
# Check Elastic Beanstalk status
eb status

# View logs
eb logs

# SSH into instance
eb ssh

# Deploy updates
eb deploy

# Check S3 sync
aws s3 ls s3://dh-portfolio-frontend

# Test database connection
mysql -h your-rds-endpoint -u admin -p
```

### Support

For additional help:

1. Check AWS documentation
2. Review Elastic Beanstalk logs
3. Test locally first
4. Use AWS support if needed

## Maintenance

### Regular Tasks

- Monitor AWS costs
- Update dependencies regularly
- Backup database
- Monitor application performance
- Update SSL certificates before expiration

### Updates

1. Make changes locally
2. Test thoroughly
3. Build and deploy
4. Verify functionality
5. Monitor for issues

---

**Note**: This guide assumes a basic AWS setup. For production environments, consider additional security measures, monitoring, and backup strategies.
