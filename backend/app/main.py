from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.config import settings
from app.core.security import get_current_user
from app.db.session import engine, Base
from app.api.v1.router import api_router

# Create tables on startup (for demo; in production use Alembic)
# Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Only create tables if explicitly opted in for local development/demo.
    # By default, AUTO_CREATE_TABLES is False to protect persistent database schemas.
    if settings.AUTO_CREATE_TABLES:
        Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: nothing for now
    pass

app = FastAPI(
    title="KaushalSetu API",
    description="AI-powered Employment Outcome Tracking System",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "kaushalsetu"}

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to KaushalSetu API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)