import type { ResumeTemplate } from "../../templates/templateTypes";

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onChange: (template: ResumeTemplate) => void;
}

interface TemplateOption {
  id: ResumeTemplate;
  name: string;
  description: string;
}

const templates: TemplateOption[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and ATS-friendly",
  },
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Clean layout with light blue accents",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional two-column design",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, clean and highly readable",
  },
  {
    id: "creative-blue",
    name: "Creative Blue",
    description: "Modern sidebar with blue styling",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Designed for software and AI roles",
  },
  {
    id: "professional-split",
    name: "Professional Split",
    description: "Strong two-column professional layout",
  },
  {
    id: "modern-header",
    name: "Modern Header",
    description: "Bold header with blue accent",
  },
];

function TemplateMiniPreview({
  template,
  selected,
}: {
  template: ResumeTemplate;
  selected: boolean;
}) {
  const base =
    "relative h-32 w-full overflow-hidden rounded-lg border transition-all duration-200";

  if (template === "classic") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-slate-900 ring-2 ring-slate-900/10"
            : "border-slate-200"
        } bg-white`}
      >
        <div className="px-4 pt-3">
          <div className="mx-auto h-2 w-24 rounded bg-slate-800" />
          <div className="mx-auto mt-1 h-1.5 w-16 rounded bg-slate-300" />

          <div className="mt-4 h-1 w-16 rounded bg-slate-800" />
          <div className="mt-1 h-px w-full bg-slate-300" />

          <div className="mt-3 space-y-1">
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-11/12 rounded bg-slate-200" />
            <div className="h-1 w-9/12 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (template === "modern-blue") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-sky-500 ring-2 ring-sky-500/10"
            : "border-slate-200"
        } bg-white`}
      >
        <div className="bg-sky-100 px-4 py-3">
          <div className="h-2 w-24 rounded bg-slate-800" />
          <div className="mt-1 h-1.5 w-20 rounded bg-slate-500" />
        </div>

        <div className="px-4 pt-3">
          <div className="h-1.5 w-16 rounded bg-sky-500" />
          <div className="mt-2 h-1 w-full rounded bg-slate-200" />
          <div className="mt-1 h-1 w-10/12 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (template === "executive") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-slate-800 ring-2 ring-slate-800/10"
            : "border-slate-200"
        } bg-white`}
      >
        <div className="flex h-full">
          <div className="w-1/3 bg-slate-800 p-3">
            <div className="h-2 w-14 rounded bg-white" />
            <div className="mt-5 h-1 w-10 rounded bg-slate-400" />
            <div className="mt-2 h-1 w-full rounded bg-slate-500" />
            <div className="mt-1 h-1 w-10/12 rounded bg-slate-500" />
          </div>

          <div className="flex-1 p-3">
            <div className="h-2 w-24 rounded bg-slate-800" />
            <div className="mt-1 h-1 w-16 rounded bg-slate-300" />
            <div className="mt-5 h-1.5 w-14 rounded bg-slate-800" />
            <div className="mt-2 h-1 w-full rounded bg-slate-200" />
            <div className="mt-1 h-1 w-11/12 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-slate-800 ring-2 ring-slate-800/10"
            : "border-slate-200"
        } bg-white`}
      >
        <div className="px-5 pt-4">
          <div className="h-2.5 w-28 rounded bg-slate-900" />
          <div className="mt-1 h-1 w-20 rounded bg-slate-300" />

          <div className="mt-6 h-1 w-12 rounded bg-slate-900" />
          <div className="mt-2 h-1 w-full rounded bg-slate-200" />
          <div className="mt-1 h-1 w-10/12 rounded bg-slate-200" />

          <div className="mt-5 h-1 w-16 rounded bg-slate-900" />
        </div>
      </div>
    );
  }

  if (template === "creative-blue") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-blue-500 ring-2 ring-blue-500/10"
            : "border-slate-200"
        } bg-white`}
      >
        <div className="flex h-full">
          <div className="w-2/5 bg-blue-50 p-3">
            <div className="mx-auto h-8 w-8 rounded-full bg-blue-200" />
            <div className="mx-auto mt-2 h-1.5 w-16 rounded bg-slate-800" />
            <div className="mx-auto mt-1 h-1 w-12 rounded bg-slate-400" />

            <div className="mt-5 h-1 w-10 rounded bg-blue-500" />
            <div className="mt-2 h-1 w-full rounded bg-slate-200" />
            <div className="mt-1 h-1 w-10/12 rounded bg-slate-200" />
          </div>

          <div className="flex-1 p-3">
            <div className="h-2 w-24 rounded bg-slate-800" />
            <div className="mt-5 h-1.5 w-14 rounded bg-blue-500" />
            <div className="mt-2 h-1 w-full rounded bg-slate-200" />
            <div className="mt-1 h-1 w-11/12 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (template === "tech") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-cyan-500 ring-2 ring-cyan-500/10"
            : "border-slate-200"
        } bg-slate-50`}
      >
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2 w-24 rounded bg-slate-900" />
              <div className="mt-1 h-1 w-16 rounded bg-slate-400" />
            </div>

            <div className="h-5 w-5 rounded border border-cyan-400 bg-cyan-50" />
          </div>

          <div className="mt-4 rounded border border-slate-200 bg-white p-2">
            <div className="flex gap-1">
              <div className="h-2 w-8 rounded bg-cyan-100" />
              <div className="h-2 w-10 rounded bg-cyan-100" />
              <div className="h-2 w-7 rounded bg-cyan-100" />
            </div>
          </div>

          <div className="mt-3 h-1.5 w-14 rounded bg-cyan-500" />
          <div className="mt-2 h-1 w-full rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (template === "professional-split") {
    return (
      <div
        className={`${base} ${
          selected
            ? "border-indigo-500 ring-2 ring-indigo-500/10"
            : "border-slate-200"
        } bg-white`}
      >
        <div className="flex h-full">
          <div className="w-2/5 border-r border-slate-200 bg-slate-50 p-3">
            <div className="h-2 w-20 rounded bg-slate-800" />
            <div className="mt-4 h-1.5 w-12 rounded bg-indigo-500" />
            <div className="mt-2 h-1 w-full rounded bg-slate-200" />
            <div className="mt-1 h-1 w-10/12 rounded bg-slate-200" />
            <div className="mt-4 h-1.5 w-10 rounded bg-indigo-500" />
          </div>

          <div className="flex-1 p-3">
            <div className="h-1.5 w-16 rounded bg-indigo-500" />
            <div className="mt-2 h-1 w-full rounded bg-slate-200" />
            <div className="mt-1 h-1 w-11/12 rounded bg-slate-200" />

            <div className="mt-4 h-1.5 w-14 rounded bg-indigo-500" />
            <div className="mt-2 h-1 w-full rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${base} ${
        selected
          ? "border-sky-600 ring-2 ring-sky-600/10"
          : "border-slate-200"
      } bg-white`}
    >
      <div className="bg-slate-800 px-4 py-4">
        <div className="h-2.5 w-28 rounded bg-white" />
        <div className="mt-1 h-1.5 w-20 rounded bg-slate-300" />
      </div>

      <div className="h-1 bg-sky-400" />

      <div className="px-4 pt-3">
        <div className="h-1.5 w-16 rounded bg-slate-800" />
        <div className="mt-2 h-1 w-full rounded bg-slate-200" />
        <div className="mt-1 h-1 w-10/12 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function TemplateSelector({
  selectedTemplate,
  onChange,
}: TemplateSelectorProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Choose a Template
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select a resume design. Your content stays the same.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={`group text-left ${
                isSelected ? "outline-none" : ""
              }`}
            >
              <TemplateMiniPreview
                template={template.id}
                selected={isSelected}
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {template.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {template.description}
                  </p>
                </div>

                {isSelected && (
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}