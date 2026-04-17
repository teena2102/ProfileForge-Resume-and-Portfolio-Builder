import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Share2, Copy, Check, ArrowLeft, Lock } from 'lucide-react';
import API from '../utils/api';

import ClassicTemplate from '../assets/templates/ClassicTemplate';
import MinimalTemplate from '../assets/templates/MinimalTemplate';
import MinimalImageTemplate from '../assets/templates/MinimalImageTemplate';
import ModernTemplate from '../assets/templates/ModernTemplate';

const TEMPLATES = {
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  'minimal-image': MinimalImageTemplate,
  modern: ModernTemplate,
};

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/resume/public/${resumeId}`);
        setResumeData(data.resume);
        document.title = `${data.resume.personal_info?.full_name || 'Resume'} | ResumeAI`;
      } catch (err) {
        setError(err.response?.data?.message || 'Resume not found or not public');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resumeId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
        <Lock size={28} className="text-slate-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-800">Resume Not Available</h1>
      <p className="text-slate-500 max-w-sm">{error}</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
        Go Home
      </Link>
    </div>
  );

  const TemplateComponent = TEMPLATES[resumeData.template] || ClassicTemplate;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action bar */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
            <ArrowLeft size={14} />
            ResumeAI
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-slate-600 rounded-full text-sm hover:bg-gray-50 transition"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition"
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <TemplateComponent data={resumeData} accentColor={resumeData.accent_color || '#3b82f6'} />
        </div>
      </div>
    </div>
  );
};

export default Preview;
