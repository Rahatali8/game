from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.product import Product
from app.schemas.product import ProductOut
from app.schemas.common import ok

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
async def list_products(
    country: str | None = Query(None),
    limit: int = Query(50, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = select(Product).where(Product.is_active == True).order_by(Product.sort_order, Product.id)
    if country:
        q = q.where(Product.country == country)
    q = q.limit(limit)
    result = await db.execute(q)
    products = result.scalars().all()
    return ok(data=[ProductOut.model_validate(p) for p in products])


@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.id == product_id, Product.is_active == True))
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return ok(data=ProductOut.model_validate(product))
