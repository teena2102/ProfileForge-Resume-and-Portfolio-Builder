import React, { useState } from 'react';
import { X, PlusIcon, Sparkles, Loader2 } from 'lucide-react';
import API from '../../utils/api';

const SkillsForm = ({ data = [], onChange, jobTitle }) => {
    const [input, setInput] = useState('');
    const [improving, setImproving] = useState(false);

    const addSkill = () => {
        const trimmed = input.trim();
        if (!trimmed || data.includes(trimmed)) return;
        onChange([...data, trimmed]);
        setInput('');
    };

    const removeSkill = (skill) => {
        onChange(data.filter((s) => s !== skill));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSuggest = async () => {
        setImproving(true);
        try {
            const { data: res } = await API.post('/resume/ai-improve', {
                section: 'skills',
                content: data.join(', '),
                jobTitle,
            });
            // Parse comma-separated skills from AI response
            const suggested = res.improved
                .split(',')
                .map((s) => s.replace(/^[\d\.\-\*\s]+/, '').trim())
                .filter((s) => s.length > 0 && s.length < 40);
            const merged = [...new Set([...data, ...suggested])];
            onChange(merged.slice(0, 20));
        } catch (err) {
            console.error(err);
        } finally {
            setImproving(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Skills</h3>
                <button type="button" onClick={handleSuggest} disabled={improving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition shadow-sm">
                    {improving ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {improving ? 'Suggesting...' : 'AI Suggest'}
                </button>
            </div>

            {/* Tag display */}
            <div className="flex flex-wrap gap-2 min-h-10">
                {data.map((skill) => (
                    <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-medium">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500 transition">
                            <X size={10} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a skill and press Enter or comma"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
                />
                <button type="button" onClick={addSkill}
                    className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                    <PlusIcon size={16} />
                </button>
            </div>
            <p className="text-xs text-slate-400">Press Enter or comma to add · {data.length} skills added</p>
        </div>
    );
};

export default SkillsForm;
