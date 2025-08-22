@echo off
echo Setting up environment for FINALPROJECT...
echo.

REM Add Python and Node.js to PATH
set PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312;C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python312\Scripts;C:\Program Files\nodejs

echo Environment setup complete!
echo.
echo Starting FINALPROJECT servers...
echo.

REM Start Next.js frontend in a new window
start "Next.js Frontend" cmd /k "cd /d %~dp0 && npm run dev"

REM Wait a moment for frontend to start
timeout /t 5 /nobreak > nul

REM Start Django backend in a new window
start "Django Backend" cmd /k "cd /d %~dp0 && python manage.py runserver"

echo.
echo Both servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:8000
echo.
echo Press any key to close this window...
pause > nul
