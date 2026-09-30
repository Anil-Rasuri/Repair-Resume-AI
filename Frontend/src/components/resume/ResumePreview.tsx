import type { ReactNode } from "react";

import type { ResumeData } from "../../types/resume";
import type { ResumeTemplate } from "../../templates/templateTypes";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
}

function formatDate(date: string): string {
  if (!date) {
    return "";
  }

  const parts = date.split("-");

  if (parts.length === 2) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);

    if (!Number.isNaN(year) && month >= 1 && month <= 12) {
      return new Date(year, month - 1).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
    }
  }

  return date;
}

function getDateRange(
  startDate: string,
  endDate: string | undefined,
  currentlyWorking: boolean
): string {
  const start = formatDate(startDate);

  if (currentlyWorking) {
    return start ? `${start} – Present` : "Present";
  }

  const end = formatDate(endDate ?? "");

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start || end;
}

function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-2 border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-800 ${className}`}
    >
      {children}
    </h2>
  );
}

function ContactInfo({
  resumeData,
  className = "",
}: {
  resumeData: ResumeData;
  className?: string;
}) {
  const personal = resumeData.personal_info;

  const items = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio,
  ].filter((item) => item?.trim());

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[8px] leading-tight text-slate-600 ${className}`}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="break-all"
        >
          {item}

          {index < items.length - 1 ? (
            <span className="ml-2 text-slate-300">
              |
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function SummaryContent({
  resumeData,
  className = "",
}: {
  resumeData: ResumeData;
  className?: string;
}) {
  if (!resumeData.professional_summary?.trim()) {
    return null;
  }

  return (
    <p
      className={`text-[8.5px] leading-[1.45] text-slate-700 ${className}`}
    >
      {resumeData.professional_summary.trim()}
    </p>
  );
}

function SkillsContent({
  resumeData,
  compact = false,
}: {
  resumeData: ResumeData;
  compact?: boolean;
}) {
  const technical = resumeData.skills.technical.filter(Boolean);
  const soft = resumeData.skills.soft.filter(Boolean);
  const other = resumeData.skills.other.filter(Boolean);

  if (
    technical.length === 0 &&
    soft.length === 0 &&
    other.length === 0
  ) {
    return null;
  }

  const groups = [
    {
      label: "Technical",
      values: technical,
    },
    {
      label: "Soft Skills",
      values: soft,
    },
    {
      label: "Other",
      values: other,
    },
  ].filter((group) => group.values.length > 0);

  if (compact) {
    return (
      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 text-[7px] font-bold uppercase tracking-wide text-slate-400">
              {group.label}
            </p>

            <div className="flex flex-wrap gap-1">
              {group.values.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-slate-300 px-1.5 py-0.5 text-[7px] leading-none text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 text-[8px] leading-[1.35] text-slate-700">
      {groups.map((group) => (
        <p key={group.label}>
          <span className="font-semibold">
            {group.label}:
          </span>{" "}
          {group.values.join(", ")}
        </p>
      ))}
    </div>
  );
}

function EducationContent({
  resumeData,
  compact = false,
}: {
  resumeData: ResumeData;
  compact?: boolean;
}) {
  if (resumeData.education.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {resumeData.education.map((education, index) => (
        <div
          key={`${education.degree}-${index}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* Degree */}
              <p
                className={`font-bold text-slate-800 ${
                  compact
                    ? "text-[7.5px]"
                    : "text-[8.5px]"
                }`}
              >
                {education.degree}
              </p>

              {/* Branch */}
              {education.branch?.trim() && (
                <p
                  className={`text-slate-600 ${
                    compact
                      ? "text-[7px]"
                      : "text-[8px]"
                  }`}
                >
                  {education.branch.trim()}
                </p>
              )}

              {/* Institution + Location */}
              <p
                className={`text-slate-600 ${
                  compact
                    ? "text-[7px]"
                    : "text-[8px]"
                }`}
              >
                {education.institution}

                {education.location
                  ? `, ${education.location}`
                  : ""}
              </p>
            </div>

            {/* Education Dates */}
            {(education.start_date ||
              education.end_date) && (
              <p
                className={`shrink-0 text-right italic text-slate-500 ${
                  compact
                    ? "text-[6.5px]"
                    : "text-[7px]"
                }`}
              >
                {formatDate(education.start_date)}

                {education.start_date &&
                education.end_date
                  ? " – "
                  : ""}

                {formatDate(education.end_date)}
              </p>
            )}
          </div>

          {/* Description */}
          {education.description?.trim() && (
            <p
              className={`mt-1 leading-[1.35] text-slate-600 ${
                compact
                  ? "text-[7px]"
                  : "text-[7.5px]"
              }`}
            >
              {education.description.trim()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsContent({
  resumeData,
  compact = false,
  boxed = false,
}: {
  resumeData: ResumeData;
  compact?: boolean;
  boxed?: boolean;
}) {
  if (resumeData.projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {resumeData.projects.map((project, index) => (
        <div
          key={`${project.name}-${index}`}
          className={
            boxed
              ? "rounded border border-slate-600 bg-slate-900/50 p-2"
              : ""
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <p
              className={`font-bold ${
                compact
                  ? "text-[7.5px]"
                  : "text-[8.5px]"
              } ${
                boxed
                  ? "text-slate-100"
                  : "text-slate-800"
              }`}
            >
              {project.name}
            </p>

            {project.project_url?.trim() && (
              <p
                className={`break-all ${
                  compact
                    ? "text-[6.5px]"
                    : "text-[7px]"
                } ${
                  boxed
                    ? "text-cyan-300"
                    : "text-blue-600"
                }`}
              >
                {project.project_url.trim()}
              </p>
            )}
          </div>

          {project.technologies.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {project.technologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className={`rounded px-1.5 py-0.5 text-[6.5px] ${
                      boxed
                        ? "border border-slate-600 bg-slate-800 text-cyan-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {technology}
                  </span>
                )
              )}
            </div>
          )}

          {project.description?.trim() && (
            <p
              className={`mt-1.5 leading-[1.4] ${
                compact
                  ? "text-[7px]"
                  : "text-[7.5px]"
              } ${
                boxed
                  ? "text-slate-300"
                  : "text-slate-600"
              }`}
            >
              {project.description.trim()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function CertificationsContent({
  resumeData,
  compact = false,
}: {
  resumeData: ResumeData;
  compact?: boolean;
}) {
  if (resumeData.certifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {resumeData.certifications.map(
        (certification, index) => (
          <div
            key={`${certification.name}-${index}`}
          >
            <p
              className={`font-semibold text-slate-800 ${
                compact
                  ? "text-[7px]"
                  : "text-[8px]"
              }`}
            >
              {certification.name}
            </p>

            <p
              className={`text-slate-600 ${
                compact
                  ? "text-[6.5px]"
                  : "text-[7px]"
              }`}
            >
              {certification.issuing_organization}

              {certification.issue_date
                ? ` • ${formatDate(
                    certification.issue_date
                  )}`
                : ""}
            </p>

            {certification.credential_id?.trim() && (
              <p
                className={`text-slate-500 ${
                  compact
                    ? "text-[6px]"
                    : "text-[6.5px]"
                }`}
              >
                ID:{" "}
                {certification.credential_id.trim()}
              </p>
            )}

            {certification.credential_url?.trim() && (
              <p
                className={`break-all text-blue-600 ${
                  compact
                    ? "text-[6px]"
                    : "text-[6.5px]"
                }`}
              >
                {certification.credential_url.trim()}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

function InternshipsContent({
  resumeData,
  compact = false,
}: {
  resumeData: ResumeData;
  compact?: boolean;
}) {
  if (resumeData.internships.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {resumeData.internships.map(
        (internship, index) => (
          <div
            key={`${internship.internship_title}-${index}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={`font-bold text-slate-800 ${
                    compact
                      ? "text-[7.5px]"
                      : "text-[8.5px]"
                  }`}
                >
                  {internship.internship_title}
                </p>

                <p
                  className={`text-slate-600 ${
                    compact
                      ? "text-[7px]"
                      : "text-[8px]"
                  }`}
                >
                  {internship.company}

                  {internship.location
                    ? `, ${internship.location}`
                    : ""}
                </p>
              </div>

              <p
                className={`shrink-0 text-right italic text-slate-500 ${
                  compact
                    ? "text-[6.5px]"
                    : "text-[7px]"
                }`}
              >
                {getDateRange(
                  internship.start_date,
                  internship.end_date,
                  internship.currently_working
                )}
              </p>
            </div>

            {internship.technologies.length > 0 && (
              <p
                className={`mt-0.5 text-slate-500 ${
                  compact
                    ? "text-[6.5px]"
                    : "text-[7px]"
                }`}
              >
                <span className="font-semibold">
                  Technologies:
                </span>{" "}
                {internship.technologies.join(", ")}
              </p>
            )}

            {internship.description?.trim() && (
              <p
                className={`mt-1 leading-[1.4] text-slate-600 ${
                  compact
                    ? "text-[7px]"
                    : "text-[7.5px]"
                }`}
              >
                {internship.description.trim()}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

function ExperienceContent({
  resumeData,
  compact = false,
}: {
  resumeData: ResumeData;
  compact?: boolean;
}) {
  if (resumeData.experience.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      {resumeData.experience.map(
        (experience, index) => (
          <div
            key={`${experience.job_title}-${index}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={`font-bold text-slate-800 ${
                    compact
                      ? "text-[7.5px]"
                      : "text-[8.5px]"
                  }`}
                >
                  {experience.job_title}
                </p>

                <p
                  className={`text-slate-600 ${
                    compact
                      ? "text-[7px]"
                      : "text-[8px]"
                  }`}
                >
                  {experience.company}

                  {experience.location
                    ? `, ${experience.location}`
                    : ""}
                </p>
              </div>

              <p
                className={`shrink-0 text-right italic text-slate-500 ${
                  compact
                    ? "text-[6.5px]"
                    : "text-[7px]"
                }`}
              >
                {getDateRange(
                  experience.start_date,
                  experience.end_date,
                  experience.currently_working
                )}
              </p>
            </div>

            {experience.description?.trim() && (
              <p
                className={`mt-1 leading-[1.4] text-slate-600 ${
                  compact
                    ? "text-[7px]"
                    : "text-[7.5px]"
                }`}
              >
                {experience.description.trim()}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

function EmptyResumeState() {
  return (
    <div className="flex min-h-[1000px] items-center justify-center bg-white p-10 text-center">
      <div>
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-100" />

        <h3 className="text-sm font-semibold text-slate-700">
          Your resume preview
        </h3>

        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
          Start entering your information and your
          resume will appear here automatically.
        </p>
      </div>
    </div>
  );
}

function ResumePage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`resume-a4-page mx-auto min-h-[1123px] w-full max-w-[794px] overflow-hidden bg-white ${className}`}
      style={{
        aspectRatio: "210 / 297",
      }}
    >
      {children}
    </div>
  );
}

function ClassicTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  const hasContent =
    personal.full_name ||
    personal.professional_title ||
    resumeData.professional_summary ||
    resumeData.skills.technical.length ||
    resumeData.skills.soft.length ||
    resumeData.skills.other.length ||
    resumeData.education.length ||
    resumeData.projects.length ||
    resumeData.certifications.length ||
    resumeData.internships.length ||
    resumeData.experience.length;

  if (!hasContent) {
    return <EmptyResumeState />;
  }

  return (
    <ResumePage className="px-[52px] py-[44px]">
      <header className="border-b border-slate-300 pb-4 text-center">
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-1 text-[10px] font-medium text-slate-600">
            {personal.professional_title}
          </p>
        )}

        <ContactInfo
          resumeData={resumeData}
          className="mt-2"
        />
      </header>

      <main className="space-y-4 pt-4">
        {resumeData.professional_summary?.trim() && (
          <section>
            <SectionTitle>
              Professional Summary
            </SectionTitle>

            <SummaryContent
              resumeData={resumeData}
            />
          </section>
        )}

        {(resumeData.skills.technical.length > 0 ||
          resumeData.skills.soft.length > 0 ||
          resumeData.skills.other.length > 0) && (
          <section>
            <SectionTitle>Skills</SectionTitle>

            <SkillsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.education.length > 0 && (
          <section>
            <SectionTitle>Education</SectionTitle>

            <EducationContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.projects.length > 0 && (
          <section>
            <SectionTitle>Projects</SectionTitle>

            <ProjectsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.certifications.length > 0 && (
          <section>
            <SectionTitle>
              Certifications
            </SectionTitle>

            <CertificationsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.internships.length > 0 && (
          <section>
            <SectionTitle>
              Internships
            </SectionTitle>

            <InternshipsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.experience.length > 0 && (
          <section>
            <SectionTitle>
              Experience
            </SectionTitle>

            <ExperienceContent
              resumeData={resumeData}
            />
          </section>
        )}
      </main>
    </ResumePage>
  );
}

function ModernBlueTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  return (
    <ResumePage>
      <header className="bg-sky-50 px-[52px] py-[38px]">
        <h1 className="text-[24px] font-bold text-slate-900">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-1 text-[10px] font-medium text-sky-700">
            {personal.professional_title}
          </p>
        )}

        <ContactInfo
          resumeData={resumeData}
          className="mt-2 justify-start"
        />
      </header>

      <main className="px-[52px] py-[32px]">
        <div className="space-y-4">
          {resumeData.professional_summary?.trim() && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Professional Summary
              </h2>

              <SummaryContent
                resumeData={resumeData}
              />
            </section>
          )}

          {(resumeData.skills.technical.length > 0 ||
            resumeData.skills.soft.length > 0 ||
            resumeData.skills.other.length > 0) && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Skills
              </h2>

              <SkillsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.education.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Education
              </h2>

              <EducationContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.projects.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Projects
              </h2>

              <ProjectsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.certifications.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Certifications
              </h2>

              <CertificationsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.internships.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Internships
              </h2>

              <InternshipsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.experience.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Experience
              </h2>

              <ExperienceContent
                resumeData={resumeData}
              />
            </section>
          )}
        </div>
      </main>
    </ResumePage>
  );
}

function ExecutiveTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  return (
    <ResumePage className="grid grid-cols-[245px_1fr]">
      <aside className="bg-slate-800 px-7 py-9 text-white">
        <h1 className="text-[20px] font-bold leading-tight">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-2 text-[9px] leading-4 text-slate-300">
            {personal.professional_title}
          </p>
        )}

        <div className="mt-5 border-t border-slate-600 pt-4">
          <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Contact
          </p>

          <div className="space-y-1.5 break-all text-[7px] leading-3 text-slate-300">
            {personal.email && (
              <p>{personal.email}</p>
            )}

            {personal.phone && (
              <p>{personal.phone}</p>
            )}

            {personal.location && (
              <p>{personal.location}</p>
            )}

            {personal.linkedin && (
              <p>{personal.linkedin}</p>
            )}

            {personal.github && (
              <p>{personal.github}</p>
            )}

            {personal.portfolio && (
              <p>{personal.portfolio}</p>
            )}
          </div>
        </div>

        {(resumeData.skills.technical.length > 0 ||
          resumeData.skills.soft.length > 0 ||
          resumeData.skills.other.length > 0) && (
          <div className="mt-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Skills
            </p>

            <SkillsContent
              resumeData={resumeData}
              compact
            />
          </div>
        )}

        {resumeData.education.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Education
            </p>

            <EducationContent
              resumeData={resumeData}
              compact
            />
          </div>
        )}

        {resumeData.certifications.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Certifications
            </p>

            <CertificationsContent
              resumeData={resumeData}
              compact
            />
          </div>
        )}
      </aside>

      <main className="px-8 py-9">
        {resumeData.professional_summary?.trim() && (
          <section>
            <SectionTitle>
              Profile
            </SectionTitle>

            <SummaryContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.experience.length > 0 && (
          <section className="mt-5">
            <SectionTitle>
              Experience
            </SectionTitle>

            <ExperienceContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.internships.length > 0 && (
          <section className="mt-5">
            <SectionTitle>
              Internships
            </SectionTitle>

            <InternshipsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.projects.length > 0 && (
          <section className="mt-5">
            <SectionTitle>
              Projects
            </SectionTitle>

            <ProjectsContent
              resumeData={resumeData}
            />
          </section>
        )}
      </main>
    </ResumePage>
  );
}

function MinimalTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  return (
    <ResumePage className="px-[60px] py-[52px]">
      <header className="pb-5">
        <h1 className="text-[25px] font-light tracking-tight text-slate-900">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-1 text-[9px] text-slate-500">
            {personal.professional_title}
          </p>
        )}

        <ContactInfo
          resumeData={resumeData}
          className="mt-3 justify-start"
        />
      </header>

      <div className="h-px bg-slate-200" />

      <main className="space-y-5 pt-5">
        {resumeData.professional_summary?.trim() && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Summary
            </h2>

            <SummaryContent
              resumeData={resumeData}
            />
          </section>
        )}

        {(resumeData.skills.technical.length > 0 ||
          resumeData.skills.soft.length > 0 ||
          resumeData.skills.other.length > 0) && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Skills
            </h2>

            <SkillsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.experience.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Experience
            </h2>

            <ExperienceContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.internships.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Internships
            </h2>

            <InternshipsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.projects.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Projects
            </h2>

            <ProjectsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.education.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Education
            </h2>

            <EducationContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.certifications.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Certifications
            </h2>

            <CertificationsContent
              resumeData={resumeData}
            />
          </section>
        )}
      </main>
    </ResumePage>
  );
}

function CreativeBlueTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  const initials =
    personal.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part[0]?.toUpperCase()
      )
      .join("") || "YN";

  return (
    <ResumePage className="grid grid-cols-[240px_1fr]">
      <aside className="bg-sky-50 px-7 py-9">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-[20px] font-bold text-white">
          {initials}
        </div>

        <h1 className="mt-4 text-[18px] font-bold text-slate-900">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-1 text-[8px] font-medium text-sky-700">
            {personal.professional_title}
          </p>
        )}

        <div className="mt-5 border-t border-sky-200 pt-4">
          <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-sky-700">
            Contact
          </p>

          <div className="space-y-1.5 break-all text-[7px] leading-3 text-slate-600">
            {personal.email && (
              <p>{personal.email}</p>
            )}

            {personal.phone && (
              <p>{personal.phone}</p>
            )}

            {personal.location && (
              <p>{personal.location}</p>
            )}

            {personal.linkedin && (
              <p>{personal.linkedin}</p>
            )}

            {personal.github && (
              <p>{personal.github}</p>
            )}

            {personal.portfolio && (
              <p>{personal.portfolio}</p>
            )}
          </div>
        </div>

        {(resumeData.skills.technical.length > 0 ||
          resumeData.skills.soft.length > 0 ||
          resumeData.skills.other.length > 0) && (
          <div className="mt-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Skills
            </p>

            <SkillsContent
              resumeData={resumeData}
              compact
            />
          </div>
        )}

        {resumeData.certifications.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Certifications
            </p>

            <CertificationsContent
              resumeData={resumeData}
              compact
            />
          </div>
        )}
      </aside>

      <main className="px-8 py-9">
        {resumeData.professional_summary?.trim() && (
          <section>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Profile
            </h2>

            <SummaryContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.experience.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Experience
            </h2>

            <ExperienceContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.internships.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Internships
            </h2>

            <InternshipsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.projects.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Projects
            </h2>

            <ProjectsContent
              resumeData={resumeData}
            />
          </section>
        )}

        {resumeData.education.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
              Education
            </h2>

            <EducationContent
              resumeData={resumeData}
            />
          </section>
        )}
      </main>
    </ResumePage>
  );
}

function TechTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  return (
    <ResumePage className="bg-slate-950 px-8 py-8 text-slate-100">
      <header className="border-b border-slate-700 pb-5">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              SOFTWARE / AI
            </p>

            <h1 className="text-[23px] font-bold">
              {personal.full_name || "Your Name"}
            </h1>

            {personal.professional_title && (
              <p className="mt-1 text-[9px] text-slate-400">
                {personal.professional_title}
              </p>
            )}
          </div>

          <div className="max-w-[300px] text-right">
            <ContactInfo
              resumeData={resumeData}
              className="justify-end text-slate-400"
            />
          </div>
        </div>
      </header>

      <main className="space-y-4 pt-5">
        {resumeData.professional_summary?.trim() && (
          <section>
            <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Profile
            </h2>

            <SummaryContent
              resumeData={resumeData}
              className="text-slate-300"
            />
          </section>
        )}

        {(resumeData.skills.technical.length > 0 ||
          resumeData.skills.soft.length > 0 ||
          resumeData.skills.other.length > 0) && (
          <section>
            <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Tech Stack
            </h2>

            <SkillsContent
              resumeData={resumeData}
              compact
            />
          </section>
        )}

        {resumeData.projects.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Projects
            </h2>

            <ProjectsContent
              resumeData={resumeData}
              compact
              boxed
            />
          </section>
        )}

        {resumeData.experience.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Experience
            </h2>

            <div className="[&_*]:!text-slate-300">
              <ExperienceContent
                resumeData={resumeData}
                compact
              />
            </div>
          </section>
        )}

        {resumeData.internships.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Internships
            </h2>

            <div className="[&_*]:!text-slate-300">
              <InternshipsContent
                resumeData={resumeData}
                compact
              />
            </div>
          </section>
        )}

        {resumeData.education.length > 0 && (
          <section>
            <h2 className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Education
            </h2>

            <div className="[&_*]:!text-slate-300">
              <EducationContent
                resumeData={resumeData}
                compact
              />
            </div>
          </section>
        )}
      </main>
    </ResumePage>
  );
}

function ProfessionalSplitTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  return (
    <ResumePage>
      <header className="border-b-4 border-indigo-600 px-[52px] py-7">
        <h1 className="text-[23px] font-bold text-slate-900">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-1 text-[9px] font-medium text-indigo-600">
            {personal.professional_title}
          </p>
        )}

        <ContactInfo
          resumeData={resumeData}
          className="mt-2 justify-start"
        />
      </header>

      <div className="grid grid-cols-[220px_1fr]">
        <aside className="bg-slate-50 px-6 py-7">
          {(resumeData.skills.technical.length > 0 ||
            resumeData.skills.soft.length > 0 ||
            resumeData.skills.other.length > 0) && (
            <section>
              <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.12em] text-indigo-700">
                Skills
              </h2>

              <SkillsContent
                resumeData={resumeData}
                compact
              />
            </section>
          )}

          {resumeData.education.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.12em] text-indigo-700">
                Education
              </h2>

              <EducationContent
                resumeData={resumeData}
                compact
              />
            </section>
          )}

          {resumeData.certifications.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-[8px] font-bold uppercase tracking-[0.12em] text-indigo-700">
                Certifications
              </h2>

              <CertificationsContent
                resumeData={resumeData}
                compact
              />
            </section>
          )}
        </aside>

        <main className="px-7 py-7">
          {resumeData.professional_summary?.trim() && (
            <section>
              <SectionTitle>
                Summary
              </SectionTitle>

              <SummaryContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.experience.length > 0 && (
            <section className="mt-5">
              <SectionTitle>
                Experience
              </SectionTitle>

              <ExperienceContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.internships.length > 0 && (
            <section className="mt-5">
              <SectionTitle>
                Internships
              </SectionTitle>

              <InternshipsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.projects.length > 0 && (
            <section className="mt-5">
              <SectionTitle>
                Projects
              </SectionTitle>

              <ProjectsContent
                resumeData={resumeData}
              />
            </section>
          )}
        </main>
      </div>
    </ResumePage>
  );
}

function ModernHeaderTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const personal = resumeData.personal_info;

  return (
    <ResumePage>
      <header className="bg-slate-800 px-[52px] py-8 text-white">
        <h1 className="text-[24px] font-bold">
          {personal.full_name || "Your Name"}
        </h1>

        {personal.professional_title && (
          <p className="mt-1 text-[10px] font-medium text-sky-300">
            {personal.professional_title}
          </p>
        )}

        <ContactInfo
          resumeData={resumeData}
          className="mt-2 justify-start text-slate-300"
        />
      </header>

      <div className="h-1 bg-sky-500" />

      <main className="px-[52px] py-8">
        <div className="space-y-4">
          {resumeData.professional_summary?.trim() && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Professional Summary
              </h2>

              <SummaryContent
                resumeData={resumeData}
              />
            </section>
          )}

          {(resumeData.skills.technical.length > 0 ||
            resumeData.skills.soft.length > 0 ||
            resumeData.skills.other.length > 0) && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Skills
              </h2>

              <SkillsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.experience.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Experience
              </h2>

              <ExperienceContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.internships.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Internships
              </h2>

              <InternshipsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.projects.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Projects
              </h2>

              <ProjectsContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.education.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Education
              </h2>

              <EducationContent
                resumeData={resumeData}
              />
            </section>
          )}

          {resumeData.certifications.length > 0 && (
            <section>
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700">
                Certifications
              </h2>

              <CertificationsContent
                resumeData={resumeData}
              />
            </section>
          )}
        </div>
      </main>
    </ResumePage>
  );
}

function renderTemplate(
  template: ResumeTemplate,
  resumeData: ResumeData
) {
  switch (template) {
    case "modern-blue":
      return (
        <ModernBlueTemplate
          resumeData={resumeData}
        />
      );

    case "executive":
      return (
        <ExecutiveTemplate
          resumeData={resumeData}
        />
      );

    case "minimal":
      return (
        <MinimalTemplate
          resumeData={resumeData}
        />
      );

    case "creative-blue":
      return (
        <CreativeBlueTemplate
          resumeData={resumeData}
        />
      );

    case "tech":
      return (
        <TechTemplate
          resumeData={resumeData}
        />
      );

    case "professional-split":
      return (
        <ProfessionalSplitTemplate
          resumeData={resumeData}
        />
      );

    case "modern-header":
      return (
        <ModernHeaderTemplate
          resumeData={resumeData}
        />
      );

    case "classic":
    default:
      return (
        <ClassicTemplate
          resumeData={resumeData}
        />
      );
  }
}

export default function ResumePreview({
  resumeData,
  template,
}: ResumePreviewProps) {
  return (
    <div className="w-full">
      <div className="mb-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Resume Preview
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Your resume updates automatically as you enter
          information.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-3 shadow-sm">
        <div id="resume-preview-document">
          {renderTemplate(
            template,
            resumeData
          )}
        </div>
      </div>
    </div>
  );
}