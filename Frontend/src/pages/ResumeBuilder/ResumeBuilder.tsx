import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

function ResumeBuilder() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Resume Builder
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Create a professional resume by entering your details and
            selecting one of our templates.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Resume Builder
          </h2>

          <p className="mt-2 text-slate-600">
            The resume form and template selector will be built here next.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block text-sm font-semibold text-slate-900 hover:underline"
          >
            ← Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ResumeBuilder;