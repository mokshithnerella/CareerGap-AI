"""CareerGap AI - FastAPI Application Entrypoint.

Orchestrates PDF text extraction, entity parsing, deterministic skill matching,
role taxonomies, and personalized learning roadmap generation.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.resumes import router as resumes_router
from app.api.job_roles import router as job_roles_router
from app.api.job_descriptions import router as job_descriptions_router
from app.api.matches import router as matches_router
from app.api.roadmaps import router as roadmaps_router
from app.api.resources import router as resources_router

app = FastAPI(
    title="CareerGap AI Intelligence API",
    description="Production-grade AI career and skill gap analysis platform backend.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(resumes_router, prefix="/api")
app.include_router(job_roles_router, prefix="/api")
app.include_router(job_descriptions_router, prefix="/api")
app.include_router(matches_router, prefix="/api")
app.include_router(roadmaps_router, prefix="/api")
app.include_router(resources_router, prefix="/api")


@app.get("/api/health", tags=["System"])
async def health_check():
    """Service health and diagnostics endpoint."""
    return {
        "status": "healthy",
        "service": "CareerGap AI Backend",
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "max_upload_size_bytes": settings.MAX_UPLOAD_SIZE_BYTES,
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Safely catch unhandled errors without leaking sensitive stack traces in production."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "detail": "An unexpected error occurred processing your request.",
            "path": str(request.url.path),
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
