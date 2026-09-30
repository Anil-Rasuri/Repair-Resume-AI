import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Phone,
  UserCircle,
  Wrench,
} from "lucide-react";

import type { ResumeData } from "../../types/resume";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
}

/* =========================================================
   A4
========================================================= */

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date?: string) => {
  if (!date) return "";

  const [year, month] = date.split("-");

  if (!month) return year;

  const months: Record<string, string> = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  return `${months[month] || month} ${year}`;
};

const cleanUrl = (url?: string) => {
  if (!url) return "";

  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
};

const hasText = (value?: string) => Boolean(value?.trim());

const normalizeTemplate = (template: string) => {
  const value = template.toLowerCase().trim();

  if (value.includes("modern blue")) return "modern-blue";
  if (value.includes("executive")) return "executive";
  if (value.includes("creative")) return "creative-blue";
  if (value.includes("professional split")) return "professional-split";
  if (value.includes("modern header")) return "modern-header";
  if (value.includes("minimal")) return "minimal";
  if (value.includes("tech")) return "tech";

  return "classic";
};

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function SectionTitle({
  title,
  icon,
  color = "#2563EB",
  line = true,
}: {
  title: string;
  icon?: ReactNode;
  color?: string;
  line?: boolean;
}) {
  return (
    <div
      className={`mb-3 flex items-center gap-2 ${
        line ? "border-b border-slate-200 pb-1.5" : ""
      }`}
    >
      {icon && (
        <span style={{ color }} className="flex shrink-0">
          {icon}
        </span>
      )}

      <h2
        className="text-[12px] font-bold uppercase tracking-[0.12em]"
        style={{ color: "#172033" }}
      >
        {title}
      </h2>
    </div>
  );
}

function ContactItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
      <span className="shrink-0 text-[#2563EB]">{icon}</span>
      <span>{children}</span>
    </span>
  );
}

function SkillList({
  skills,
  chip = false,
}: {
  skills: string[];
  chip?: boolean;
}) {
  if (!skills.length) return null;

  if (chip) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="rounded bg-[#EAF2FF] px-2 py-1 text-[9px] font-medium leading-none text-[#2457A6]"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {skills.map((skill, index) => (
        <p
          key={`${skill}-${index}`}
          className="text-[10px] leading-[1.4] text-slate-600"
        >
          • {skill}
        </p>
      ))}
    </div>
  );
}

/* =========================================================
   EXPERIENCE
========================================================= */

function ExperienceBlock({
  item,
  compact = false,
}: {
  item: ResumeData["experience"][number];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mb-4" : "mb-5"}>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h3 className="text-[11.5px] font-bold leading-[1.3] text-[#172033]">
            {item.job_title || "Job Title"}
          </h3>

          <p className="mt-0.5 text-[10px] font-semibold leading-[1.35] text-[#2563EB]">
            {item.company || "Company"}
            {item.location ? ` • ${item.location}` : ""}
          </p>
        </div>

        {(item.start_date ||
          item.end_date ||
          item.currently_working) && (
          <span className="shrink-0 whitespace-nowrap text-[9px] font-medium text-slate-500">
            {formatDate(item.start_date)}
            {item.start_date &&
            (item.end_date || item.currently_working)
              ? " – "
              : ""}
            {item.currently_working
              ? "Present"
              : formatDate(item.end_date)}
          </span>
        )}
      </div>

      {hasText(item.description) && (
        <p className="mt-1.5 whitespace-pre-line text-[10px] leading-[1.48] text-slate-600">
          {item.description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   INTERNSHIP
========================================================= */

function InternshipBlock({
  item,
}: {
  item: ResumeData["internships"][number];
}) {
  return (
    <div className="mb-5">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h3 className="text-[11.5px] font-bold leading-[1.3] text-[#172033]">
            {item.internship_title || "Internship"}
          </h3>

          <p className="mt-0.5 text-[10px] font-semibold text-[#2563EB]">
            {item.company || "Company"}
            {item.location ? ` • ${item.location}` : ""}
          </p>
        </div>

        {(item.start_date ||
          item.end_date ||
          item.currently_working) && (
          <span className="shrink-0 whitespace-nowrap text-[9px] text-slate-500">
            {formatDate(item.start_date)}
            {item.start_date &&
            (item.end_date || item.currently_working)
              ? " – "
              : ""}
            {item.currently_working
              ? "Present"
              : formatDate(item.end_date)}
          </span>
        )}
      </div>

      {hasText(item.description) && (
        <p className="mt-1.5 whitespace-pre-line text-[10px] leading-[1.48] text-slate-600">
          {item.description}
        </p>
      )}

      {item.technologies.length > 0 && (
        <p className="mt-1.5 text-[9px] leading-[1.4] text-slate-500">
          <span className="font-semibold text-slate-700">
            Technologies:
          </span>{" "}
          {item.technologies.join(" • ")}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PROJECT
========================================================= */

function ProjectBlock({
  item,
  style = "normal",
}: {
  item: ResumeData["projects"][number];
  style?: "normal" | "tech" | "minimal";
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-start justify-between gap-5">
        <h3
          className={`font-bold leading-[1.3] ${
            style === "tech"
              ? "text-[11.5px] text-[#0F172A]"
              : "text-[11.5px] text-[#172033]"
          }`}
        >
          {item.name || "Project"}
        </h3>

        {item.project_url && (
          <span className="flex max-w-[190px] shrink-0 items-center gap-1 truncate text-[8.5px] text-[#2563EB]">
            <ExternalLink size={9} />
            <span className="truncate">
              {cleanUrl(item.project_url)}
            </span>
          </span>
        )}
      </div>

      {hasText(item.description) && (
        <p className="mt-1.5 whitespace-pre-line text-[10px] leading-[1.48] text-slate-600">
          {item.description}
        </p>
      )}

      {item.technologies.length > 0 && (
        <p
          className={`mt-1.5 text-[9px] leading-[1.4] ${
            style === "tech"
              ? "font-medium text-slate-600"
              : "text-slate-500"
          }`}
        >
          {item.technologies.join(" • ")}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   EDUCATION
========================================================= */

function EducationBlock({
  item,
}: {
  item: ResumeData["education"][number];
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[10.5px] font-bold leading-[1.35] text-[#172033]">
            {item.degree || "Degree"}
          </h3>

          {item.branch && (
            <p className="mt-0.5 text-[9.5px] leading-[1.35] text-slate-600">
              {item.branch}
            </p>
          )}

          <p className="mt-0.5 text-[9.5px] font-semibold leading-[1.35] text-[#2563EB]">
            {item.institution || "Institution"}
          </p>

          {item.location && (
            <p className="mt-0.5 text-[9px] text-slate-500">
              {item.location}
            </p>
          )}
        </div>

        {(item.start_date || item.end_date) && (
          <span className="shrink-0 whitespace-nowrap text-[8.5px] text-slate-500">
            {formatDate(item.start_date)}
            {item.start_date && item.end_date ? " – " : ""}
            {formatDate(item.end_date)}
          </span>
        )}
      </div>

      {item.description && (
        <p className="mt-1.5 text-[9px] leading-[1.45] text-slate-500">
          {item.description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   CERTIFICATION
========================================================= */

function CertificationBlock({
  item,
}: {
  item: ResumeData["certifications"][number];
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[10px] font-bold leading-[1.35] text-[#172033]">
            {item.name || "Certification"}
          </h3>

          <p className="mt-0.5 text-[9px] font-medium text-[#2563EB]">
            {item.issuing_organization}
          </p>

          {item.credential_id && (
            <p className="mt-1 text-[8.5px] text-slate-500">
              ID: {item.credential_id}
            </p>
          )}
        </div>

        {item.issue_date && (
          <span className="shrink-0 whitespace-nowrap text-[8.5px] text-slate-500">
            {formatDate(item.issue_date)}
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DATA FILTER
========================================================= */

function useResumeSections(resumeData: ResumeData) {
  const validExperience = resumeData.experience.filter(
    (item) =>
      hasText(item.job_title) ||
      hasText(item.company) ||
      hasText(item.description)
  );

  const validInternships = resumeData.internships.filter(
    (item) =>
      hasText(item.internship_title) ||
      hasText(item.company) ||
      hasText(item.description) ||
      item.technologies.length > 0
  );

  const validEducation = resumeData.education.filter(
    (item) =>
      hasText(item.degree) ||
      hasText(item.institution) ||
      hasText(item.branch) ||
      hasText(item.description)
  );

  const validProjects = resumeData.projects.filter(
    (item) =>
      hasText(item.name) ||
      hasText(item.description) ||
      item.technologies.length > 0
  );

  const validCertifications =
    resumeData.certifications.filter(
      (item) =>
        hasText(item.name) ||
        hasText(item.issuing_organization)
    );

  return {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  };
}

/* =========================================================
   CLASSIC TEMPLATE
========================================================= */

function ClassicTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white text-slate-800"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header className="border-b-[3px] border-[#2563EB] px-[38px] pb-[20px] pt-[30px]">
        <h1 className="text-[29px] font-extrabold tracking-[-0.035em] text-[#111827]">
          {personal_info.full_name || "Your Name"}
        </h1>

        <p className="mt-2 text-[13px] font-semibold text-[#2563EB]">
          {personal_info.professional_title ||
            "Professional Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[9.5px] text-slate-500">
          {personal_info.email && (
            <ContactItem
              icon={<Mail size={10} />}
            >
              {personal_info.email}
            </ContactItem>
          )}

          {personal_info.phone && (
            <ContactItem
              icon={<Phone size={10} />}
            >
              {personal_info.phone}
            </ContactItem>
          )}

          {personal_info.location && (
            <ContactItem
              icon={<MapPin size={10} />}
            >
              {personal_info.location}
            </ContactItem>
          )}

          {personal_info.linkedin && (
            <ContactItem
              icon={<ExternalLink size={10} />}
            >
              {cleanUrl(personal_info.linkedin)}
            </ContactItem>
          )}

          {personal_info.github && (
            <ContactItem
              icon={<ExternalLink size={10} />}
            >
              {cleanUrl(personal_info.github)}
            </ContactItem>
          )}

          {personal_info.portfolio && (
            <ContactItem
              icon={<ExternalLink size={10} />}
            >
              {cleanUrl(personal_info.portfolio)}
            </ContactItem>
          )}
        </div>
      </header>

      <div className="grid grid-cols-[225px_1fr]">
        <aside className="min-h-[923px] border-r border-slate-200 bg-[#F5F8FC] px-[22px] py-[25px]">
          {(skills.technical.length > 0 ||
            skills.soft.length > 0 ||
            skills.other.length > 0) && (
            <section className="mb-7">
              <SectionTitle
                icon={<Wrench size={14} />}
                title="Skills"
              />

              {skills.technical.length > 0 && (
                <div className="mb-4">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Technical
                  </p>
                  <SkillList
                    skills={skills.technical}
                    chip
                  />
                </div>
              )}

              {skills.soft.length > 0 && (
                <div className="mb-4">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Soft Skills
                  </p>
                  <SkillList
                    skills={skills.soft}
                    chip
                  />
                </div>
              )}

              {skills.other.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    Other
                  </p>
                  <SkillList
                    skills={skills.other}
                    chip
                  />
                </div>
              )}
            </section>
          )}

          {validEducation.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                icon={<GraduationCap size={14} />}
                title="Education"
              />

              {validEducation.map((item, index) => (
                <EducationBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validCertifications.length > 0 && (
            <section>
              <SectionTitle
                icon={<Award size={14} />}
                title="Certifications"
              />

              {validCertifications.map(
                (item, index) => (
                  <CertificationBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </aside>

        <main className="px-[29px] py-[25px]">
          {hasText(professional_summary) && (
            <section className="mb-6">
              <SectionTitle
                icon={<UserCircle size={14} />}
                title="Professional Summary"
              />

              <p className="text-[10.5px] leading-[1.55] text-slate-600">
                {professional_summary}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                icon={<BriefcaseBusiness size={14} />}
                title="Experience"
              />

              {validExperience.map((item, index) => (
                <ExperienceBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                icon={<Layers3 size={14} />}
                title="Projects"
              />

              {validProjects.map((item, index) => (
                <ProjectBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validInternships.length > 0 && (
            <section>
              <SectionTitle
                icon={<BriefcaseBusiness size={14} />}
                title="Internships"
              />

              {validInternships.map(
                (item, index) => (
                  <InternshipBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   MODERN BLUE
========================================================= */

function ModernBlueTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header className="bg-[#172033] px-[42px] py-[31px] text-white">
        <h1 className="text-[30px] font-extrabold tracking-[-0.04em]">
          {personal_info.full_name || "Your Name"}
        </h1>

        <p className="mt-2 text-[13px] font-semibold text-blue-300">
          {personal_info.professional_title ||
            "Professional Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-slate-300">
          {personal_info.email && (
            <span>{personal_info.email}</span>
          )}

          {personal_info.phone && (
            <span>{personal_info.phone}</span>
          )}

          {personal_info.location && (
            <span>{personal_info.location}</span>
          )}

          {personal_info.linkedin && (
            <span>{cleanUrl(personal_info.linkedin)}</span>
          )}

          {personal_info.github && (
            <span>{cleanUrl(personal_info.github)}</span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_245px]">
        <main className="px-[34px] py-[27px]">
          {hasText(professional_summary) && (
            <section className="mb-6">
              <SectionTitle
                title="Profile"
                color="#2563EB"
              />

              <p className="text-[10.5px] leading-[1.55] text-slate-600">
                {professional_summary}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                title="Experience"
                color="#2563EB"
              />

              {validExperience.map((item, index) => (
                <ExperienceBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                title="Projects"
                color="#2563EB"
              />

              {validProjects.map((item, index) => (
                <ProjectBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validInternships.length > 0 && (
            <section>
              <SectionTitle
                title="Internships"
                color="#2563EB"
              />

              {validInternships.map(
                (item, index) => (
                  <InternshipBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </main>

        <aside className="min-h-[923px] bg-[#F1F5F9] px-[23px] py-[27px]">
          {skills.technical.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Technical Skills"
                color="#2563EB"
              />
              <SkillList
                skills={skills.technical}
                chip
              />
            </section>
          )}

          {skills.soft.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Soft Skills"
                color="#2563EB"
              />
              <SkillList
                skills={skills.soft}
                chip
              />
            </section>
          )}

          {validEducation.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Education"
                color="#2563EB"
              />

              {validEducation.map((item, index) => (
                <EducationBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validCertifications.length > 0 && (
            <section>
              <SectionTitle
                title="Certifications"
                color="#2563EB"
              />

              {validCertifications.map(
                (item, index) => (
                  <CertificationBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   EXECUTIVE
========================================================= */

function ExecutiveTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white text-[#1E293B]"
      style={{
        fontFamily:
          'Georgia, "Times New Roman", serif',
      }}
    >
      <header className="px-[48px] pb-[24px] pt-[40px]">
        <h1 className="text-[31px] font-bold tracking-[-0.03em] text-[#111827]">
          {personal_info.full_name || "Your Name"}
        </h1>

        <div className="mt-2 flex items-center justify-between border-b-2 border-[#1E293B] pb-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#475569]">
            {personal_info.professional_title ||
              "Professional Title"}
          </p>

          <div className="text-right text-[8.8px] leading-[1.7] text-slate-500">
            {personal_info.email && (
              <div>{personal_info.email}</div>
            )}
            {personal_info.phone && (
              <div>{personal_info.phone}</div>
            )}
            {personal_info.location && (
              <div>{personal_info.location}</div>
            )}
          </div>
        </div>
      </header>

      <main className="px-[48px] pb-[30px]">
        {hasText(professional_summary) && (
          <section className="mb-6">
            <SectionTitle
              title="Executive Profile"
              color="#334155"
            />

            <p className="text-[10.5px] leading-[1.65] text-slate-600">
              {professional_summary}
            </p>
          </section>
        )}

        {validExperience.length > 0 && (
          <section className="mb-6">
            <SectionTitle
              title="Professional Experience"
              color="#334155"
            />

            {validExperience.map((item, index) => (
              <ExperienceBlock
                key={index}
                item={item}
              />
            ))}
          </section>
        )}

        <div className="grid grid-cols-[1.5fr_1fr] gap-[32px]">
          <div>
            {validProjects.length > 0 && (
              <section className="mb-6">
                <SectionTitle
                  title="Selected Projects"
                  color="#334155"
                />

                {validProjects.map(
                  (item, index) => (
                    <ProjectBlock
                      key={index}
                      item={item}
                      style="minimal"
                    />
                  )
                )}
              </section>
            )}

            {validInternships.length > 0 && (
              <section>
                <SectionTitle
                  title="Internships"
                  color="#334155"
                />

                {validInternships.map(
                  (item, index) => (
                    <InternshipBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}
          </div>

          <aside>
            {validEducation.length > 0 && (
              <section className="mb-6">
                <SectionTitle
                  title="Education"
                  color="#334155"
                />

                {validEducation.map(
                  (item, index) => (
                    <EducationBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}

            {validCertifications.length > 0 && (
              <section>
                <SectionTitle
                  title="Certifications"
                  color="#334155"
                />

                {validCertifications.map(
                  (item, index) => (
                    <CertificationBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   MINIMAL
========================================================= */

function MinimalTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white text-[#1F2937]"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header className="px-[54px] pb-[22px] pt-[44px]">
        <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#111827]">
          {personal_info.full_name || "Your Name"}
        </h1>

        <p className="mt-2 text-[12px] font-medium text-slate-500">
          {personal_info.professional_title ||
            "Professional Title"}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-slate-200 pt-3 text-[9px] text-slate-500">
          {personal_info.email && (
            <span>{personal_info.email}</span>
          )}

          {personal_info.phone && (
            <span>{personal_info.phone}</span>
          )}

          {personal_info.location && (
            <span>{personal_info.location}</span>
          )}

          {personal_info.linkedin && (
            <span>{cleanUrl(personal_info.linkedin)}</span>
          )}

          {personal_info.github && (
            <span>{cleanUrl(personal_info.github)}</span>
          )}
        </div>
      </header>

      <main className="grid grid-cols-[1fr_220px] gap-[36px] px-[54px] py-[25px]">
        <div>
          {hasText(professional_summary) && (
            <section className="mb-7">
              <SectionTitle
                title="Profile"
                line={false}
              />

              <p className="text-[10.5px] leading-[1.6] text-slate-600">
                {professional_summary}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Experience"
                line={false}
              />

              {validExperience.map((item, index) => (
                <ExperienceBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Projects"
                line={false}
              />

              {validProjects.map((item, index) => (
                <ProjectBlock
                  key={index}
                  item={item}
                  style="minimal"
                />
              ))}
            </section>
          )}

          {validInternships.length > 0 && (
            <section>
              <SectionTitle
                title="Internships"
                line={false}
              />

              {validInternships.map(
                (item, index) => (
                  <InternshipBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </div>

        <aside className="border-l border-slate-200 pl-[25px]">
          {skills.technical.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Skills"
                line={false}
              />

              <SkillList
                skills={skills.technical}
              />
            </section>
          )}

          {skills.soft.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Soft Skills"
                line={false}
              />

              <SkillList
                skills={skills.soft}
              />
            </section>
          )}

          {validEducation.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Education"
                line={false}
              />

              {validEducation.map((item, index) => (
                <EducationBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validCertifications.length > 0 && (
            <section>
              <SectionTitle
                title="Certifications"
                line={false}
              />

              {validCertifications.map(
                (item, index) => (
                  <CertificationBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}

/* =========================================================
   CREATIVE BLUE
========================================================= */

function CreativeBlueTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header className="relative overflow-hidden bg-[#EFF6FF] px-[42px] pb-[25px] pt-[38px]">
        <div className="absolute right-[-35px] top-[-55px] h-[180px] w-[180px] rounded-full bg-[#DBEAFE]" />

        <div className="relative">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">
            Professional Resume
          </p>

          <h1 className="text-[31px] font-extrabold tracking-[-0.045em] text-[#111827]">
            {personal_info.full_name || "Your Name"}
          </h1>

          <p className="mt-2 text-[13px] font-semibold text-[#2563EB]">
            {personal_info.professional_title ||
              "Professional Title"}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-slate-600">
            {personal_info.email && (
              <span>{personal_info.email}</span>
            )}
            {personal_info.phone && (
              <span>{personal_info.phone}</span>
            )}
            {personal_info.location && (
              <span>{personal_info.location}</span>
            )}
            {personal_info.linkedin && (
              <span>{cleanUrl(personal_info.linkedin)}</span>
            )}
            {personal_info.github && (
              <span>{cleanUrl(personal_info.github)}</span>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[230px_1fr]">
        <aside className="min-h-[905px] bg-[#F8FAFC] px-[23px] py-[27px]">
          {skills.technical.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Technical Skills"
                color="#2563EB"
              />
              <SkillList
                skills={skills.technical}
                chip
              />
            </section>
          )}

          {skills.soft.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Soft Skills"
                color="#2563EB"
              />
              <SkillList
                skills={skills.soft}
                chip
              />
            </section>
          )}

          {validEducation.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Education"
                color="#2563EB"
              />
              {validEducation.map((item, index) => (
                <EducationBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validCertifications.length > 0 && (
            <section>
              <SectionTitle
                title="Certifications"
                color="#2563EB"
              />
              {validCertifications.map(
                (item, index) => (
                  <CertificationBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </aside>

        <main className="px-[29px] py-[27px]">
          {hasText(professional_summary) && (
            <section className="mb-6">
              <SectionTitle
                title="About Me"
                color="#2563EB"
              />
              <p className="text-[10.5px] leading-[1.55] text-slate-600">
                {professional_summary}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                title="Experience"
                color="#2563EB"
              />
              {validExperience.map((item, index) => (
                <ExperienceBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                title="Projects"
                color="#2563EB"
              />
              {validProjects.map((item, index) => (
                <ProjectBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validInternships.length > 0 && (
            <section>
              <SectionTitle
                title="Internships"
                color="#2563EB"
              />
              {validInternships.map(
                (item, index) => (
                  <InternshipBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   TECH
========================================================= */

function TechTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white text-[#172033]"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header className="border-b border-slate-300 bg-[#F8FAFC] px-[40px] py-[30px]">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[9px] font-semibold tracking-[0.15em] text-[#2563EB]">
              SOFTWARE / TECHNOLOGY
            </p>

            <h1 className="mt-2 text-[29px] font-extrabold tracking-[-0.04em]">
              {personal_info.full_name || "Your Name"}
            </h1>

            <p className="mt-1.5 text-[12px] font-medium text-slate-600">
              {personal_info.professional_title ||
                "Software Developer"}
            </p>
          </div>

          <div className="text-right font-mono text-[8.5px] leading-[1.8] text-slate-500">
            {personal_info.email && (
              <div>{personal_info.email}</div>
            )}
            {personal_info.phone && (
              <div>{personal_info.phone}</div>
            )}
            {personal_info.location && (
              <div>{personal_info.location}</div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[8.5px] text-[#2563EB]">
          {personal_info.github && (
            <span>{cleanUrl(personal_info.github)}</span>
          )}
          {personal_info.linkedin && (
            <span>{cleanUrl(personal_info.linkedin)}</span>
          )}
          {personal_info.portfolio && (
            <span>{cleanUrl(personal_info.portfolio)}</span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_232px]">
        <main className="px-[31px] py-[27px]">
          {hasText(professional_summary) && (
            <section className="mb-6">
              <SectionTitle
                title="Summary"
                color="#2563EB"
              />

              <p className="text-[10.5px] leading-[1.55] text-slate-600">
                {professional_summary}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                title="Experience"
                color="#2563EB"
              />

              {validExperience.map((item, index) => (
                <ExperienceBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-6">
              <SectionTitle
                title="Projects"
                color="#2563EB"
              />

              {validProjects.map((item, index) => (
                <ProjectBlock
                  key={index}
                  item={item}
                  style="tech"
                />
              ))}
            </section>
          )}

          {validInternships.length > 0 && (
            <section>
              <SectionTitle
                title="Internships"
                color="#2563EB"
              />

              {validInternships.map(
                (item, index) => (
                  <InternshipBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </main>

        <aside className="min-h-[905px] border-l border-slate-200 bg-[#F8FAFC] px-[22px] py-[27px]">
          {skills.technical.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Technical Stack"
                color="#2563EB"
              />

              <SkillList
                skills={skills.technical}
              />
            </section>
          )}

          {skills.soft.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Core Skills"
                color="#2563EB"
              />

              <SkillList
                skills={skills.soft}
              />
            </section>
          )}

          {skills.other.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Other"
                color="#2563EB"
              />

              <SkillList
                skills={skills.other}
              />
            </section>
          )}

          {validEducation.length > 0 && (
            <section className="mb-7">
              <SectionTitle
                title="Education"
                color="#2563EB"
              />

              {validEducation.map((item, index) => (
                <EducationBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validCertifications.length > 0 && (
            <section>
              <SectionTitle
                title="Certifications"
                color="#2563EB"
              />

              {validCertifications.map(
                (item, index) => (
                  <CertificationBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL SPLIT
========================================================= */

function ProfessionalSplitTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div className="grid grid-cols-[205px_1fr]">
        <aside className="min-h-[1123px] bg-[#172033] px-[22px] py-[35px] text-white">
          <div className="border-b border-white/15 pb-6">
            <h1 className="text-[23px] font-extrabold leading-[1.05] tracking-[-0.035em]">
              {personal_info.full_name || "Your Name"}
            </h1>

            <p className="mt-3 text-[10px] font-semibold leading-[1.4] text-blue-300">
              {personal_info.professional_title ||
                "Professional Title"}
            </p>
          </div>

          <div className="border-b border-white/15 py-5 text-[8.5px] leading-[1.8] text-slate-300">
            {personal_info.email && (
              <div>{personal_info.email}</div>
            )}

            {personal_info.phone && (
              <div>{personal_info.phone}</div>
            )}

            {personal_info.location && (
              <div>{personal_info.location}</div>
            )}

            {personal_info.linkedin && (
              <div className="mt-1 break-all text-blue-300">
                {cleanUrl(personal_info.linkedin)}
              </div>
            )}

            {personal_info.github && (
              <div className="break-all text-blue-300">
                {cleanUrl(personal_info.github)}
              </div>
            )}
          </div>

          {skills.technical.length > 0 && (
            <section className="border-b border-white/15 py-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Skills
              </p>

              <div className="space-y-2">
                {skills.technical.map(
                  (skill, index) => (
                    <div
                      key={`${skill}-${index}`}
                      className="text-[9px] text-slate-300"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {skills.soft.length > 0 && (
            <section className="py-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Soft Skills
              </p>

              <div className="space-y-2">
                {skills.soft.map((skill, index) => (
                  <div
                    key={`${skill}-${index}`}
                    className="text-[9px] text-slate-300"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        <main className="px-[32px] py-[35px]">
          {hasText(professional_summary) && (
            <section className="mb-7">
              <SectionTitle
                title="Professional Summary"
              />

              <p className="text-[10.5px] leading-[1.6] text-slate-600">
                {professional_summary}
              </p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className="mb-7">
              <SectionTitle title="Experience" />

              {validExperience.map((item, index) => (
                <ExperienceBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validProjects.length > 0 && (
            <section className="mb-7">
              <SectionTitle title="Projects" />

              {validProjects.map((item, index) => (
                <ProjectBlock
                  key={index}
                  item={item}
                />
              ))}
            </section>
          )}

          {validInternships.length > 0 && (
            <section className="mb-7">
              <SectionTitle title="Internships" />

              {validInternships.map(
                (item, index) => (
                  <InternshipBlock
                    key={index}
                    item={item}
                  />
                )
              )}
            </section>
          )}

          <div className="grid grid-cols-2 gap-8">
            {validEducation.length > 0 && (
              <section>
                <SectionTitle title="Education" />

                {validEducation.map(
                  (item, index) => (
                    <EducationBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}

            {validCertifications.length > 0 && (
              <section>
                <SectionTitle title="Certifications" />

                {validCertifications.map(
                  (item, index) => (
                    <CertificationBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   MODERN HEADER
========================================================= */

function ModernHeaderTemplate({
  resumeData,
}: {
  resumeData: ResumeData;
}) {
  const {
    personal_info,
    professional_summary,
    skills,
  } = resumeData;

  const {
    validExperience,
    validInternships,
    validEducation,
    validProjects,
    validCertifications,
  } = useResumeSections(resumeData);

  return (
    <div
      className="h-[1123px] w-[794px] overflow-hidden bg-white"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header className="border-b-4 border-[#2563EB] px-[42px] pb-[23px] pt-[35px]">
        <div className="flex items-end justify-between gap-7">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.045em] text-[#111827]">
              {personal_info.full_name || "Your Name"}
            </h1>

            <p className="mt-2 text-[12.5px] font-semibold text-[#2563EB]">
              {personal_info.professional_title ||
                "Professional Title"}
            </p>
          </div>

          <div className="text-right text-[8.5px] leading-[1.8] text-slate-500">
            {personal_info.email && (
              <div>{personal_info.email}</div>
            )}
            {personal_info.phone && (
              <div>{personal_info.phone}</div>
            )}
            {personal_info.location && (
              <div>{personal_info.location}</div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[8.5px] text-[#2563EB]">
          {personal_info.linkedin && (
            <span>{cleanUrl(personal_info.linkedin)}</span>
          )}

          {personal_info.github && (
            <span>{cleanUrl(personal_info.github)}</span>
          )}

          {personal_info.portfolio && (
            <span>{cleanUrl(personal_info.portfolio)}</span>
          )}
        </div>
      </header>

      <main className="px-[42px] py-[26px]">
        {hasText(professional_summary) && (
          <section className="mb-6">
            <SectionTitle title="Professional Summary" />

            <p className="max-w-[690px] text-[10.5px] leading-[1.55] text-slate-600">
              {professional_summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-[1fr_220px] gap-[30px]">
          <div>
            {validExperience.length > 0 && (
              <section className="mb-6">
                <SectionTitle title="Experience" />

                {validExperience.map((item, index) => (
                  <ExperienceBlock
                    key={index}
                    item={item}
                  />
                ))}
              </section>
            )}

            {validProjects.length > 0 && (
              <section className="mb-6">
                <SectionTitle title="Projects" />

                {validProjects.map(
                  (item, index) => (
                    <ProjectBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}

            {validInternships.length > 0 && (
              <section>
                <SectionTitle title="Internships" />

                {validInternships.map(
                  (item, index) => (
                    <InternshipBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}
          </div>

          <aside className="border-l border-slate-200 pl-[22px]">
            {skills.technical.length > 0 && (
              <section className="mb-7">
                <SectionTitle title="Skills" />

                <SkillList
                  skills={skills.technical}
                  chip
                />
              </section>
            )}

            {skills.soft.length > 0 && (
              <section className="mb-7">
                <SectionTitle title="Soft Skills" />

                <SkillList
                  skills={skills.soft}
                  chip
                />
              </section>
            )}

            {validEducation.length > 0 && (
              <section className="mb-7">
                <SectionTitle title="Education" />

                {validEducation.map(
                  (item, index) => (
                    <EducationBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}

            {validCertifications.length > 0 && (
              <section>
                <SectionTitle title="Certifications" />

                {validCertifications.map(
                  (item, index) => (
                    <CertificationBlock
                      key={index}
                      item={item}
                    />
                  )
                )}
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   TEMPLATE SWITCHER
========================================================= */

function TemplateRenderer({
  template,
  resumeData,
}: {
  template: string;
  resumeData: ResumeData;
}) {
  const selected = normalizeTemplate(template);

  switch (selected) {
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

/* =========================================================
   MAIN PREVIEW
========================================================= */

function ResumePreview({
  resumeData,
  template,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateScale = () => {
      const availableWidth = container.clientWidth - 24;

      if (!availableWidth) return;

      setScale(
        Math.min(
          availableWidth / PAGE_WIDTH,
          1
        )
      );
    };

    updateScale();

    const observer = new ResizeObserver(
      updateScale
    );

    observer.observe(container);

    window.addEventListener(
      "resize",
      updateScale
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateScale
      );
    };
  }, []);

  const scaledWidth = PAGE_WIDTH * scale;
  const scaledHeight = PAGE_HEIGHT * scale;

  return (
    <div className="w-full">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Resume Preview
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Your resume updates as you edit the
          information.
        </p>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-3 shadow-[0_12px_35px_rgba(15,23,42,0.08)]"
      >
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
        >
          <div
            id="resume-preview-document"
            data-template={template}
            className="resume-a4-page absolute left-0 top-0 origin-top-left"
            style={{
              width: `${PAGE_WIDTH}px`,
              height: `${PAGE_HEIGHT}px`,
              transform: `scale(${scale})`,
            }}
          >
            <TemplateRenderer
              template={template}
              resumeData={resumeData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;