import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function TailorResume() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Tailor Your Resume
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Upload your existing resume and the job description to generate a
            tailored resume and cover letter.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Your Resume
            </h2>

            <p className="mt-2 text-slate-600">
              Upload your existing PDF or DOCX resume.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Job Description
            </h2>

            <p className="mt-2 text-slate-600">
              Paste the job description you want to target.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-900 hover:underline"
          >
            ← Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default TailorResume;