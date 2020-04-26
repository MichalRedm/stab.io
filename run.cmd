@echo off
:loop
cd /D "%~dp0"
node server/server.js
pause
goto loop