@echo off
setlocal

:: Get the directory of this batch file
set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

:: Determine Python executable from virtual environment if it exists
set "PYTHON_EXE=python"
if exist "%PROJECT_ROOT%venv\Scripts\python.exe" (
    set "PYTHON_EXE=%PROJECT_ROOT%venv\Scripts\python.exe"
) else if exist "%PROJECT_ROOT%.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%PROJECT_ROOT%.venv\Scripts\python.exe"
)

echo [1/4] Checking existing backend health...
curl -s -f -m 2 http://127.0.0.1:8000/api/health >nul 2>&1
if not errorlevel 1 (
    echo Backend is already running and healthy! Reusing existing backend.
    goto SKIP_BACKEND
)

echo Existing backend not found or not healthy. Starting a new backend...
:: Clean up only specifically named windows if they exist
taskkill /FI "WINDOWTITLE eq Skyrim NPC Backend*" /T /F >nul 2>&1

if not exist "%PROJECT_ROOT%venv\Scripts\python.exe" (
    if not exist "%PROJECT_ROOT%.venv\Scripts\python.exe" (
        echo Virtual environment not found. Creating 'venv'...
        python -m venv venv
        echo Installing backend dependencies...
        "%PROJECT_ROOT%venv\Scripts\python.exe" -m pip install -r "%PROJECT_ROOT%backend\requirements.txt"
        set "PYTHON_EXE=%PROJECT_ROOT%venv\Scripts\python.exe"
    )
)

start "Skyrim NPC Backend" cmd /k "cd /d "%PROJECT_ROOT%backend" && "%PYTHON_EXE%" -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo Waiting for backend health...
:WAIT_BACKEND
timeout /t 5 /nobreak >nul
curl -s -f -m 2 http://127.0.0.1:8000/api/health >nul 2>&1
if errorlevel 1 (
    echo Still waiting for backend...
    goto WAIT_BACKEND
)
echo Backend is now healthy!

:SKIP_BACKEND
echo.
echo [2/4] Checking frontend...
curl -s -f -m 1 http://localhost:5173/ >nul 2>&1
if not errorlevel 1 (
    echo Frontend is already running! Reusing existing frontend.
    goto VERIFY_APP
)

echo Existing frontend not found. Starting a new frontend...
taskkill /FI "WINDOWTITLE eq Skyrim NPC Frontend*" /T /F >nul 2>&1

cd /d "%PROJECT_ROOT%frontend"
if not exist node_modules (
    echo node_modules not found. Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed! Cannot start frontend.
        pause
        exit /b 1
    )
)

start "Skyrim NPC Frontend" cmd /k "cd /d "%PROJECT_ROOT%frontend" && npm run dev"

echo Waiting for frontend...
:WAIT_FRONTEND
timeout /t 2 /nobreak >nul
curl -s -f -m 1 http://localhost:5173/ >nul 2>&1
if errorlevel 1 (
    echo Still waiting for frontend...
    goto WAIT_FRONTEND
)
echo Frontend is up!

:VERIFY_APP
echo.
echo [3/4] Verifying application...
echo Backend: OK
echo Frontend: OK

echo.
echo [4/4] Opening browser...
start http://localhost:5173/

endlocal
