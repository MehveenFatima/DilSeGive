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

## 🔌 API Reference

Base URL: `http://localhost:5000/api`. Routes marked 🔒 need an `Authorization: Bearer <token>` header. Login and signup are limited to 20 attempts per 15 minutes.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server and database status |
| `POST` | `/auth/signup` | Register as a Donor or NGO (`name`, `email`, `password`, `role`, `ngoName` for NGOs) |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `GET` | `/user/profile` 🔒 | Current user's profile |
| `GET` | `/user/donations` 🔒 | Current donor's successful donations |
| `GET` | `/campaigns` | List campaigns, newest first. Optional: `?category=`, `?status=`, `?q=` (search), `?page=&limit=` (total in `X-Total-Count`) |
| `GET` | `/campaigns/:id` | Get one campaign with updates and expenses |
| `POST` | `/campaigns/seed` 🔒 | Re-seed sample campaigns (Admin only) |
| `POST` | `/payment/create-checkout-session` 🔒 | Start a Stripe Checkout for a donation (`amount`, `campaignId`) |
| `POST` | `/payment/verify` | Confirm a Stripe session and record the donation (`sessionId`) |

## 👤 Demo Accounts

The frontend includes demo accounts so you can explore the dashboards right away:

| Role | Email | Password |
|------|-------|----------|
| Donor | `donor@test.com` | `123456` |
| NGO | `ngo@test.com` | `123456` |

For test payments, use Stripe's test card `4242 4242 4242 4242` with any future expiry date and any CVC.

## 📜 Available Scripts

**Frontend (project root)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests with Vitest |

**Backend (`server/`)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the API with auto-reload (nodemon) |
| `npm start` | Start the API with Node |
| `npm run seed` | Replace all campaigns with the sample data |
| `npm test` | Run backend unit tests (Node test runner) |

## 🤝 Contributing

1. Fork the repository and create a branch: `git checkout -b feature/your-feature`
2. Make your changes and run `npm run lint` and `npm test`
3. Commit with a clear message and open a pull request

## 👩‍💻 Author

**Mehveen Fatima** — B.Tech CSIT, Gokaraju Rangaraju Institute of Engineering and Technology (GRIET), Hyderabad
GitHub: [@MehveenFatima](https://github.com/MehveenFatima)
