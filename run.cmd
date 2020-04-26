@echo off
:loop
cd /D "%~dp0"
node server.js
pause
goto loop