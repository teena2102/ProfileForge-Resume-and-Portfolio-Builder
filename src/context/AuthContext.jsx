import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) { setLoading(false); return; }
            try {
                const { data } = await API.get('/auth/me');
                setUser(data.user);
            } catch {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, [token]);

    const login = (userData, jwtToken) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
