import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

import PersonalInfoForm from "../../components/resume/PersonalInfoForm";
import SummaryForm from "../../components/resume/SummaryForm";
import SkillsForm from "../../components/resume/SkillsForm";
import ExperienceForm from "../../components/resume/ExperienceForm";
import InternshipForm from "../../components/resume/InternshipForm";
import EducationForm from "../../components/resume/EducationForm";
import ProjectsForm from "../../components/resume/ProjectsForm";
import CertificationForm from "../../components/resume/CertificationForm";
import ResumePreview from "../../components/resume/ResumePreview";

import { createResume } from "../../services/api";

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

const initialPersonalInfo: PersonalInfo = {
  full_name: "",
  professional_title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

const initialSkills: Skills = {
  technical: [],
  soft: [],
  other: [],
};

interface SectionHeaderProps {
  number: string;
  title: string;
  description: string;
  onAdd?: () => void;
  addLabel?: string;
}

function SectionHeader({
  number,
  title,
  description,
  onAdd,
  addLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">
          {number}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {onAdd && addLabel && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <Plus size={14} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

function SectionBox({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <SectionHeader
        number={number}
        title={title}
        description={description}
      />

      <div className="p-5">{children}</div>
    </section>
  );
}

function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(initialPersonalInfo);

  const [summary, setSummary] = useState("");

  const [skills, setSkills] =
    useState<Skills>(initialSkills);

  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [internships, setInternships] =
    useState<Internship[]>([]);

  const [education, setEducation] =
    useState<Education[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [certifications, setCertifications] =
    useState<Certification[]>([]);

  const [showCertificationForm, setShowCertificationForm] =
    useState(false);

  const [showInternshipForm, setShowInternshipForm] =
    useState(false);

  const [showExperienceForm, setShowExperienceForm] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const resumeData: ResumeData = {
    personal_info: personalInfo,
    professional_summary:
      summary.trim() || undefined,
    skills,
    experience: experiences,
    internships,
    education,
    projects,
    certifications,
  };

  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!personalInfo.full_name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!personalInfo.professional_title.trim()) {
      setErrorMessage(
        "Please enter your professional title."
      );
      return;
    }

    if (!personalInfo.email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!personalInfo.phone.trim()) {
      setErrorMessage(
        "Please enter your phone number."
      );
      return;
    }

    if (!personalInfo.location.trim()) {
      setErrorMessage(
        "Please enter your location."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await createResume(resumeData);

      console.log(
        "Resume created successfully:",
        response
      );

      setSuccessMessage(
        "Resume information saved successfully."
      );
    } catch (error) {
      console.error(
        "Resume creation failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF]">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#F1F5F9]/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="text-right">
            <h1 className="text-base font-semibold text-slate-800">
              Resume Builder
            </h1>

            <p className="text-xs text-slate-500">
              Build your professional resume
            </p>
          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">

        {/* ================= INTRO ================= */}

        <div className="mb-8">

          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Resume Builder
          </span>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create your professional resume
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add your information below. Your resume
            preview will update automatically as you make
            changes.
          </p>

        </div>

        {/* ================= TWO COLUMN LAYOUT ================= */}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">

          {/* ================= LEFT FORM ================= */}

          <div className="min-w-0 space-y-5">

            {/* 01 PERSONAL INFORMATION */}

            <SectionBox
              number="01"
              title="Personal Information"
              description="Add your contact and professional details."
            >
              <PersonalInfoForm
                data={personalInfo}
                onChange={setPersonalInfo}
              />
            </SectionBox>

            {/* 02 PROFESSIONAL SUMMARY */}

            <SectionBox
              number="02"
              title="Professional Summary"
              description="Write a short summary of your professional background."
            >
              <SummaryForm
                value={summary}
                onChange={setSummary}
              />
            </SectionBox>

            {/* 03 SKILLS */}

            <SectionBox
              number="03"
              title="Skills"
              description="Add your technical, soft, and other relevant skills."
            >
              <SkillsForm
                skills={skills}
                onChange={setSkills}
              />
            </SectionBox>

            {/* 04 EDUCATION */}

            <SectionBox
              number="04"
              title="Education"
              description="Add your academic qualifications."
            >
              <EducationForm
                education={education}
                onChange={setEducation}
              />
            </SectionBox>

            {/* 05 PROJECTS */}

            <SectionBox
              number="05"
              title="Projects"
              description="Showcase projects that demonstrate your skills."
            >
              <ProjectsForm
                projects={projects}
                onChange={setProjects}
              />
            </SectionBox>

            {/* 06 CERTIFICATIONS */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <SectionHeader
                number="06"
                title="Certifications"
                description="Add professional certifications and credentials."
                onAdd={() =>
                  setShowCertificationForm(
                    (current) => !current
                  )
                }
                addLabel={
                  showCertificationForm
                    ? "Close"
                    : "Add Certification"
                }
              />

              {certifications.length > 0 && (
                <div className="px-5 pt-5">

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

                    <p className="text-xs font-medium text-slate-600">
                      {certifications.length} certification
                      {certifications.length !== 1
                        ? "s"
                        : ""}{" "}
                      added
                    </p>

                  </div>

                </div>
              )}

              {showCertificationForm && (
                <div className="p-5">

                  <CertificationForm
                    certifications={certifications}
                    onChange={setCertifications}
                  />

                </div>
              )}

            </section>

            {/* 07 INTERNSHIPS */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <SectionHeader
                number="07"
                title="Internships"
                description="Add internship experience and technologies used."
                onAdd={() =>
                  setShowInternshipForm(
                    (current) => !current
                  )
                }
                addLabel={
                  showInternshipForm
                    ? "Close"
                    : "Add Internship"
                }
              />

              {internships.length > 0 && (
                <div className="px-5 pt-5">

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

                    <p className="text-xs font-medium text-slate-600">
                      {internships.length} internship
                      {internships.length !== 1
                        ? "s"
                        : ""}{" "}
                      added
                    </p>

                  </div>

                </div>
              )}

              {showInternshipForm && (
                <div className="p-5">

                  <InternshipForm
                    internships={internships}
                    onChange={setInternships}
                  />

                </div>
              )}

            </section>

            {/* 08 EXPERIENCE */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <SectionHeader
                number="08"
                title="Experience"
                description="Add your professional work experience."
                onAdd={() =>
                  setShowExperienceForm(
                    (current) => !current
                  )
                }
                addLabel={
                  showExperienceForm
                    ? "Close"
                    : "Add Experience"
                }
              />

              {experiences.length > 0 && (
                <div className="px-5 pt-5">

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

                    <p className="text-xs font-medium text-slate-600">
                      {experiences.length} experience
                      {experiences.length !== 1
                        ? "s"
                        : ""}{" "}
                      added
                    </p>

                  </div>

                </div>
              )}

              {showExperienceForm && (
                <div className="p-5">

                  <ExperienceForm
                    experiences={experiences}
                    onChange={setExperiences}
                  />

                </div>
              )}

            </section>

            {/* ================= SUCCESS ================= */}

            {successMessage && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

                <CheckCircle2 size={18} />

                <span>{successMessage}</span>

              </div>
            )}

            {/* ================= ERROR ================= */}

            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* ================= SAVE ================= */}

            <div className="flex justify-end pt-2">

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  "Save Resume"
                )}

              </button>

            </div>

          </div>

          {/* ================= RIGHT COLUMN SPACER ================= */}

          <div
            className="hidden xl:block"
            aria-hidden="true"
          />

        </div>

        {/* ==================================================
            SINGLE FIXED RESUME PREVIEW
        ================================================== */}

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
            />
          </div>
        </div>

      </main>

    </div>
  );
}

export default ResumeBuilder;