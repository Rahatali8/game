# 🔥 CLOUDFIRE FRONTEND — Claude Code Master Prompt

> **Instructions for User:**
> 1. Create a folder named `frontend` inside your `cloudfire/` project
> 2. Open that folder in VS Code
> 3. Open Claude Code (terminal) in that folder
> 4. Paste this **ENTIRE FILE** as your first message to Claude Code
> 5. Make sure backend is already running on `http://localhost:8000` before testing API calls
> 6. Let Claude Code build it phase by phase

---

## ⚡ ROLE & MISSION

You are a **Senior Frontend Engineer** with 10+ years of experience in Next.js, React, TypeScript, Tailwind CSS, and mobile-first design. You are building **CloudFire** — a crystal mining investment platform — as a fully responsive Next.js 16 web app that will later become a mobile APK via Capacitor.

**Build production-quality code:**
- TypeScript strict mode, no `any`
- Mobile-first design (max-width 500px is primary)
- Tailwind utility classes (no custom CSS files unless needed)
- shadcn/ui for buttons, inputs, dialogs
- Server Components where possible, Client Components when needed (`'use client'`)
- Proper loading states + skeletons
- Error boundaries + toast notifications
- All API calls via centralized Axios client
- JWT stored in `httpOnly` cookie OR localStorage (we'll use localStorage for simplicity)
- NO placeholder content — wire everything to the backend

---

## 🛠️ TECH STACK (LOCKED)

```
Framework:     Next.js 16 (App Router)
Language:      TypeScript (strict)
Styling:       Tailwind CSS v4
UI Library:    shadcn/ui
Icons:         lucide-react
Animations:    framer-motion
HTTP:          axios
Charts:        chart.js + react-chartjs-2
QR Code:       qrcode.react
Cookies:       js-cookie
WebSocket:     native browser API
Backend URL:   http://localhost:8000/api/v1
Build target:  Web + future Capacitor (mobile)
```

---

## 🎨 DESIGN SYSTEM — BLUE + WHITE

**MUST USE THESE EXACT COLORS — no orange, no red, no purple as primary.**

### Tailwind Config Extension

Add to `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        50:  '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',   // ⭐ PRIMARY
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',   // ⭐ DEEP
        950: '#0f1e4d',
      },
      surface: {
        DEFAULT: '#ffffff',
        soft: '#f8fafc',
        muted: '#f1f5f9',
      },
      ink: {
        DEFAULT: '#0f172a',
        soft: '#475569',
        muted: '#94a3b8',
      },
    },
    backgroundImage: {
      'brand-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      'card-gradient': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      'hero-gradient': 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
}
```

### Design Tokens

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --radius: 1rem;
  --radius-card: 1.5rem;
  --radius-pill: 9999px;
}

body {
  background: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

### Layout Rules

- Mobile-first: design for 360–500px width
- Center container: `max-w-md mx-auto` everywhere
- Cards: `rounded-2xl` to `rounded-3xl`
- Buttons: `rounded-xl` to `rounded-full`
- Shadows: `shadow-sm` to `shadow-xl` — subtle, not heavy
- Spacing: generous padding inside cards (`p-4` to `p-6`)
- Typography: bold headers (font-extrabold), normal body (font-medium)

---

## 📂 FOLDER STRUCTURE

```
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Redirects to /home or /login
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx                # With BottomNav
│   │   ├── home/page.tsx             # was index.php
│   │   ├── product/page.tsx          # Mining Pool
│   │   ├── asset/page.tsx            # Wallet
│   │   ├── message/page.tsx          # Live Chat
│   │   └── me/
│   │       ├── page.tsx              # Profile
│   │       ├── commission/page.tsx
│   │       ├── premium/page.tsx
│   │       ├── team/page.tsx
│   │       ├── login-history/page.tsx
│   │       ├── personal-info/page.tsx
│   │       ├── change-password/page.tsx
│   │       ├── withdraw-pin/page.tsx
│   │       └── settings/page.tsx
│   ├── deposit/page.tsx
│   ├── withdraw/page.tsx
│   ├── rent/[id]/page.tsx
│   ├── account-history/page.tsx
│   ├── withdraw-history/page.tsx
│   ├── task-reward/page.tsx
│   ├── random-bonus/page.tsx
│   ├── about-us/page.tsx
│   ├── consult/page.tsx
│   └── announcement/page.tsx
├── components/
│   ├── ui/                           # shadcn (button, input, dialog, toast)
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── PageHeader.tsx
│   │   └── BackButton.tsx
│   ├── home/
│   │   ├── WalletStatsCard.tsx
│   │   ├── MinerBubble.tsx
│   │   ├── CryptoChart.tsx
│   │   ├── NewsTicker.tsx
│   │   └── HotProductCard.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── CountryTabs.tsx
│   │   ├── PremiumStatusTracker.tsx
│   │   ├── MyMinersModal.tsx
│   │   └── PurchaseConfirmModal.tsx
│   ├── asset/
│   │   └── AssetCard.tsx
│   ├── message/
│   │   ├── ChatBubble.tsx
│   │   ├── VoiceMessage.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── VoiceRecorder.tsx
│   ├── me/
│   │   ├── ProfileHeader.tsx
│   │   ├── WeeklyBonusTable.tsx
│   │   ├── InviteCard.tsx
│   │   ├── TeamStatsCard.tsx
│   │   └── MenuListItem.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── Toast.tsx
├── lib/
│   ├── api.ts                        # Axios instance
│   ├── auth.ts                       # JWT helpers
│   ├── socket.ts                     # WebSocket
│   ├── utils.ts                      # cn(), formatters
│   └── constants.ts                  # countries, etc.
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useWallet.ts
│   ├── useMiners.ts
│   ├── useTeam.ts
│   ├── useMessages.ts
│   ├── useWebSocket.ts
│   └── useCountdown.ts
├── types/
│   ├── api.ts                        # API response types
│   ├── user.ts
│   ├── miner.ts
│   ├── message.ts
│   └── index.ts
├── store/                            # Zustand (optional, simple state)
│   └── authStore.ts
├── public/
│   ├── images/
│   ├── miners/                       # product images
│   └── logo.png
├── .env.local.example
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 📦 DEPENDENCIES TO INSTALL

```bash
# Core
npm install axios lucide-react framer-motion js-cookie

# Charts
npm install chart.js react-chartjs-2

# QR
npm install qrcode.react

# State (optional)
npm install zustand

# Date
npm install date-fns

# Types
npm install -D @types/js-cookie

# shadcn setup
npx shadcn@latest init
npx shadcn@latest add button input label dialog dropdown-menu toast sonner tabs avatar separator skeleton
```

---

## 🎯 BUILD IN THESE PHASES

### **PHASE 1: Foundation**

1. Run `npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"`
2. Install all dependencies above
3. Run `npx shadcn@latest init` (choose Slate/Neutral, CSS variables YES)
4. Create the `tailwind.config.ts` with brand colors above
5. Set up `app/globals.css` with brand tokens
6. Add Inter font in `app/layout.tsx`:
   ```tsx
   import { Inter } from 'next/font/google'
   const inter = Inter({ subsets: ['latin'] })
   ```
7. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   NEXT_PUBLIC_APP_NAME=CloudFire
   ```
8. Create `lib/api.ts`:
   ```typescript
   import axios from 'axios'
   import Cookies from 'js-cookie'

   export const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
     headers: { 'Content-Type': 'application/json' },
   })

   api.interceptors.request.use((config) => {
     const token = Cookies.get('access_token') || localStorage.getItem('access_token')
     if (token) config.headers.Authorization = `Bearer ${token}`
     return config
   })

   api.interceptors.response.use(
     (res) => res,
     (err) => {
       if (err.response?.status === 401) {
         localStorage.removeItem('access_token')
         window.location.href = '/login'
       }
       return Promise.reject(err)
     }
   )
   ```

9. Create `lib/auth.ts` with helpers
10. Create `types/` files with proper TypeScript interfaces

---

### **PHASE 2: Auth Pages**

#### `/login` page
**Design:**
- Centered card, max-width 500px
- Logo at top (CloudFire fire icon or text)
- Title: "Welcome Back" (brand-700 color, bold)
- Mobile number: country code dropdown (+92, +1, +44, +91, +86, +81, +49, +33, +61, +7, +55, +20, +90, +966, +971, +62, +63, +84) + phone input
- Password input (with show/hide toggle)
- "Sign In" button (brand gradient, full width, rounded-xl)
- "Don't have an account? Create account" link
- On success: animated success modal with wallet preview, then redirect to `/home`

**API:** `POST /api/v1/auth/login`

#### `/register` page
- Same country code dropdown
- Mobile, Password, Confirm Password, Full Name
- Referral code (auto-filled from `?ref=CODE` URL param)
- SMS verification simulated (optional, skip for now)
- "Sign Up" button
- Link to login

**API:** `POST /api/v1/auth/register`

---

### **PHASE 3: Bottom Navigation + Main Layout**

`components/layout/BottomNav.tsx` — fixed bottom, 5 items:

1. 🏠 Home → `/home`
2. ⛏️ Discover → `/product`
3. 💼 Shop → `/asset`
4. 💬 Messages → `/message` (with notification dot)
5. 👤 Profile → `/me`

**Design:**
- `fixed bottom-0` position
- Height 76px desktop / 68px mobile
- Background: `bg-brand-950` (deep navy)
- 5 SVG icons, white fill
- Active item: slightly bigger + brighter glow
- Use Lucide icons: `Home`, `Pickaxe`, `Wallet`, `MessageCircle`, `User`

**Main layout `app/(main)/layout.tsx`** wraps all 5 pages with this BottomNav and protects routes (redirect to /login if no token).

---

### **PHASE 4: Home (`/home`)**

**Sections from top to bottom:**

1. **Top hero section** (gradient `from-brand-900 to-brand-700`, rounded-b-3xl):
   - Header row: Logo + "CLOUD FIRE" / "CRYSTAL MINING" + LIVE badge (green pulse)
   - Total Assets ($X.XX) + Miners count
   - **Glass Bubbles row:**
     - Component: `MinerBubble.tsx` — circular glass effect, coin icon inside, countdown below
     - "READY!" state with green glow when claimable
     - Click → calls `POST /api/v1/miners/{id}/claim`
     - Use `framer-motion` for floating animation
   - "GET ALL" button (gradient, big, rounded-xl)
     - Calls `POST /api/v1/miners/claim-all`

2. **Center message bar** (light yellow background, soft pulse)

3. **News ticker** (marquee, "🎉 Member from X bought Y")

4. **2 Feature cards** side-by-side:
   - Task Reward → `/task-reward`
   - Random Bonus → `/random-bonus`

5. **4 Quick nav** (About Us, Consultant, Message, Announcement)

6. **Crypto Markets** card with Chart.js:
   - BTC / ETH / FIL tabs
   - Fetch live from Binance API: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
   - Update every 8 seconds
   - Smooth line chart with gradient fill

7. **Hot Mining Machines** list (top 2-3 products)
   - "View all" → `/product`

**APIs:**
- `GET /api/v1/wallet/dashboard`
- `GET /api/v1/miners`
- `GET /api/v1/products?limit=3`
- `POST /api/v1/miners/{id}/claim`
- `POST /api/v1/miners/claim-all`
- Binance API (external)

---

### **PHASE 5: Product / Mining Pool (`/product`)**

1. **Header:** "MINING POOL" with hard-hat icon
2. **Premium Status Tracker** card:
   - Standard / Premium badge
   - If standard: "⚠️ Purchase $80 PREMIUM MINER" warning
3. **Wallet card** (compact)
4. **My Miners** card — clickable, opens modal:
   - Active count
   - Modal: Tabs (Running / Expired) with progress bars
5. **Announcement strip**
6. **Country tabs** (horizontal scroll): All, Kazakhstan, Global, North Korea, Japan, Iceland, China
7. **Product grid** (one column on mobile, two on tablet+):
   - Card per product with `ProductCard.tsx`
   - Special tag at top (offer/premium)
   - 90x90 image, name, daily/total/period/limit stats
   - Old price (strikethrough) + new price
   - "RENT" button (brand gradient) → opens purchase confirmation modal
8. **Purchase Confirm Modal:**
   - Shows: product, total cost, current balance, after-purchase balance
   - "Confirm Purchase" button → `POST /api/v1/miners/purchase`
   - Success: shows "🎉 Purchase Successful!" with confetti animation (framer-motion)

**APIs:**
- `GET /api/v1/wallet`
- `GET /api/v1/products`
- `GET /api/v1/miners`
- `POST /api/v1/miners/purchase`

---

### **PHASE 6: Asset / Wallet (`/asset`)**

1. **Header:** "Assets" (brand-blue left border)
2. **Main blue gradient card:**
   - "TOTAL ASSETS" + amount (large, 2.8rem font)
   - Two columns: Available Balance + Commission Balance
   - **Deposit button** (white with blue border) → `/deposit`
   - **Withdraw button** (white) → `/withdraw`
3. **Quick action icons (2):**
   - Account history → `/account-history`
   - Withdrawal history → `/withdraw-history`
4. **Mining Income card:**
   - Total Mining Income
   - 2x2 grid: Total Referrals / Total Withdrawn / Yesterday's Mining / Today's Mining

**APIs:**
- `GET /api/v1/wallet/dashboard`

---

### **PHASE 7: Deposit + Withdraw Pages**

#### `/deposit`
- Amount input
- Method tabs: USDT / JazzCash / Easypaisa / Bank Transfer
- Show payment instructions per method (admin's account number, etc.)
- TXN ID input
- Screenshot upload
- Submit → multipart POST to `/api/v1/deposits`
- Show pending status

#### `/withdraw`
- Amount input (with available balance display)
- Method dropdown
- Account details (different fields per method)
- **Withdraw PIN input** (4-6 digit, password type)
- Fee calculation display
- Net amount you'll receive
- Submit → `POST /api/v1/withdrawals`

---

### **PHASE 8: Message / Live Chat (`/message`)**

**Design:**
- Header: brand-700 gradient, CloudFire Support logo, "Online" green badge
- 3-dot menu: Clear Chat History option
- Chat body: scrollable, message bubbles
- User messages: right side, brand-gradient bubble, white text
- Admin messages: left side, white bubble, dark text
- Voice messages: with wave animation + play button
- Typing indicator: 3 animated dots
- Input area: text input + 🎤 voice button + send button (paper-plane)

**Real-time:**
- Open WebSocket connection to `ws://localhost:8000/ws/chat/{token}`
- On message receive: append + auto-scroll
- Voice recording: MediaRecorder API, max 60 sec, send as FormData

**APIs:**
- `GET /api/v1/messages`
- `POST /api/v1/messages/text`
- `POST /api/v1/messages/voice` (multipart)
- `DELETE /api/v1/messages/clear`
- `WS /ws/chat/{token}`

---

### **PHASE 9: Profile (`/me`)**

**Sections:**

1. **Top hero card** (light blue gradient):
   - Avatar (clickable to upload) + golden frame if premium
   - Name + ID + Phone
   - "Your Code: ELFPCZ"

2. **Wallet card** (blue gradient):
   - 3 columns: Balance / Commission Earned / Total Withdrawn
   - "Claim Commission" button (green gradient) → moves commission to balance

3. **Premium Upgrade card** (light yellow, only if not premium):
   - "Upgrade to Premium Member"
   - "Get 8 exclusive benefits & higher income"
   - "Upgrade →" button → `/me/premium`

4. **Invite & Earn card** (blue→purple gradient):
   - QR code (use `qrcode.react`)
   - Referral code with copy button
   - Referral link with copy button

5. **My Team section:**
   - Level 1 / 2 / 3 / Total counts
   - "View Team →" → `/me/team`

6. **Weekly Bonus table** (9 tiers, highlight current tier with green dot):
   - New Partner, Junior, Intermediate, Senior, Regional, City, Executive, Corporate, Consultant

7. **Team Commission card:**
   - 3 lines explaining 10%/4%/2%
   - "View History →" → `/me/commission`

8. **Menu items** (vertical list, each with icon + label + chevron):
   - 👤 Personal Information → `/me/personal-info`
   - 🔒 Login Password → `/me/change-password`
   - 🛡️ Withdraw Password → `/me/withdraw-pin`
   - ⚙️ Settings → `/me/settings`
   - 📱 Login History → `/me/login-history`

9. **Logout button** (white, red text)

**APIs:**
- `GET /api/v1/wallet/dashboard`
- `GET /api/v1/team/stats`
- `POST /api/v1/commissions/claim`

---

### **PHASE 10: Profile Sub-Pages**

- `/me/commission` — Total earned card + Level 1/2/3 chips + transaction table + claim history
- `/me/premium` — Premium benefits showcase, $80 purchase card
- `/me/team` — Dark hero, 3 level tables with miner badges
- `/me/login-history` — Card-based list with device + IP + location
- `/me/personal-info` — Form to update name + phone (read-only mobile)
- `/me/change-password` — Current / New / Confirm
- `/me/withdraw-pin` — Set/update + verify with login password
- `/me/settings` — Display name input

---

### **PHASE 11: Misc Pages**

- `/task-reward` — Daily sign-in calendar, claim button
- `/random-bonus` — Code input, redeem button
- `/about-us` — Static content card
- `/consult` — Customer service info
- `/announcement` — List of announcements
- `/account-history` — Wallet transactions table
- `/withdraw-history` — Withdrawal records with status badges
- `/rent/[id]` — Rent confirmation page (alternate to modal)

---

### **PHASE 12: Polish + Mobile Responsive**

- Add loading skeletons everywhere (shadcn `Skeleton`)
- Toast notifications for all actions (use `sonner`)
- Error boundaries
- 404 page (`app/not-found.tsx`)
- Test on iPhone SE size (375px) — everything must work
- Test on iPad size — layout adjusts gracefully
- Add PWA manifest for "Add to Home Screen"
- Lighthouse score > 90 for Performance + Accessibility

---

### **PHASE 13: Capacitor Mobile App (Bonus)**

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init CloudFire com.cloudfire.app
npm run build
npx cap add android
npx cap copy android
npx cap open android      # opens Android Studio for APK build
```

---

## 🎨 KEY UI COMPONENTS — DETAILED SPECS

### `MinerBubble.tsx` (the glass coin)
```tsx
// Circular glass-morphism effect
<motion.div
  className="
    w-14 h-14 rounded-full
    bg-white/15 backdrop-blur-md
    border border-white/40
    flex items-center justify-center
    cursor-pointer
    shadow-lg
  "
  animate={{ y: [0, -5, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  {/* coin icon */}
</motion.div>
// Below: countdown "23:45:12" or "READY!"
// Name: truncated 10 chars
```

When `can_claim=true`, add:
- Green glow border
- `glowPulse` animation
- On click: calls API, then refetches

---

### `ProductCard.tsx`
```tsx
<div className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-slate-100">
  {/* Top bar: offer tag + maybe premium badge */}
  <div className="flex items-center justify-between mb-2">
    <span className="bg-brand-gradient text-white px-3 py-1 rounded-tl-xl rounded-br-xl text-[10px] font-extrabold">
      ★ SPECIAL PRICE | BIG DISCOUNT
    </span>
  </div>

  {/* Main row: image + stats */}
  <div className="flex gap-3">
    <Image src={...} width={90} height={90} className="rounded-2xl" />
    <div className="flex-1">
      <h3 className="font-extrabold text-sm">CLOUD-FIRE MICRO BT</h3>
      <div className="grid grid-cols-2 gap-1 mt-2">
        <Stat label="Daily" value="$0.40" highlight />
        <Stat label="Total" value="$10.00" />
        <Stat label="Period" value="25 Days" />
        <Stat label="Limit" value="1" />
      </div>
    </div>
  </div>

  {/* Bottom: price + button */}
  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
    <span className="text-2xl font-extrabold">$5.00</span>
    <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-6">
      RENT
    </Button>
  </div>
</div>
```

---

### `BottomNav.tsx`
```tsx
'use client'
import { Home, Pickaxe, Wallet, MessageCircle, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const items = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/product', icon: Pickaxe, label: 'Mine' },
  { href: '/asset', icon: Wallet, label: 'Wallet' },
  { href: '/message', icon: MessageCircle, label: 'Chat' },
  { href: '/me', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[76px] bg-gradient-to-br from-brand-950 to-[#030b1c] flex items-center justify-around px-4">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <Icon
              className={`text-white transition-all ${
                active ? 'w-8 h-8 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'w-6 h-6 opacity-80'
              }`}
            />
          </Link>
        )
      })}
    </nav>
  )
}
```

---

## ✅ DEFINITION OF DONE (per phase)

- [ ] All pages render correctly on 375px width
- [ ] All API calls have try-catch + toast on error
- [ ] Loading states with skeletons
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All buttons have hover + active states
- [ ] All forms have proper validation
- [ ] Auth-protected routes redirect to /login if no token
- [ ] Use shadcn Dialog/AlertDialog for modals, not custom

---

## 🚀 STARTUP COMMANDS

```bash
# Once
npm install
cp .env.local.example .env.local

# Dev
npm run dev          # http://localhost:3000

# Build
npm run build
npm start

# Lint
npm run lint
```

---

## 🎯 START NOW

1. Confirm Node.js 20+: `node --version`
2. Build **PHASE 1** first (Next.js scaffolding + Tailwind config + Axios + types)
3. Show me the project running at localhost:3000 with the Inter font + brand colors visible
4. Wait for my confirmation before Phase 2
5. Continue phase by phase
6. After Phase 12, prepare Capacitor for mobile

**Backend must be running at localhost:8000 before Phase 2.**

Build clean, build mobile-first, build production-ready. **Blue + White only. No orange/red as primary.**

Let's ship this! 🚀
