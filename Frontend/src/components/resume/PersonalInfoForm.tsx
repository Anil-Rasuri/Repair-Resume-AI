import type { PersonalInfo } from "../../types/resume";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

function PersonalInfoForm({
  data,
  onChange,
}: PersonalInfoFormProps) {
  const handleChange = (
    field: keyof PersonalInfo,
    value: string
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">
          Personal Information
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Add your basic contact and professional information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Full Name *
          </label>

          <input
            type="text"
            value={data.full_name}
            onChange={(e) =>
              handleChange("full_name", e.target.value)
            }
            placeholder="e.g. Anil Kumar"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Professional Title */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Professional Title *
          </label>

          <input
            type="text"
            value={data.professional_title}
            onChange={(e) =>
              handleChange(
                "professional_title",
                e.target.value
              )
            }
            placeholder="e.g. Junior AI Engineer"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Email *
          </label>

          <input
            type="email"
            value={data.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Phone *
          </label>

          <input
            type="tel"
            value={data.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            placeholder="e.g. +91 98765 43210"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Location *
          </label>

          <input
            type="text"
            value={data.location}
            onChange={(e) =>
              handleChange("location", e.target.value)
            }
            placeholder="e.g. Hyderabad, India"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            LinkedIn
          </label>

          <input
            type="url"
            value={data.linkedin || ""}
            onChange={(e) =>
              handleChange("linkedin", e.target.value)
            }
            placeholder="linkedin.com/in/yourname"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            GitHub
          </label>

          <input
            type="url"
            value={data.github || ""}
            onChange={(e) =>
              handleChange("github", e.target.value)
            }
            placeholder="github.com/yourname"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Portfolio */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            Portfolio
          </label>

          <input
            type="url"
            value={data.portfolio || ""}
            onChange={(e) =>
              handleChange("portfolio", e.target.value)
            }
            placeholder="yourportfolio.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </section>
  );
}

export default PersonalInfoForm;