from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/crypto", tags=["crypto"])

SYMBOLS = {"BTC": "BTCUSDT", "ETH": "ETHUSDT", "FIL": "FILUSDT"}


@router.get("/prices")
async def crypto_prices():
    prices = {}
    async with httpx.AsyncClient(timeout=5.0) as client:
        for coin, symbol in SYMBOLS.items():
            try:
                r = await client.get(f"https://api.binance.com/api/v3/ticker/24hr?symbol={symbol}")
                data = r.json()
                prices[coin] = {
                    "price": float(data.get("lastPrice", 0)),
                    "change_24h": float(data.get("priceChangePercent", 0)),
                }
            except Exception:
                prices[coin] = {"price": 0, "change_24h": 0}
    return {"success": True, "data": prices}
