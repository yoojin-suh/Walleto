from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging
from app.core.config import settings
from app.core.database import SessionLocal
from app.api.routes import auth, otp, financial
from app.services.otp_service import cleanup_expired_otps
from app.services.device_service import cleanup_expired_devices

logger = logging.getLogger(__name__)

# Database tables are now managed by Alembic migrations
# Run "alembic upgrade head" to create/update tables
# See ALEMBIC_GUIDE.md for more information

# Background scheduler for OTP cleanup
scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle startup and shutdown events.
    This runs when the app starts and stops.
    """
    # STARTUP: This code runs when the app starts
    scheduler.add_job(
        run_cleanup,
        'interval',
        minutes=5,
        id='cleanup_expired_data'
    )
    scheduler.start()
    logger.info("Cleanup scheduler started - running every 5 minutes")

    # Let the app run
    yield

    # SHUTDOWN: This code runs when the app stops
    scheduler.shutdown()
    logger.info("OTP cleanup scheduler stopped")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_cleanup():
    """Execute cleanup in background."""
    db = SessionLocal()
    try:
        deleted_otps, deleted_attempts = cleanup_expired_otps(db)
        deleted_devices = cleanup_expired_devices(db)

        if deleted_otps > 0 or deleted_attempts > 0 or deleted_devices > 0:
            logger.info(
                f"Cleanup completed: {deleted_otps} OTPs, "
                f"{deleted_attempts} attempts, {deleted_devices} devices deleted"
            )
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")
    finally:
        db.close()


# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(otp.router, prefix="/api")
app.include_router(financial.router, prefix="/api")


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Walleto API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
