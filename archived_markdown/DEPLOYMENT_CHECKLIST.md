# Backend Deployment Checklist

## ✅ Pre-Deployment

- [ ] Backend code is ready and tested locally
- [ ] Database schema is created and tested
- [ ] Environment variables are documented
- [ ] AWS account is set up with appropriate permissions
- [ ] AWS CLI is installed and configured

## ✅ Package Preparation

- [ ] Run `.\deploy-backend.ps1` to create deployment package
- [ ] Verify package contains all necessary files
- [ ] Check package size (should be < 50MB)
- [ ] Test package locally if possible

## ✅ AWS Elastic Beanstalk Setup

- [ ] Create new EB application: `dh-portfolio-backend`
- [ ] Create new environment: `dh-portfolio-backend-prod`
- [ ] Select Node.js 18 platform
- [ ] Upload deployment package
- [ ] Wait for environment to be ready

## ✅ Environment Configuration

- [ ] Set NODE_ENV=production
- [ ] Set PORT=8080
- [ ] Configure database connection variables:
  - [ ] DB_HOST
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_NAME
  - [ ] DB_PORT
- [ ] Set JWT_SECRET
- [ ] Set FRONTEND_URL
- [ ] Configure any other app-specific variables

## ✅ Security Configuration

- [ ] Configure security groups:
  - [ ] HTTP (port 80) from 0.0.0.0/0
  - [ ] HTTPS (port 443) from 0.0.0.0/0
  - [ ] MySQL (port 3306) from RDS security group only
- [ ] Enable HTTPS listener
- [ ] Configure SSL certificate (if available)
- [ ] Set up proper CORS configuration

## ✅ Database Connection

- [ ] Verify RDS security group allows EB connections
- [ ] Test database connectivity
- [ ] Verify database credentials work
- [ ] Check database permissions

## ✅ Load Balancer & Auto Scaling

- [ ] Configure health check path: `/api/health`
- [ ] Set appropriate health check settings
- [ ] Configure auto scaling rules
- [ ] Set min/max instance counts

## ✅ Monitoring Setup

- [ ] Enable enhanced monitoring
- [ ] Set up CloudWatch alarms
- [ ] Configure log retention
- [ ] Set up error rate monitoring

## ✅ Deployment Verification

- [ ] Test health endpoint: `GET /api/health`
- [ ] Test projects endpoint: `GET /api/projects`
- [ ] Test contact endpoint: `POST /api/contact`
- [ ] Test authentication endpoints
- [ ] Verify file upload functionality
- [ ] Check CORS is working correctly

## ✅ Performance & Security

- [ ] Verify rate limiting is working
- [ ] Check security headers are present
- [ ] Test with different user agents
- [ ] Monitor response times
- [ ] Check error logs

## ✅ Documentation

- [ ] Document deployment URL
- [ ] Record environment variables (securely)
- [ ] Document monitoring setup
- [ ] Create rollback procedures
- [ ] Update frontend configuration

## ✅ Post-Deployment

- [ ] Update frontend API endpoint
- [ ] Test full application flow
- [ ] Set up monitoring alerts
- [ ] Plan for future deployments
- [ ] Document lessons learned

## 🔧 Troubleshooting Commands

```bash
# Check environment status
eb status

# View logs
eb logs

# SSH into instance
eb ssh

# View events
eb events

# Test health endpoint
curl https://your-domain.elasticbeanstalk.com/api/health
```

## 📞 Emergency Contacts

- AWS Support: [Your AWS Support Plan]
- Database Admin: [Contact Info]
- DevOps Team: [Contact Info]

## 📋 Environment Variables Reference

```
NODE_ENV=production
PORT=8080
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=3306
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🚨 Rollback Plan

1. Identify the issue
2. Check EB environment events
3. If needed, rollback to previous version
4. Test functionality
5. Document the issue and resolution
