# Crowdfunding Platform — React Frontend

React 18 + Vite frontend for the Crowdfunding Platform.

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Framework  | React 18 + Vite               |
| Routing    | React Router v6               |
| State      | Zustand (auth)                |
| Styling    | Tailwind CSS                  |
| Payments   | Stripe React + Stripe.js      |
| Charts     | Recharts                      |
| HTTP       | Axios                         |
| Dates      | Day.js                        |
| Toasts     | react-hot-toast               |

## Pages

| Route           | Page              | Auth     |
|-----------------|-------------------|----------|
| /               | Home              | None     |
| /browse         | Browse Campaigns  | None     |
| /campaign/:id   | Campaign Detail   | None     |
| /login          | Login             | None     |
| /register       | Register          | None     |
| /create         | Create Campaign   | Creator  |
| /dashboard      | Analytics Dash    | Creator  |
| /my-donations   | My Donations      | Any user |

## Quick Start

```bash
# Install
npm install

# Copy env
cp .env.example .env
# Fill in VITE_API_URL and VITE_STRIPE_PUBLISHABLE_KEY

# Run dev server
npm run dev
```

Frontend runs at: http://localhost:5173

## Build for production

```bash
npm run build
# Output in dist/
```

## Environment Variables

| Variable                      | Description                  |
|-------------------------------|------------------------------|
| VITE_API_URL                  | Backend API URL              |
| VITE_STRIPE_PUBLISHABLE_KEY   | Stripe publishable key       |

## Folder Structure

```
src/
├── pages/           ← Route-level pages
├── components/
│   ├── layout/      ← Navbar, Footer
│   ├── campaigns/   ← CampaignCard, Filters
│   ├── donations/   ← DonateModal, DonorList
│   ├── analytics/   ← Charts
│   └── common/      ← ProgressBar, Skeleton, EmptyState
├── hooks/           ← useCampaigns, useProgress
├── services/        ← API service calls
├── store/           ← Zustand auth store
└── utils/           ← formatCurrency, calcProgress etc.
```
