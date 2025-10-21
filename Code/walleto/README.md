# Walleto - Budget Analysis/Management System

Welcome to Walleto! This is a full-stack digital budget management application with a Next.js frontend and FastAPI backend. Follow the steps below to get it running on your computer.

## What You Need Before Starting

Make sure you have these installed on your computer:
- **Node.js** (version 18 or newer) - Download from [nodejs.org](https://nodejs.org/)
- **Python** (version 3.11 or newer) - Download from [python.org](https://python.org/)
- **PostgreSQL** (version 14 or newer) - Download from [postgresql.org](https://postgresql.org/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)

## How to Get the Project on Your Computer

### Option 1: Fork the Repository (Recommended for Team Members)
1. Go to the main project page on GitHub
2. Click the "Fork" button in the top-right corner
3. This creates your own copy of the project
4. Open your terminal/command prompt
5. Type this command (replace `YOUR-USERNAME` with your GitHub username):
   ```
   git clone https://github.com/YOUR-USERNAME/Walleto/Code/walleto.git
   ```

### Option 2: Clone Directly
1. Open your terminal/command prompt
2. Type this command:
   ```
   git clone https://github.com/yoojin-suh/walleto/code/walleto.git
   ```

## Project Setup

### 1. Database Setup (PostgreSQL)

First, create a PostgreSQL database for Walleto:

```bash
# Open PostgreSQL (use psql or pgAdmin)
psql -U postgres

# In PostgreSQL, create the database:
CREATE DATABASE walleto;

# Exit psql:
\q
```

### 2. Backend Setup (FastAPI)

Navigate to the backend folder and set up the Python environment:

```bash
cd walleto/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# Application
APP_NAME=Walleto API
DEBUG=True
ENVIRONMENT=development

# Database (Update with your PostgreSQL credentials)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/walleto

# Security (Change this in production!)
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:3000

# Email (SMTP for OTP - Update with your Gmail credentials)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@walleto.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Run Database Migrations:**

```bash
# Still in backend folder with venv activated
alembic upgrade head
```

This creates all the necessary tables in your database.

**Start the Backend Server:**

```bash
uvicorn app.main:app --reload
```

The backend API will be running at `http://localhost:8000`

### 3. Frontend Setup (Next.js)

Open a **new terminal** window/tab and navigate to the project root:

```bash
cd walleto

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

## Running the Full Application

You need **both servers running** for the application to work:

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. **Terminal 2** - Frontend:
   ```bash
   npm run dev
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

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

## Tech Stack

**Frontend:**
- Next.js 15
- React
- TypeScript
- Tailwind CSS

**Backend:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (database migrations)
- JWT Authentication

**Email Service:**
- SMTP (Gmail)
- OTP verification

## Project Structure

```
walleto/
├── src/                  # Frontend source code
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── contexts/        # React contexts (Auth)
│   └── lib/             # API client
├── backend/             # Backend source code
│   ├── app/
│   │   ├── api/        # API routes
│   │   ├── core/       # Config, database, security
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── services/   # Business logic
│   └── alembic/        # Database migrations
└── public/             # Static files
```

## Database Migrations

When you make changes to database models:

```bash
cd backend
source venv/bin/activate

# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply the migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

See `backend/ALEMBIC_GUIDE.md` for detailed migration instructions.

## Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
- Verify database exists: `psql -U postgres -l | grep walleto`
- Check `.env` file has correct database credentials
- Make sure virtual environment is activated

**Frontend can't connect to backend:**
- Verify backend is running at `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Look for CORS errors in browser console

**Database errors:**
- Run migrations: `alembic upgrade head`
- Check database connection in `.env`

**OTP emails not sending:**
- Update SMTP settings in `backend/.env`
- For Gmail: use an [App Password](https://support.google.com/accounts/answer/185833)

## Making Changes

**Frontend:**
- Pages are in `src/app/`
- Components in `src/components/`
- Auto-refresh on save

**Backend:**
- API routes in `backend/app/api/routes/`
- Models in `backend/app/models/`
- Auto-reload with `--reload` flag

## Need Help?

1. Check if all prerequisites are installed:
   ```bash
   node --version
   python --version
   psql --version
   ```

2. Make sure both servers are running

3. Check the console for error messages

4. Ask a team member!

## Team

Developed by the Walleto team for CST499 Capstone Project.
