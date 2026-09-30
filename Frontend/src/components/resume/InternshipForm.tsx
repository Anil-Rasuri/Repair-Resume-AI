import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { Internship } from "../../types/resume";

interface InternshipFormProps {
  internships: Internship[];
  onChange: (internships: Internship[]) => void;
  onDraftChange?: (draft: Internship | null) => void;
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

function InternshipForm({
  internships,
  onChange,
  onDraftChange,
}: InternshipFormProps) {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 71 },
    (_, index) => currentYear - index
  );

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");

  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const [currentlyWorking, setCurrentlyWorking] =
    useState(false);

  const [description, setDescription] = useState("");

  const [technologyInput, setTechnologyInput] =
    useState("");

  const [technologies, setTechnologies] =
    useState<string[]>([]);

  /*
   * Send the current form to the parent as a live draft.
   *
   * The draft is only used for the live preview.
   * It is not added to the saved internship list until
   * the user clicks "Add Internship".
   */
  useEffect(() => {
    const hasContent = Boolean(
      title.trim() ||
        company.trim() ||
        location.trim() ||
        startMonth ||
        startYear ||
        endMonth ||
        endYear ||
        currentlyWorking ||
        description.trim() ||
        technologies.length > 0
    );

    if (!hasContent) {
      onDraftChange?.(null);
      return;
    }

    const draft: Internship = {
      internship_title: title,
      company,
      location: location.trim() || undefined,

      start_date:
        startYear && startMonth
          ? `${startYear}-${startMonth}`
          : "",

      end_date:
        !currentlyWorking &&
        endYear &&
        endMonth
          ? `${endYear}-${endMonth}`
          : undefined,

      currently_working: currentlyWorking,

      description,

      technologies,
    };

    onDraftChange?.(draft);
  }, [
    title,
    company,
    location,
    startMonth,
    startYear,
    endMonth,
    endYear,
    currentlyWorking,
    description,
    technologies,
    onDraftChange,
  ]);

  const addTechnology = () => {
    const technology = technologyInput.trim();

    if (!technology) {
      return;
    }

    if (
      technologies.some(
        (item) =>
          item.toLowerCase() ===
          technology.toLowerCase()
      )
    ) {
      setTechnologyInput("");
      return;
    }

    setTechnologies([
      ...technologies,
      technology,
    ]);

    setTechnologyInput("");
  };

  const removeTechnology = (index: number) => {
    setTechnologies(
      technologies.filter(
        (_, technologyIndex) =>
          technologyIndex !== index
      )
    );
  };

  const addInternship = () => {
    if (
      !title.trim() ||
      !company.trim() ||
      !startMonth ||
      !startYear
    ) {
      return;
    }

    if (
      !currentlyWorking &&
      (!endMonth || !endYear)
    ) {
      return;
    }

    const newInternship: Internship = {
      internship_title: title.trim(),
      company: company.trim(),
      location: location.trim() || undefined,

      start_date: `${startYear}-${startMonth}`,

      end_date: currentlyWorking
        ? undefined
        : `${endYear}-${endMonth}`,

      currently_working: currentlyWorking,

      description: description.trim(),

      technologies,
    };

    onChange([
      ...internships,
      newInternship,
    ]);

    /*
     * Clear the draft after saving it.
     */
    onDraftChange?.(null);

    setTitle("");
    setCompany("");
    setLocation("");

    setStartMonth("");
    setStartYear("");

    setEndMonth("");
    setEndYear("");

    setCurrentlyWorking(false);

    setDescription("");

    setTechnologyInput("");
    setTechnologies([]);
  };

  const removeInternship = (index: number) => {
    onChange(
      internships.filter(
        (_, internshipIndex) =>
          internshipIndex !== index
      )
    );
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "";
    }

    const [year, month] =
      date.split("-");

    const monthName = months.find(
      (item) => item.value === month
    )?.label;

    return `${monthName || month} ${year}`;
  };

  const isAddDisabled =
    !title.trim() ||
    !company.trim() ||
    !startMonth ||
    !startYear ||
    (!currentlyWorking &&
      (!endMonth || !endYear));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Internships
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Add your internship experience and the
          technologies you used.
        </p>
      </div>

      {/* Saved internships */}
      {internships.length > 0 && (
        <div className="mb-5 space-y-3">
          {internships.map(
            (internship, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <h3 className="text-sm font-semibold text-slate-900">
                      {internship.internship_title}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-blue-600">
                      {internship.company}

                      {internship.location
                        ? ` • ${internship.location}`
                        : ""}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {formatDate(
                        internship.start_date
                      )}

                      {" - "}

                      {internship.currently_working
                        ? "Present"
                        : formatDate(
                            internship.end_date
                          )}
                    </p>

                    {internship.technologies
                      .length > 0 && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        {internship.technologies.join(
                          " • "
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeInternship(index)
                    }
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove internship"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Internship form */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Internship Title */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Internship Title *
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Software Developer Intern"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Company */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Company *
          </label>

          <input
            type="text"
            value={company}
            onChange={(event) =>
              setCompany(event.target.value)
            }
            placeholder="Company name"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="e.g. Hyderabad, India"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Start Month */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Start Month *
          </label>

          <select
            value={startMonth}
            onChange={(event) =>
              setStartMonth(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select month
            </option>

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

        {/* Start Year */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Start Year *
          </label>

          <select
            value={startYear}
            onChange={(event) =>
              setStartYear(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              Select year
            </option>

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

        {/* End Month / Year */}
        {!currentlyWorking && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                End Month *
              </label>

              <select
                value={endMonth}
                onChange={(event) =>
                  setEndMonth(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select month
                </option>

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
                End Year *
              </label>

              <select
                value={endYear}
                onChange={(event) =>
                  setEndYear(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Select year
                </option>

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
          </>
        )}

        {/* Currently Working */}
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={currentlyWorking}
              onChange={(event) => {
                setCurrentlyWorking(
                  event.target.checked
                );

                if (event.target.checked) {
                  setEndMonth("");
                  setEndYear("");
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <span className="text-xs text-slate-700">
              I currently work here
            </span>
          </label>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={4}
            placeholder="Describe your responsibilities, achievements, and contributions..."
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Technologies */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Technologies / Skills
          </label>

          <div className="flex gap-2">

            <input
              type="text"
              value={technologyInput}
              onChange={(event) =>
                setTechnologyInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTechnology();
                }
              }}
              placeholder="e.g. React, Python, SQL"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={addTechnology}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={15} />
              Add
            </button>
          </div>

          {technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {technologies.map(
                (technology, index) => (
                  <span
                    key={`${technology}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                  >
                    {technology}

                    <button
                      type="button"
                      onClick={() =>
                        removeTechnology(index)
                      }
                      className="text-blue-400 transition hover:text-blue-700"
                      aria-label={`Remove ${technology}`}
                    >
                      ×
                    </button>
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Internship */}
      <button
        type="button"
        onClick={addInternship}
        disabled={isAddDisabled}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} />
        Add Internship
      </button>
    </section>
  );
}

export default InternshipForm;