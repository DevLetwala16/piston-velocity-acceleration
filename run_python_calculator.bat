@echo off
title Piston Kinematics Python Calculator
cd /d "%~dp0python"
echo ========================================================
echo Running Python Kinematics & Dynamics Calculator...
echo Author: Rahul Parmar
echo ========================================================
echo.
python cli_calculator.py --bore 85 --stroke 88 --rod 145 --rpm 6000 --mass 0.45
echo.
pause
