from typing import List, Optional

from pydantic import BaseModel, EmailStr


class PersonalInfo(BaseModel):
    full_name: str
    professional_title: str
    email: EmailStr
    phone: str
    location: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None


class Experience(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    currently_working: bool = False
    description: str


class Internship(BaseModel):
    internship_title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    currently_working: bool = False
    description: str
    technologies: List[str] = []


class Education(BaseModel):
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: str
    end_date: str
    description: Optional[str] = None


class Project(BaseModel):
    name: str
    description: str
    technologies: List[str] = []
    project_url: Optional[str] = None


class Certification(BaseModel):
    name: str
    issuing_organization: str
    issue_date: str
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None


class Skills(BaseModel):
    technical: List[str] = []
    soft: List[str] = []
    other: List[str] = []


class ResumeData(BaseModel):
    personal_info: PersonalInfo
    professional_summary: Optional[str] = None
    skills: Skills
    experience: List[Experience] = []
    internships: List[Internship] = []
    education: List[Education] = []
    projects: List[Project] = []
    certifications: List[Certification] = []