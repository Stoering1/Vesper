@echo off
setlocal EnableExtensions
cd /d "%~dp0Vesper-main"
if not exist package.json (
  echo FEHLER: Vesper-main\package.json wurde nicht gefunden.
  pause
  exit /b 1
)
if not exist node_modules\vite\bin\vite.js (
  echo Vesper-Abhaengigkeiten fehlen.
  echo Bitte zuerst Install-Vesper.bat ausfuehren.
  pause
  exit /b 1
)

echo Vesper wird gestartet...
echo.
echo PC:    http://localhost:8080
set "IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"IPv4-Adresse" /C:"IPv4 Address"') do (
  if not defined IP set "IP=%%a"
)
set "IP=%IP: =%"
if defined IP echo iPad:  http://%IP%:8080

echo.
echo Dieses Fenster offen lassen, solange Vesper laeuft.
echo Zum Beenden: STRG+C
call npm run dev
if errorlevel 1 echo.
if errorlevel 1 echo Vesper wurde mit einem Fehler beendet.
pause
