
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, User2 } from 'lucide-react';
import PortfolioBuilder from '../pages/PortfolioBuilder';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        <Link to="/app" className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </div>
          <span className="hidden sm:block">ProfileForge  </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <User2 size={14} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
            </div>

            <Link to="/ats-checker" className="text-sm px-3 py-1.5 hover:bg-slate-100 rounded-full">
              ATS Score
            </Link>

            <Link to="/PortfolioBuilder" className="text-sm px-3 py-1.5 hover:bg-slate-100 rounded-full">
              Portfolio
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Logout</span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;