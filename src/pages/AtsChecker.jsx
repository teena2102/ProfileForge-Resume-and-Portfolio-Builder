
import React, { useMemo, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const actionVerbs = [
  "developed","built","designed","created","managed","implemented",
  "optimized","led","improved","analyzed","engineered","launched"
];

function extractKeywords(text = "") {
  const words = text.toLowerCase().match(/\b[a-z+#.]{3,}\b/g) || [];
  const stop = ["and","the","for","with","you","your","are","this","that","from"];
  return [...new Set(words.filter(w => !stop.includes(w)))].slice(0, 80);
}

export default function AtsChecker() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ") + " ";
        }
        setResume(text);
      } else {
        const txt = await file.text();
        setResume(txt);
      }
    } catch (err) {
      alert("File read failed");
    }
  };

  const analyze = async () => {
    if (!resume.trim()) return alert("Upload or paste resume first");

    const r = resume.toLowerCase();
    const keywords = extractKeywords(jd);

    const matched = keywords.filter(k => r.includes(k));
    const missing = keywords.filter(k => !r.includes(k));

    const keywordScore = Math.round((matched.length / Math.max(1, keywords.length)) * 50);

    let format = 0;
    ["education","skills","projects","experience","summary"].forEach(s => {
      if (r.includes(s)) format += 5;
    });
    if (/\S+@\S+\.\S+/.test(r)) format += 3;
    if (/\d{10}/.test(r.replace(/\D/g, ""))) format += 2;
    format = Math.min(format, 25);

    const verbCount = actionVerbs.filter(v => r.includes(v)).length;
    const impact = Math.min(25, verbCount * 2 + (/\d+%|\d+x|\d+ users/.test(r) ? 5 : 0));

    const total = Math.min(100, keywordScore + format + impact);

    setResult({
      total,
      matched,
      missing,
      keywordScore,
      format,
      impact
    });

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume })
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      setJobs([]);
    }
    setLoading(false);
  };

  const level = useMemo(() => {
    if (!result) return "";
    if (result.total >= 80) return "Excellent";
    if (result.total >= 60) return "Good";
    return "Needs Improvement";
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031b16] via-[#0a2e26] to-[#02110d] text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent animate-pulse">
            ProfileForge ATS Checker
          </h1>
          <p className="text-slate-300 mt-3">Real ATS Score • Missing Keywords • Live Jobs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-5">
            <textarea
              rows="14"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste Resume Text"
              className="w-full bg-transparent outline-none border border-white/10 rounded-2xl p-4"
            />

            <label className="mt-4 block border-2 border-dashed border-green-400 rounded-2xl p-6 text-center cursor-pointer hover:bg-green-500/10 transition">
              <input type="file" hidden onChange={handleFile} />
              <p className="text-lg font-semibold">Choose Resume File</p>
              <p className="text-sm text-slate-300 mt-1">PDF / TXT / DOCX</p>
              {fileName && <p className="mt-2 text-green-300">{fileName}</p>}
            </label>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-5">
            <textarea
              rows="20"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste Job Description"
              className="w-full bg-transparent outline-none border border-white/10 rounded-2xl p-4"
            />
          </div>
        </div>

        <button
          onClick={analyze}
          className="mt-6 w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-600 hover:scale-[1.01] transition"
        >
          Analyze Resume
        </button>

        {result && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6">
              <div className="flex justify-center">
                <div className="relative w-44 h-44 rounded-full border-[12px] border-green-500 flex items-center justify-center">
                  <div>
                    <div className="text-4xl font-black text-center">{result.total}%</div>
                    <div className="text-sm text-center text-slate-300">{level}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                <div className="bg-white/10 p-3 rounded-xl">{result.keywordScore}</div>
                <div className="bg-white/10 p-3 rounded-xl">{result.format}</div>
                <div className="bg-white/10 p-3 rounded-xl">{result.impact}</div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6">
              <h3 className="font-bold text-green-300 mb-2">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing.slice(0, 20).map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/20 border border-red-400 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>

              <h3 className="font-bold text-emerald-300 mt-6 mb-2">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.matched.slice(0, 20).map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-400 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && <p className="mt-8 text-center">Loading Jobs...</p>}

{jobs.length > 0 && (
  <div className="mt-10">
    <h2 className="text-3xl font-bold text-white mb-6">
      Recommended Jobs
    </h2>

    <div className="grid md:grid-cols-2 gap-5">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="rounded-3xl p-5 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:scale-[1.02] transition-all"
        >
          <h3 className="text-xl font-bold text-white">
            {job.title}
          </h3>

          <p className="text-gray-300 mt-1">
            {job.company}
          </p>

          <p className="text-sm text-gray-400">
            {job.location}
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <a
              href={job.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              LinkedIn
            </a>

            <a
              href={job.naukari}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 text-white"
            >
              Naukri
            </a>

            <a
              href={job.internshala}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-green-600 text-white"
            >
              Internshala
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div>
  );
}