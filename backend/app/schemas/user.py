from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    country_code: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class SetWithdrawPinRequest(BaseModel):
    pin: str
    current_password: str


class LoginHistoryOut(BaseModel):
    id: int
    ip_address: Optional[str]
    device_type: Optional[str]
    os_name: Optional[str]
    browser_name: Optional[str]
    ip_location: Optional[str]
    is_current: bool
    login_time: datetime

    model_config = {"from_attributes": True}
