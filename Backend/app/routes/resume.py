from fastapi import APIRouter

from app.models.resume import ResumeData

router = APIRouter()


@router.post("/resume")
def create_resume(resume: ResumeData):
    return {
        "status": "success",
        "message": "Resume data received successfully",
        "resume": resume.model_dump(),
    }