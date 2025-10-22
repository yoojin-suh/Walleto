# Walleto - Budget Analysis/Management System

Welcome to Walleto! This is a full-stack digital budget management application with a Next.js frontend and FastAPI backend. Follow the steps below to get it running on your computer.

## What You Need Before Starting

Make sure you have these installed on your computer:
- **Node.js** (version 18 or newer) - Download from [nodejs.org](https://nodejs.org/)
- **Python** (version 3.11 or newer) - Download from [python.org](https://python.org/)
- **PostgreSQL** (version 14 or newer) - Download from [postgresql.org](https://postgresql.org/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)


# Install dependencies
pip install -r requirements.txt


### Frontend Setup (Next.js)

# Install frontend dependencies
npm install
```

**Configure Environment Variables:**

Create a `.env.local` file in the root folder:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Start the Frontend Server:**

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`


## Features Implemented (Sprint 1)

✅ User Authentication
- Sign up with email verification (OTP)
- Sign in with 2FA (OTP)
- Password reset flow
- Remember device (trusted devices for 30 days)

✅ User Onboarding
- Profile setup
- Profile picture upload
- Personal information

✅ Dashboard
- Financial overview
- Budget tracking
- Transaction management
- Category management


