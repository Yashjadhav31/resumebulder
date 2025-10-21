@echo off
echo Starting ML Resume Analyzer Service...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

REM Download required models
echo Downloading required models...
python -m spacy download en_core_web_sm

REM Start the service
echo.
echo Starting ML service on http://localhost:5001
echo Press Ctrl+C to stop the service
echo.
python app.py

pause
