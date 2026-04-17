import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    company: String,
    position: String,
    start_date: String,
    end_date: String,
    description: String,
    is_current: { type: Boolean, default: false },
});

const educationSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    field: String,
    graduation_date: String,
    gpa: String,
});

const projectSchema = new mongoose.Schema({
    name: String,
    type: String,
    description: String,
});

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: 'Untitled Resume',
        trim: true,
    },
    personal_info: {
        full_name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
        profession: { type: String, default: '' },
        image: { type: String, default: '' },
        imageFileId: { type: String, default: '' }, // ImageKit file ID for deletion
    },
    professional_summary: { type: String, default: '' },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [String],
    project: [projectSchema],
    template: {
        type: String,
        enum: ['classic', 'minimal', 'minimal-image', 'modern'],
        default: 'classic',
    },
    accent_color: { type: String, default: '#3b82f6' },
    public: { type: Boolean, default: false },
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
