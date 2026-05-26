from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


class CommissionOut(BaseModel):
    id: int
    from_user_name: Optional[str]
    miner_name: Optional[str]
    level: int
    commission_percent: Decimal
    purchase_amount: Decimal
    commission_amount: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}


class CommissionTotals(BaseModel):
    total: Decimal
    level1: Decimal
    level2: Decimal
    level3: Decimal


class TeamStats(BaseModel):
    level1_count: int
    level2_count: int
    level3_count: int
    total: int
    weekly_bonus_tier: str
    weekly_bonus_amount: Decimal
