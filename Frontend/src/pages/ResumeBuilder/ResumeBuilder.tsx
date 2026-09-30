import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PersonalInfoForm from "../../components/resume/PersonalInfoForm";
import SummaryForm from "../../components/resume/SummaryForm";
import SkillsForm from "../../components/resume/SkillsForm";
import EducationForm from "../../components/resume/EducationForm";
import ProjectsForm from "../../components/resume/ProjectsForm";
import CertificationForm from "../../components/resume/CertificationForm";
import InternshipForm from "../../components/resume/InternshipForm";
import ExperienceForm from "../../components/resume/ExperienceForm";
import ResumePreview from "../../components/resume/ResumePreview";
import TemplateSelector from "../../components/resume/TemplateSelector";

import { createResume } from "../../services/api";
import {
  downloadResumePdf,
  downloadResumeWord,
} from "../../services/ResumeDownload";

import type {
  Certification,
  Education,
  Experience,
  Internship,
  PersonalInfo,
  Project,
  ResumeData,
  Skills,
} from "../../types/resume";

import type { ResumeTemplate } from "../../templates/templateTypes";

const emptyPersonalInfo: PersonalInfo = {
  full_name: "",
  professional_title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

const emptySkills: Skills = {
  technical: [],
  soft: [],
  other: [],
};

const emptyExperience = (): Experience => ({
  job_title: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  currently_working: false,
  description: "",
});

const emptyInternship = (): Internship => ({
  internship_title: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  currently_working: false,
  description: "",
  technologies: [],
});

const emptyCertification = (): Certification => ({
  name: "",
  issuing_organization: "",
  issue_date: "",
  credential_id: "",
  credential_url: "",
});

function SectionHeader({
  number,
  title,
  description,
  action,
}: {
  number: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-200 text-xs font-semibold text-slate-600">
          {number}
        </span>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function SectionAction({
  onClick,
  children,
  danger = false,
}: {
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        danger
          ? "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
          : "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
      }
    >
      {children}
    </button>
  );
}

function DownloadButton({
  onClick,
  loading,
  icon,
  children,
}: {
  onClick: () => void;
  loading: boolean;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon
      )}

      {loading ? "Preparing..." : children}
    </button>
  );
}

function hasCertificationContent(
  certification: Certification
): boolean {
  return Boolean(
    certification.name.trim() ||
      certification.issuing_organization.trim() ||
      certification.issue_date.trim() ||
      certification.credential_id?.trim() ||
      certification.credential_url?.trim()
  );
}

function hasInternshipContent(
  internship: Internship
): boolean {
  return Boolean(
    internship.internship_title.trim() ||
      internship.company.trim() ||
      internship.location?.trim() ||
      internship.start_date.trim() ||
      internship.end_date?.trim() ||
      internship.description.trim() ||
      internship.technologies.some((technology) =>
        technology.trim()
      )
  );
}

function hasExperienceContent(
  experience: Experience
): boolean {
  return Boolean(
    experience.job_title.trim() ||
      experience.company.trim() ||
      experience.location?.trim() ||
      experience.start_date.trim() ||
      experience.end_date?.trim() ||
      experience.description.trim()
  );
}

export default function ResumeBuilder() {
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(emptyPersonalInfo);

  const [professionalSummary, setProfessionalSummary] =
    useState("");

  const [skills, setSkills] =
    useState<Skills>(emptySkills);

  const [education, setEducation] =
    useState<Education[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [certifications, setCertifications] =
    useState<Certification[]>([]);

  const [internships, setInternships] =
    useState<Internship[]>([]);

  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  /*
   * Live drafts
   *
   * These allow the preview to update while the user is typing
   * instead of waiting until the user clicks Add.
   */
  const [certificationDraft, setCertificationDraft] =
    useState<Certification | null>(null);

  const [internshipDraft, setInternshipDraft] =
    useState<Internship | null>(null);

  /*
   * Section visibility
   *
   * These control whether optional sections are enabled at all.
   */
  const [showCertificationSection, setShowCertificationSection] =
    useState(true);

  const [showInternshipSection, setShowInternshipSection] =
    useState(true);

  const [showExperienceSection, setShowExperienceSection] =
    useState(true);

  const [showCertificationForm, setShowCertificationForm] =
    useState(false);

  const [showInternshipForm, setShowInternshipForm] =
    useState(false);

  const [showExperienceForm, setShowExperienceForm] =
    useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate>("classic");

  const [saving, setSaving] =
    useState(false);

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const [downloadingPdf, setDownloadingPdf] =
    useState(false);

  const [downloadingWord, setDownloadingWord] =
    useState(false);

  /*
   * Only include completed/somewhat-filled entries in the actual
   * resume data.
   *
   * This prevents an empty form from creating an empty section
   * inside the resume preview.
   */
  const visibleCertifications = useMemo(
    () =>
      certifications.filter(hasCertificationContent),
    [certifications]
  );

  const visibleInternships = useMemo(
    () =>
      internships.filter(hasInternshipContent),
    [internships]
  );

  const visibleExperiences = useMemo(
    () =>
      experiences.filter(hasExperienceContent),
    [experiences]
  );

  const hasCertificationDraft =
    certificationDraft !== null &&
    hasCertificationContent(certificationDraft);

  const hasInternshipDraft =
    internshipDraft !== null &&
    hasInternshipContent(internshipDraft);

  const resumeData = useMemo<ResumeData>(
    () => ({
      personal_info: personalInfo,

      professional_summary:
        professionalSummary,

      skills,

      education,

      projects,

      certifications:
        showCertificationSection
          ? [
              ...visibleCertifications,
              ...(hasCertificationDraft &&
              certificationDraft
                ? [certificationDraft]
                : []),
            ]
          : [],

      internships:
        showInternshipSection
          ? [
              ...visibleInternships,
              ...(hasInternshipDraft &&
              internshipDraft
                ? [internshipDraft]
                : []),
            ]
          : [],

      experience:
        showExperienceSection
          ? visibleExperiences
          : [],
    }),
    [
      personalInfo,
      professionalSummary,
      skills,
      education,
      projects,
      visibleCertifications,
      certificationDraft,
      hasCertificationDraft,
      visibleInternships,
      internshipDraft,
      hasInternshipDraft,
      visibleExperiences,
      showCertificationSection,
      showInternshipSection,
      showExperienceSection,
    ]
  );

  const handleSaveResume = async () => {
    setError("");
    setSaveSuccess(false);

    if (!personalInfo.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!personalInfo.professional_title.trim()) {
      setError("Please enter your professional title.");
      return;
    }

    if (!personalInfo.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!personalInfo.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!personalInfo.location.trim()) {
      setError("Please enter your location.");
      return;
    }

    try {
      setSaving(true);

      await createResume(resumeData);

      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the resume. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setError("");

    const resumeElement =
      window.document.getElementById(
        "resume-preview-document"
      );

    if (!resumeElement) {
      setError(
        "Resume preview is not available. Please try again."
      );
      return;
    }

    try {
      setDownloadingPdf(true);

      await downloadResumePdf(
        resumeElement,
        resumeData
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate the PDF. Please try again."
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    setError("");

    try {
      setDownloadingWord(true);

      await downloadResumeWord(resumeData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate the Word document. Please try again."
      );
    } finally {
      setDownloadingWord(false);
    }
  };

  const handleCertificationDraftChange = (
    draft: Certification | null
  ) => {
    setCertificationDraft(draft);
  };

  const handleInternshipDraftChange = (
    draft: Internship | null
  ) => {
    setInternshipDraft(draft);
  };

  /*
   * Certification section
   */
  const enableCertificationSection = () => {
    setError("");
    setShowCertificationSection(true);
    setShowCertificationForm(true);

    if (certifications.length === 0) {
      setCertificationDraft(emptyCertification());
    }
  };

  const removeCertificationSection = () => {
    setCertifications([]);
    setCertificationDraft(null);
    setShowCertificationForm(false);
    setShowCertificationSection(false);
  };

  /*
   * Internship section
   */
  const enableInternshipSection = () => {
    setError("");
    setShowInternshipSection(true);
    setShowInternshipForm(true);

    if (internships.length === 0) {
      setInternshipDraft(emptyInternship());
    }
  };

  const removeInternshipSection = () => {
    setInternships([]);
    setInternshipDraft(null);
    setShowInternshipForm(false);
    setShowInternshipSection(false);
  };

  /*
   * Experience section
   */
  const enableExperienceSection = () => {
    setError("");
    setShowExperienceSection(true);
    setShowExperienceForm(true);

    /*
     * Important:
     * Create the first empty experience immediately.
     * This means clicking "Add Experience" opens the actual
     * fields instead of showing only another "+ Add Experience"
     * button.
     */
    if (experiences.length === 0) {
      setExperiences([emptyExperience()]);
    }
  };

  const removeExperienceSection = () => {
    setExperiences([]);
    setShowExperienceForm(false);
    setShowExperienceSection(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#F1F5F9]/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
            aria-label="Back to home"
          >
            <img
              src="/logo.png"
              alt="Repair Resume AI"
              className="h-auto w-[155px] object-contain"
            />
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:py-10">

        {/* Page heading */}
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            Resume Builder
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Build your professional resume
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Add your information step by step. Your resume
            preview updates automatically as you enter your
            details.
          </p>
        </div>

        {/* Builder layout */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">

          {/* Left side */}
          <div className="min-w-0 space-y-5 pb-10">

            {/* 01 Personal Information */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                number="01"
                title="Personal Information"
                description="Add the contact details that should appear on your resume."
              />

              <div className="p-5">
                <PersonalInfoForm
                  data={personalInfo}
                  onChange={setPersonalInfo}
                />
              </div>
            </section>

            {/* 02 Professional Summary */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                number="02"
                title="Professional Summary"
                description="Write a short summary that highlights your background and career direction."
              />

              <div className="p-5">
                <SummaryForm
                  value={professionalSummary}
                  onChange={setProfessionalSummary}
                />
              </div>
            </section>

            {/* 03 Skills */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                number="03"
                title="Skills"
                description="Add technical, soft, and other relevant skills."
              />

              <div className="p-5">
                <SkillsForm
                  skills={skills}
                  onChange={setSkills}
                />
              </div>
            </section>

            {/* 04 Education */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                number="04"
                title="Education"
                description="Add your academic qualifications."
              />

              <div className="p-5">
                <EducationForm
                  education={education}
                  onChange={setEducation}
                />
              </div>
            </section>

            {/* 05 Projects */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                number="05"
                title="Projects"
                description="Showcase projects that demonstrate your skills and experience."
              />

              <div className="p-5">
                <ProjectsForm
                  projects={projects}
                  onChange={setProjects}
                />
              </div>
            </section>

            {/* 06 Certifications */}
            {showCertificationSection ? (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  number="06"
                  title="Certifications"
                  description="Add relevant certifications and credentials."
                  action={
                    <SectionAction
                      danger
                      onClick={removeCertificationSection}
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </SectionAction>
                  }
                />

                <div className="p-5">
                  {showCertificationForm ? (
                    <CertificationForm
                      certifications={certifications}
                      onChange={setCertifications}
                      onDraftChange={
                        handleCertificationDraftChange
                      }
                    />
                  ) : certifications.length > 0 ? (
                    <div className="space-y-3">
                      {certifications.map(
                        (certification, index) => (
                          <div
                            key={`${certification.name}-${index}`}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {certification.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {
                                certification.issuing_organization
                              }
                            </p>

                            {certification.issue_date && (
                              <p className="mt-1 text-xs text-slate-500">
                                Issued:{" "}
                                {certification.issue_date}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No certifications added yet
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setShowCertificationForm(true);
                          setCertificationDraft(
                            emptyCertification()
                          );
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Certification
                      </button>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Certifications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This section is currently removed from your resume.
                    </p>
                  </div>

                  <SectionAction
                    onClick={enableCertificationSection}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Certification
                  </SectionAction>
                </div>
              </section>
            )}

            {/* 07 Internships */}
            {showInternshipSection ? (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  number="07"
                  title="Internships"
                  description="Add internships, training experience, and technologies."
                  action={
                    <SectionAction
                      danger
                      onClick={removeInternshipSection}
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </SectionAction>
                  }
                />

                <div className="p-5">
                  {showInternshipForm ? (
                    <InternshipForm
                      internships={internships}
                      onChange={setInternships}
                      onDraftChange={
                        handleInternshipDraftChange
                      }
                    />
                  ) : internships.length > 0 ? (
                    <div className="space-y-3">
                      {internships.map(
                        (internship, index) => (
                          <div
                            key={`${internship.company}-${index}`}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {internship.internship_title}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {internship.company}
                              {internship.location
                                ? ` • ${internship.location}`
                                : ""}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {internship.start_date}
                              {" — "}
                              {internship.currently_working
                                ? "Present"
                                : internship.end_date || ""}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No internships added yet
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setShowInternshipForm(true);
                          setInternshipDraft(
                            emptyInternship()
                          );
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Internship
                      </button>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Internships
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This section is currently removed from your resume.
                    </p>
                  </div>

                  <SectionAction
                    onClick={enableInternshipSection}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Internship
                  </SectionAction>
                </div>
              </section>
            )}

            {/* 08 Experience */}
            {showExperienceSection ? (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  number="08"
                  title="Experience"
                  description="Add your professional work experience."
                  action={
                    <SectionAction
                      danger
                      onClick={removeExperienceSection}
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </SectionAction>
                  }
                />

                <div className="p-5">
                  {showExperienceForm ? (
                    <ExperienceForm
                      experiences={experiences}
                      onChange={setExperiences}
                    />
                  ) : experiences.length > 0 ? (
                    <div className="space-y-3">
                      {experiences.map(
                        (experience, index) => (
                          <div
                            key={`${experience.company}-${index}`}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {experience.job_title}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {experience.company}
                              {experience.location
                                ? ` • ${experience.location}`
                                : ""}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {experience.start_date}
                              {" — "}
                              {experience.currently_working
                                ? "Present"
                                : experience.end_date || ""}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No experience added yet
                      </p>

                      <button
                        type="button"
                        onClick={enableExperienceSection}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Experience
                      </button>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Experience
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This section is currently removed from your resume.
                    </p>
                  </div>

                  <SectionAction
                    onClick={enableExperienceSection}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Experience
                  </SectionAction>
                </div>
              </section>
            )}

            {/* 09 Resume Template */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <SectionHeader
                number="09"
                title="Resume Template"
                description="Choose a resume design that matches your style."
              />

              <div className="p-5">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onChange={setSelectedTemplate}
                />
              </div>
            </section>

            {/* Download / Save */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Finish your resume
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Download your resume as an editable Word document
                    or PDF, or save the resume data.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <DownloadButton
                    onClick={handleDownloadWord}
                    loading={downloadingWord}
                    icon={
                      <FileText className="h-4 w-4" />
                    }
                  >
                    Download Word
                  </DownloadButton>

                  <DownloadButton
                    onClick={handleDownloadPdf}
                    loading={downloadingPdf}
                    icon={
                      <Download className="h-4 w-4" />
                    }
                  >
                    Download PDF
                  </DownloadButton>

                  <button
                    type="button"
                    onClick={handleSaveResume}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : saveSuccess ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : null}

                    {saving
                      ? "Saving..."
                      : saveSuccess
                        ? "Saved"
                        : "Save Resume"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {saveSuccess && !error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Resume data saved successfully.
                </div>
              )}
            </section>
          </div>

          {/* Preview spacer */}
          <div
            className="hidden xl:block"
            aria-hidden="true"
          />
        </div>
      </main>

      {/* Fixed Resume Preview */}
      <div
        className="pointer-events-none fixed z-40 hidden xl:block"
        style={{
          top: "88px",
          right:
            "max(24px, calc((100vw - 1280px) / 2))",
          width: "520px",
          maxHeight: "calc(100vh - 112px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div className="pointer-events-auto">
          <ResumePreview
            resumeData={resumeData}
            template={selectedTemplate}
          />
        </div>
      </div>
    </div>
  );
}