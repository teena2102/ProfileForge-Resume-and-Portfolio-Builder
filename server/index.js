import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
//import atsAI from './routes/atsAI.js';
import jobsRoute from "./routes/jobs.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
//app.use('/api/ats', atsAI);
app.use("/api/jobs", jobsRoute);
app.use("/api/portfolio", portfolioRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Resume Builder API is running ✅' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
