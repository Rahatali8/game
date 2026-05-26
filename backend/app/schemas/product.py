from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


class ProductOut(BaseModel):
    id: int
    name: str
    price: Decimal
    old_price: Optional[Decimal]
    daily_income: Decimal
    total_income: Decimal
    period_days: int
    quantity_limit: int
    image_url: Optional[str]
    country: str
    is_premium_miner: bool
    offer_tag: Optional[str]
    card_color: Optional[str]
    sort_order: int

    model_config = {"from_attributes": True}


class CreateProductRequest(BaseModel):
    name: str
    price: Decimal
    old_price: Optional[Decimal] = None
    daily_income: Decimal
    total_income: Decimal
    period_days: int
    quantity_limit: int = 1
    image_url: Optional[str] = None
    country: str = "global"
    is_premium_miner: bool = False
    offer_tag: Optional[str] = None
    card_color: Optional[str] = None
    sort_order: int = 0
