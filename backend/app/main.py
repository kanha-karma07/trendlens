from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title="TrendLens API",
    description="Short-horizon stock price estimation API for Indian equities (NSE/BSE)",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
