from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.user import User
from app.models.transaction import Deposit, Withdrawal
from app.models.product import Product
from app.models.announcement import Announcement
from app.models.message import Message
from app.models.bonus import BonusCode
from app.schemas.product import CreateProductRequest, ProductOut
from app.schemas.transaction import DepositOut, WithdrawalOut
from app.schemas.common import ok
from app.services.wallet_service import get_wallet
from app.utils.helpers import generate_referral_code

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
async def list_users(
    page: int = Query(1, ge=1),
    search: str = Query(""),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    q = select(User).offset((page - 1) * 20).limit(20)
    if search:
        q = q.where(User.mobile.ilike(f"%{search}%") | User.name.ilike(f"%{search}%"))
    result = await db.execute(q)
    users = result.scalars().all()
    return ok(data=[{"id": u.id, "mobile": u.mobile, "name": u.name, "is_active": u.is_active, "is_premium": u.is_premium} for u in users])


@router.get("/deposits/pending")
async def pending_deposits(db: AsyncSession = Depends(get_db), _admin: User = Depends(get_current_admin)):
    result = await db.execute(select(Deposit).where(Deposit.status == "pending").order_by(Deposit.created_at.desc()))
    return ok(data=[DepositOut.model_validate(d) for d in result.scalars().all()])


@router.post("/deposits/{deposit_id}/approve")
async def approve_deposit(
    deposit_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Deposit).where(Deposit.id == deposit_id))
    deposit = result.scalar_one_or_none()
    if not deposit or deposit.status != "pending":
        raise HTTPException(status_code=404, detail="Deposit not found or already processed")

    deposit.status = "approved"
    deposit.processed_at = datetime.now(timezone.utc)

    wallet = await get_wallet(db, deposit.user_id)
    wallet.balance += deposit.amount
    await db.commit()
    return ok(message="Deposit approved")


@router.post("/deposits/{deposit_id}/reject")
async def reject_deposit(
    deposit_id: int,
    body: dict = {},
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Deposit).where(Deposit.id == deposit_id))
    deposit = result.scalar_one_or_none()
    if not deposit or deposit.status != "pending":
        raise HTTPException(status_code=404, detail="Deposit not found or already processed")

    deposit.status = "rejected"
    deposit.processed_at = datetime.now(timezone.utc)
    deposit.admin_note = body.get("note", "")
    await db.commit()
    return ok(message="Deposit rejected")


@router.get("/withdrawals/pending")
async def pending_withdrawals(db: AsyncSession = Depends(get_db), _admin: User = Depends(get_current_admin)):
    result = await db.execute(select(Withdrawal).where(Withdrawal.status == "pending").order_by(Withdrawal.requested_at.desc()))
    return ok(data=[WithdrawalOut.model_validate(w) for w in result.scalars().all()])


@router.post("/withdrawals/{withdrawal_id}/approve")
async def approve_withdrawal(
    withdrawal_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Withdrawal).where(Withdrawal.id == withdrawal_id))
    w = result.scalar_one_or_none()
    if not w or w.status != "pending":
        raise HTTPException(status_code=404, detail="Withdrawal not found or already processed")
    w.status = "approved"
    w.processed_at = datetime.now(timezone.utc)
    await db.commit()
    return ok(message="Withdrawal approved")


@router.post("/withdrawals/{withdrawal_id}/reject")
async def reject_withdrawal(
    withdrawal_id: int,
    body: dict = {},
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Withdrawal).where(Withdrawal.id == withdrawal_id))
    w = result.scalar_one_or_none()
    if not w or w.status != "pending":
        raise HTTPException(status_code=404, detail="Withdrawal not found or already processed")

    wallet = await get_wallet(db, w.user_id)
    wallet.balance += w.amount

    w.status = "rejected"
    w.processed_at = datetime.now(timezone.utc)
    w.admin_note = body.get("note", "")

    wallet_result = await db.execute(select(__import__("app.models.wallet", fromlist=["Wallet"]).Wallet).where(__import__("app.models.wallet", fromlist=["Wallet"]).Wallet.user_id == w.user_id))
    wallet_obj = wallet_result.scalar_one_or_none()
    if wallet_obj:
        wallet_obj.total_withdrawn -= w.net_amount

    await db.commit()
    return ok(message="Withdrawal rejected and refunded")


@router.post("/products")
async def create_product(
    body: CreateProductRequest,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    product = Product(**body.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return ok(data=ProductOut.model_validate(product))


@router.patch("/products/{product_id}")
async def update_product(
    product_id: int,
    body: dict,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, val in body.items():
        if hasattr(product, key):
            setattr(product, key, val)
    await db.commit()
    return ok(data=ProductOut.model_validate(product))


@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    await db.commit()
    return ok(message="Product deactivated")


@router.post("/announcements")
async def create_announcement(
    body: dict,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    ann = Announcement(title=body.get("title", ""), body=body.get("body"), banner_url=body.get("banner_url"))
    db.add(ann)
    await db.commit()
    return ok(message="Announcement created")


@router.post("/bonus-codes")
async def create_bonus_code(
    body: dict,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    from decimal import Decimal
    code = BonusCode(
        code=(body.get("code") or generate_referral_code(8)).upper(),
        amount=Decimal(str(body.get("amount", 1))),
        max_uses=body.get("max_uses", 1),
    )
    db.add(code)
    await db.commit()
    return ok(data={"code": code.code, "amount": float(code.amount)})


@router.get("/messages/{user_id}")
async def admin_get_messages(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(Message).where(Message.user_id == user_id).order_by(Message.created_at.asc()).limit(100)
    )
    from app.schemas.message import MessageOut
    return ok(data=[MessageOut.model_validate(m) for m in result.scalars().all()])


@router.post("/messages/{user_id}/reply")
async def admin_reply(
    user_id: int,
    body: dict,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    from app.api.v1.websocket import manager
    msg = Message(user_id=user_id, sender_type="admin", message=body.get("message", ""), message_type="text")
    db.add(msg)
    await db.commit()
    await db.refresh(msg)

    await manager.send_to_user(user_id, {
        "id": msg.id,
        "user_id": user_id,
        "sender_type": "admin",
        "message": msg.message,
        "message_type": "text",
        "created_at": msg.created_at.isoformat(),
    })
    from app.schemas.message import MessageOut
    return ok(data=MessageOut.model_validate(msg))
