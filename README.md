# 🌸 Bloom & Blossom — Premium Floral E-Commerce

A portfolio-level, production-ready full-stack flower boutique built with Next.js 14, TypeScript, PostgreSQL, Prisma, and NextAuth.

---

## ✨ Features

- **Premium UI/UX** — Romantic, elegant design with Framer Motion animations
- **Full E-Commerce** — Shop, product detail, cart, and checkout flows
- **AI Bouquet Stylist** — Smart recommendation engine (OpenAI-ready)
- **Authentication** — NextAuth with email/password, role-based access (USER/ADMIN)
- **Admin Dashboard** — Full product, order, user, and category management
- **Server Components** — Next.js 14 App Router with efficient data fetching
- **Type-Safe** — End-to-end TypeScript with Zod validation
- **SEO Ready** — Metadata API, sitemap, robots.txt, Open Graph

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom bloom design system |
| Animations | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth v4 |
| Validation | Zod + React Hook Form |
| State | Zustand (cart) |
| Deployment | Vercel |

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally

### 1. Clone & Install

```bash
git clone <your-repo>
cd bloom-blossom
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/bloom_blossom"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Create and migrate the database
npx prisma migrate dev --name init

# Seed with 20 products, categories, users
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bloomblossom.com | Admin123! |
| User | demo@bloomblossom.com | User123! |

---

## 📁 Project Structure

```
bloom-blossom/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # 20 sample products + users
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Login, Register
│   │   ├── (shop)/            # Shop, Product, Cart, Checkout
│   │   ├── (dashboard)/       # Profile, Orders
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── ai-recommendation/ # AI Stylist page
│   │   └── api/               # API routes
│   ├── actions/               # Server Actions
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── newsletter.ts
│   │   └── recommendations.ts
│   ├── components/
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Auth forms
│   │   ├── home/              # Homepage sections
│   │   ├── layout/            # Navbar, Footer, Providers
│   │   ├── shop/              # Shop components
│   │   └── ui/                # UI primitives (Toast, etc.)
│   ├── hooks/
│   │   ├── use-cart.ts        # Zustand cart store
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── utils.ts           # Utilities + helpers
│   │   └── validations.ts     # Zod schemas
│   ├── styles/
│   │   └── globals.css        # Bloom design system
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🐳 Docker Setup

```bash
# Start PostgreSQL + App
docker-compose up -d

# Run migrations inside container
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

Access at [http://localhost:3000](http://localhost:3000)

---

## ☁️ Vercel Deployment

### 1. Create a PostgreSQL database
Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres).

### 2. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### 3. Set Environment Variables in Vercel Dashboard

```
DATABASE_URL         = your_postgres_connection_string
NEXTAUTH_URL         = https://your-app.vercel.app
NEXTAUTH_SECRET      = your_secure_secret
NEXT_PUBLIC_APP_URL  = https://your-app.vercel.app
```

### 4. Run migrations on your remote database

```bash
DATABASE_URL="your_remote_url" npx prisma migrate deploy
DATABASE_URL="your_remote_url" npm run db:seed
```

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset & re-seed database |

---

## 🤖 AI Feature — OpenAI Integration

The AI Bouquet Stylist is currently powered by smart rule-based logic. To connect to OpenAI:

1. Add `OPENAI_API_KEY` to your `.env`
2. Install the SDK: `npm install openai`
3. Replace `scoreAndReturn()` in `src/actions/recommendations.ts` with:

```typescript
import OpenAI from 'openai'
const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are an expert floral designer...' },
    { role: 'user', content: `Recommend bouquets for: ${JSON.stringify(input)}` }
  ],
  response_format: { type: 'json_object' }
})
```

---

## 💳 Stripe Payment Integration

The checkout architecture is Stripe-ready. To enable payments:

1. Install: `npm install stripe @stripe/stripe-js`
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env`
3. Replace the payment placeholder in `/checkout` with Stripe Elements
4. Add a webhook handler at `/api/webhooks/stripe`

---

## 📐 Design System

The Bloom design system includes:

- **Colors**: Blush pink, soft rose, lavender, cream, soft gold
- **Typography**: Cormorant Garamond (serif), Jost (sans), Dancing Script (script)
- **Components**: `.btn-bloom`, `.card-bloom`, `.input-bloom`, `.badge-bloom`
- **Animations**: Framer Motion page transitions, floating elements, hover effects

---

## 🌍 Internationalization Ready

The architecture supports i18n. To add Dutch/German locales:

1. Install: `npm install next-intl`
2. Add locale files to `/messages/nl.json`, `/messages/de.json`
3. Wrap the app in `NextIntlClientProvider`

---

Made with 🌸 by a passionate developer targeting the European tech market.
