# responses.py
from fastapi import HTTPException
from typing import Union

def success_response(data: Union[dict, list, str] = None):
    return {
        "status": "success",
        "data": data,
        "message": None
    }

def error_response(message: str, status_code: int = 400):
    raise HTTPException(
        status_code=status_code,
        detail={
            "status": "error",
            "data": None,
            "message": message
        }
    )
