@echo off
setlocal EnableExtensions
cd /d "%~dp0"
if not exist Vesper-main\package.json (
  echo FEHLER: Dieses Update-Paket muss neben Vesper-main liegen.
  pause
  exit /b 1
)
echo Vesper-Update: lokale Installation wird vorbereitet.
echo.
if exist Vesper-main\.vesper-data echo Die lokale Datenbank bleibt erhalten.
if exist Vesper-main\node_modules echo Vorhandene Abhaengigkeiten bleiben erhalten.
echo.
call Install-Vesper.bat
