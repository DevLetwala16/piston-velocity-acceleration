@echo off
title Generate Excel Spreadsheet
cd /d "%~dp0python"
echo ========================================================
echo Generating Excel (.xlsx) Spreadsheet...
echo Author: Rahul Parmar
echo ========================================================
echo.
python generate_spreadsheet.py
echo.
pause
