import { useState } from "react";
import { X } from "lucide-react";
import type { Skills } from "../../types/resume";

interface SkillsFormProps {
  skills: Skills;
  onChange: (skills: Skills) => void;
}

function SkillsForm({
  skills,
  onChange,
}: SkillsFormProps) {
  const [inputs, setInputs] = useState({
    technical: "",
    soft: "",
    other: "",
  });

  const addSkill = (
    category: keyof Skills
  ) => {
    const value = inputs[category].trim();

    if (!value) {
      return;
    }

    if (
      skills[category].some(
        (skill) =>
          skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      return;
    }

    onChange({
      ...skills,
      [category]: [...skills[category], value],
    });

    setInputs({
      ...inputs,
      [category]: "",
    });
  };

  const removeSkill = (
    category: keyof Skills,
    index: number
  ) => {
    onChange({
      ...skills,
      [category]: skills[category].filter(
        (_, skillIndex) => skillIndex !== index
      ),
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    category: keyof Skills
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill(category);
    }
  };

  const renderSkillCategory = (
    category: keyof Skills,
    title: string,
    placeholder: string
  ) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {title}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputs[category]}
          onChange={(e) =>
            setInputs({
              ...inputs,
              [category]: e.target.value,
            })
          }
          onKeyDown={(e) =>
            handleKeyDown(e, category)
          }
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={() => addSkill(category)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add
        </button>
      </div>

      {skills[category].length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills[category].map(
            (skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700"
              >
                {skill}

                <button
                  type="button"
                  onClick={() =>
                    removeSkill(category, index)
                  }
                  className="text-slate-400 transition hover:text-red-500"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={13} />
                </button>
              </span>
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">
          Skills
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Organize your skills into clear categories.
        </p>
      </div>

      <div className="space-y-5">
        {renderSkillCategory(
          "technical",
          "Technical Skills",
          "e.g. Python, React, SQL"
        )}

        {renderSkillCategory(
          "soft",
          "Soft Skills",
          "e.g. Communication, Teamwork"
        )}

        {renderSkillCategory(
          "other",
          "Other Skills",
          "e.g. Git, Docker, Microsoft Office"
        )}
      </div>
    </section>
  );
}

export default SkillsForm;