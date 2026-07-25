@echo off
setlocal EnableExtensions DisableDelayedExpansion

cd /d "%~dp0"
set "ROOT_DIR=%CD%"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"

echo.
echo ========================================================
echo   HealthPath Kosovo - local development launcher
echo ========================================================
echo.

where java.exe >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java was not found. Install JDK 17 or newer and try again.
    echo The app was not started. Fix the error above, then run run-app.cmd again.
    pause
    exit /b 1
)

where node.exe >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found. Install Node.js 18 or newer and try again.
    echo The app was not started. Fix the error above, then run run-app.cmd again.
    pause
    exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm.cmd was not found. Reinstall Node.js and try again.
    echo The app was not started. Fix the error above, then run run-app.cmd again.
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%\mvnw.cmd" (
    echo [ERROR] Missing backend\mvnw.cmd.
    echo The app was not started. Fix the error above, then run run-app.cmd again.
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
    echo [ERROR] Missing frontend\package.json.
    echo The app was not started. Fix the error above, then run run-app.cmd again.
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%\node_modules\.bin\vite.cmd" (
    echo [SETUP] Frontend dependencies are missing. Installing them now...
    pushd "%FRONTEND_DIR%"
    call npm.cmd install
    if errorlevel 1 (
        popd
        echo [ERROR] npm install failed. Review the output above.
        echo The app was not started. Fix the error above, then run run-app.cmd again.
        pause
        exit /b 1
    )
    popd
)

netstat -ano -p tcp 2>nul | findstr /R /C:":5000 .*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [OK] Backend is already running on port 5000.
) else (
    echo [START] Starting the backend on port 5000...
    start "HealthPath Backend" /D "%BACKEND_DIR%" "%ComSpec%" /d /k "call mvnw.cmd spring-boot:run"
)

netstat -ano -p tcp 2>nul | findstr /R /C:":5173 .*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [OK] Frontend is already running on port 5173.
) else (
    echo [START] Starting the frontend on port 5173...
    start "HealthPath Frontend" /D "%FRONTEND_DIR%" "%ComSpec%" /d /k "call npm.cmd run dev"
)

echo.
echo App URL:      http://localhost:5173
echo API docs:     http://localhost:5000/swagger-ui.html
echo.
echo Keep the Backend and Frontend windows open while using the app.
echo You can run this file again safely; active ports will not be started twice.
exit /b 0
