import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import ResumeBuilder from "./pages/ResumeBuilder/ResumeBuilder";
import TailorResume from "./pages/TailorResume/TailorResume";
import ATSChecker from "./pages/ATSChecker/ATSChecker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/resume-builder" element={<ResumeBuilder />} />

        <Route path="/tailor-resume" element={<TailorResume />} />

        <Route path="/ats-checker" element={<ATSChecker />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;