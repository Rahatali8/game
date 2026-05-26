from fastapi import APIRouter
from app.api.v1 import auth, users, wallet, products, miners, commissions, team, deposits, withdrawals, messages, tasks, bonus, announcements, crypto, admin, websocket

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(wallet.router)
api_router.include_router(products.router)
api_router.include_router(miners.router)
api_router.include_router(commissions.router)
api_router.include_router(team.router)
api_router.include_router(deposits.router)
api_router.include_router(withdrawals.router)
api_router.include_router(messages.router)
api_router.include_router(tasks.router)
api_router.include_router(bonus.router)
api_router.include_router(announcements.router)
api_router.include_router(crypto.router)
api_router.include_router(admin.router)
api_router.include_router(websocket.router)
