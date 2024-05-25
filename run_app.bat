@echo off
cd /d %~dp0

echo Installing dependencies...
pip install -r requirements.txt

cd backend

echo Starting Flask app...
python app.py
