import logging
from datetime import datetime, timezone

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_v1_router
from app.core.config import settings

logger = logging.getLogger("trendlens")

app = FastAPI(
    title="TrendLens API",
    description="Short-horizon stock price estimation API for Indian equities (NSE/BSE)",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Centralized error handler for ValueErrors (e.g. password validation, input formatting)
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


# Centralized handler for unexpected server exceptions
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )


# Mount versioned API routes
app.include_router(api_v1_router)


@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "ok",
        "app": "TrendLens",
        "version": "0.1.0",
        "data_mode": settings.DATA_MODE,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/", tags=["System"])
async def root():
    """Root metadata endpoint."""
    return {
        "message": "Welcome to TrendLens API",
        "docs_url": "/docs",
        "health_url": "/health",
        "data_mode": settings.DATA_MODE,
    }
