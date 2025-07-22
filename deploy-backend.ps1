# Backend Deployment Script for AWS Elastic Beanstalk
# This script creates a deployment package for your backend

Write-Host "🚀 Creating Backend Deployment Package for AWS Elastic Beanstalk" -ForegroundColor Green

# Create deployment directory
$deployDir = "backend-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir

Write-Host "📁 Created deployment directory: $deployDir" -ForegroundColor Yellow

# Copy backend files
Write-Host "📋 Copying backend files..." -ForegroundColor Yellow
Copy-Item "backend\*" -Destination $deployDir -Recurse -Force

# Remove node_modules if it exists (will be installed on EB)
if (Test-Path "$deployDir\node_modules") {
    Remove-Item "$deployDir\node_modules" -Recurse -Force
    Write-Host "🗑️ Removed node_modules (will be installed on EB)" -ForegroundColor Yellow
}

# Create deployment package
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "backend-deploy-$timestamp.zip"

Write-Host "📦 Creating deployment package: $zipName" -ForegroundColor Yellow

# Use PowerShell's Compress-Archive
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipName -Force

Write-Host "✅ Deployment package created: $zipName" -ForegroundColor Green
Write-Host "📏 Package size: $((Get-Item $zipName).Length / 1MB) MB" -ForegroundColor Cyan

# Clean up
Remove-Item $deployDir -Recurse -Force

Write-Host "`n🎯 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Go to AWS Elastic Beanstalk Console" -ForegroundColor White
Write-Host "2. Create a new Node.js environment" -ForegroundColor White
Write-Host "3. Upload the zip file: $zipName" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White
Write-Host "5. Set up security groups" -ForegroundColor White

Write-Host "`n📋 Files included in package:" -ForegroundColor Cyan
Get-ChildItem -Path $deployDir -Recurse | ForEach-Object {
    Write-Host "   $($_.FullName.Replace($deployDir, ''))" -ForegroundColor Gray
} 