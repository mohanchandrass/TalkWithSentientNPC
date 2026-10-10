@echo off
echo Stopping Skyrim NPC servers...

:: Close the specific command windows created by run_app.bat
echo Terminating Backend Window...
taskkill /FI "WINDOWTITLE eq Skyrim NPC Backend*" /T /F >nul 2>&1

echo Terminating Frontend Window...
taskkill /FI "WINDOWTITLE eq Skyrim NPC Frontend*" /T /F >nul 2>&1

echo Done.
