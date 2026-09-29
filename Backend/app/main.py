from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.resume import router as resume_router


app = FastAPI(
    title="Repair Resume AI API",
    description="Backend API for Repair Resume AI",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router,
    prefix="/api",
)

app.include_router(
    resume_router,
    prefix="/api",
)


@app.get("/")
def root():
    return {
        "message": "Repair Resume AI API is running"
    }