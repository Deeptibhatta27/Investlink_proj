# FINALPROJECT Launcher Script
Write-Host "Setting up environment for FINALPROJECT..." -ForegroundColor Green
Write-Host ""

# Add Python and Node.js to PATH
$env:PATH += ";C:\Users\$env:USERNAME\AppData\Local\Programs\Python\Python312;C:\Users\$env:USERNAME\AppData\Local\Programs\Python\Python312\Scripts;C:\Program Files\nodejs"

Write-Host "Environment setup complete!" -ForegroundColor Green
Write-Host ""

# Verify installations
Write-Host "Checking installations..." -ForegroundColor Yellow
try {
    $pythonVersion = & "C:\Users\$env:USERNAME\AppData\Local\Programs\Python\Python312\python.exe" --version 2>&1
    Write-Host "✓ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found" -ForegroundColor Red
}

try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version 2>&1
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Starting FINALPROJECT servers..." -ForegroundColor Green
Write-Host ""

# Start Next.js frontend
Write-Host "Starting Next.js frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 3

# Start Django backend
Write-Host "Starting Django backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python manage.py runserver" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
