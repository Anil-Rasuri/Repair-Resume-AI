import {
  ArrowRight,
  Check,
  FileText,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";



function Home() {
  return (
    
    <div className="min-h-screen bg-[#F4F7FF] text-slate-900">
      <Navbar />

      <main>
        
        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative overflow-hidden border-b border-blue-100 bg-[#F1F6FF]">
          <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="pointer-events-none absolute right-[25%] top-10 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />

          <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-200/25 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-20 lg:pt-16">
            {/* LEFT */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600">
                <Sparkles className="h-3.5 w-3.5" />
                Build • Tailor • Get Hired
              </div>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#14233D] sm:text-5xl lg:text-[52px]">
                Build a resume that
                <span className="block text-blue-600">
                  gets you noticed.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-600">
                Create a professional resume, tailor it to any job with AI,
                generate a targeted cover letter, and check your ATS
                compatibility — all in one place.
              </p>

              {/* BUTTONS */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/resume-builder"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
                >
                  Create Resume
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/tailor-resume"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Tailor
                </Link>
              </div>

              {/* BENEFITS */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Free to use
                </span>

                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  ATS-friendly
                </span>

                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  No account required
                </span>
              </div>
            </div>

            {/* RIGHT — RESUME MOCKUP */}
            <div className="relative mx-auto w-full max-w-[620px]">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/25 blur-3xl" />

              <div className="absolute left-[12%] top-[15%] h-[65%] w-[65%] rotate-[-8deg] rounded-[40%] bg-gradient-to-br from-blue-200/70 via-indigo-100/70 to-violet-200/60" />

              {/* RESUME WINDOW */}
              <div className="group relative mx-auto w-[92%] rotate-[1deg] overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_25px_70px_rgba(30,64,175,0.16)] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_35px_85px_rgba(30,64,175,0.24)]">
                {/* TOP BAR */}
                <div className="flex h-10 items-center justify-between border-b border-slate-100 bg-white px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                    </div>

                    <span className="text-[10px] font-semibold text-slate-700">
                      Resume Builder
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                    <span className="h-2 w-2 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-[130px_1fr]">
                  {/* SIDEBAR */}
                  <div className="border-r border-slate-100 bg-slate-50/80 p-3">
                    {[
                      "Template",
                      "Personal Info",
                      "Experience",
                      "Skills",
                      "Education",
                      "Summary",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`mb-1.5 flex items-center gap-2 rounded-md px-2.5 py-2 text-[9px] ${
                          index === 0
                            ? "bg-blue-50 font-semibold text-blue-600"
                            : "text-slate-500"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* RESUME */}
                  <div className="bg-white p-5 sm:p-6">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          John Doe
                        </h3>

                        <p className="mt-0.5 text-[9px] font-medium text-blue-600">
                          Software Engineer
                        </p>

                        <p className="mt-2 text-[7px] text-slate-400">
                          john.doe@email.com • +1 (555) 123-4567 • San
                          Francisco, CA
                        </p>
                      </div>
                    </div>

                    {/* EXPERIENCE */}
                    <div className="mt-4">
                      <h4 className="text-[9px] font-bold uppercase tracking-wide text-slate-800">
                        Experience
                      </h4>

                      <div className="mt-2">
                        <div className="flex justify-between">
                          <p className="text-[8px] font-semibold text-slate-700">
                            Senior Software Engineer
                          </p>

                          <p className="text-[7px] text-slate-400">
                            2021 – Present
                          </p>
                        </div>

                        <p className="mt-1 text-[7px] text-blue-600">
                          Tech Solutions Inc.
                        </p>

                        <ul className="mt-2 space-y-1">
                          <li className="text-[7px] text-slate-500">
                            • Developed scalable web applications using React
                            and Node.js
                          </li>

                          <li className="text-[7px] text-slate-500">
                            • Led a team of engineers to deliver key features
                          </li>

                          <li className="text-[7px] text-slate-500">
                            • Improved application performance by 40%
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* SKILLS */}
                    <div className="mt-4">
                      <h4 className="text-[9px] font-bold uppercase tracking-wide text-slate-800">
                        Skills
                      </h4>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {[
                          "JavaScript",
                          "React",
                          "Node.js",
                          "Python",
                          "AWS",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-blue-50 px-2 py-1 text-[6px] font-medium text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* EDUCATION */}
                    <div className="mt-4">
                      <h4 className="text-[9px] font-bold uppercase tracking-wide text-slate-800">
                        Education
                      </h4>

                      <div className="mt-2 flex justify-between">
                        <div>
                          <p className="text-[8px] font-semibold text-slate-700">
                            B.Sc. in Computer Science
                          </p>

                          <p className="mt-1 text-[7px] text-slate-400">
                            University of California
                          </p>
                        </div>

                        <p className="text-[7px] text-slate-400">
                          2017 – 2021
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ATS CARD */}
              <div className="absolute -right-2 top-[24%] w-[145px] rounded-xl border border-slate-100 bg-[#E7F8EF] p-4 shadow-[0_15px_40px_rgba(15,23,42,0.12)] sm:-right-4 sm:w-[155px]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-100 bg-white">
                  <span className="text-sm font-bold text-emerald-600">
                    92%
                  </span>
                </div>

                <p className="mt-3 text-center text-[11px] font-bold text-slate-800">
                  ATS Friendly
                </p>

                <div className="mt-3 space-y-2">
                  <p className="flex items-center gap-1.5 text-[8px] text-slate-500">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Keywords matched
                  </p>

                  <p className="flex items-center gap-1.5 text-[8px] text-slate-500">
                    <Check className="h-3 w-3 text-emerald-500" />
                    Well structured
                  </p>

                  <p className="flex items-center gap-1.5 text-[8px] text-slate-500">
                    <Check className="h-3 w-3 text-emerald-500" />
                    No formatting issues
                  </p>
                </div>
              </div>

              <div className="absolute right-[6%] top-[8%] text-blue-500">
                ✦
              </div>

              <div className="absolute left-[3%] top-[36%] text-blue-500">
                ◇
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TOOLKIT
        ===================================================== */}
        <section className="border-b border-blue-100 bg-[#E2E8F0] py-10">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                Your toolkit
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#14233D] sm:text-2xl">
                Everything you need to apply
              </h2>

              <p className="mx-auto mt-1.5 max-w-lg text-xs leading-5 text-slate-600">
                Simple tools to create, improve, and optimize your job
                application.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {/* RESUME BUILDER */}
              <div className="group rounded-lg border border-blue-200 bg-[#DDEBFF] p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <FileText
                    className="h-4 w-4 text-blue-600"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  Resume Builder
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Create a clean, professional resume using job-ready
                  templates.
                </p>

                <Link
                  to="/resume-builder"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 transition group-hover:text-blue-800"
                >
                  Create a resume
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* AI TAILOR */}
              <div className="group rounded-lg border border-violet-200 bg-[#EEE6FF] p-4 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                  <Sparkles
                    className="h-4 w-4 text-violet-600"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  AI Resume Tailoring
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Match your resume to a job description and create a targeted
                  cover letter.
                </p>

                <Link
                  to="/tailor-resume"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 transition group-hover:text-violet-800"
                >
                  Tailor my resume
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* ATS CHECKER */}
              <div className="group rounded-lg border border-emerald-200 bg-[#DFF7EC] p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                  <SearchCheck
                    className="h-4 w-4 text-emerald-600"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  ATS Checker
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Analyze your resume and identify keywords and potential gaps
                  before applying.
                </p>

                <Link
                  to="/ats-checker"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 transition group-hover:text-emerald-800"
                >
                  Check my resume
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}
        <section className="border-b border-indigo-100 bg-[#EEF4FF] py-11">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              {/* LEFT */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Simple workflow
                </p>

                <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight tracking-tight text-[#14233D]">
                  From resume to job-ready in a few steps.
                </h2>

                <p className="mt-3 max-w-md text-xs leading-5 text-slate-600">
                  Start with a new resume or upload your existing one. Improve
                  and tailor it for the role you're applying for, then check
                  how well it matches the job.
                </p>

                <Link
                  to="/resume-builder"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#14233D] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* RIGHT — THREE WORKFLOW BOXES */}
              <div className="space-y-2.5">
                {/* 01 */}
                <div className="group flex items-center gap-3 rounded-lg border border-blue-100 bg-[#E2EDFF] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-[#DBE8FF] hover:shadow-[0_10px_25px_rgba(37,99,235,0.14)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 transition-transform duration-300 group-hover:scale-105">
                    01
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Build your resume
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Create a professional resume from scratch.
                    </p>
                  </div>
                </div>

                {/* 02 */}
                <div className="group flex items-center gap-3 rounded-lg border border-violet-100 bg-[#EEE7FF] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:bg-[#E7DEFF] hover:shadow-[0_10px_25px_rgba(124,58,237,0.14)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600 transition-transform duration-300 group-hover:scale-105">
                    02
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Tailor with AI
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Match your resume to the job description.
                    </p>
                  </div>
                </div>

                {/* 03 */}
                <div className="group flex items-center gap-3 rounded-lg border border-emerald-100 bg-[#E2F7EC] p-3 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-[#D8F2E4] hover:shadow-[0_10px_25px_rgba(16,185,129,0.14)]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600 transition-transform duration-300 group-hover:scale-105">
                    03
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Check ATS compatibility
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Find keywords and potential gaps before applying.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-slate-800 bg-[#14233D]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-white">
              Repair Resume AI
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Build. Tailor. Apply.
            </p>
          </div>

          <p className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Repair Resume AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    
  );
}

export default Home;