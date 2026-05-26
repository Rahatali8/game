from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class WalletOut(BaseModel):
    balance: Decimal
    commission_income: Decimal
    total_withdrawn: Decimal
    total_earned: Decimal

    model_config = {"from_attributes": True}


class DashboardOut(BaseModel):
    wallet: WalletOut
    miners_count: int
    today_mining: Decimal
    yesterday_mining: Decimal
    total_referrals: int
