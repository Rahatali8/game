from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.core.security import decode_token
from app.models.message import Message
from datetime import datetime, timezone

router = APIRouter(tags=["websocket"])


class ConnectionManager:
    def __init__(self) -> None:
        self.active: dict[int, list[WebSocket]] = {}
        self.admins: list[WebSocket] = []

    async def connect_user(self, user_id: int, ws: WebSocket) -> None:
        await ws.accept()
        self.active.setdefault(user_id, []).append(ws)

    def disconnect_user(self, user_id: int, ws: WebSocket) -> None:
        if user_id in self.active:
            try:
                self.active[user_id].remove(ws)
            except ValueError:
                pass

    async def connect_admin(self, ws: WebSocket) -> None:
        await ws.accept()
        self.admins.append(ws)

    def disconnect_admin(self, ws: WebSocket) -> None:
        try:
            self.admins.remove(ws)
        except ValueError:
            pass

    async def send_to_user(self, user_id: int, data: dict) -> None:
        for ws in self.active.get(user_id, []):
            try:
                await ws.send_json(data)
            except Exception:
                pass

    async def broadcast_to_admins(self, data: dict) -> None:
        for ws in self.admins:
            try:
                await ws.send_json(data)
            except Exception:
                pass


manager = ConnectionManager()


@router.websocket("/ws/chat/{token}")
async def websocket_chat(ws: WebSocket, token: str):
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except Exception:
        await ws.close(code=4001)
        return

    await manager.connect_user(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            msg_text = data.get("message", "")
            if not msg_text:
                continue

            async with AsyncSessionLocal() as db:
                msg = Message(
                    user_id=user_id,
                    sender_type="user",
                    message=msg_text,
                    message_type="text",
                )
                db.add(msg)
                await db.commit()
                await db.refresh(msg)

            payload_out = {
                "id": msg.id,
                "user_id": user_id,
                "sender_type": "user",
                "message": msg.message,
                "message_type": "text",
                "created_at": msg.created_at.isoformat(),
            }
            await manager.send_to_user(user_id, payload_out)
            await manager.broadcast_to_admins({**payload_out, "for_user_id": user_id})

    except WebSocketDisconnect:
        manager.disconnect_user(user_id, ws)
