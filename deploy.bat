@echo off
echo 🚀 Deploying RoomLink Platform...

REM Step 1: Push to GitHub
echo 📦 Pushing to GitHub...
git add .
git commit -m "Deploy: %date% %time%"
git push origin main

echo ✅ Deployment initiated!
echo.
echo Next Steps:
echo 1. Go to Railway Dashboard: https://railway.app/dashboard
echo 2. Check deployment status
echo 3. Set environment variables if first deployment
echo 4. Your app will be live at the provided Railway URL

pause
