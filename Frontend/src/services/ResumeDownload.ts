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
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
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

/*
 * Convert a canvas to a JPEG Blob.
 *
 * Using a Blob avoids the PNG-signature issue that can
 * happen when passing canvas.toDataURL() directly to jsPDF.
 */
function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality = 0.96
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              "Could not create the PDF image."
            )
          );
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

/*
 * Wait until the browser has finished rendering the
 * resume before taking the screenshot.
 */
async function waitForResumeRender(): Promise<void> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/*
 * Find the actual resume A4 page.
 *
 * ResumePreview contains:
 *
 * #resume-preview-document
 *      └── .resume-a4-page
 *
 * The surrounding preview card must NOT be captured.
 */
function getResumePage(
  resumeElement: HTMLElement
): HTMLElement {
  if (
    resumeElement.matches(
      ".resume-a4-page"
    )
  ) {
    return resumeElement;
  }

  const page =
    resumeElement.querySelector(
      ".resume-a4-page"
    );

  if (!(page instanceof HTMLElement)) {
    throw new Error(
      "Resume preview page could not be found."
    );
  }

  return page;
}

/*
 * Find the visible content bounds inside the rendered
 * resume image.
 *
 * This removes large empty areas caused by the browser
 * preview while keeping the actual resume design.
 */
function getContentBounds(
  canvas: HTMLCanvasElement
): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!ctx) {
    return {
      left: 0,
      top: 0,
      right: canvas.width,
      bottom: canvas.height,
    };
  }

  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const data = imageData.data;

  let left = canvas.width;
  let top = canvas.height;
  let right = 0;
  let bottom = 0;

  /*
   * Ignore pixels that are effectively white.
   *
   * A small tolerance is used because anti-aliasing
   * can create pixels that are very close to white.
   */
  const whiteThreshold = 247;

  /*
   * Scan the canvas.
   *
   * Step 2 keeps the operation reasonably fast on
   * high-resolution screenshots.
   */
  for (
    let y = 0;
    y < canvas.height;
    y += 2
  ) {
    for (
      let x = 0;
      x < canvas.width;
      x += 2
    ) {
      const index =
        (y * canvas.width + x) * 4;

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];

      if (
        alpha > 10 &&
        (
          red < whiteThreshold ||
          green < whiteThreshold ||
          blue < whiteThreshold
        )
      ) {
        if (x < left) {
          left = x;
        }

        if (x > right) {
          right = x;
        }

        if (y < top) {
          top = y;
        }

        if (y > bottom) {
          bottom = y;
        }
      }
    }
  }

  /*
   * If the page is completely white, use the entire
   * resume page instead of returning invalid bounds.
   */
  if (
    left >= canvas.width ||
    top >= canvas.height ||
    right <= 0 ||
    bottom <= 0
  ) {
    return {
      left: 0,
      top: 0,
      right: canvas.width,
      bottom: canvas.height,
    };
  }

  /*
   * Convert the scanned bounds back to a safe rectangle.
   */
  return {
    left: Math.max(0, left - 4),
    top: Math.max(0, top - 4),
    right: Math.min(
      canvas.width - 1,
      right + 4
    ),
    bottom: Math.min(
      canvas.height - 1,
      bottom + 4
    ),
  };
}

/*
 * Create a cropped canvas from the detected content.
 */
function cropCanvas(
  source: HTMLCanvasElement,
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }
): HTMLCanvasElement {
  const width =
    bounds.right - bounds.left + 1;

  const height =
    bounds.bottom - bounds.top + 1;

  const cropped =
    document.createElement("canvas");

  cropped.width = width;
  cropped.height = height;

  const context =
    cropped.getContext("2d");

  if (!context) {
    return source;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(
    0,
    0,
    width,
    height
  );

  context.drawImage(
    source,
    bounds.left,
    bounds.top,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return cropped;
}

/*
 * PDF EXPORT
 *
 * Rules:
 *
 * - Exactly one A4 page.
 * - No second page.
 * - No stretching.
 * - Preserve aspect ratio.
 * - Keep a professional margin.
 * - Use the selected resume template.
 */
export async function downloadResumePdf(
  resumeElement: HTMLElement,
  resumeData: ResumeData
): Promise<void> {
  const resumePage =
    getResumePage(resumeElement);

  await waitForResumeRender();

  /*
   * Render the actual resume page at high resolution.
   */
  const canvas = await html2canvas(
    resumePage,
    {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      width: resumePage.scrollWidth,
      height: resumePage.scrollHeight,
      windowWidth:
        document.documentElement
          .clientWidth,
      windowHeight:
        document.documentElement
          .clientHeight,
    }
  );

  /*
   * Detect the actual visible resume content.
   */
  const bounds =
    getContentBounds(canvas);

  /*
   * Crop unnecessary blank space.
   *
   * This is important because we want the resume
   * itself to use the available A4 page rather than
   * shrinking because of surrounding blank space.
   */
  const contentCanvas =
    cropCanvas(canvas, bounds);

  /*
   * Convert to JPEG Blob.
   */
  const imageBlob =
    await canvasToJpegBlob(
      contentCanvas,
      0.96
    );

  const imageUrl =
    URL.createObjectURL(imageBlob);

  try {
    /*
     * Create exactly one A4 page.
     */
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    /*
     * Professional resume margins.
     *
     * 8 mm on each side gives the resume enough
     * breathing room without wasting the page.
     */
    const margin = 8;

    const availableWidth =
      pageWidth - margin * 2;

    const availableHeight =
      pageHeight - margin * 2;

    /*
     * Determine the image's natural aspect ratio.
     */
    const imageWidth =
      contentCanvas.width;

    const imageHeight =
      contentCanvas.height;

    const aspectRatio =
      imageWidth / imageHeight;

    /*
     * Fit the resume inside the available A4
     * area while preserving its aspect ratio.
     *
     * Nothing is stretched.
     */
    let pdfWidth =
      availableWidth;

    let pdfHeight =
      pdfWidth / aspectRatio;

    if (
      pdfHeight > availableHeight
    ) {
      pdfHeight =
        availableHeight;

      pdfWidth =
        pdfHeight * aspectRatio;
    }

    /*
     * Center the resume on the A4 page.
     */
    const x =
      (pageWidth - pdfWidth) / 2;

    const y =
      (pageHeight - pdfHeight) / 2;

    /*
     * Add the actual JPEG image.
     */
    pdf.addImage(
      imageUrl,
      "JPEG",
      x,
      y,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );

    /*
     * Save exactly one-page PDF.
     */
    const fileName = safeFileName(
      resumeData.personal_info
        .full_name || "resume"
    );

    pdf.save(
      `${fileName}-Resume.pdf`
    );
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

/*
 * WORD EXPORT
 */
export async function downloadResumeWord(
  resumeData: ResumeData
): Promise<void> {
  const personal =
    resumeData.personal_info;

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
  if (
    personal.professional_title?.trim()
  ) {
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
            text:
              contactParts.join(" | "),
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
    resumeData.skills.soft.filter(
      Boolean
    );

  const otherSkills =
    resumeData.skills.other.filter(
      Boolean
    );

  if (
    technicalSkills.length > 0 ||
    softSkills.length > 0 ||
    otherSkills.length > 0
  ) {
    children.push(
      addHeading("SKILLS")
    );

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
  if (
    resumeData.education.length > 0
  ) {
    children.push(
      addHeading("EDUCATION")
    );

    resumeData.education.forEach(
      (education) => {
        if (
          education.degree?.trim()
        ) {
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

        if (
          education.branch?.trim()
        ) {
          children.push(
            addText(
              education.branch.trim(),
              {
                size: 8.5,
              }
            )
          );
        }

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

        const startDate =
          formatDate(
            education.start_date
          );

        const endDate =
          formatDate(
            education.end_date
          );

        if (
          startDate ||
          endDate
        ) {
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
  if (
    resumeData.projects.length > 0
  ) {
    children.push(
      addHeading("PROJECTS")
    );

    resumeData.projects.forEach(
      (project) => {
        if (
          project.name?.trim()
        ) {
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
      addHeading(
        "CERTIFICATIONS"
      )
    );

    resumeData.certifications.forEach(
      (certification) => {
        if (
          certification.name?.trim()
        ) {
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
          certification
            .issuing_organization
            ?.trim();

        const issueDate =
          formatDate(
            certification.issue_date
          );

        if (
          organization ||
          issueDate
        ) {
          const parts: string[] = [];

          if (organization) {
            parts.push(
              organization
            );
          }

          if (issueDate) {
            parts.push(
              issueDate
            );
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
  if (
    resumeData.internships.length > 0
  ) {
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

        if (
          internship.company?.trim()
        ) {
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

        const startDate =
          formatDate(
            internship.start_date
          );

        const endDate =
          internship.currently_working
            ? "Present"
            : formatDate(
                internship.end_date ?? ""
              );

        if (
          startDate ||
          endDate
        ) {
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
  if (
    resumeData.experience.length > 0
  ) {
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

        if (
          experience.company?.trim()
        ) {
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

        const startDate =
          formatDate(
            experience.start_date
          );

        const endDate =
          experience.currently_working
            ? "Present"
            : formatDate(
                experience.end_date ?? ""
              );

        if (
          startDate ||
          endDate
        ) {
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
  const wordDocument =
    new WordDocument({
      sections: [
        {
          children,
        },
      ],
    });

  const blob =
    await Packer.toBlob(
      wordDocument
    );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    window.document.createElement(
      "a"
    );

  anchor.href = url;

  anchor.download =
    `${safeFileName(
      personal.full_name ||
        "resume"
    )}-Resume.docx`;

  window.document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}