interface SummaryFormProps {
  value: string;
  onChange: (value: string) => void;
}

function SummaryForm({
  value,
  onChange,
}: SummaryFormProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Professional Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Write a short summary about your experience, skills, and career goals.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Example: Computer Science graduate with experience in React, TypeScript, Python, and AI technologies. Passionate about building scalable applications and solving real-world problems."
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-2 flex justify-end">
        <span className="text-xs text-slate-400">
          {value.length} characters
        </span>
      </div>
    </section>
  );
}

export default SummaryForm;