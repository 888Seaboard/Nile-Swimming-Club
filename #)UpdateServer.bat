@echo off
cd /d C:\Users\Tovey\yt-stripe-nextjs-supabase

echo ==========================
echo Git status before commit
echo ==========================
git status
echo.

echo Staging all changes...
git add .

echo.
echo Committing changes with default message...
git commit -m "Update Nile Swimming Club site"

echo.
echo Pushing to origin main...
git push origin main

echo.
echo Done. Press any key to close.
pause >nul