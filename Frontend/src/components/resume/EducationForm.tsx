import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Education } from "../../types/resume";

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
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

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onChange,
}) => {
  const addEducation = () => {
    onChange([
      ...education,
      {
        degree: "",
        institution: "",
        location: "",
        start_date: "",
        end_date: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = education.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    );

    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {education.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">
              Education {index + 1}
            </h3>

            {education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Degree */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Degree
              </label>

              <input
                type="text"
                value={item.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                placeholder="B.Tech Computer Science"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Institution
              </label>

              <input
                type="text"
                value={item.institution}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
                placeholder="University / College Name"
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
                value={item.location || ""}
                onChange={(e) =>
                  updateEducation(index, "location", e.target.value)
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
                value={item.start_date}
                onChange={(value) =>
                  updateEducation(index, "start_date", value)
                }
              />
            </div>

            {/* End Year */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                End Year
              </label>

              <YearPicker
                value={item.end_date}
                onChange={(value) =>
                  updateEducation(index, "end_date", value)
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={item.description || ""}
              onChange={(e) =>
                updateEducation(index, "description", e.target.value)
              }
              placeholder="Add relevant education details, achievements, coursework, etc."
              rows={4}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
      >
        + Add Education
      </button>
    </div>
  );
};

export default EducationForm;