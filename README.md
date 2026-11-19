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
