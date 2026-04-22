@echo off
echo Starting FastAPI Backend...
.\venv\Scripts\python -m uvicorn main:app --reload
pause
