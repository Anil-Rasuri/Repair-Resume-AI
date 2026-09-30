import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { Certification } from "../../types/resume";

interface CertificationFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
  onDraftChange?: (draft: Certification | null) => void;
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function CertificationForm({
  certifications,
  onChange,
  onDraftChange,
}: CertificationFormProps) {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 71 },
    (_, index) => currentYear - index
  );

  const [name, setName] = useState("");
  const [issuingOrganization, setIssuingOrganization] =
    useState("");

  const [issueMonth, setIssueMonth] = useState("");
  const [issueYear, setIssueYear] = useState("");

  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");

  /*
   * Keep the current certification visible in the live preview.
   * It becomes a saved certification only when the user clicks
   * "Add Certification".
   */
  useEffect(() => {
    onDraftChange?.({
      name,
      issuing_organization: issuingOrganization,
      issue_date:
        issueYear && issueMonth
          ? `${issueYear}-${issueMonth}`
          : "",
      credential_id: credentialId.trim() || undefined,
      credential_url: credentialUrl.trim() || undefined,
    });
  }, [
    name,
    issuingOrganization,
    issueMonth,
    issueYear,
    credentialId,
    credentialUrl,
    onDraftChange,
  ]);

  const addCertification = () => {
    if (
      !name.trim() ||
      !issuingOrganization.trim() ||
      !issueMonth ||
      !issueYear
    ) {
      return;
    }

    const newCertification: Certification = {
      name: name.trim(),
      issuing_organization:
        issuingOrganization.trim(),
      issue_date: `${issueYear}-${issueMonth}`,
      credential_id:
        credentialId.trim() || undefined,
      credential_url:
        credentialUrl.trim() || undefined,
    };

    onChange([
      ...certifications,
      newCertification,
    ]);

    setName("");
    setIssuingOrganization("");
    setIssueMonth("");
    setIssueYear("");
    setCredentialId("");
    setCredentialUrl("");
  };

  const removeCertification = (index: number) => {
    onChange(
      certifications.filter(
        (_, certificationIndex) =>
          certificationIndex !== index
      )
    );
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "";
    }

    const [year, month] = date.split("-");

    const monthName = months.find(
      (item) => item.value === month
    )?.label;

    return `${monthName || month} ${year}`;
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Certifications
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Add professional certifications and credentials.
        </p>
      </div>

      {certifications.length > 0 && (
        <div className="mb-5 space-y-3">
          {certifications.map(
            (certification, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {certification.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-600">
                      {certification.issuing_organization}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {formatDate(
                        certification.issue_date
                      )}
                    </p>

                    {certification.credential_id && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        Credential ID:{" "}
                        {certification.credential_id}
                      </p>
                    )}

                    {certification.credential_url && (
                      <p className="mt-1 truncate text-[11px] text-blue-600">
                        {certification.credential_url}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeCertification(index)
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove certification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Certification Name *
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. AWS Certified Cloud Practitioner"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Issuing Organization *
          </label>

          <input
            type="text"
            value={issuingOrganization}
            onChange={(event) =>
              setIssuingOrganization(
                event.target.value
              )
            }
            placeholder="e.g. Amazon Web Services"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Issue Month *
          </label>

          <select
            value={issueMonth}
            onChange={(event) =>
              setIssueMonth(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select month</option>

            {months.map((month) => (
              <option
                key={month.value}
                value={month.value}
              >
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Issue Year *
          </label>

          <select
            value={issueYear}
            onChange={(event) =>
              setIssueYear(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select year</option>

            {years.map((year) => (
              <option
                key={year}
                value={String(year)}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Credential ID
          </label>

          <input
            type="text"
            value={credentialId}
            onChange={(event) =>
              setCredentialId(event.target.value)
            }
            placeholder="Optional"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Credential URL
          </label>

          <input
            type="url"
            value={credentialUrl}
            onChange={(event) =>
              setCredentialUrl(event.target.value)
            }
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={addCertification}
        disabled={
          !name.trim() ||
          !issuingOrganization.trim() ||
          !issueMonth ||
          !issueYear
        }
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} />
        Add Certification
      </button>
    </section>
  );
}

export default CertificationForm;