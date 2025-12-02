@echo off
echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Committing changes...
git commit -m "Initial commit: Core features (Jobs, Auth, Dashboard) completed"

echo Renaming branch to main...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/jianrenchen00/UKChinese-Job.git
:: If remote already exists, set-url instead
if %ERRORLEVEL% NEQ 0 git remote set-url origin https://github.com/jianrenchen00/UKChinese-Job.git

echo Pushing to GitHub...
echo Note: You may be asked to sign in to GitHub in a browser window.
git push -u origin main

echo Done!
pause
