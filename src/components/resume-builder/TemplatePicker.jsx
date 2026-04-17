import React from 'react';

const TEMPLATES = [
    { id: 'classic', label: 'Classic', color: '#3b82f6', description: 'Traditional & professional' },
    { id: 'minimal', label: 'Minimal', color: '#10b981', description: 'Clean & modern' },
    { id: 'minimal-image', label: 'Minimal+Photo', color: '#8b5cf6', description: 'With profile image' },
    { id: 'modern', label: 'Modern', color: '#f59e0b', description: 'Bold & dynamic' },
];

const ACCENT_COLORS = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#ec4899', '#14b8a6', '#6366f1', '#f97316', '#0ea5e9',
];

const TemplatePicker = ({ template, accentColor, onTemplateChange, onColorChange }) => {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Choose Template</h3>
                <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => onTemplateChange(t.id)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${template === t.id
                                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                        >
                            {/* Template preview thumbnail */}
                            <div
                                className="w-full h-16 rounded-lg mb-2 flex items-center justify-center"
                                style={{ backgroundColor: t.color + '20', borderLeft: `4px solid ${t.color}` }}
                            >
                                <div className="space-y-1 w-4/5">
                                    <div className="h-1.5 rounded-full" style={{ backgroundColor: t.color, width: '60%' }} />
                                    <div className="h-1 rounded-full bg-gray-300 w-full" />
                                    <div className="h-1 rounded-full bg-gray-300" style={{ width: '80%' }} />
                                    <div className="h-1 rounded-full bg-gray-200" style={{ width: '70%' }} />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-slate-700">{t.label}</p>
                            <p className="text-xs text-slate-400">{t.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Accent Color</h3>
                <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => onColorChange(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${accentColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                    {/* Custom color picker */}
                    <label className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition flex items-center justify-center overflow-hidden" title="Custom color">
                        <span className="text-xs text-gray-400">+</span>
                        <input type="color" value={accentColor} onChange={(e) => onColorChange(e.target.value)} className="opacity-0 absolute w-0 h-0" />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TemplatePicker;
