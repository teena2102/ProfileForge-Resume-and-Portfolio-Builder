import Resume from '../models/Resume.js';
import { improveResumeSection, parseResumeFromText } from '../utils/gemini.js';
import { uploadToImageKit, deleteFromImageKit } from '../utils/imagekit.js';
// import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import pdfParse from "pdf-parse";

// @GET /api/resume — get all resumes for logged-in user
export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json({ success: true, resumes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/resume — create new resume
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;
        const resume = await Resume.create({ userId: req.user._id, title: title || 'Untitled Resume' });
        res.status(201).json({ success: true, resume });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/resume/:id — get single resume (owner only)
export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
        res.json({ success: true, resume });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/resume/:id — update resume
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
        res.json({ success: true, resume });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @DELETE /api/resume/:id — delete resume
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
        // Delete profile image from ImageKit if exists
        if (resume.personal_info?.imageFileId) {
            await deleteFromImageKit(resume.personal_info.imageFileId).catch(() => { });
        }
        res.json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/resume/public/:id — public view (no auth required)
export const getPublicResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, public: true });
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found or not public' });
        res.json({ success: true, resume });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/resume/ai-improve — improve a resume section using Gemini
export const aiImprove = async (req, res) => {
    try {
        const { section, content, jobTitle } = req.body;
        if (!section || !content)
            return res.status(400).json({ success: false, message: 'section and content are required' });

        const improved = await improveResumeSection(section, content, jobTitle);
        res.json({ success: true, improved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/resume/upload-pdf — parse uploaded PDF and return structured data
// export const uploadPdf = async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
//         const data = await pdfParse(req.file.buffer);
//         const parsed = await parseResumeFromText(data.text);
//         res.json({ success: true, data: parsed });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
export const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        let text = "";

        try {
            const data = await pdfParse(req.file.buffer);
            text = data.text || "";
        } catch (pdfError) {
            console.log("PDF Parse Warning:", pdfError.message);
            return res.status(400).json({
                success: false,
                message: "This PDF cannot be parsed. Try another PDF or use text resume."
            });
        }

        if (!text.trim()) {
            return res.status(400).json({
                success: false,
                message: "No readable text found in PDF."
            });
        }

        return res.json({
            success: true,
            fileName: req.file.originalname,
            text
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Upload failed"
        });
    }
};

// @POST /api/resume/upload-image — upload profile image to ImageKit
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
        const result = await uploadToImageKit(req.file.buffer, req.file.originalname, req.user._id.toString());
        res.json({ success: true, url: result.url, fileId: result.fileId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
