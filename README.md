# DilSeGive 💚

**Give from the heart, see where it goes.**

DilSeGive is a transparent donation platform that connects donors with NGO campaigns across India. Donors can browse verified campaigns, donate securely, download receipts and follow exactly how their money is spent. NGOs upload proof of every expense, which is read with OCR and given a fraud-risk score before it is published to the campaign's transparency timeline.

## ✨ Features

**For donors**
- Browse and filter campaigns by category and location (Food, Education, Healthcare, Relief, Development)
- Campaign pages with progress, NGO updates and a proof-of-work gallery
- Secure checkout with Stripe (INR) and a downloadable PDF donation receipt
- Donor dashboard: impact summary, donation history, impact reports and profile

**For NGOs**
- NGO dashboard to create campaigns and post updates
- Upload expense receipts: text is extracted in the browser with OCR (Tesseract.js)
- Each proof gets a fraud-risk score and a transaction hash recorded with the expense

**Transparency**
- Public transparency page with expense categories, funds timeline and expense timeline charts
- "AI Verified" badge on campaigns whose proofs pass verification
- Admin panel for campaign moderation

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, Recharts, React Router, TanStack Query |
| In-browser tools | Tesseract.js (OCR), jsPDF + html2canvas (receipts) |
| Backend | Node.js, Express, MongoDB with Mongoose |
| Auth & payments | JWT, bcrypt password hashing, Stripe Checkout |
| Testing & quality | Vitest, Testing Library, Playwright, ESLint |

## 📁 Project Structure

```
dilsegive/
├── src/                    # React frontend
│   ├── api/                # API client helpers (base URL in api/config.ts)
│   ├── components/         # Reusable UI, auth, donor and layout components
│   ├── context/            # Auth, donation and theme providers
│   ├── data/               # Sample campaigns, donations and demo users
│   ├── pages/              # Home, campaigns, transparency, payment and dashboards
│   └── test/               # Vitest setup and tests
├── server/                 # Express + MongoDB backend
│   ├── config/             # Environment variable checks
│   ├── controllers/        # Auth, campaign, donation and payment logic
│   ├── data/               # Sample campaigns used to seed an empty database
│   ├── middleware/         # JWT auth, role checks and error handling
│   ├── models/             # User, Campaign and Donation schemas
│   ├── routes/             # API route definitions
│   └── index.js            # Server entry point
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Stripe account in test mode (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/MehveenFatima/DilSeGive.git
cd DilSeGive
```

### 2. Start the backend
```bash
cd server
npm install
cp .env.example .env    # then fill in your own values
npm run dev             # starts on http://localhost:5000
```
When the database is empty, the server seeds 15 sample campaigns on startup.

### 3. Start the frontend
In a new terminal, from the project root:
```bash
npm install
cp .env.example .env    # optional: change VITE_API_URL
npm run dev             # opens on http://localhost:8080
```

### Environment variables

**Backend (`server/.env`)**

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the API server (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `30d` (default `30d`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (use a `sk_test_...` key for development) |
| `FRONTEND_URL` | Frontend origin for CORS and Stripe redirects (default `http://localhost:8080`) |

**Frontend (`.env`)**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default `http://localhost:5000/api`) |

> Never commit your real `.env` files — they are already listed in `.gitignore`.
