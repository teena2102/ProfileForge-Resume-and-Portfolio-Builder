import React, { useEffect, useState } from 'react';
import {
  FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a'];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadAllResumes = async () => {
    try {
      const { data } = await API.get('/resume');
      setAllResumes(data.resumes || []);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setActionLoading(true);
    try {
      const { data } = await API.post('/resume', { title: title.trim() });
      setShowCreateResume(false);
      setTitle('');
      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume || !title.trim()) return;
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      const { data } = await API.post('http://localhost:5000/api/resume/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Create a new resume with the parsed data
      const { data: createData } = await API.post('/resume', {
        title: title.trim(),
        ...data.data,
      });
      setShowUploadResume(false);
      setTitle('');
      setResume(null);
      navigate(`/app/builder/${createData.resume._id}`);
    } catch (err) {
      console.error('Failed to upload resume:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTitle = async (event) => {
    event.preventDefault();
    if (!editTitle.trim()) return;
    setActionLoading(true);
    try {
      const { data } = await API.put(`/resume/${editResumeId}`, { title: editTitle.trim() });
      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title: data.resume.title } : r))
      );
      setEditResumeId('');
      setEditTitle('');
    } catch (err) {
      console.error('Failed to update title:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await API.delete(`/resume/${resumeId}`);
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  useEffect(() => { loadAllResumes(); }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <p className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name?.split(' ')[0]}
        </p>
        <div className="flex gap-4 flex-wrap">
          {/* Create Resume */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col justify-center items-center gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg cursor-pointer transition-all duration-300 rounded-lg"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full group-hover:scale-110" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">Create Resume</p>
          </button>

          {/* Upload Resume */}
          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col justify-center items-center gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg cursor-pointer transition-all duration-300 rounded-lg"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full group-hover:scale-110" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">Upload & Optimize</p>
          </button>
        </div>

        <hr className="border-slate-200 my-6" />

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full sm:max-w-36 h-48 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : allResumes.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FilePenLineIcon className="size-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No resumes yet</p>
            <p className="text-sm mt-1">Create your first resume to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
            {allResumes.map((resume, index) => {
              const baseColor = colors[index % colors.length];
              return (
                <button
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  key={resume._id}
                  className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg,${baseColor}10,${baseColor}40)`,
                    borderColor: baseColor + '40',
                  }}
                >
                  <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all" style={{ color: baseColor }} />
                  <p className="text-sm group-hover:scale-105 transition-all px-2 text-center font-medium" style={{ color: baseColor }}>
                    {resume.title}
                  </p>
                  <p className="absolute bottom-1 text-[11px] transition-all duration-300 px-2 text-center" style={{ color: baseColor + '90' }}>
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  {/* Public badge */}
                  {resume.public && (
                    <span className="absolute top-1 left-1 p-1 rounded" title="Public link active">
                      <LinkIcon size={11} style={{ color: baseColor }} />
                    </span>
                  )}
                  {/* Action buttons */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1 right-1 group-hover:flex items-center hidden"
                  >
                    <TrashIcon
                      onClick={() => deleteResume(resume._id)}
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                    <PencilIcon
                      onClick={() => { setEditResumeId(resume._id); setEditTitle(resume.title); }}
                      className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white border shadow-xl rounded-xl w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full mb-4 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
              <button
                disabled={actionLoading}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {actionLoading ? 'Creating...' : 'Create Resume'}
              </button>
              <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => { setShowCreateResume(false); setTitle(''); }} />
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white border shadow-xl rounded-xl w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-1">Upload & Optimize Resume</h2>
              <p className="text-sm text-slate-500 mb-4">AI will parse your PDF and pre-fill the form</p>
              <input
                type="text"
                placeholder="Enter resume title"
                className="w-full mb-4 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
              <label htmlFor="resume-input" className="block text-sm text-slate-700 mb-4">
                <div className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg p-6 py-8 cursor-pointer transition-colors ${resume ? 'border-green-400 text-green-700 bg-green-50' : 'border-slate-300 text-slate-400 hover:border-purple-400 hover:text-purple-600'}`}>
                  {resume ? <p className="font-medium">{resume.name}</p> : (
                    <>
                      <UploadCloud className="size-10 stroke-1" />
                      <p>Click to upload PDF resume</p>
                    </>
                  )}
                </div>
              </label>
              <input type="file" id="resume-input" accept=".pdf" hidden onChange={(e) => setResume(e.target.files[0])} />
              <button
                disabled={actionLoading || !resume}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {actionLoading ? 'Processing with AI...' : 'Upload & Parse Resume'}
              </button>
              <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => { setShowUploadResume(false); setTitle(''); setResume(null); }} />
            </div>
          </form>
        )}

        {/* Edit Title Modal */}
        {editResumeId && (
          <form
            onSubmit={handleEditTitle}
            onClick={() => setEditResumeId('')}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white border shadow-xl rounded-xl w-full max-w-sm p-6">
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                type="text"
                placeholder="Enter new title"
                className="w-full mb-4 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                autoFocus
              />
              <button disabled={actionLoading} className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60">
                {actionLoading ? 'Updating...' : 'Update Title'}
              </button>
              <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => { setEditResumeId(''); setEditTitle(''); }} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
