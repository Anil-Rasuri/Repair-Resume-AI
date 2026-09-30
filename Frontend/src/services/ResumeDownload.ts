import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
  AlignmentType,
  Document as WordDocument,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import type { ResumeData } from "../types/resume";

function safeFileName(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .replace(/\s+/g, "-");

  return cleaned || "resume";
}

function formatDate(date: string): string {
  if (!date) {
    return "";
  }

  const parts = date.split("-");

  if (parts.length === 2) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);

    if (
      !Number.isNaN(year) &&
      month >= 1 &&
      month <= 12
    ) {
      return new Date(
        year,
        month - 1
      ).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  }

  return date;
}

function addHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: {
      before: 120,
      after: 50,
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 20,
      }),
    ],
  });
}

function addText(
  text: string,
  options?: {
    bold?: boolean;
    italic?: boolean;
    size?: number;
  }
): Paragraph {
  return new Paragraph({
    spacing: {
      after: 40,
    },
    children: [
      new TextRun({
        text,
        bold: options?.bold ?? false,
        italics: options?.italic ?? false,
        size: (options?.size ?? 18) * 2,
      }),
    ],
  });
}

export async function downloadResumePdf(
  resumeElement: HTMLElement,
  resumeData: ResumeData
): Promise<void> {
  const canvas = await html2canvas(resumeElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    imageTimeout: 15000,
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const imageWidth = pageWidth;

  const imageHeight =
    (canvas.height * imageWidth) /
    canvas.width;

  const imageData = canvas.toDataURL(
    "image/png",
    1
  );

  /*
   * The resume preview is designed as an A4 page.
   * If the captured content is slightly taller than A4,
   * keep the exported PDF inside one A4 page.
   */
  const finalHeight = Math.min(
    imageHeight,
    pageHeight
  );

  pdf.addImage(
    imageData,
    "PNG",
    0,
    0,
    imageWidth,
    finalHeight,
    undefined,
    "FAST"
  );

  const fileName = safeFileName(
    resumeData.personal_info.full_name ||
      "resume"
  );

  pdf.save(`${fileName}-Resume.pdf`);
}

export async function downloadResumeWord(
  resumeData: ResumeData
): Promise<void> {
  const personal = resumeData.personal_info;

  const children: Paragraph[] = [];

  /*
   * NAME
   */
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 40,
      },
      children: [
        new TextRun({
          text:
            personal.full_name ||
            "Your Name",
          bold: true,
          size: 28,
        }),
      ],
    })
  );

  /*
   * PROFESSIONAL TITLE
   */
  if (personal.professional_title?.trim()) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 60,
        },
        children: [
          new TextRun({
            text:
              personal.professional_title.trim(),
            size: 20,
          }),
        ],
      })
    );
  }

  /*
   * CONTACT INFORMATION
   */
  const contactParts: string[] = [];

  if (personal.email?.trim()) {
    contactParts.push(
      personal.email.trim()
    );
  }

  if (personal.phone?.trim()) {
    contactParts.push(
      personal.phone.trim()
    );
  }

  if (personal.location?.trim()) {
    contactParts.push(
      personal.location.trim()
    );
  }

  if (personal.linkedin?.trim()) {
    contactParts.push(
      personal.linkedin.trim()
    );
  }

  if (personal.github?.trim()) {
    contactParts.push(
      personal.github.trim()
    );
  }

  if (personal.portfolio?.trim()) {
    contactParts.push(
      personal.portfolio.trim()
    );
  }

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 120,
        },
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 16,
          }),
        ],
      })
    );
  }

  /*
   * PROFESSIONAL SUMMARY
   */
  if (
    resumeData.professional_summary?.trim()
  ) {
    children.push(
      addHeading(
        "PROFESSIONAL SUMMARY"
      ),
      addText(
        resumeData.professional_summary.trim(),
        {
          size: 8.5,
        }
      )
    );
  }

  /*
   * SKILLS
   */
  const technicalSkills =
    resumeData.skills.technical.filter(
      Boolean
    );

  const softSkills =
    resumeData.skills.soft.filter(Boolean);

  const otherSkills =
    resumeData.skills.other.filter(Boolean);

  if (
    technicalSkills.length > 0 ||
    softSkills.length > 0 ||
    otherSkills.length > 0
  ) {
    children.push(addHeading("SKILLS"));

    if (technicalSkills.length > 0) {
      children.push(
        addText(
          `Technical: ${technicalSkills.join(
            ", "
          )}`,
          {
            size: 8.5,
          }
        )
      );
    }

    if (softSkills.length > 0) {
      children.push(
        addText(
          `Soft Skills: ${softSkills.join(
            ", "
          )}`,
          {
            size: 8.5,
          }
        )
      );
    }

    if (otherSkills.length > 0) {
      children.push(
        addText(
          `Other: ${otherSkills.join(
            ", "
          )}`,
          {
            size: 8.5,
          }
        )
      );
    }
  }

  /*
   * EDUCATION
   */
  if (resumeData.education.length > 0) {
    children.push(addHeading("EDUCATION"));

    resumeData.education.forEach(
      (education) => {
        if (education.degree?.trim()) {
          children.push(
            addText(
              education.degree.trim(),
              {
                bold: true,
                size: 9,
              }
            )
          );
        }

        /*
         * BRANCH
         */
        if (education.branch?.trim()) {
          children.push(
            addText(
              education.branch.trim(),
              {
                size: 8.5,
              }
            )
          );
        }

        /*
         * INSTITUTION + LOCATION
         */
        if (
          education.institution?.trim()
        ) {
          children.push(
            addText(
              `${education.institution.trim()}${
                education.location?.trim()
                  ? `, ${education.location.trim()}`
                  : ""
              }`,
              {
                size: 8.5,
              }
            )
          );
        }

        const startDate = formatDate(
          education.start_date
        );

        const endDate = formatDate(
          education.end_date
        );

        if (startDate || endDate) {
          children.push(
            addText(
              `${startDate}${
                startDate && endDate
                  ? " – "
                  : ""
              }${endDate}`,
              {
                size: 8,
                italic: true,
              }
            )
          );
        }

        if (
          education.description?.trim()
        ) {
          children.push(
            addText(
              education.description.trim(),
              {
                size: 8,
              }
            )
          );
        }
      }
    );
  }

  /*
   * PROJECTS
   */
  if (resumeData.projects.length > 0) {
    children.push(addHeading("PROJECTS"));

    resumeData.projects.forEach(
      (project) => {
        if (project.name?.trim()) {
          children.push(
            addText(
              project.name.trim(),
              {
                bold: true,
                size: 9,
              }
            )
          );
        }

        if (
          project.technologies.length > 0
        ) {
          children.push(
            addText(
              `Technologies: ${project.technologies.join(
                ", "
              )}`,
              {
                size: 8,
              }
            )
          );
        }

        if (
          project.description?.trim()
        ) {
          children.push(
            addText(
              project.description.trim(),
              {
                size: 8,
              }
            )
          );
        }

        if (
          project.project_url?.trim()
        ) {
          children.push(
            addText(
              `Project URL: ${project.project_url.trim()}`,
              {
                size: 8,
              }
            )
          );
        }
      }
    );
  }

  /*
   * CERTIFICATIONS
   */
  if (
    resumeData.certifications.length > 0
  ) {
    children.push(
      addHeading("CERTIFICATIONS")
    );

    resumeData.certifications.forEach(
      (certification) => {
        if (certification.name?.trim()) {
          children.push(
            addText(
              certification.name.trim(),
              {
                bold: true,
                size: 9,
              }
            )
          );
        }

        const organization =
          certification.issuing_organization?.trim();

        const issueDate = formatDate(
          certification.issue_date
        );

        if (organization || issueDate) {
          const parts: string[] = [];

          if (organization) {
            parts.push(organization);
          }

          if (issueDate) {
            parts.push(issueDate);
          }

          children.push(
            addText(
              parts.join(" • "),
              {
                size: 8,
              }
            )
          );
        }

        if (
          certification.credential_id?.trim()
        ) {
          children.push(
            addText(
              `Credential ID: ${certification.credential_id.trim()}`,
              {
                size: 8,
              }
            )
          );
        }

        if (
          certification.credential_url?.trim()
        ) {
          children.push(
            addText(
              `Credential URL: ${certification.credential_url.trim()}`,
              {
                size: 8,
              }
            )
          );
        }
      }
    );
  }

  /*
   * INTERNSHIPS
   */
  if (resumeData.internships.length > 0) {
    children.push(
      addHeading("INTERNSHIPS")
    );

    resumeData.internships.forEach(
      (internship) => {
        if (
          internship.internship_title?.trim()
        ) {
          children.push(
            addText(
              internship.internship_title.trim(),
              {
                bold: true,
                size: 9,
              }
            )
          );
        }

        if (internship.company?.trim()) {
          children.push(
            addText(
              `${internship.company.trim()}${
                internship.location?.trim()
                  ? `, ${internship.location.trim()}`
                  : ""
              }`,
              {
                size: 8.5,
              }
            )
          );
        }

        const startDate = formatDate(
          internship.start_date
        );

        const endDate =
          internship.currently_working
            ? "Present"
            : formatDate(
                internship.end_date ?? ""
              );

        if (startDate || endDate) {
          children.push(
            addText(
              `${startDate}${
                startDate && endDate
                  ? " – "
                  : ""
              }${endDate}`,
              {
                size: 8,
                italic: true,
              }
            )
          );
        }

        if (
          internship.technologies.length > 0
        ) {
          children.push(
            addText(
              `Technologies: ${internship.technologies.join(
                ", "
              )}`,
              {
                size: 8,
              }
            )
          );
        }

        if (
          internship.description?.trim()
        ) {
          children.push(
            addText(
              internship.description.trim(),
              {
                size: 8,
              }
            )
          );
        }
      }
    );
  }

  /*
   * EXPERIENCE
   */
  if (resumeData.experience.length > 0) {
    children.push(
      addHeading("EXPERIENCE")
    );

    resumeData.experience.forEach(
      (experience) => {
        if (
          experience.job_title?.trim()
        ) {
          children.push(
            addText(
              experience.job_title.trim(),
              {
                bold: true,
                size: 9,
              }
            )
          );
        }

        if (experience.company?.trim()) {
          children.push(
            addText(
              `${experience.company.trim()}${
                experience.location?.trim()
                  ? `, ${experience.location.trim()}`
                  : ""
              }`,
              {
                size: 8.5,
              }
            )
          );
        }

        const startDate = formatDate(
          experience.start_date
        );

        const endDate =
          experience.currently_working
            ? "Present"
            : formatDate(
                experience.end_date ?? ""
              );

        if (startDate || endDate) {
          children.push(
            addText(
              `${startDate}${
                startDate && endDate
                  ? " – "
                  : ""
              }${endDate}`,
              {
                size: 8,
                italic: true,
              }
            )
          );
        }

        if (
          experience.description?.trim()
        ) {
          children.push(
            addText(
              experience.description.trim(),
              {
                size: 8,
              }
            )
          );
        }
      }
    );
  }

  /*
   * WORD DOCUMENT
   */
  const wordDocument = new WordDocument({
    sections: [
      {
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(
    wordDocument
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    window.document.createElement("a");

  anchor.href = url;

  anchor.download = `${safeFileName(
    personal.full_name || "resume"
  )}-Resume.docx`;

  window.document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}