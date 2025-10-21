# Walleto Backend API

FastAPI backend for Walleto budget management application.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Database (via pgAdmin4)
- **PyJWT** - JWT authentication
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── auth.py          # Authentication endpoints
│   ├── core/
│   │   ├── config.py            # Configuration settings
│   │   ├── database.py          # Database connection
│   │   └── security.py          # JWT & password hashing
│   ├── models/
│   │   └── user.py              # User database model
│   ├── schemas/
│   │   └── user.py              # Pydantic schemas
│   ├── services/
│   │   └── auth.py              # Business logic
│   └── main.py                  # FastAPI app entry point
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── requirements.txt             # Python dependencies
└── README.md
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup PostgreSQL Database

1. Open **pgAdmin4**
2. Create a new database named `walleto`
3. Update `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/walleto
   ```

### 4. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/me` - Update user profile (requires token)

### Health Check

- `GET /` - API info
- `GET /health` - Health check

## API Documentation

Interactive API documentation is automatically available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing API

### 1. Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 2. Sign In
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing secret
- `FRONTEND_URL` - Next.js frontend URL (for CORS)

## Database Migrations

Currently using SQLAlchemy's `create_all()` for simplicity. For production, consider using Alembic:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## Development

- Backend runs on: `http://localhost:8000`
- Frontend runs on: `http://localhost:3000`
- CORS is configured to allow frontend requests

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- SQL injection protection via SQLAlchemy ORM
