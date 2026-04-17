import { User2Icon, Mail, Lock } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get('state');
  const [state, setState] = React.useState(urlState || 'login');
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = state === 'login' ? '/auth/login' : '/auth/register';
      const payload = state === 'login'
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const { data } = await API.post(endpoint, payload);
      if (data.success) {
        login(data.user, data.token);
        navigate('/app');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[380px] w-full mx-4 text-center border border-gray-200 rounded-2xl px-8 py-10 bg-white shadow-xl"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-gray-900 text-2xl font-bold">
          {state === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          {state === 'login' ? 'Sign in to your account' : 'Start building your resume today'}
        </p>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {state !== 'login' && (
          <div className="flex items-center w-full bg-white border border-gray-200 h-12 rounded-xl overflow-hidden px-4 gap-2 mb-3 focus-within:border-indigo-400 transition-colors">
            <User2Icon size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="border-none outline-none ring-0 flex-1 text-sm"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full bg-white border border-gray-200 h-12 rounded-xl overflow-hidden px-4 gap-2 mb-3 focus-within:border-indigo-400 transition-colors">
          <Mail size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="border-none outline-none ring-0 flex-1 text-sm"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center w-full bg-white border border-gray-200 h-12 rounded-xl overflow-hidden px-4 gap-2 mb-4 focus-within:border-indigo-400 transition-colors">
          <Lock size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 flex-1 text-sm"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all font-medium shadow-md shadow-indigo-200 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
          {state === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p
          onClick={() => { setState((prev) => (prev === 'login' ? 'register' : 'login')); setError(''); }}
          className="text-gray-500 text-sm mt-5 cursor-pointer"
        >
          {state === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span className="text-indigo-600 hover:underline font-medium">
            {state === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
