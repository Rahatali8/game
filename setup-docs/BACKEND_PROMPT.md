# 🔥 CLOUDFIRE BACKEND — Claude Code Master Prompt

> **Instructions for User:**
> 1. Create a folder named `backend` inside your `cloudfire/` project
> 2. Open that folder in VS Code
> 3. Open Claude Code (terminal) in that folder
> 4. Paste this **ENTIRE FILE** as your first message to Claude Code
> 5. Let Claude Code build it phase by phase

---

## ⚡ ROLE & MISSION

You are a **Senior Python Backend Engineer** with 10+ years of experience in FastAPI, PostgreSQL, SQLAlchemy 2.0 async, and JWT authentication. You are building the complete backend for **CloudFire** — a crystal mining investment platform with referral commissions, real-time chat, and admin management.

**Build production-quality code:**
- Use async/await everywhere (SQLAlchemy 2.0 async)
- Type hints on every function
- Pydantic v2 for validation
- Proper error handling with HTTPException
- Folder structure matters — keep it clean
- NO TODO comments — actually implement everything
- Write code that just works when copy-pasted

---

## 🛠️ TECH STACK (LOCKED — DO NOT CHANGE)

```
Python:        3.11+
Framework:     FastAPI 0.115+
ASGI Server:   Uvicorn
ORM:           SQLAlchemy 2.0 (async)
Migrations:    Alembic
Database:      PostgreSQL (asyncpg driver)
Validation:    Pydantic v2
Auth:          JWT (python-jose)
Password:      bcrypt (passlib)
File Upload:   FastAPI UploadFile
Real-time:     WebSocket (FastAPI built-in)
Env:           python-dotenv + pydantic-settings
CORS:          fastapi.middleware.cors
```

---

## 📂 EXACT FOLDER STRUCTURE TO CREATE

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI entry, CORS, routers
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                 # Pydantic Settings
│   │   ├── database.py               # async engine + session
│   │   ├── security.py               # JWT + bcrypt
│   │   └── deps.py                   # get_current_user, get_db
│   ├── models/                       # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── base.py                   # Base, TimestampMixin
│   │   ├── user.py
│   │   ├── wallet.py
│   │   ├── product.py
│   │   ├── miner.py
│   │   ├── claim_history.py
│   │   ├── commission.py
│   │   ├── transaction.py            # deposit + withdrawal
│   │   ├── message.py
│   │   ├── login_history.py
│   │   ├── notification.py
│   │   ├── announcement.py
│   │   ├── task_reward.py
│   │   └── bonus.py
│   ├── schemas/                      # Pydantic request/response
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── wallet.py
│   │   ├── product.py
│   │   ├── miner.py
│   │   ├── transaction.py
│   │   ├── message.py
│   │   ├── commission.py
│   │   └── common.py                 # APIResponse, Pagination
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py             # combines all routes
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── wallet.py
│   │       ├── products.py
│   │       ├── miners.py
│   │       ├── commissions.py
│   │       ├── team.py
│   │       ├── deposits.py
│   │       ├── withdrawals.py
│   │       ├── messages.py
│   │       ├── tasks.py
│   │       ├── bonus.py
│   │       ├── announcements.py
│   │       ├── crypto.py
│   │       ├── admin.py
│   │       └── websocket.py
│   ├── services/                     # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── miner_service.py          # purchase, claim logic
│   │   ├── commission_service.py     # 10/4/2 distribution
│   │   ├── wallet_service.py
│   │   ├── deposit_service.py
│   │   ├── withdrawal_service.py
│   │   ├── premium_service.py
│   │   └── notification_service.py
│   └── utils/
│       ├── __init__.py
│       ├── helpers.py                # generate_referral_code, etc.
│       └── parser.py                 # device/IP parser
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
├── alembic.ini
├── uploads/
│   ├── avatars/
│   ├── voices/
│   └── deposits/
├── tests/
│   └── __init__.py
├── .env.example
├── .gitignore
├── requirements.txt
├── seed.py                           # seed initial products
└── README.md
```

---

## 🗄️ DATABASE SCHEMA (Build These 16 Tables)

### 1. `users`
- `id` int PK, `mobile` varchar(20) unique, `password_hash` varchar(255)
- `withdraw_pin` varchar(255) nullable, `name` varchar(100)
- `avatar_url` varchar(500), `referral_code` varchar(20) unique
- `referred_by` varchar(20) nullable (FK to users.referral_code)
- `is_premium` bool default false, `premium_until` timestamp
- `is_admin` bool default false, `is_active` bool default true
- `created_at`, `last_login`

### 2. `wallets` (1-to-1 with users)
- `user_id` int FK unique, `balance` decimal(15,2)
- `commission_income` decimal(15,2), `total_withdrawn` decimal(15,2)
- `total_earned` decimal(15,2), `updated_at`

### 3. `products`
- `id`, `name`, `price`, `old_price`, `daily_income`, `total_income`
- `period_days`, `quantity_limit`, `image_url`, `country`
- `is_premium_miner`, `offer_tag`, `card_color`, `is_active`, `created_at`

### 4. `user_miners`
- `id`, `user_id` FK, `product_id` FK, `product_name`
- `purchase_price`, `daily_income`, `total_income`, `period_days`
- `days_claimed` (int), `last_claim_at`, `started_at`, `expires_at`
- `status` (active/expired), `image_url`

### 5. `claim_history`
- `id`, `user_id` FK, `miner_id` FK, `amount`, `claimed_at`

### 6. `commissions`
- `id`, `user_id` (earner), `from_user_id` (buyer), `from_user_name`
- `miner_id`, `miner_name`, `level` (1/2/3), `commission_percent`
- `purchase_amount`, `commission_amount`, `created_at`

### 7. `commission_claims`
- `id`, `user_id`, `amount`, `claimed_at`

### 8. `deposits`
- `id`, `user_id`, `amount`, `method`, `txn_id`, `screenshot_url`
- `status` (pending/approved/rejected), `admin_note`
- `created_at`, `processed_at`

### 9. `withdrawals`
- `id`, `user_id`, `amount`, `fee`, `net_amount`, `method`
- `account_details` (text/JSON), `status`, `admin_note`
- `requested_at`, `processed_at`

### 10. `messages`
- `id`, `user_id`, `sender_type` (user/admin), `message` (text)
- `message_type` (text/voice), `voice_url`, `voice_duration`
- `is_read`, `created_at`

### 11. `login_history`
- `id`, `user_id`, `ip_address`, `device_type`, `os_name`
- `browser_name`, `ip_location`, `login_time`, `is_current`

### 12. `notifications`
- `id`, `user_id`, `title`, `body`, `type`, `is_read`, `created_at`

### 13. `announcements`
- `id`, `title`, `body`, `is_active`, `created_at`

### 14. `task_rewards`
- `id`, `user_id`, `task_type`, `amount`, `claimed_at`

### 15. `bonus_claims`
- `id`, `user_id`, `bonus_code`, `amount`, `claimed_at`

### 16. `bonus_codes`
- `id`, `code` unique, `amount`, `max_uses`, `uses_count`
- `expires_at`, `is_active`, `created_at`

**ALL TIMESTAMPS:** Use `DateTime(timezone=True)`, default `func.now()`.

---

## 🎯 BUILD IN THESE PHASES

### **PHASE 1: Foundation** (Do this first)

1. Create `requirements.txt`:
```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.35
alembic==1.14.0
asyncpg==0.30.0
psycopg2-binary==2.9.10
pydantic==2.9.2
pydantic-settings==2.6.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
python-dotenv==1.0.1
email-validator==2.2.0
user-agents==2.2.0
httpx==0.27.2
websockets==13.1
```

2. Create `.env.example`:
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/cloudfire
SECRET_KEY=change-me-to-random-32-char-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10
```

3. Create `app/core/config.py` — Pydantic Settings class loading `.env`

4. Create `app/core/database.py`:
   - `async_engine = create_async_engine(...)`
   - `AsyncSessionLocal`
   - `async def get_db() -> AsyncGenerator[AsyncSession, None]`

5. Create `app/core/security.py`:
   - `hash_password(plain) -> str`
   - `verify_password(plain, hashed) -> bool`
   - `create_access_token(data: dict) -> str`
   - `decode_token(token: str) -> dict`

6. Create `app/models/base.py`:
   - `Base = declarative_base()`
   - `TimestampMixin` with `created_at`, `updated_at`

7. Create ALL 16 models with proper relationships

8. Initialize Alembic:
   - `alembic init alembic`
   - Configure `alembic/env.py` to use async + import all models
   - Generate first migration: `alembic revision --autogenerate -m "initial schema"`
   - Apply: `alembic upgrade head`

9. Create `app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(title="CloudFire API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status": "ok", "service": "CloudFire API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

10. Create `seed.py` to insert 9 default products (data in MASTER_PLAN.md table)

---

### **PHASE 2: Authentication**

**Endpoints:**
- `POST /api/v1/auth/register`
  - Body: `mobile`, `password`, `name`, `referral_code` (optional)
  - Validates mobile uniqueness, hashes password
  - Generates unique 6-char alphanumeric `referral_code` (uppercase)
  - Creates wallet record
  - Returns: `{access_token, user}`

- `POST /api/v1/auth/login`
  - Body: `mobile`, `password`
  - Verifies, updates `last_login`, saves login_history
  - Returns: `{access_token, user, wallet}`

- `GET /api/v1/auth/me`
  - Header: Bearer token
  - Returns current user data

- `POST /api/v1/auth/logout`

- `POST /api/v1/auth/refresh`

**Files:** `app/api/v1/auth.py`, `app/services/auth_service.py`, `app/schemas/auth.py`

---

### **PHASE 3: Users + Profile**

**Endpoints:**
- `GET    /api/v1/users/profile`
- `PATCH  /api/v1/users/profile` — update name
- `POST   /api/v1/users/change-password`
- `POST   /api/v1/users/set-withdraw-pin`
- `POST   /api/v1/users/avatar` — file upload, save to `uploads/avatars/`
- `GET    /api/v1/users/login-history`

---

### **PHASE 4: Wallet**

**Endpoints:**
- `GET /api/v1/wallet` — current balances
- `GET /api/v1/wallet/dashboard` — aggregated:
  ```json
  {
    "wallet": {...},
    "today_mining": 0.00,
    "yesterday_mining": 0.00,
    "total_referrals": 0
  }
  ```

---

### **PHASE 5: Products + Miners + Claiming**

**Endpoints:**
- `GET  /api/v1/products` — list all active products
- `GET  /api/v1/products/{id}`
- `GET  /api/v1/miners` — user's purchased miners with status:
  ```json
  [
    {
      "id": 1,
      "product_name": "...",
      "daily_income": 0.40,
      "remaining_days": 24,
      "can_claim": true,
      "remaining_cooldown": 0,
      "expired": false,
      "image_url": "..."
    }
  ]
  ```
- `POST /api/v1/miners/purchase`
  - Body: `product_id`
  - Validates: balance + commission >= price, quantity_limit not exceeded
  - Deducts from balance (use commission if balance insufficient)
  - Creates user_miner with `expires_at = now() + period_days`
  - **Distributes 3-level commission** (call commission_service)
  - If product is premium_miner, set user.is_premium=True, premium_until=expires_at
  - Returns success/failure

- `POST /api/v1/miners/{id}/claim`
  - Validates: miner.user_id == current_user, 24hr passed since last_claim
  - Adds daily_income to wallet.balance
  - Updates `last_claim_at`, increments `days_claimed`
  - Creates `claim_history` record
  - Sets `status='expired'` if days_claimed >= period_days

- `POST /api/v1/miners/claim-all`
  - Claims all ready miners in one transaction

**File:** `app/services/miner_service.py` is critical here.

---

### **PHASE 6: Commission System (3 levels)**

**Logic in `app/services/commission_service.py`:**

```python
async def distribute_commission(
    db: AsyncSession,
    buyer: User,
    miner: UserMiner,
    purchase_amount: Decimal
):
    """
    When user buys a miner, distribute commission to up to 3 levels of inviters.
    Level 1 (direct): 10%
    Level 2: 4%
    Level 3: 2%
    """
    levels = [(1, 10), (2, 4), (3, 2)]
    current_referrer_code = buyer.referred_by

    for level, percent in levels:
        if not current_referrer_code:
            break

        # Find the user with this referral_code
        result = await db.execute(
            select(User).where(User.referral_code == current_referrer_code)
        )
        upline = result.scalar_one_or_none()
        if not upline:
            break

        # Calculate commission
        amount = (purchase_amount * Decimal(percent) / Decimal(100)).quantize(Decimal('0.01'))

        # Insert commission record
        commission = Commission(
            user_id=upline.id,
            from_user_id=buyer.id,
            from_user_name=buyer.name,
            miner_id=miner.id,
            miner_name=miner.product_name,
            level=level,
            commission_percent=percent,
            purchase_amount=purchase_amount,
            commission_amount=amount,
        )
        db.add(commission)

        # Add to upline's commission_income (NOT balance)
        wallet = await get_wallet(db, upline.id)
        wallet.commission_income += amount
        wallet.total_earned += amount

        # Move up to next level
        current_referrer_code = upline.referred_by

    await db.commit()
```

**Endpoints:**
- `GET  /api/v1/commissions/history?limit=30`
- `GET  /api/v1/commissions/totals` — returns `{total, level1, level2, level3}`
- `POST /api/v1/commissions/claim` — moves all commission_income to balance, creates claim record

---

### **PHASE 7: Team**

**Endpoints:**
- `GET /api/v1/team/stats`
  ```json
  {
    "level1_count": 0,
    "level2_count": 0,
    "level3_count": 0,
    "total": 0,
    "weekly_bonus_tier": "New Partner",
    "weekly_bonus_amount": 0
  }
  ```
- `GET /api/v1/team/level/1` — list level 1 members with their miners + commissions earned

**Recursive query needed:** Use CTE or repeated joins to get 3 levels.

---

### **PHASE 8: Deposits + Withdrawals**

**Deposits:**
- `POST /api/v1/deposits`
  - Multipart form: `amount`, `method`, `txn_id`, `screenshot` (file)
  - Saves screenshot, creates pending deposit
- `GET  /api/v1/deposits/history`

**Withdrawals:**
- `POST /api/v1/withdrawals`
  - Body: `amount`, `method`, `account_details`, `withdraw_pin`
  - Verifies withdraw_pin, deducts from wallet.balance immediately (or hold)
  - Creates pending withdrawal
- `GET  /api/v1/withdrawals/history`

---

### **PHASE 9: Messages (Chat)**

**REST Endpoints:**
- `GET    /api/v1/messages?last_id=0&limit=50`
- `POST   /api/v1/messages/text` — body: `message`
- `POST   /api/v1/messages/voice` — multipart: audio file + duration
- `DELETE /api/v1/messages/clear`

**WebSocket:**
- `WS /ws/chat/{token}`
  - Validates JWT token from URL
  - Connection manager pattern
  - On user message: save to DB + broadcast to user's socket + admin sockets
  - On admin reply: broadcast to that user's socket

```python
# app/api/v1/websocket.py
class ConnectionManager:
    def __init__(self):
        self.active: dict[int, list[WebSocket]] = {}
        self.admins: list[WebSocket] = []

    async def connect(self, user_id: int, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(user_id, []).append(ws)

    async def disconnect(self, user_id: int, ws: WebSocket):
        if user_id in self.active:
            self.active[user_id].remove(ws)

    async def send_to_user(self, user_id: int, data: dict):
        for ws in self.active.get(user_id, []):
            await ws.send_json(data)
```

---

### **PHASE 10: Tasks + Bonus + Announcements**

- `POST /api/v1/tasks/claim-daily` — once per 24hrs, adds $0.10 reward
- `POST /api/v1/bonus/redeem-code` — validates bonus_code, adds to balance, increments uses_count
- `GET  /api/v1/announcements` — active announcements
- `GET  /api/v1/crypto/prices` — proxies Binance API for BTC/ETH/FIL

---

### **PHASE 11: Admin Routes**

All admin endpoints require `is_admin=True` check via dependency.

- `POST   /api/v1/admin/login`
- `GET    /api/v1/admin/users?page=1&search=`
- `GET    /api/v1/admin/users/{id}`
- `PATCH  /api/v1/admin/users/{id}` — activate/deactivate
- `GET    /api/v1/admin/deposits/pending`
- `POST   /api/v1/admin/deposits/{id}/approve` — adds to user.balance
- `POST   /api/v1/admin/deposits/{id}/reject`
- `GET    /api/v1/admin/withdrawals/pending`
- `POST   /api/v1/admin/withdrawals/{id}/approve`
- `POST   /api/v1/admin/withdrawals/{id}/reject` — refunds to user.balance
- `POST   /api/v1/admin/products` — create product
- `PATCH  /api/v1/admin/products/{id}`
- `DELETE /api/v1/admin/products/{id}`
- `POST   /api/v1/admin/announcements`
- `POST   /api/v1/admin/bonus-codes`
- `GET    /api/v1/admin/messages/{user_id}`
- `POST   /api/v1/admin/messages/{user_id}/reply` — body: message text

---

## 🔐 SECURITY RULES

1. **Passwords:** Min 6 chars, bcrypt with cost 12
2. **JWT:** HS256, 7-day expiry, store user_id + is_admin in payload
3. **CORS:** Whitelist frontend URL from settings
4. **File Uploads:**
   - Max size: 10 MB
   - Avatars: only `.jpg/.jpeg/.png/.webp`
   - Voice: only `.webm/.mp3/.m4a/.ogg`
   - Deposit screenshots: only image types
   - Always save with UUID filenames
5. **SQL Injection:** Never use raw strings; SQLAlchemy ORM only
6. **Rate Limiting:** Add to login + register (e.g. slowapi library)
7. **Withdraw PIN:** Separate from login password, hashed same way

---

## 📦 RESPONSE FORMAT (Consistent)

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "INSUFFICIENT_FUNDS"
}
```

Use `HTTPException(status_code=400, detail={...})` for errors.

---

## ✅ DEFINITION OF DONE

For each phase:
- [ ] All endpoints implemented with proper async/await
- [ ] Pydantic schemas for request + response
- [ ] Error handling with appropriate HTTP codes (400/401/403/404/409/500)
- [ ] Type hints on all functions
- [ ] Tested via FastAPI auto docs at `/docs`
- [ ] Database migrations generated and applied
- [ ] CORS works with frontend at localhost:3000

---

## 🚀 STARTUP COMMANDS

```bash
# Initial setup (once)
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate           # Windows
pip install -r requirements.txt
cp .env.example .env              # then edit .env

# Create database (in psql)
createdb cloudfire

# Migrations
alembic upgrade head

# Seed initial products
python seed.py

# Run dev server
uvicorn app.main:app --reload --port 8000

# Visit http://localhost:8000/docs for Swagger UI
```

---

## 🎯 START NOW

1. Confirm Python 3.11+ is installed: `python3 --version`
2. Build **PHASE 1** first (foundation + all 16 models + initial migration + run successfully)
3. Show me the project tree and the running `/docs` endpoint
4. Wait for my confirmation before Phase 2
5. Continue phase by phase, building all 50+ endpoints
6. After Phase 11, deploy guide for Railway/Render

**Build clean, build complete, build production-ready.** Let's go! 🔥
