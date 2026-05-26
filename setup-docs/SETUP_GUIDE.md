# 🚀 CLOUDFIRE — Complete Setup Guide

Bhai, yeh aapki **step-by-step guide** hai. Sirf yeh follow karen aur project ban jayega.

---

## 📦 KYA-KYA FILES MILI HAIN

Aapko **3 files** mili hain:

1. **`MASTER_PLAN.md`** — Poora project ka overview (database schema, colors, roadmap, API list)
2. **`BACKEND_PROMPT.md`** — Claude Code mein paste karne wala backend ka prompt
3. **`FRONTEND_PROMPT.md`** — Claude Code mein paste karne wala frontend ka prompt
4. **`SETUP_GUIDE.md`** — Yeh file (kya karna hai step-by-step)

---

## ✅ PRE-REQUIREMENTS CHECK

Pehle yeh sab aapke Linux mein hona chahiye:

```bash
# Terminal mein chala kar check karen:

node --version          # Should be v20+ (or v18+)
npm --version           # Should be v9+
python3 --version       # Should be 3.11+
pip3 --version          # Should be 23+
psql --version          # PostgreSQL installed?
git --version           # Git installed?
```

**Agar koi missing hai:**

```bash
# Ubuntu/Debian par missing install karen:
sudo apt update
sudo apt install nodejs npm python3 python3-pip python3-venv postgresql postgresql-contrib git

# Node.js v20 install (best way - via NodeSource):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 🛠️ STEP 1: PROJECT FOLDER BANAEN

```bash
# Home directory mein jao
cd ~

# Main folder banao
mkdir cloudfire
cd cloudfire

# Sub-folders banao
mkdir backend frontend

# VS Code mein open karo
code .
```

---

## 🐘 STEP 2: POSTGRESQL DATABASE BANAEN

```bash
# PostgreSQL service start karen
sudo service postgresql start

# Postgres user mein switch karen
sudo -u postgres psql

# Phir psql ke andar yeh likhen:
```

```sql
CREATE DATABASE cloudfire;
CREATE USER cloudfire_user WITH PASSWORD 'cloudfire123';
GRANT ALL PRIVILEGES ON DATABASE cloudfire TO cloudfire_user;
\c cloudfire
GRANT ALL ON SCHEMA public TO cloudfire_user;
\q
```

**Verify** karen:
```bash
psql -U cloudfire_user -d cloudfire -h localhost
# Password puchega: cloudfire123
# Agar connect ho jaye to: \q to exit
```

**Database URL save karo:**
```
postgresql+asyncpg://cloudfire_user:cloudfire123@localhost:5432/cloudfire
```

---

## 🤖 STEP 3: CLAUDE CODE INSTALL KAREN

```bash
# Claude Code install
npm install -g @anthropic-ai/claude-code

# Login karen
claude login
# Phir browser khulega, sign in karen
```

---

## 🔥 STEP 4: BACKEND BANAEN (FastAPI)

```bash
# Backend folder mein jao
cd ~/cloudfire/backend

# Claude Code start karo
claude
```

Ab Claude Code chalu ho gaya. **`BACKEND_PROMPT.md`** file ka **poora content copy karo** aur **paste karo** Claude Code ke chat mein.

Yeh kaam karega:
- Python virtual environment banayega
- FastAPI install karega
- 16 database tables banayega
- Alembic migrations chalayega
- Sab API endpoints banayega
- Server start karega on port 8000

**Test:** Browser mein kholo `http://localhost:8000/docs` — Swagger UI dikhega with all APIs.

---

## 🎨 STEP 5: FRONTEND BANAEN (Next.js)

**Ek naya terminal kholen** (backend wala chalu rehne dein):

```bash
cd ~/cloudfire/frontend

# Claude Code start karo
claude
```

Ab **`FRONTEND_PROMPT.md`** file ka **poora content copy karo** aur **paste karo**.

Yeh kaam karega:
- Next.js 16 project banayega
- Tailwind + shadcn install karega
- Blue/white theme set karega
- Sab 15+ pages banayega
- Bottom navigation lagayega
- API integration karega backend ke saath
- Server start karega on port 3000

**Test:** Browser mein kholo `http://localhost:3000` — login page dikhega.

---

## 🎯 STEP 6: TESTING

Dono server chalne ke baad:

1. **Register:** Naya account banao `+92` country code se
2. **Login:** Login karke dashboard dekho
3. **Profile:** Apna profile dekho
4. **Products:** Mining pool mein products dekho
5. **Purchase test:** Pehle deposit add karwao (admin se), phir miner buy karo

---

## 🚀 STEP 7: DEPLOY (Production)

### Backend (FastAPI):
**Option A — Railway (FREE $5 credit/month):**
1. Sign up at https://railway.app
2. Create new project → Deploy from GitHub
3. Push your `backend/` folder to GitHub
4. Railway will auto-detect Python and deploy
5. Add PostgreSQL plugin from Railway
6. Copy DATABASE_URL from Railway dashboard

**Option B — Render (FREE):**
1. Sign up at https://render.com
2. New Web Service → Connect GitHub
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL (free tier)

### Frontend (Next.js):
**Vercel (FREE forever):**
1. Sign up at https://vercel.com (use GitHub login)
2. Import your `frontend/` folder repo
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1`
4. Click Deploy
5. Get a free `.vercel.app` URL

### Database (Production):
**Supabase (FREE 500MB):**
1. Sign up at https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Use as `DATABASE_URL` in backend `.env`

---

## 📱 STEP 8: MOBILE APP (BONUS)

Jab website complete ho jaye, mobile APK banane ke liye:

```bash
cd ~/cloudfire/frontend

# Capacitor install
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialize
npx cap init CloudFire com.cloudfire.app

# Configure Next.js for static export
# Edit next.config.ts:
#   output: 'export'
#   images: { unoptimized: true }

# Build
npm run build

# Add Android
npx cap add android
npx cap copy android

# Android Studio install karen, phir:
npx cap open android
# Android Studio mein "Build APK" karen
```

APK file aapko mil jayegi.

---

## 🆘 TROUBLESHOOTING

### Backend issue: "psycopg2 install fails"
```bash
sudo apt install libpq-dev python3-dev
pip install psycopg2-binary
```

### Backend issue: "Port 8000 already in use"
```bash
# Kill the process
sudo lsof -ti:8000 | xargs kill -9
```

### Frontend issue: "CORS error"
- Backend ke `.env` mein `FRONTEND_URL=http://localhost:3000` set karen
- Backend restart karen

### Frontend issue: "API 401 Unauthorized"
- localStorage clear karen browser mein
- Login dobara karen

### Alembic migration error
```bash
# Reset migrations:
rm -rf alembic/versions/*
alembic revision --autogenerate -m "fresh"
alembic upgrade head
```

---

## 📅 EXPECTED TIMELINE

| Day | Phase | Outcome |
|-----|-------|---------|
| Day 1 | Setup (Phase 1) | Empty backend + frontend running |
| Day 2-3 | Auth (Phase 2) | Register + Login working |
| Day 4-5 | Profile + Wallet (Phase 3-4) | Profile page full + wallet dashboard |
| Day 6-7 | Mining (Phase 5) | Buy + claim miners working |
| Day 8 | Deposit/Withdraw (Phase 7) | Payment flow done |
| Day 9 | Chat (Phase 8) | Real-time chat working |
| Day 10 | Profile sub-pages (Phase 10) | All me/* pages done |
| Day 11-12 | Misc + Admin | Bonus features + admin panel |
| Day 13 | Polish | Mobile responsive, loading states |
| Day 14 | Deploy | Live on Vercel + Railway |
| Day 15+ | Mobile APK | Capacitor build |

---

## 💡 PRO TIPS

1. **Always test backend first** before connecting frontend
2. **Use `/docs` page** in browser to test APIs without frontend
3. **Commit to Git frequently** — `git commit -m "Phase X complete"`
4. **Don't change tech stack** mid-way — finish first, optimize later
5. **Ask Claude Code for help** anytime — it's interactive
6. **Backup your database** before any major change:
   ```bash
   pg_dump cloudfire > backup.sql
   ```

---

## 🎯 FINAL CHECKLIST

Before going live:

- [ ] Change `SECRET_KEY` in backend `.env` to a strong random string
- [ ] Set `ENVIRONMENT=production` in backend
- [ ] Remove all `console.log` from frontend
- [ ] Test on real mobile phone (not just browser dev tools)
- [ ] Set up admin account (run a script to mark one user as `is_admin=True`)
- [ ] Configure payment methods (USDT addresses, JazzCash numbers)
- [ ] Set up domain (optional, e.g., from Namecheap $1/year)
- [ ] Enable HTTPS (automatic on Vercel + Railway)
- [ ] Backup strategy (daily DB backup)
- [ ] Privacy policy + Terms of service pages

---

## 📞 NEED HELP?

Agar koi step pe atak jayen:

1. Error ka **exact message** Claude Code ko bhejen
2. Yeh batayen kaunse phase pe ho
3. `npm run dev` ya `uvicorn` ki output share karen

**Aap akele nahi ho — har step mein Claude Code aapki help karega!**

🔥 **Let's build CloudFire!** 🚀
