import React, { useState } from 'react';
import { PlusIcon, TrashIcon, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../../utils/api';

const emptyEntry = () => ({
    company: '', position: '', start_date: '', end_date: '', description: '', is_current: false,
    _id: Date.now().toString(),
});

const ExperienceForm = ({ data = [], onChange, jobTitle }) => {
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [improvingIdx, setImprovingIdx] = useState(null);

    const handleChange = (index, field, value) => {
        const updated = data.map((item, i) => i === index ? { ...item, [field]: value } : item);
        onChange(updated);
    };

    const addEntry = () => {
        onChange([...data, emptyEntry()]);
        setExpandedIndex(data.length);
    };

    const removeEntry = (index) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const handleImprove = async (index) => {
        const entry = data[index];
        if (!entry?.description?.trim()) return;
        setImprovingIdx(index);
        try {
            const { data: res } = await API.post('/resume/ai-improve', {
                section: 'experience',
                content: entry.description,
                jobTitle: entry.position || jobTitle,
            });
            handleChange(index, 'description', res.improved);
        } catch (err) {
            console.error(err);
        } finally {
            setImprovingIdx(null);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Work Experience</h3>
                <button type="button" onClick={addEntry}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-indigo-300 text-indigo-600 rounded-full hover:bg-indigo-50 transition">
                    <PlusIcon size={12} /> Add
                </button>
            </div>

            {data.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No experience added yet. Click "Add" to start.</p>
            )}

            {data.map((entry, index) => (
                <div key={entry._id || index} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-700">{entry.position || 'New Position'}</p>
                            <p className="text-xs text-slate-500">{entry.company || 'Company'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeEntry(index); }}
                                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition">
                                <TrashIcon size={14} />
                            </button>
                            {expandedIndex === index ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                    </div>

                    {/* Body */}
                    {expandedIndex === index && (
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Company</label>
                                    <input value={entry.company} onChange={(e) => handleChange(index, 'company', e.target.value)}
                                        placeholder="Company name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Position</label>
                                    <input value={entry.position} onChange={(e) => handleChange(index, 'position', e.target.value)}
                                        placeholder="Job title" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Start Date</label>
                                    <input type="month" value={entry.start_date} onChange={(e) => handleChange(index, 'start_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">End Date</label>
                                    <input type="month" value={entry.is_current ? '' : entry.end_date}
                                        onChange={(e) => handleChange(index, 'end_date', e.target.value)}
                                        disabled={entry.is_current}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 disabled:bg-gray-50 disabled:text-gray-400" />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={entry.is_current}
                                    onChange={(e) => handleChange(index, 'is_current', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                Currently working here
                            </label>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs text-slate-500">Description</label>
                                    <button type="button" onClick={() => handleImprove(index)} disabled={improvingIdx === index || !entry.description?.trim()}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition">
                                        {improvingIdx === index ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                        AI Improve
                                    </button>
                                </div>
                                <textarea value={entry.description} onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    placeholder="Describe your responsibilities, achievements, and impact..."
                                    rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 resize-none" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ExperienceForm;
