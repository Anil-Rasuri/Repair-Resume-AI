import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Experience } from "../../types/resume";

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

interface YearPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 71 },
    (_, index) => String(currentYear - index)
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={pickerRef} className="relative w-[130px]">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <span className={value ? "text-slate-700" : "text-slate-400"}>
          {value || "Year"}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[44px] z-50 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="max-h-[150px] overflow-y-auto py-1">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onChange(year);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-sm transition ${
                  value === year
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onChange,
}) => {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        job_title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        currently_working: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const updated = experiences.map((experience, i) =>
      i === index
        ? {
            ...experience,
            [field]: value,
          }
        : experience
    );

    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">
              Experience {index + 1}
            </h3>

            {experiences.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Job Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Job Title
              </label>

              <input
                type="text"
                value={experience.job_title}
                onChange={(e) =>
                  updateExperience(index, "job_title", e.target.value)
                }
                placeholder="Software Engineer"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Company */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Company
              </label>

              <input
                type="text"
                value={experience.company}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                placeholder="Company Name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Location
              </label>

              <input
                type="text"
                value={experience.location || ""}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
                placeholder="Hyderabad, India"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Start Year */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Start Year
              </label>

              <YearPicker
                value={experience.start_date}
                onChange={(value) =>
                  updateExperience(index, "start_date", value)
                }
              />
            </div>

            {/* End Year */}
            {!experience.currently_working && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  End Year
                </label>

                <YearPicker
                  value={experience.end_date || ""}
                  onChange={(value) =>
                    updateExperience(index, "end_date", value)
                  }
                />
              </div>
            )}
          </div>

          {/* Currently Working */}
          <div className="mt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={experience.currently_working}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "currently_working",
                    e.target.checked
                  )
                }
                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              I currently work here
            </label>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={experience.description}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              placeholder="Describe your responsibilities, achievements, and contributions..."
              rows={5}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
      >
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;