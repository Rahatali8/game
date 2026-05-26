from pydantic import BaseModel
from typing import Any, Optional


class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


def ok(data: Any = None, message: str = "Success") -> dict:
    return {"success": True, "message": message, "data": data}


def err(message: str, error_code: str = "") -> dict:
    return {"success": False, "message": message, "error_code": error_code}
