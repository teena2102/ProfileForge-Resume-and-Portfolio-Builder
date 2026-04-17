import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';
import {
    getAllResumes,
    createResume,
    getResume,
    updateResume,
    deleteResume,
    getPublicResume,
    aiImprove,
    uploadPdf,
    uploadImage,
} from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public route — must come before /:id to avoid conflict
router.get('/public/:id', getPublicResume);

// AI routes
router.post('/ai-improve', authMiddleware, aiImprove);
router.post('/upload-pdf', authMiddleware, upload.single('resume'), uploadPdf);
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImage);

// CRUD routes
router.get('/', authMiddleware, getAllResumes);
router.post('/', authMiddleware, createResume);
router.get('/:id', authMiddleware, getResume);
router.put('/:id', authMiddleware, updateResume);
router.delete('/:id', authMiddleware, deleteResume);

export default router;
