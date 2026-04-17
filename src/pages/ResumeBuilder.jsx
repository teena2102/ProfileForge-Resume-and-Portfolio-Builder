import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, FileText,
  FolderIcon, GraduationCap, Sparkles, User, Globe, EyeIcon,
  Palette, Copy, Check, Save, Loader2
} from 'lucide-react';
import API from '../utils/api';

// Form components
import PersonalInfoForm from '../components/resume-builder/PersonalInfoForm';
import SummaryForm from '../components/resume-builder/SummaryForm';
import ExperienceForm from '../components/resume-builder/ExperienceForm';
import EducationForm from '../components/resume-builder/EducationForm';
import SkillsForm from '../components/resume-builder/SkillsForm';
import ProjectsForm from '../components/resume-builder/ProjectsForm';
import TemplatePicker from '../components/resume-builder/TemplatePicker';

// Template components
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

const SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Sparkles },
  { id: 'projects', name: 'Projects', icon: FolderIcon },
  { id: 'template', name: 'Design', icon: Palette },
];

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState({
    _id: '', title: '',
    personal_info: {},
    professional_summary: '',
    experience: [], education: [], skills: [], project: [],
    template: 'classic', accent_color: '#3b82f6', public: false,
  });
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef(null);

  // Load resume
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/resume/${resumeId}`);
        setResumeData(data.resume);
        document.title = data.resume.title || 'ResumeAI Builder';
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resumeId]);

  // Auto-save with debouncing
  const autoSave = useCallback(
    (newData) => {
      setSaved(false);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          await API.put(`/resume/${resumeId}`, newData);
          setSaved(true);
        } catch (err) {
          console.error('Auto-save failed:', err);
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    [resumeId]
  );

  const updateData = (updates) => {
    const newData = { ...resumeData, ...updates };
    setResumeData(newData);
    autoSave(newData);
  };

  const shareUrl = `${window.location.origin}/view/${resumeId}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePublic = () => {
    updateData({ public: !resumeData.public });
  };

  const activeSection = SECTIONS[activeSectionIndex];
  const TemplateComponent = TEMPLATES[resumeData.template] || ClassicTemplate;

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <Loader2 className="animate-spin text-indigo-500 size-10" />
    </div>
  );

  return (
    <div>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/app" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all text-sm">
          <ArrowLeftIcon className="size-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {/* Save status */}
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            {saving ? (
              <><Loader2 size={12} className="animate-spin" /> Saving...</>
            ) : saved ? (
              <><Save size={12} className="text-green-500" /> Saved</>
            ) : (
              <><Save size={12} /> Unsaved</>
            )}
          </span>

          {/* Public toggle */}
          <button
            onClick={togglePublic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${resumeData.public
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
          >
            <Globe size={12} />
            {resumeData.public ? 'Public' : 'Private'}
          </button>

          {/* Share link */}
          {resumeData.public && (
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-medium hover:bg-indigo-700 transition-all"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          )}

          {/* Preview */}
          <Link
            to={`/view/${resumeId}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-full text-xs font-medium hover:bg-slate-50 transition-all"
          >
            <EyeIcon size={12} />
            Preview
          </Link>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <input
          value={resumeData.title}
          onChange={(e) => updateData({ title: e.target.value })}
          className="text-xl font-bold text-slate-800 focus:outline-none border-b border-transparent focus:border-indigo-300 pb-1 bg-transparent transition-all w-auto"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left panel — form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-gray-100">
                <div
                  className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(activeSectionIndex * 100) / (SECTIONS.length - 1)}%` }}
                />
              </div>

              {/* Section tabs */}
              <div className="flex overflow-x-auto gap-1 px-3 py-2 border-b border-gray-100 scrollbar-hide">
                {SECTIONS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSectionIndex(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeSectionIndex === i
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      <Icon size={12} />
                      {s.name}
                    </button>
                  );
                })}
              </div>

              {/* Form content */}
              <div className="p-5 max-h-[calc(100vh-260px)] overflow-y-auto">
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(val) => updateData({ personal_info: val })}
                    resumeId={resumeId}
                  />
                )}
                {activeSection.id === 'summary' && (
                  <SummaryForm
                    data={resumeData.professional_summary}
                    onChange={(val) => updateData({ professional_summary: val })}
                    jobTitle={resumeData.personal_info?.profession}
                  />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(val) => updateData({ experience: val })}
                    jobTitle={resumeData.personal_info?.profession}
                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(val) => updateData({ education: val })}
                  />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(val) => updateData({ skills: val })}
                    jobTitle={resumeData.personal_info?.profession}
                  />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectsForm
                    data={resumeData.project}
                    onChange={(val) => updateData({ project: val })}
                    jobTitle={resumeData.personal_info?.profession}
                  />
                )}
                {activeSection.id === 'template' && (
                  <TemplatePicker
                    template={resumeData.template}
                    accentColor={resumeData.accent_color}
                    onTemplateChange={(val) => updateData({ template: val })}
                    onColorChange={(val) => updateData({ accent_color: val })}
                  />
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 bg-slate-50">
                <button
                  onClick={() => setActiveSectionIndex((p) => Math.max(p - 1, 0))}
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-white rounded-lg transition disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-xs text-slate-400">{activeSectionIndex + 1} / {SECTIONS.length}</span>
                <button
                  onClick={() => setActiveSectionIndex((p) => Math.min(p + 1, SECTIONS.length - 1))}
                  disabled={activeSectionIndex === SECTIONS.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-white rounded-lg transition disabled:opacity-30"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right panel — live preview */}
          <div className="lg:col-span-7">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-600">Live Preview</p>
                <Link to={`/view/${resumeId}`} target="_blank"
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  <EyeIcon size={12} /> Open full preview
                </Link>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <div className="transform origin-top-left scale-[0.65] sm:scale-75 w-[155%] sm:w-[133%]">
                  <TemplateComponent data={resumeData} accentColor={resumeData.accent_color || '#3b82f6'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
