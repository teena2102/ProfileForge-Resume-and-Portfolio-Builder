import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import API from '../../utils/api';

const emptyEntry = () => ({
    name: '', type: '', description: '', _id: Date.now().toString(),
});

const ProjectsForm = ({ data = [], onChange, jobTitle }) => {
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

    const removeEntry = (index) => onChange(data.filter((_, i) => i !== index));

    const handleImprove = async (index) => {
        const entry = data[index];
        if (!entry?.description?.trim()) return;
        setImprovingIdx(index);
        try {
            const { data: res } = await API.post('/resume/ai-improve', {
                section: 'project',
                content: entry.description,
                jobTitle,
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
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Projects</h3>
                <button type="button" onClick={addEntry}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-indigo-300 text-indigo-600 rounded-full hover:bg-indigo-50 transition">
                    <PlusIcon size={12} /> Add
                </button>
            </div>

            {data.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No projects added yet.</p>
            )}

            {data.map((entry, index) => (
                <div key={entry._id || index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div
                        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-700">{entry.name || 'New Project'}</p>
                            <p className="text-xs text-slate-500">{entry.type || 'Type'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeEntry(index); }}
                                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition">
                                <TrashIcon size={14} />
                            </button>
                            {expandedIndex === index ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                    </div>

                    {expandedIndex === index && (
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Project Name</label>
                                <input value={entry.name} onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    placeholder="e.g. E-Commerce Platform"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Type / Category</label>
                                <input value={entry.type} onChange={(e) => handleChange(index, 'type', e.target.value)}
                                    placeholder="e.g. Web Application, Mobile App"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                            </div>
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
                                    placeholder="Describe what you built, technologies used, and impact..."
                                    rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 resize-none" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProjectsForm;
