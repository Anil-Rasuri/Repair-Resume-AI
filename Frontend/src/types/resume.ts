export interface PersonalInfo {
  full_name: string;
  professional_title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  job_title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  currently_working: boolean;
  description: string;
}

export interface Internship {
  internship_title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  currently_working: boolean;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  branch?: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  project_url?: string;
}

export interface Certification {
  name: string;
  issuing_organization: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  other: string[];
}

export interface ResumeData {
  personal_info: PersonalInfo;
  professional_summary?: string;
  skills: Skills;
  experience: Experience[];
  internships: Internship[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}