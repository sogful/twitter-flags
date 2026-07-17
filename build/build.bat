@echo off
setlocal
set "here=%~dp0"
for %%i in ("%here%..") do set "root=%%~fi"
set "stage=%TEMP%\twitterflags-stage"
set "zip=%here%twitterflags.zip"
set "tar=%SystemRoot%\System32\tar.exe"

where node >nul 2>nul || (echo node.js is required on path & exit /b 1)
if not exist "%tar%" (echo windows tar.exe not found, needs win10 1803+ & exit /b 1)

echo [1/2] packing extension zip...
robocopy "%root%\configs" "%stage%\configs" /mir /nfl /ndl /njh /njs >nul
robocopy "%root%\fonts"   "%stage%\fonts"   /mir /nfl /ndl /njh /njs >nul
robocopy "%root%\images"  "%stage%\images"  /mir /nfl /ndl /njh /njs >nul
robocopy "%root%\src"     "%stage%\src"     /mir /nfl /ndl /njh /njs >nul
copy /y "%root%\manifest.json" "%stage%" >nul
copy /y "%root%\panel.html" "%stage%" >nul
copy /y "%root%\panel.css" "%stage%" >nul
copy /y "%root%\panel.js" "%stage%" >nul

pushd "%stage%"
"%tar%" -a -c -f "%zip%" manifest.json panel.html panel.css panel.js configs fonts images src
set "rc=%errorlevel%"
popd
if not "%rc%"=="0" (echo zip step failed & exit /b 1)

echo [2/2] building userscript...
node "%here%builduserscript.js"
if errorlevel 1 (echo userscript step failed & exit /b 1)

echo.
echo done. twitterflags.zip + twitterflags.user.js are in %here%
