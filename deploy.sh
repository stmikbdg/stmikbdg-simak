#!/bin/bash

# Check input argument (dev, build, prod)
if [ "$1" == "dev" ]; then
    echo "Starting Laravel + React in Development Mode..."

    # Clear Laravel caches
    php artisan cache:clear
    php artisan route:clear
    php artisan config:clear
    php artisan view:clear
    php artisan config:cache
    php artisan route:cache

    # Start Laravel development server in the background
    php artisan serve &

    # Wait for the server to start (adjust delay if needed)
    sleep 5

    # Open localhost in Chrome (Linux: google-chrome, WSL: chrome.exe)
    if grep -qi microsoft /proc/version; then
        /mnt/c/Program\ Files/Google/Chrome/Application/chrome.exe http://localhost:8000 &
    else
        google-chrome http://localhost:8000 &
    fi

    # Start React development server (Vite)
    cd resources/js || exit
    npm run dev

    exit 0
fi

if [ "$1" == "build" ]; then
    echo "Building Laravel + React for Production..."

    # Clear Laravel caches and optimize
    php artisan cache:clear
    php artisan route:clear
    php artisan config:clear
    php artisan view:clear
    php artisan config:cache
    php artisan route:cache

    # Build React (with Vite)
    cd resources/js || exit
    npm run build
    cd ../../

    echo "Build complete!"

    # Start Laravel production server in the background
    php artisan serve &

    # Wait and open localhost
    sleep 5

    if grep -qi microsoft /proc/version; then
        /mnt/c/Program\ Files/Google/Chrome/Application/chrome.exe http://localhost:8000 &
    else
        google-chrome http://localhost:8000 &
    fi

    exit 0
fi

# Invalid option
echo "Invalid option. Use:"
echo "    ./deploy.sh dev   - Start Development Mode"
echo "    ./deploy.sh build - Build and Start for Production"
exit 1
