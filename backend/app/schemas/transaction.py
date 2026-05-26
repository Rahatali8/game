from pydantic import BaseModel
from typing import Optional, Any
from decimal import Decimal
from datetime import datetime


class DepositOut(BaseModel):
    id: int
    amount: Decimal
    method: Optional[str]
    txn_id: Optional[str]
    screenshot_url: Optional[str]
    status: str
    admin_note: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class WithdrawalOut(BaseModel):
    id: int
    amount: Decimal
    fee: Decimal
    net_amount: Decimal
    method: Optional[str]
    account_details: Optional[str]
    status: str
    admin_note: Optional[str]
    requested_at: datetime

    model_config = {"from_attributes": True}


class WithdrawRequest(BaseModel):
    amount: Decimal
    method: str
    account_details: dict[str, Any]
    withdraw_pin: str
