// Replace your ViewPortfolio.jsx with this upgraded version

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/portfolio/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPortfolio(data.data);
      })
      .catch(console.error);
  }, [slug]);

  if (!portfolio) {
    return <div className="p-10">Loading...</div>;
  }

  const styles = {
    developer:
      "bg-gradient-to-br from-emerald-950 via-slate-950 to-green-900 text-white",
    creative:
      "bg-gradient-to-br from-pink-600 via-purple-800 to-slate-900 text-white",
    corporate:
      "bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white",
    minimal:
      "bg-white text-black",
    neon:
      "bg-black text-cyan-400",
  };

  const pageClass =
    styles[portfolio.template_name] || styles.developer;

  const skills = portfolio.skills?.split(",") || [];
  const projects = portfolio.projects?.split("\n") || [];

  return (
    <div className={`min-h-screen p-8 ${pageClass}`}>
      <h1 className="text-5xl font-bold">{portfolio.name}</h1>

      <p className="text-2xl mt-2">
        {portfolio.title}
      </p>

      <section className="mt-10">
        <h2 className="text-3xl font-bold">About</h2>
        <p className="mt-3 max-w-3xl">{portfolio.about}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-bold">Skills</h2>

        <div className="flex flex-wrap gap-3 mt-4">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-bold">Projects</h2>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {projects.map((project, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/10 border border-white/10"
            >
              {project}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-bold">Contact</h2>
        <p className="mt-2">{portfolio.email}</p>
        <p>{portfolio.linkedin}</p>
        <p>{portfolio.github}</p>
      </section>
    </div>
  );
}