@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 20 or later is required. Download from https://nodejs.org/
  pause
  exit /b 1
)
node --version
start "" "http://127.0.0.1:4309"
node server.mjs
pause
