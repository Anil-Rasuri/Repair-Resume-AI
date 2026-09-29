import { useState } from "react";
import type { Project } from "../../types/resume";

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const emptyProject: Project = {
  name: "",
  description: "",
  technologies: [],
  project_url: "",
};

function ProjectsForm({
  projects,
  onChange,
}: ProjectsFormProps) {
  const [technologyInputs, setTechnologyInputs] = useState<
    Record<number, string>
  >({});

  const addProject = () => {
    onChange([
      ...projects,
      {
        ...emptyProject,
        technologies: [],
      },
    ]);
  };

  const removeProject = (index: number) => {
    onChange(
      projects.filter((_, projectIndex) => projectIndex !== index)
    );

    setTechnologyInputs((previous) => {
      const updated = { ...previous };
      delete updated[index];
      return updated;
    });
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | string[]
  ) => {
    const updatedProjects = [...projects];

    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    onChange(updatedProjects);
  };

  const addTechnology = (index: number) => {
    const technology = (
      technologyInputs[index] ?? ""
    ).trim();

    if (!technology) {
      return;
    }

    const currentTechnologies =
      projects[index].technologies;

    const alreadyExists = currentTechnologies.some(
      (existingTechnology) =>
        existingTechnology.toLowerCase() ===
        technology.toLowerCase()
    );

    if (alreadyExists) {
      setTechnologyInputs((previous) => ({
        ...previous,
        [index]: "",
      }));

      return;
    }

    updateProject(index, "technologies", [
      ...currentTechnologies,
      technology,
    ]);

    setTechnologyInputs((previous) => ({
      ...previous,
      [index]: "",
    }));
  };

  const removeTechnology = (
    projectIndex: number,
    technologyToRemove: string
  ) => {
    const updatedTechnologies =
      projects[projectIndex].technologies.filter(
        (technology) => technology !== technologyToRemove
      );

    updateProject(
      projectIndex,
      "technologies",
      updatedTechnologies
    );
  };

  const handleTechnologyKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology(index);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Projects
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add projects that demonstrate your skills and practical experience.
        </p>
      </div>

      <div className="space-y-5">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Project {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Project Name
                </label>

                <input
                  type="text"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="AI Resume Builder"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Project URL
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="url"
                  value={project.project_url ?? ""}
                  onChange={(e) =>
                    updateProject(
                      index,
                      "project_url",
                      e.target.value
                    )
                  }
                  placeholder="https://github.com/yourname/project"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Technologies
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={technologyInputs[index] ?? ""}
                    onChange={(e) =>
                      setTechnologyInputs((previous) => ({
                        ...previous,
                        [index]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) =>
                      handleTechnologyKeyDown(e, index)
                    }
                    placeholder="e.g. React, TypeScript, FastAPI"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => addTechnology(index)}
                    className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>

                {project.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map(
                      (technology) => (
                        <div
                          key={technology}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5"
                        >
                          <span className="text-sm text-slate-700">
                            {technology}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeTechnology(
                                index,
                                technology
                              )
                            }
                            aria-label={`Remove ${technology}`}
                            className="text-slate-400 transition hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Project Description
                </label>

                <textarea
                  value={project.description}
                  onChange={(e) =>
                    updateProject(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe what you built, the problem it solves, and your contribution..."
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addProject}
        className="mt-5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      >
        + Add Project
      </button>
    </section>
  );
}

export default ProjectsForm;