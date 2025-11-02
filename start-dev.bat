@echo off
echo ==========================================
echo Starting Laravel Development Environment...
echo ==========================================
echo.

REM === Start XAMPP Apache and MySQL ===
echo Starting XAMPP Apache and MySQL...
cd /d "C:\xampp"

REM Start Apache
start "XAMPP Apache" cmd /c "xampp_start.exe apache"
timeout /t 2 /nobreak >nul

REM Start MySQL
start "XAMPP MySQL" cmd /c "xampp_start.exe mysql"
timeout /t 3 /nobreak >nul

REM Return to project directory
cd /d "C:\path\to\your\laravel\project"

REM === Start Laravel backend ===
echo Starting Laravel server...
start "Laravel Server" cmd /k "php artisan serve"

REM Wait a moment before starting npm
timeout /t 2 /nobreak >nul

REM === Start Vite frontend ===
echo Starting Vite Dev Server...
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo Development servers are starting...
echo - XAMPP Apache and MySQL started
echo - Laravel: http://127.0.0.1:8000
echo - Vite: Check the Vite window for the URL
echo ==========================================
echo.
echo Close this window or press any key to exit (servers will continue running)
pause >nul
