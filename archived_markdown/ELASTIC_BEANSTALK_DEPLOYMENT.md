# AWS Elastic Beanstalk Backend Deployment Guide

## Overview

This guide provides detailed steps to deploy your Node.js backend to AWS Elastic Beanstalk.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Your backend code ready for deployment

## Step 1: Prepare Deployment Package

### Option A: Use the Automated Script (Recommended)

```powershell
# Run the deployment script
.\deploy-backend.ps1
```

### Option B: Manual Package Creation

1. Create a new directory: `backend-deploy`
2. Copy all backend files to this directory
3. Ensure `package.json` is in the root of the deployment directory
4. Remove `node_modules/` (will be installed on EB)
5. Zip the contents (not the folder itself)

## Step 2: Create Elastic Beanstalk Application

### 2.1 Access AWS Console

1. Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click "Create Application"

### 2.2 Application Configuration

```
Application name: dh-portfolio-backend
Description: Portfolio website backend API
```

### 2.3 Environment Configuration

```
Environment name: dh-portfolio-backend-prod
Domain: [your-domain].elasticbeanstalk.com
Platform: Node.js
Platform branch: Node.js 18
Platform version: Latest
```

## Step 3: Configure Environment

### 3.1 Upload Application

1. Choose "Upload your code"
2. Select your deployment zip file
3. Click "Create environment"

### 3.2 Environment Variables

Add these environment variables in the EB Console:

#### Database Configuration

```
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306
```

#### Application Configuration

```
NODE_ENV=production
PORT=8080
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

#### Optional Configuration

```
SKIP_DB=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.3 Security Configuration

#### Security Groups

1. Go to EC2 → Security Groups
2. Find the EB security group (auto-created)
3. Configure inbound rules:

```
Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0

Type: HTTPS
Protocol: TCP
Port: 443
Source: 0.0.0.0/0

Type: MySQL/Aurora
Protocol: TCP
Port: 3306
Source: [Your RDS Security Group ID]
```

## Step 4: Advanced Configuration

### 4.1 Load Balancer Configuration

1. Go to Configuration → Load balancer
2. Enable HTTPS listener
3. Add SSL certificate (if you have one)
4. Configure health check:
   - Path: `/api/health`
   - Port: 8080
   - Timeout: 5 seconds
   - Interval: 30 seconds
   - Unhealthy threshold: 5
   - Healthy threshold: 3

### 4.2 Auto Scaling Configuration

1. Go to Configuration → Auto Scaling
2. Configure scaling triggers:
   - CPU utilization > 70%
   - Memory utilization > 80%
3. Set min/max instances: 1-3

### 4.3 Monitoring Configuration

1. Go to Configuration → Monitoring
2. Enable enhanced monitoring
3. Set up CloudWatch alarms:
   - CPU utilization
   - Memory utilization
   - Request count
   - Error rate

## Step 5: Database Connection

### 5.1 RDS Security Group

Ensure your RDS security group allows connections from the EB security group:

```
Type: MySQL/Aurora
Protocol: TCP
Port: 3306
Source: [EB Security Group ID]
```

### 5.2 Database Connection Test

After deployment, test the database connection:

```bash
curl https://your-eb-domain.elasticbeanstalk.com/api/health
```

## Step 6: Deployment Verification

### 6.1 Health Check

```bash
curl https://your-eb-domain.elasticbeanstalk.com/api/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

### 6.2 API Endpoints Test

```bash
# Test projects endpoint
curl https://your-eb-domain.elasticbeanstalk.com/api/projects

# Test contact endpoint
curl -X POST https://your-eb-domain.elasticbeanstalk.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## Step 7: Continuous Deployment (Optional)

### 7.1 GitHub Integration

1. Go to Configuration → Source
2. Choose "GitHub"
3. Connect your repository
4. Configure branch and deployment settings

### 7.2 AWS CLI Deployment

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB project
eb init dh-portfolio-backend --region us-east-1

# Deploy
eb deploy
```

## Step 8: Monitoring and Maintenance

### 8.1 CloudWatch Logs

1. Go to Monitoring → Logs
2. Request logs for debugging
3. Set up log retention policies

### 8.2 Performance Monitoring

- Monitor response times
- Track error rates
- Monitor database connections
- Set up alerts for critical metrics

### 8.3 Backup Strategy

- Enable automated backups for RDS
- Set up S3 backups for uploaded files
- Document recovery procedures

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading

- Check EB environment configuration
- Verify variable names match your code
- Restart the environment after changes

#### 2. Database Connection Issues

- Verify RDS security group rules
- Check database credentials
- Ensure RDS is in the same VPC as EB

#### 3. CORS Issues

- Verify FRONTEND_URL environment variable
- Check CORS configuration in server.js
- Test with different origins

#### 4. File Upload Issues

- Check S3 permissions (if using S3)
- Verify upload directory permissions
- Monitor disk space usage

### Useful Commands

```bash
# View EB logs
eb logs

# SSH into EB instance
eb ssh

# Check environment status
eb status

# View environment events
eb events
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Always use HTTPS in production
3. **Security Groups**: Restrict access to minimum required ports
4. **IAM Roles**: Use least privilege principle
5. **Regular Updates**: Keep dependencies updated
6. **Monitoring**: Set up comprehensive monitoring and alerting

## Cost Optimization

1. **Instance Types**: Choose appropriate instance sizes
2. **Auto Scaling**: Configure based on actual usage patterns
3. **Reserved Instances**: Consider for predictable workloads
4. **Monitoring**: Track costs in AWS Cost Explorer

## Next Steps

After successful deployment:

1. Update your frontend to use the new API endpoint
2. Set up custom domain (if needed)
3. Configure SSL certificate
4. Set up monitoring and alerting
5. Document deployment procedures
6. Plan for disaster recovery
