# 🔥 CLOUDFIRE — MASTER PLAN

> Complete roadmap, architecture, database schema, and deployment guide for the CloudFire crypto mining platform.

---

## 📋 PROJECT OVERVIEW

**Name:** CloudFire (Crystal Mining)
**Type:** Cloud mining + referral platform with 3-level commission system
**Currency:** USD ($)
**Theme:** Blue + White (professional, modern)
**Target:** Mobile-first responsive web app → convertible to Android/iOS via Capacitor

---

## 🏗️ TECH STACK (FINAL)

### Frontend
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui**
- **Framer Motion** (animations)
- **Chart.js** (crypto charts)
- **Lucide React** (icons)
- **Axios** (API calls)
- **js-cookie** (JWT storage)
- **qrcode.react** (referral QR)

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy 2.0** (async ORM)
- **Alembic** (migrations — Django-style)
- **PostgreSQL** (database)
- **python-jose** (JWT tokens)
- **passlib + bcrypt** (password hashing)
- **WebSockets** (real-time chat)
- **Pydantic v2** (validation)

### DevOps
- **Git + GitHub** (version control)
- **Vercel** (frontend hosting — FREE)
- **Railway / Render** (backend hosting — FREE tier)
- **Supabase / Neon** (PostgreSQL — FREE tier)

---

## 🎨 BRAND TOKENS (Blue + White)

```css
/* Primary Palette */
--cf-primary:        #2563eb   /* Royal Blue - main brand */
--cf-primary-dark:   #1e3a8a   /* Deep Blue - headers */
--cf-primary-light:  #3b82f6   /* Sky Blue - accents */
--cf-bg:             #f8fafc   /* Off-white - page bg */
--cf-bg-blue:        #dbeafe   /* Light blue - card bg */
--cf-bg-dark:        #0f172a   /* Navy - footer/dark sections */

/* Text */
--cf-text:           #0f172a   /* Main text */
--cf-text-soft:      #475569   /* Secondary text */
--cf-text-muted:     #94a3b8   /* Muted/captions */

/* States */
--cf-success:        #10b981   /* Green - gains */
--cf-warning:        #f59e0b   /* Amber - warnings */
--cf-danger:         #ef4444   /* Red - errors */
--cf-info:           #06b6d4   /* Cyan - info */

/* Gradients */
--cf-grad-hero:      linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)
--cf-grad-wallet:    linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)
--cf-grad-premium:   linear-gradient(135deg, #d4af37 0%, #f9ca24 100%)

/* Borders & Shadows */
--cf-border:         #e2e8f0
--cf-shadow:         0 4px 12px rgba(37, 99, 235, 0.08)
--cf-shadow-lg:      0 12px 32px rgba(37, 99, 235, 0.12)

/* Radius */
--cf-radius-sm:      12px
--cf-radius:         20px
--cf-radius-lg:      28px
--cf-radius-pill:    9999px
```

---

## 📊 DATABASE SCHEMA (16 Tables)

### 1. `users` — User accounts
```
id              SERIAL PK
mobile          VARCHAR(20) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
withdraw_pwd    VARCHAR(255)
name            VARCHAR(100)
referral_code   VARCHAR(10) UNIQUE NOT NULL
referred_by     INTEGER REFERENCES users(id)
is_premium      BOOLEAN DEFAULT FALSE
premium_until   TIMESTAMP
avatar_url      TEXT
country_code    VARCHAR(5) DEFAULT '+92'
is_active       BOOLEAN DEFAULT TRUE
is_admin        BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP DEFAULT NOW()
last_login      TIMESTAMP
```

### 2. `wallets` — User finances
```
user_id              INTEGER PK REFERENCES users(id)
balance              DECIMAL(15,2) DEFAULT 0
commission_income    DECIMAL(15,2) DEFAULT 0
total_withdrawn      DECIMAL(15,2) DEFAULT 0
total_earned         DECIMAL(15,2) DEFAULT 0
updated_at           TIMESTAMP DEFAULT NOW()
```

### 3. `products` — Mining machines
```
id                  SERIAL PK
name                VARCHAR(100) NOT NULL
price               DECIMAL(10,2) NOT NULL
old_price           DECIMAL(10,2)
daily_income        DECIMAL(10,2) NOT NULL
total_income        DECIMAL(10,2) NOT NULL
period_days         INTEGER NOT NULL
quantity_limit      INTEGER DEFAULT 1
image_url           TEXT
country             VARCHAR(50) DEFAULT 'global'
is_premium_miner    BOOLEAN DEFAULT FALSE
offer_tag           VARCHAR(100)
card_color          VARCHAR(20)
is_active           BOOLEAN DEFAULT TRUE
sort_order          INTEGER DEFAULT 0
created_at          TIMESTAMP DEFAULT NOW()
```

### 4. `user_miners` — User's purchased machines
```
id                  SERIAL PK
user_id             INTEGER REFERENCES users(id)
product_id          INTEGER REFERENCES products(id)
product_name        VARCHAR(100)
image_url           TEXT
purchase_price      DECIMAL(10,2)
daily_income        DECIMAL(10,2)
total_income        DECIMAL(10,2)
period_days         INTEGER
remaining_days      INTEGER
last_claim_at       TIMESTAMP
started_at          TIMESTAMP DEFAULT NOW()
expires_at          TIMESTAMP
status              VARCHAR(20) DEFAULT 'active'  -- active/expired
```

### 5. `claim_history` — Daily mining income claims
```
id              SERIAL PK
user_id         INTEGER REFERENCES users(id)
miner_id        INTEGER REFERENCES user_miners(id)
amount          DECIMAL(10,2)
claimed_at      TIMESTAMP DEFAULT NOW()
```

### 6. `commissions` — Referral commission earned
```
id                  SERIAL PK
user_id             INTEGER REFERENCES users(id)        -- earner
from_user_id        INTEGER REFERENCES users(id)        -- payer
from_user_name      VARCHAR(100)
miner_id            INTEGER
miner_name          VARCHAR(100)
level               INTEGER  -- 1, 2, or 3
percent             DECIMAL(5,2)  -- 10, 4, or 2
purchase_amount     DECIMAL(10,2)
commission_amount   DECIMAL(10,2)
status              VARCHAR(20) DEFAULT 'pending'   -- pending/claimed
created_at          TIMESTAMP DEFAULT NOW()
```

### 7. `commission_claims` — Commission → Balance transfers
```
id          SERIAL PK
user_id     INTEGER REFERENCES users(id)
amount      DECIMAL(10,2)
claimed_at  TIMESTAMP DEFAULT NOW()
```

### 8. `deposits` — Money in
```
id              SERIAL PK
user_id         INTEGER REFERENCES users(id)
amount          DECIMAL(10,2) NOT NULL
method          VARCHAR(50)        -- USDT, JazzCash, EasyPaisa, Bank
txn_id          VARCHAR(100)
proof_image     TEXT
status          VARCHAR(20) DEFAULT 'pending'   -- pending/approved/rejected
admin_note      TEXT
created_at      TIMESTAMP DEFAULT NOW()
processed_at    TIMESTAMP
```

### 9. `withdrawals` — Money out
```
id                  SERIAL PK
user_id             INTEGER REFERENCES users(id)
amount              DECIMAL(10,2) NOT NULL
method              VARCHAR(50)
account_details     JSONB         -- account_number, holder_name, etc
status              VARCHAR(20) DEFAULT 'pending'
admin_note          TEXT
requested_at        TIMESTAMP DEFAULT NOW()
processed_at        TIMESTAMP
```

### 10. `messages` — Live chat (user ↔ admin)
```
id              SERIAL PK
user_id         INTEGER REFERENCES users(id)
sender_type     VARCHAR(10)        -- 'user' or 'admin'
message         TEXT
message_type    VARCHAR(10) DEFAULT 'text'   -- text or voice
voice_url       TEXT
voice_duration  INTEGER
is_read         BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP DEFAULT NOW()
```

### 11. `login_history` — Security log
```
id              SERIAL PK
user_id         INTEGER REFERENCES users(id)
ip_address      VARCHAR(45)
device_type     VARCHAR(20)
os_name         VARCHAR(50)
browser_name    VARCHAR(50)
ip_location     VARCHAR(100)
is_current      BOOLEAN DEFAULT FALSE
login_time      TIMESTAMP DEFAULT NOW()
```

### 12. `notifications` — Push/in-app notifications
```
id          SERIAL PK
user_id     INTEGER REFERENCES users(id)
title       VARCHAR(200)
body        TEXT
type        VARCHAR(50)         -- info, success, warning, error
icon        VARCHAR(50)
is_read     BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP DEFAULT NOW()
```

### 13. `announcements` — Admin broadcasts
```
id          SERIAL PK
title       VARCHAR(200)
body        TEXT
banner_url  TEXT
is_active   BOOLEAN DEFAULT TRUE
created_at  TIMESTAMP DEFAULT NOW()
```

### 14. `task_rewards` — Daily sign-in bonus
```
id              SERIAL PK
user_id         INTEGER REFERENCES users(id)
task_type       VARCHAR(50)
amount          DECIMAL(10,2)
claimed_date    DATE
created_at      TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, task_type, claimed_date)
```

### 15. `bonus_claims` — Random bonus key codes
```
id              SERIAL PK
user_id         INTEGER REFERENCES users(id)
bonus_code      VARCHAR(50)
amount          DECIMAL(10,2)
claimed_at      TIMESTAMP DEFAULT NOW()
```

### 16. `crypto_prices` — Cache for Binance API (BTC/ETH/FIL)
```
coin        VARCHAR(10) PK
price       DECIMAL(15,2)
change_24h  DECIMAL(5,2)
updated_at  TIMESTAMP DEFAULT NOW()
```

---

## 🔗 API ENDPOINTS (50+ Endpoints)

### Auth (`/api/auth`)
- `POST /register` — Create account
- `POST /login` — Login with mobile + password
- `POST /logout` — Logout
- `POST /refresh` — Refresh JWT token
- `GET /me` — Current user info
- `PUT /me` — Update profile
- `PUT /me/password` — Change login password
- `PUT /me/withdraw-password` — Set/update withdraw password
- `POST /me/avatar` — Upload avatar

### Dashboard (`/api/dashboard`)
- `GET /` — Home dashboard data (wallet + miners + stats)
- `GET /crypto-prices` — Live BTC/ETH/FIL prices

### Products (`/api/products`)
- `GET /` — List all mining machines (filter by country)
- `GET /{id}` — Single product detail
- `GET /hot` — Featured products

### Miners (`/api/miners`)
- `GET /` — User's miners (active + expired)
- `POST /purchase` — Buy a miner
- `POST /{id}/claim` — Claim daily income from one miner
- `POST /claim-all` — Claim from all miners

### Wallet (`/api/wallet`)
- `GET /` — Balance + commission + stats
- `POST /claim-commission` — Transfer commission → balance
- `GET /claim-history` — Claim transactions

### Deposits (`/api/deposits`)
- `POST /` — Submit deposit request
- `GET /` — User's deposit history
- `GET /{id}` — Single deposit detail

### Withdrawals (`/api/withdrawals`)
- `POST /` — Request withdrawal (requires withdraw pwd)
- `GET /` — User's withdrawal history
- `GET /{id}` — Single withdrawal

### Team / Commission (`/api/team`)
- `GET /counts` — L1/L2/L3 member counts
- `GET /level/{level}` — Team members at level (1/2/3)
- `GET /commissions` — Commission transactions
- `GET /commission-totals` — Total by level

### Messages (`/api/messages`)
- `GET /` — Chat history
- `POST /` — Send text message
- `POST /voice` — Send voice message (multipart)
- `DELETE /` — Clear chat
- `WS /ws/{user_id}` — WebSocket for real-time chat

### Notifications (`/api/notifications`)
- `GET /` — List notifications
- `PUT /{id}/read` — Mark as read
- `PUT /read-all` — Mark all read

### Tasks & Bonus (`/api/tasks`)
- `GET /reward` — Daily task reward status
- `POST /reward/claim` — Claim daily reward
- `POST /bonus/claim` — Redeem bonus code

### Public (`/api/public`)
- `GET /announcements` — Active announcements
- `GET /about` — About us content
- `GET /consultant` — Consultant info

### Admin (`/api/admin`) — Protected, admin-only
- `GET /users` — List users
- `GET /deposits/pending` — Pending deposits
- `POST /deposits/{id}/approve`
- `POST /deposits/{id}/reject`
- `GET /withdrawals/pending`
- `POST /withdrawals/{id}/approve`
- `POST /withdrawals/{id}/reject`
- `POST /products` — Create product
- `PUT /products/{id}` — Update product
- `POST /announcements` — Create announcement
- `GET /messages/{user_id}` — User's chat
- `POST /messages/{user_id}/reply` — Reply to user

---

## 📂 FOLDER STRUCTURE

```
cloudfire/
│
├── frontend/                    ← Next.js 16 project
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/
│   │   │   ├── layout.tsx       ← With bottom nav
│   │   │   ├── page.tsx          ← Home (/)
│   │   │   ├── product/page.tsx  ← Mining Pool
│   │   │   ├── asset/page.tsx    ← Wallet
│   │   │   ├── message/page.tsx  ← Chat
│   │   │   └── me/
│   │   │       ├── page.tsx
│   │   │       ├── premium/page.tsx
│   │   │       ├── team/page.tsx
│   │   │       ├── commission/page.tsx
│   │   │       ├── settings/page.tsx
│   │   │       └── login-history/page.tsx
│   │   ├── deposit/page.tsx
│   │   ├── withdraw/page.tsx
│   │   ├── account-history/page.tsx
│   │   ├── withdraw-history/page.tsx
│   │   ├── task-reward/page.tsx
│   │   ├── random-bonus/page.tsx
│   │   ├── announcement/page.tsx
│   │   ├── about-us/page.tsx
│   │   ├── consult/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   ← shadcn components
│   │   ├── BottomNav.tsx
│   │   ├── WalletCard.tsx
│   │   ├── MinerBubble.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── ChatBubble.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts                ← Axios client
│   │   ├── auth.ts               ← JWT helpers
│   │   ├── types.ts              ← TypeScript types
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWallet.ts
│   │   └── useWebSocket.ts
│   ├── public/
│   │   └── images/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── package.json
│   └── .env.local
│
├── backend/                     ← FastAPI project
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── auth.py
│   │   │   │   ├── dashboard.py
│   │   │   │   ├── products.py
│   │   │   │   ├── miners.py
│   │   │   │   ├── wallet.py
│   │   │   │   ├── deposits.py
│   │   │   │   ├── withdrawals.py
│   │   │   │   ├── team.py
│   │   │   │   ├── messages.py
│   │   │   │   ├── notifications.py
│   │   │   │   ├── tasks.py
│   │   │   │   ├── public.py
│   │   │   │   ├── admin.py
│   │   │   │   └── websocket.py
│   │   │   └── deps.py           ← Dependencies (auth, db)
│   │   ├── core/
│   │   │   ├── config.py         ← Settings
│   │   │   ├── security.py       ← JWT, bcrypt
│   │   │   └── database.py       ← DB connection
│   │   ├── models/               ← SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── wallet.py
│   │   │   ├── product.py
│   │   │   ├── miner.py
│   │   │   ├── transaction.py
│   │   │   ├── message.py
│   │   │   └── ...
│   │   ├── schemas/              ← Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── wallet.py
│   │   │   └── ...
│   │   ├── services/             ← Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── miner_service.py
│   │   │   ├── commission_service.py
│   │   │   └── ...
│   │   └── utils/
│   │       ├── referral_code.py
│   │       └── ip_lookup.py
│   ├── alembic/
│   │   ├── versions/             ← Migration files
│   │   ├── env.py
│   │   └── alembic.ini
│   ├── tests/
│   ├── uploads/                  ← Voice messages, avatars
│   ├── main.py                   ← FastAPI entry
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🚀 PHASES OVERVIEW

| Phase | Tasks | Time |
|-------|-------|------|
| **1. Setup** | Project structure, DB, env, deps | Week 1 |
| **2. Auth** | Register, Login, JWT, sessions | Week 2 |
| **3. Profile** | Me page + sub-pages + settings | Week 3 |
| **4. Home + Mining** | Dashboard, miners, claim, products | Week 4-5 |
| **5. Wallet** | Asset, deposit, withdraw, history | Week 6 |
| **6. Chat** | WebSocket, voice, typing indicator | Week 7 |
| **7. Commission** | 3-level referral, weekly bonus | Week 8 |
| **8. Admin + Deploy** | Admin panel, Vercel, Railway | Week 9-10 |
| **Bonus** | Capacitor → Android/iOS APK | Week 11-12 |

---

## 🌐 DEPLOYMENT GUIDE

### Frontend (Next.js → Vercel)
1. Push code to GitHub
2. Sign up at vercel.com
3. Import repo
4. Add env vars: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
5. Deploy (auto on every git push)

### Backend (FastAPI → Railway)
1. Push to GitHub
2. Sign up at railway.app (free $5/month credit)
3. New Project → Deploy from GitHub
4. Add PostgreSQL service (one click)
5. Add env vars:
   - `DATABASE_URL=postgresql://...`
   - `SECRET_KEY=xxx`
   - `JWT_ALGORITHM=HS256`
6. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Database (PostgreSQL)
- **Dev:** Local PostgreSQL
- **Prod Option A:** Railway PostgreSQL (free tier)
- **Prod Option B:** Supabase (500MB free)
- **Prod Option C:** Neon.tech (500MB free)

### Mobile App (Capacitor)
```bash
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "CloudFire" "com.cloudfire.app"
npm run build
npx cap add android
npx cap sync
npx cap open android   # Opens Android Studio
# Build APK from Android Studio
```

---

## 💰 BUSINESS LOGIC RULES

### Commission Distribution (when user buys a miner)
- **Level 1 referrer** (direct): gets **10%** of purchase
- **Level 2 referrer** (indirect): gets **4%**
- **Level 3 referrer** (deep): gets **2%**
- Premium members get extra **+1% airdrop** on commission

### Miner Mechanics
- 24-hour cooldown between claims
- Each click claims `daily_income` to commission_income wallet
- New miners need 24h before first claim
- Expired miners: `remaining_days <= 0`

### Premium Member
- Cost: **$80** (one-time purchase via Premium Miner)
- Benefits:
  - 5% discount on all miners
  - +1% airdrop bonus
  - Extended lease periods
  - Reduced withdrawal fees
  - Priority support
  - Exclusive avatar frame

### Weekly Bonus Tiers (based on Level 1 referrals)
| Tier | Members | Bonus |
|------|---------|-------|
| New Partner | 0–29 | $0 |
| Junior Partner | 30–49 | $2/week |
| Intermediate Partner | 50–99 | $5/week |
| Senior Partner | 100–199 | $10/week |
| Regional Partner | 200–499 | $15/week |
| City Partner | 500–1299 | $30/week |
| Executive Partner | 1300–2499 | $100/week |
| Corporate Partner | 2500–4999 | $1K/month |
| Consultant | ≥5000 | $15K/month |

### Withdrawal Rules
- Minimum withdrawal: $10
- Requires withdraw password (separate from login)
- 24h processing time
- Admin approval required

---

## ✅ HOW TO USE THE PROMPT FILES

1. **Open Claude Code** in your terminal: `claude`
2. **Read `02_BACKEND_PROMPT.md`** — Copy entire content
3. **Paste into Claude Code** with this command:
   ```
   Build the backend exactly as described in this spec: [paste]
   ```
4. **Wait for Claude Code** to create all files and run setup
5. **Test backend:** `cd backend && uvicorn main:app --reload` → http://localhost:8000/docs
6. **Then read `03_FRONTEND_PROMPT.md`** and do the same in a new Claude Code session
7. **Test frontend:** `cd frontend && npm run dev` → http://localhost:3000

---

## 🎯 SUCCESS CRITERIA

- ✅ User can register → login → see dashboard
- ✅ Crypto prices update live every 5 sec
- ✅ User can buy miner → claim daily income after 24h
- ✅ 3-level commission auto-distributed
- ✅ Deposit + withdraw requests reach admin
- ✅ Real-time chat works (user ↔ admin)
- ✅ Premium upgrade unlocks benefits
- ✅ Mobile responsive (works on 320px+)
- ✅ Capacitor APK builds successfully

---

**Built with ❤️ for CloudFire Mining**
