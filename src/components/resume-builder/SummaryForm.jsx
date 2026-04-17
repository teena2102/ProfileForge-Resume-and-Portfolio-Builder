import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import API from '../../utils/api';

const SummaryForm = ({ data, onChange, jobTitle }) => {
    const [improving, setImproving] = useState(false);

    const handleImprove = async () => {
        if (!data) return;
        setImproving(true);
        try {
            const { data: res } = await API.post('/resume/ai-improve', {
                section: 'summary',
                content: data,
                jobTitle,
            });
            onChange(res.improved);
        } catch (err) {
            console.error('AI improve failed:', err);
        } finally {
            setImproving(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Professional Summary</h3>
                <button
                    type="button"
                    onClick={handleImprove}
                    disabled={improving || !data?.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                >
                    {improving ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {improving ? 'Improving...' : 'Improve with AI'}
                </button>
            </div>
            <textarea
                value={data || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write a compelling 3-4 sentence professional summary that highlights your experience, key skills, and career goals..."
                className="w-full h-40 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 transition-colors resize-none"
            />
            <p className="text-xs text-slate-400">{data?.length || 0} characters · Aim for 150–250 characters</p>
        </div>
    );
};

export default SummaryForm;
