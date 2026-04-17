import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDown, ChevronUp } from 'lucide-react';

const emptyEntry = () => ({
    institution: '', degree: '', field: '', graduation_date: '', gpa: '',
    _id: Date.now().toString(),
});

const EducationForm = ({ data = [], onChange }) => {
    const [expandedIndex, setExpandedIndex] = useState(0);

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

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Education</h3>
                <button type="button" onClick={addEntry}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-indigo-300 text-indigo-600 rounded-full hover:bg-indigo-50 transition">
                    <PlusIcon size={12} /> Add
                </button>
            </div>

            {data.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No education added yet.</p>
            )}

            {data.map((entry, index) => (
                <div key={entry._id || index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div
                        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-700">{entry.degree || 'Degree'} {entry.field ? `in ${entry.field}` : ''}</p>
                            <p className="text-xs text-slate-500">{entry.institution || 'Institution'}</p>
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
                                <label className="text-xs text-slate-500 mb-1 block">Institution</label>
                                <input value={entry.institution} onChange={(e) => handleChange(index, 'institution', e.target.value)}
                                    placeholder="University / School name"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Degree</label>
                                    <input value={entry.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                        placeholder="B.Tech / B.Sc / M.Sc"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Field of Study</label>
                                    <input value={entry.field} onChange={(e) => handleChange(index, 'field', e.target.value)}
                                        placeholder="Computer Science"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Graduation Date</label>
                                    <input type="month" value={entry.graduation_date} onChange={(e) => handleChange(index, 'graduation_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">GPA / Grade</label>
                                    <input value={entry.gpa} onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                                        placeholder="3.8 / 4.0 (optional)"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default EducationForm;
