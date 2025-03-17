@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Check input argument (dev, build, prod)
IF "%1" == "dev" (
    echo Starting Laravel + React in Development Mode...

    REM Start Laravel development server
    start cmd /k "php artisan serve"

    REM Start React development server (Vite)
    cd resources\js
    npm run dev
    exit /b
)

IF "%1" == "build" (
    echo Building Laravel + React for Production...

    REM Clear Laravel caches and optimize
    php artisan cache:clear
    php artisan route:clear
    php artisan config:clear
    php artisan view:clear
    php artisan config:cache
    php artisan route:cache

    REM Build React (with Vite)
    npm run build

    echo Build complete!

    REM Start Laravel production server
    start cmd /k "php artisan serve"

    exit /b
)

echo Invalid option. Use:
echo     deploy.bat dev   - Start Development Mode
echo     deploy.bat build - Build and Start for Production
exit /b
