from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MessageOut(BaseModel):
    id: int
    user_id: int
    sender_type: str
    message: Optional[str]
    message_type: str
    voice_url: Optional[str]
    voice_duration: Optional[int]
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SendMessageRequest(BaseModel):
    message: str
