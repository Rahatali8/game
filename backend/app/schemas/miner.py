from pydantic import BaseModel, computed_field
from typing import Optional
from decimal import Decimal
from datetime import datetime, timezone


class MinerOut(BaseModel):
    id: int
    product_name: str
    image_url: Optional[str]
    daily_income: Decimal
    total_income: Decimal
    period_days: int
    days_claimed: int
    last_claim_at: Optional[datetime]
    expires_at: Optional[datetime]
    status: str
    can_claim: bool
    remaining_cooldown: int  # seconds
    remaining_days: int

    model_config = {"from_attributes": True}


class PurchaseRequest(BaseModel):
    product_id: int
