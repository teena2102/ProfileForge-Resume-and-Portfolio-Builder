import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

/* Get All */
router.get("/all", async (req, res) => {
  const data = await Portfolio.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

/* Save */
router.post("/save", async (req, res) => {
  try {
    const body = req.body;

    const slug =
      (body.name || "user")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now();

    const portfolio = await Portfolio.create({
      ...body,
      slug,
    });

    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* Update by ID */
router.put("/edit/:id", async (req, res) => {
  const data = await Portfolio.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data });
});

/* Delete by ID */
router.delete("/delete/:id", async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

/* View by slug - LAST */
router.get("/:slug", async (req, res) => {
  const data = await Portfolio.findOne({
    slug: req.params.slug,
  });

  res.json({ success: true, data });
});

export default router;