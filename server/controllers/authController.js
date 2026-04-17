import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: 'All fields are required' });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ success: false, message: 'Email already in use' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const token = generateToken(user._id);
        res.json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/auth/me
export const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};
