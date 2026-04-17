import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Link } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PortfolioBuilder() {
    const [template, setTemplate] = useState("developer");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        about: "",
        skills: "",
        projects: "",
        email: "",
        linkedin: "",
        github: "",
    });
    const [savedPortfolios, setSavedPortfolios] = useState([]);

    /* -----------------------------
       Handle Input Change
    ----------------------------- */
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    /* -----------------------------
       Resume Upload + PDF Parser
    ----------------------------- */
    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let text = "";

        try {
            if (file.type === "application/pdf") {
                const buffer = await file.arrayBuffer();

                const pdf = await pdfjsLib.getDocument({
                    data: buffer,
                }).promise;

                for (let page = 1; page <= pdf.numPages; page++) {
                    const currentPage = await pdf.getPage(page);
                    const content = await currentPage.getTextContent();

                    const pageText = content.items
                        .map((item) => item.str)
                        .join(" ");

                    text += pageText + "\n";
                }
            } else {
                text = await file.text();
            }

            const cleanText = text.replace(/\s+/g, " ").trim();

            const email =
                cleanText.match(
                    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
                )?.[0] || "";

            const lines = text
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);

            const name =
                lines.find(
                    (line) =>
                        line.length > 3 &&
                        line.length < 40 &&
                        !line.includes("@") &&
                        !/\d/.test(line)
                ) || "";

            const skillBank = [
                "React",
                "Node.js",
                "JavaScript",
                "TypeScript",
                "Python",
                "Java",
                "C++",
                "MongoDB",
                "MySQL",
                "SQL",
                "HTML",
                "CSS",
                "Tailwind",
                "Bootstrap",
                "Express",
                "Git",
                "Firebase",
            ];

            const skills = skillBank
                .filter((skill) =>
                    cleanText.toLowerCase().includes(skill.toLowerCase())
                )
                .join(", ");

            let about = "";

            const summaryMatch =
                cleanText.match(
                    /(summary|profile|objective|about)(.*?)(education|skills|projects|experience|$)/i
                );

            if (summaryMatch) {
                about = summaryMatch[2].trim();
            } else {
                about = cleanText.slice(0, 350);
            }

            setFormData((prev) => ({
                ...prev,
                name: name || prev.name,
                email: email || prev.email,
                skills: skills || prev.skills,
                about: about || prev.about,
                title: "Software Developer",
                projects:
                    "Portfolio Website\nResume Builder\nChat Application",
            }));
        } catch (error) {
            console.error("Resume Parse Error:", error);
        }
    };

    /* -----------------------------
     AI Generator
    ----------------------------- */
    const generateAI = () => {
        const role = formData.skills.toLowerCase().includes("react")
            ? "Frontend Developer"
            : formData.skills.toLowerCase().includes("node")
                ? "Full Stack Developer"
                : formData.skills.toLowerCase().includes("python")
                    ? "Python Developer"
                    : "Software Developer";

        const improvedProjects = formData.projects
            .split("\n")
            .filter(Boolean)
            .map(
                (project) =>
                    `${project} - Built with modern technologies, responsive UI, and optimized performance.`
            )
            .join("\n");

        setFormData((prev) => ({
            ...prev,
            title: role,
            about: `Passionate ${role} with expertise in ${formData.skills}. I build scalable applications, responsive websites, and modern user experiences.`,
            projects: improvedProjects,
        }));
    };

    /* -----------------------------
       Helpers
    ----------------------------- */
    const skillsList = formData.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const projectsList = formData.projects
        .split("\n")
        .filter(Boolean);

    const shareLink = useMemo(() => {
        return `${window.location.origin}/portfolio/${(
            formData.name || "user"
        )
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
    }, [formData.name]);



    const copyLink = async () => {
  try {
    let slug = "";

    if (editingId) {
      const current = savedPortfolios.find(
        (item) => item._id === editingId
      );
      slug = current?.slug;
    } else {
      // latest saved portfolio by same name
      const current = savedPortfolios.find(
        (item) =>
          item.name?.toLowerCase().trim() ===
          formData.name?.toLowerCase().trim()
      );

      slug = current?.slug;
    }

    if (!slug) {
      alert("Pehle portfolio save karo, phir share link copy hoga.");
      return;
    }

    const link = `${window.location.origin}/portfolio/${slug}`;

    await navigator.clipboard.writeText(link);
    alert("Working Share Link Copied!");
  } catch (error) {
    console.error(error);
    alert("Copy failed");
  }
};

    // Replace your savePortfolio function with this version

    const savePortfolio = async () => {
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                title: formData.title,
                about: formData.about,
                skills: formData.skills,
                projects: formData.projects,
                linkedin: formData.linkedin,
                github: formData.github,
                template_name: template,
            };

            // If editing -> update route
            // ONLY change this part inside savePortfolio()

            const url = editingId
                ? `http://localhost:5000/api/portfolio/edit/${editingId}`
                : `http://localhost:5000/api/portfolio/save`;

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                const newItem = data.data;

                let oldData =
                    JSON.parse(localStorage.getItem("savedPortfolios")) || [];

                if (editingId) {
                    // replace updated item
                    oldData = oldData.map((item) =>
                        item._id === editingId ? newItem : item
                    );

                    setSavedPortfolios((prev) =>
                        prev.map((item) =>
                            item._id === editingId ? newItem : item
                        )
                    );

                    alert("Portfolio Updated Successfully!");
                } else {
                    // new save
                    oldData = [newItem, ...oldData];

                    setSavedPortfolios((prev) => [newItem, ...prev]);

                    alert("Portfolio Saved Successfully!");
                }

                localStorage.setItem(
                    "savedPortfolios",
                    JSON.stringify(oldData)
                );

                setEditingId(null);
            } else {
                alert(data.message || "Save failed");
            }
        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };
    const fetchSavedPortfolios = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/portfolio/all");
            const data = await res.json();

            if (data.success) {
                setSavedPortfolios(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSavedPortfolios();
    }, []);
    // Add these functions inside PortfolioBuilder.jsx component

    const editPortfolio = (item) => {
        setFormData({
            name: item.name || "",
            email: item.email || "",
            title: item.title || "",
            about: item.about || "",
            skills: item.skills || "",
            projects: item.projects || "",
            linkedin: item.linkedin || "",
            github: item.github || "",
        });

        setTemplate(item.template_name || "developer");

        // important for update mode
        setEditingId(item._id);
    };

   // ALSO improve deletePortfolio()

const deletePortfolio = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/portfolio/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (data.success) {
      setSavedPortfolios((prev) =>
        prev.filter((item) => item._id !== id)
      );

      localStorage.setItem(
        "savedPortfolios",
        JSON.stringify(
          savedPortfolios.filter((item) => item._id !== id)
        )
      );

      alert("Deleted Successfully");
    } else {
      alert(data.message || "Delete failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

    /* -----------------------------
       Template Styles
    ----------------------------- */
    const templateStyles = {
        developer:
            "bg-gradient-to-br from-emerald-950 via-slate-950 to-green-900",
        creative:
            "bg-gradient-to-br from-pink-600 via-purple-800 to-slate-900",
        corporate:
            "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
        minimal:
            "bg-white text-black",
        neon:
            "bg-black text-cyan-400",

    };


    return (
        <div
            className={`min-h-screen ${templateStyles[template]
                } ${template === "minimal" ? "" : "text-white"}`}
        >
            <div className="grid lg:grid-cols-3">
                {/* Left Panel */}
                <div className="p-6 bg-black/20 backdrop-blur min-h-screen space-y-4">
                    <h1 className="text-3xl font-bold text-emerald-400">
                        ProfileForge 
                    </h1>

                    {/* Upload Resume */}
                    <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleResumeUpload}
                        className="w-full p-3 rounded-xl bg-white text-black"
                    />

                    {/* Template */}
                    <select
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        className="w-full p-3 rounded-xl text-black"
                    >
                        <option value="developer">Developer</option>
                        <option value="creative">Creative</option>
                        <option value="corporate">Corporate</option>
                        <option value="minimal">Minimal</option>
                        <option value="neon">Dark Neon</option>
                    </select>

                    {/* Inputs */}
                    {[
                        "name",
                        "email",
                        "linkedin",
                        "github",
                        "title",
                    ].map((field) => (
                        <input
                            key={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            placeholder={field}
                            className="w-full p-3 rounded-xl text-black"
                        />
                    ))}

                    <textarea
                        rows="4"
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="About"
                        className="w-full p-3 rounded-xl text-black"
                    />

                    <input
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Skills"
                        className="w-full p-3 rounded-xl text-black"
                    />

                    <textarea
                        rows="4"
                        name="projects"
                        value={formData.projects}
                        onChange={handleChange}
                        placeholder="Projects"
                        className="w-full p-3 rounded-xl text-black"
                    />

                    {/* Buttons */}
                    <button
                        onClick={generateAI}
                        className="w-full bg-teal-600 p-3 rounded-xl"
                    >
                        AI Generate
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="w-full bg-emerald-600 p-3 rounded-xl"
                    >
                        Download PDF
                    </button>

                    <button
                        onClick={copyLink}
                        className="w-full bg-green-700 p-3 rounded-xl"
                    >
                        Copy Share Link
                    </button>

                    <button
                        onClick={savePortfolio}
                        className="w-full bg-blue-600 p-3 rounded-xl"
                    >
                        Save Portfolio
                    </button>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-3 text-emerald-400">
                            Saved Portfolios
                        </h2>

                        <div className="space-y-3 max-h-80 overflow-auto">
                            {savedPortfolios.map((item) => (
                                <div
                                    key={item._id}
                                    className="p-4 rounded-xl bg-white/10"
                                >
                                    <h3>{item.name}</h3>
                                    <p>{item.title}</p>

                                    <Link to={`/portfolio/${item.slug}`}>
                                        View Portfolio
                                    </Link>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => editPortfolio(item)}
                                            className="px-3 py-1 bg-green-700 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deletePortfolio(item._id)}
                                            className="px-3 py-1 bg-blue-900 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs break-all">{shareLink}</p>
                </div>

                {/* Right Preview */}
                <div className="lg:col-span-2">
                    <nav className="flex justify-between px-8 py-5 bg-black/20 sticky top-0">
                        <h2 className="font-bold text-emerald-100">
                            {formData.name || "Name"}'s Portfolio
                        </h2>

                        <div className="space-x-6">
                            <a href="#home">Home</a>
                            <a href="#about">About</a>
                            <a href="#projects">Projects</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </nav>

                    {/* Hero */}
                    <motion.section
                        id="home"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="px-8 py-20"
                    >
                        <p className="uppercase tracking-widest text-emerald-400">
                            Portfolio Website
                        </p>

                        <h1 className="text-6xl font-bold mt-3">
                            Hi, I'm {formData.name || "Your Name"}
                        </h1>

                        <p className="text-2xl mt-4">
                            {formData.title || "Developer"}
                        </p>
                    </motion.section>

                    {/* About */}
                    <motion.section
                        id="about"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="px-8 py-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            About Me
                        </h2>

                        <p className="max-w-3xl">{formData.about}</p>

                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                            {skillsList.map((skill, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-white/10 rounded-2xl"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Projects */}
                    <motion.section
                        id="projects"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="px-8 py-12 bg-black/20"
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            Projects
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">
                            {projectsList.map((project, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl bg-white/10"
                                >
                                    {project}
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Contact */}
                    <motion.section
                        id="contact"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="px-8 py-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Contact
                        </h2>

                        <p>{formData.email}</p>
                        <p>{formData.linkedin}</p>
                        <p>{formData.github}</p>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}