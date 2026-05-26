from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.miner import PurchaseRequest
from app.schemas.common import ok
from app.services.miner_service import get_user_miners, purchase_miner, claim_miner, claim_all_miners

router = APIRouter(prefix="/miners", tags=["miners"])


@router.get("")
async def list_miners(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    miners = await get_user_miners(db, current_user.id)
    return ok(data=miners)


@router.post("/purchase")
async def purchase(
    body: PurchaseRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    miner = await purchase_miner(db, current_user, body.product_id)
    return ok(data={"miner_id": miner.id}, message="Miner purchased successfully")


@router.post("/{miner_id}/claim")
async def claim(
    miner_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    amount = await claim_miner(db, current_user.id, miner_id)
    return ok(data={"amount": float(amount)}, message=f"Claimed ${amount:.2f}")


@router.post("/claim-all")
async def claim_all(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    total = await claim_all_miners(db, current_user.id)
    return ok(data={"total": float(total)}, message=f"Claimed ${total:.2f} total")
