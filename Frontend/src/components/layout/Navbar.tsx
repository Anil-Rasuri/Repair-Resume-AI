import {
  ArrowLeft,
  FileText,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navItems = [
    {
      path: "/resume-builder",
      label: "Resume Builder",
      icon: FileText,
    },
    {
      path: "/tailor-resume",
      label: "AI Tailor",
      icon: Sparkles,
    },
    {
      path: "/ats-checker",
      label: "ATS Checker",
      icon: SearchCheck,
    },
  ];

  return (
    <header className="sticky top-0 z-50 h-[68px] border-b border-slate-200 bg-[#ffffff] shadow-[0_4px_16px_rgba(15,23,42,0.10)] backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center px-5 lg:px-6">

        {/* LEFT — LOGO */}
        <div className="flex min-w-[300px] items-center">
          <Link
            to="/"
            className="flex items-center"
            aria-label="Repair Resume AI Home"
          >
            <img
              src="/logo.png"
              alt="Repair Resume AI"
              className="h-[52px] w-auto object-contain"
            />
          </Link>

          <span className="ml-3 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-600">
            FREE
          </span>
        </div>

        {/* CENTER — NAVIGATION */}
        <nav className="flex h-full flex-1 items-center justify-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex h-full items-center gap-2 text-[13px] font-medium transition-colors duration-200 ${
                  active
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-[16px] w-[16px] transition-colors ${
                    active
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                  strokeWidth={1.8}
                />

                {item.label}

                {/* SMALL CENTERED ACTIVE LINE */}
                <span
                  className={`absolute bottom-[8px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 ${
                    active ? "w-7 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* RIGHT — BACK BUTTON */}
        <div className="flex min-w-[300px] justify-end">
          {!isHomePage && (
            <Link
              to="/"
              className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                strokeWidth={1.8}
              />

              Back to Home
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;