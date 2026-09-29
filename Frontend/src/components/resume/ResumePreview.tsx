import type { ResumeData } from "../../types/resume";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const formatDate = (date?: string) => {
  if (!date) {
    return "";
  }

  const [year, month] = date.split("-");

  if (!month) {
    return year;
  }

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

function ResumePreview({
  resumeData,
}: ResumePreviewProps) {
  const {
    personal_info,
    professional_summary,
    skills,
    experience,
    internships,
    education,
    projects,
    certifications,
  } = resumeData;

  const hasTechnicalSkills =
    skills.technical.length > 0;

  const hasSoftSkills =
    skills.soft.length > 0;

  const hasOtherSkills =
    skills.other.length > 0;

  const hasSkills =
    hasTechnicalSkills ||
    hasSoftSkills ||
    hasOtherSkills;

  return (
    <div className="w-full">

      {/* PREVIEW HEADING */}
      <div className="mb-3 flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Resume Preview
          </h2>

          <p className="text-xs text-slate-500">
            Your resume updates as you edit the information.
          </p>
        </div>

      </div>

      {/* RESUME PAPER */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-[0_12px_35px_rgba(15,23,42,0.10)]">

        <div className="mx-auto min-h-[900px] w-full bg-white p-8 text-slate-800">

          {/* ================= HEADER ================= */}

          <div className="border-b border-slate-300 pb-4">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {personal_info.full_name ||
                "Your Name"}
            </h1>

            <p className="mt-1 text-sm font-medium text-blue-600">
              {personal_info.professional_title ||
                "Professional Title"}
            </p>

            {/* CONTACT INFORMATION */}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">

              {personal_info.email && (
                <span>
                  {personal_info.email}
                </span>
              )}

              {personal_info.phone && (
                <span>
                  {personal_info.phone}
                </span>
              )}

              {personal_info.location && (
                <span>
                  {personal_info.location}
                </span>
              )}

            </div>

            {/* LINKS */}

            {(personal_info.linkedin ||
              personal_info.github ||
              personal_info.portfolio) && (

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">

                {personal_info.linkedin && (
                  <span>
                    {personal_info.linkedin}
                  </span>
                )}

                {personal_info.github && (
                  <span>
                    {personal_info.github}
                  </span>
                )}

                {personal_info.portfolio && (
                  <span>
                    {personal_info.portfolio}
                  </span>
                )}

              </div>
            )}

          </div>

          {/* ================= SUMMARY ================= */}

          {professional_summary && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Professional Summary
              </h3>

              <p className="mt-2 whitespace-pre-line text-[11px] leading-5 text-slate-600">
                {professional_summary}
              </p>

            </section>
          )}

          {/* ================= SKILLS ================= */}

          {hasSkills && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Skills
              </h3>

              <div className="mt-3 space-y-2">

                {hasTechnicalSkills && (
                  <div>

                    <p className="text-[10px] font-semibold text-slate-800">
                      Technical Skills
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-slate-600">
                      {skills.technical.join(" • ")}
                    </p>

                  </div>
                )}

                {hasSoftSkills && (
                  <div>

                    <p className="text-[10px] font-semibold text-slate-800">
                      Soft Skills
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-slate-600">
                      {skills.soft.join(" • ")}
                    </p>

                  </div>
                )}

                {hasOtherSkills && (
                  <div>

                    <p className="text-[10px] font-semibold text-slate-800">
                      Other Skills
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-slate-600">
                      {skills.other.join(" • ")}
                    </p>

                  </div>
                )}

              </div>

            </section>
          )}

          {/* ================= EDUCATION ================= */}

          {education.length > 0 && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Education
              </h3>

              <div className="mt-3 space-y-3">

                {education.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4"
                  >

                    <div>

                      <h4 className="text-[11px] font-semibold text-slate-900">
                        {item.degree}
                      </h4>

                      <p className="text-[10px] text-slate-600">
                        {item.institution}

                        {item.location
                          ? ` • ${item.location}`
                          : ""}
                      </p>

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-[9px] leading-4 text-slate-500">
                          {item.description}
                        </p>
                      )}

                    </div>

                    <span className="whitespace-nowrap text-[9px] text-slate-500">
                      {formatDate(item.start_date)}
                      {" - "}
                      {formatDate(item.end_date)}
                    </span>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ================= PROJECTS ================= */}

          {projects.length > 0 && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Projects
              </h3>

              <div className="mt-3 space-y-3">

                {projects.map((project, index) => (
                  <div key={index}>

                    <div className="flex items-start justify-between gap-3">

                      <h4 className="text-[11px] font-semibold text-slate-900">
                        {project.name}
                      </h4>

                      {project.project_url && (
                        <span className="max-w-[150px] truncate text-[9px] text-blue-600">
                          {project.project_url}
                        </span>
                      )}

                    </div>

                    {project.description && (
                      <p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-slate-600">
                        {project.description}
                      </p>
                    )}

                    {project.technologies.length > 0 && (
                      <p className="mt-1 text-[9px] text-slate-500">
                        {project.technologies.join(" • ")}
                      </p>
                    )}

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ================= CERTIFICATIONS ================= */}

          {certifications.length > 0 && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Certifications
              </h3>

              <div className="mt-3 space-y-3">

                {certifications.map(
                  (certification, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4"
                    >

                      <div>

                        <h4 className="text-[11px] font-semibold text-slate-900">
                          {certification.name}
                        </h4>

                        <p className="text-[10px] text-slate-600">
                          {
                            certification.issuing_organization
                          }
                        </p>

                        {certification.credential_id && (
                          <p className="mt-0.5 text-[9px] text-slate-500">
                            Credential ID:{" "}
                            {certification.credential_id}
                          </p>
                        )}

                      </div>

                      <span className="whitespace-nowrap text-[9px] text-slate-500">
                        {formatDate(
                          certification.issue_date
                        )}
                      </span>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* ================= INTERNSHIPS ================= */}

          {internships.length > 0 && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Internships
              </h3>

              <div className="mt-3 space-y-4">

                {internships.map(
                  (internship, index) => (
                    <div key={index}>

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h4 className="text-[11px] font-semibold text-slate-900">
                            {internship.internship_title}
                          </h4>

                          <p className="text-[10px] font-medium text-blue-600">
                            {internship.company}

                            {internship.location
                              ? ` • ${internship.location}`
                              : ""}
                          </p>

                        </div>

                        <span className="whitespace-nowrap text-[9px] text-slate-500">
                          {formatDate(
                            internship.start_date
                          )}{" "}
                          -{" "}
                          {internship.currently_working
                            ? "Present"
                            : formatDate(
                                internship.end_date
                              )}
                        </span>

                      </div>

                      {internship.description && (
                        <p className="mt-1.5 whitespace-pre-line text-[10px] leading-4 text-slate-600">
                          {internship.description}
                        </p>
                      )}

                      {internship.technologies.length > 0 && (
                        <p className="mt-1 text-[9px] text-slate-500">
                          {internship.technologies.join(
                            " • "
                          )}
                        </p>
                      )}

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* ================= EXPERIENCE ================= */}

          {experience.length > 0 && (
            <section className="mt-5">

              <h3 className="border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-900">
                Experience
              </h3>

              <div className="mt-3 space-y-4">

                {experience.map((item, index) => (
                  <div key={index}>

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h4 className="text-[12px] font-semibold text-slate-900">
                          {item.job_title}
                        </h4>

                        <p className="text-[10px] font-medium text-blue-600">
                          {item.company}

                          {item.location
                            ? ` • ${item.location}`
                            : ""}
                        </p>

                      </div>

                      <span className="whitespace-nowrap text-[9px] text-slate-500">
                        {formatDate(item.start_date)}
                        {" - "}
                        {item.currently_working
                          ? "Present"
                          : formatDate(item.end_date)}
                      </span>

                    </div>

                    {item.description && (
                      <p className="mt-1.5 whitespace-pre-line text-[10px] leading-4 text-slate-600">
                        {item.description}
                      </p>
                    )}

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ================= EMPTY STATE ================= */}

          {!personal_info.full_name &&
            !professional_summary &&
            !hasSkills &&
            education.length === 0 &&
            projects.length === 0 &&
            certifications.length === 0 &&
            internships.length === 0 &&
            experience.length === 0 && (

              <div className="flex min-h-[500px] items-center justify-center text-center">

                <div>

                  <p className="text-sm font-medium text-slate-400">
                    Your resume preview will appear here
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Start entering your information.
                  </p>

                </div>

              </div>
            )}

        </div>
      </div>
    </div>
  );
}

export default ResumePreview;