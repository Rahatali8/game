from pydantic import BaseModel, field_validator
from typing import Optional


class RegisterRequest(BaseModel):
    mobile: str
    password: str
    name: Optional[str] = None
    referral_code: Optional[str] = None
    country_code: str = "+92"

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("mobile")
    @classmethod
    def mobile_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Mobile is required")
        return v


class LoginRequest(BaseModel):
    mobile: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    mobile: str
    name: Optional[str]
    avatar_url: Optional[str]
    referral_code: str
    is_premium: bool
    is_admin: bool
    country_code: str

    model_config = {"from_attributes": True}


class WalletOut(BaseModel):
    balance: float
    commission_income: float
    total_withdrawn: float
    total_earned: float

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
    wallet: Optional[WalletOut] = None
