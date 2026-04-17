import express from "express";

const router = express.Router();

function extractSkills(text = "") {
  const skills = [
    "react","node","express","mongodb","javascript","java","python",
    "sql","mysql","html","css","aws","power bi","excel","c++",
    "django","flask","spring","redux","typescript","nextjs"
  ];

  const resume = text.toLowerCase();
  return skills.filter(skill => resume.includes(skill));
}

function buildJobs(foundSkills) {
  const primary = foundSkills[0] || "developer";

  const roles = [];

  if (foundSkills.includes("react")) {
    roles.push("React Developer");
    roles.push("Frontend Developer");
  }

  if (foundSkills.includes("node")) {
    roles.push("Node.js Developer");
    roles.push("Backend Developer");
  }

  if (foundSkills.includes("java")) {
    roles.push("Java Developer");
  }

  if (foundSkills.includes("python")) {
    roles.push("Python Developer");
  }

  if (foundSkills.includes("sql") || foundSkills.includes("power bi")) {
    roles.push("Data Analyst");
  }

  if (
    foundSkills.includes("react") &&
    foundSkills.includes("node")
  ) {
    roles.push("Full Stack Developer");
  }

  if (roles.length === 0) {
    roles.push(`${primary} Developer`);
    roles.push("Software Engineer");
  }

  const uniqueRoles = [...new Set(roles)];

  return uniqueRoles.map((role, index) => ({
    title: role,
    company: "Live Search",
    location: "India",
    linkdin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}`,
    naukari: `https://www.naukri.com/${role.toLowerCase().replace(/\s+/g, "-")}-jobs`,
    internshala: `https://internshala.com/jobs/${role.toLowerCase().replace(/\s+/g, "-").replace(/\./g,"")}-jobs`,
    id: index + 1
  }));
}

router.post("/", async (req, res) => {
  try {
    const { resume } = req.body;

    const foundSkills = extractSkills(resume || "");
    const jobs = buildJobs(foundSkills);

    res.json({
      success: true,
      skills: foundSkills,
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;