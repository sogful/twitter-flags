@echo off
setlocal
set "here=%~dp0"

where node >nul 2>nul || (echo node.js is required on path & exit /b 1)

echo building userscript...
node "%here%builduserscript.js"
if errorlevel 1 (echo userscript step failed & exit /b 1)

echo.
echo done! twitterflags.user.js is in %here%
echo (the extension itself loads straight from the repo root - point "load unpacked" there)
