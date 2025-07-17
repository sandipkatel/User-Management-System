#!/bin/bash
# Run the FastAPI server using uvicorn

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
