@echo off
echo --- RAGSYSTEM GITHUB DEPLOYER ---
cd /d "%~dp0"

:: Initialize Git
if not exist .git (
    echo Initializing Git repository...
    git init
)

:: Ensure .env is ignored to protect your keys
findstr /c:".env" .gitignore >nul 2>&1
if errorlevel 1 (
    echo .env >> .gitignore
    echo Added .env to .gitignore
)

:: Add all files
echo Staging files...
git add .

:: Commit
echo Committing changes...
git commit -m "Complete RAG System with Gemini, Firebase, and ChatGPT-style UI"

:: Add Remote
echo Setting remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/FARAZSHAH909/RAGSYSTEM.git

:: Set branch to main
git branch -M main

:: Push
echo Pushing to GitHub...
echo NOTE: If this is your first time, a GitHub login window may appear.
git push -u origin main

echo.
echo --- DEPLOYMENT PROCESS FINISHED ---
pause
