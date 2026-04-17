import React, { useRef, useState } from 'react';
import { Camera, X, Loader2, Eraser } from 'lucide-react';
import API from '../../utils/api';

const PersonalInfoForm = ({ data, onChange, resumeId }) => {
    const [uploading, setUploading] = useState(false);
    const [removingBg, setRemovingBg] = useState(false);
    const fileRef = useRef();

    const handleChange = (e) => {
        onChange({ ...data, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data: res } = await API.post('/resume/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onChange({ ...data, image: res.url, imageFileId: res.fileId });
        } catch (err) {
            // Fallback: show local preview if upload fails
            const localUrl = URL.createObjectURL(file);
            onChange({ ...data, image: localUrl, imageFileId: '' });
            console.error('Image upload failed, using local preview:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveBackground = async () => {
        if (!data?.image) return;
        setRemovingBg(true);
        try {
            // Dynamically import to avoid loading the large WASM module on startup
            const { removeBackground } = await import('@imgly/background-removal');

            // Fetch the image as a blob (handles both data URLs and remote URLs)
            const imgBlob = await fetch(data.image).then(r => r.blob());

            // Run in-browser background removal (no API key needed)
            const resultBlob = await removeBackground(imgBlob);

            // Convert blob to base64 data URL for immediate preview
            const reader = new FileReader();
            reader.onload = async () => {
                const pngDataUrl = reader.result;

                // Upload the bg-removed PNG to ImageKit
                try {
                    const file = new File([resultBlob], 'profile-nobg.png', { type: 'image/png' });
                    const formData = new FormData();
                    formData.append('image', file);
                    const { data: res } = await API.post('/resume/upload-image', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    onChange({ ...data, image: res.url, imageFileId: res.fileId });
                } catch {
                    // If upload fails, use local data URL
                    onChange({ ...data, image: pngDataUrl });
                }
                setRemovingBg(false);
            };
            reader.readAsDataURL(resultBlob);
        } catch (err) {
            console.error('Background removal failed:', err);
            setRemovingBg(false);
        }
    };

    const removeImage = () => {
        onChange({ ...data, image: '', imageFileId: '' });
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Personal Information</h3>

            {/* Profile Image */}
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full flex-shrink-0">
                    {data?.image ? (
                        <>
                            <img src={data.image} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                            >
                                <X size={10} />
                            </button>
                        </>
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-dashed border-indigo-200">
                            <Camera size={24} className="text-indigo-400" />
                        </div>
                    )}
                    {(uploading || removingBg) && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                            <Loader2 size={18} className="text-white animate-spin" />
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleImageUpload} />
                    <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                        disabled={uploading || removingBg}
                        className="block w-full px-3 py-1.5 text-sm border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-60"
                    >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    {/* Background Removal Button */}
                    {data?.image && (
                        <button
                            type="button"
                            onClick={handleRemoveBackground}
                            disabled={removingBg || uploading}
                            className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-sm border border-violet-300 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors disabled:opacity-60"
                        >
                            {removingBg ? (
                                <><Loader2 size={12} className="animate-spin" /> Removing BG...</>
                            ) : (
                                <><Eraser size={12} /> Remove Background</>
                            )}
                        </button>
                    )}
                    <p className="text-xs text-slate-400">AI removes background in-browser</p>
                </div>
            </div>

            {/* Fields */}
            {[
                { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'John Doe' },
                { label: 'Profession / Job Title', name: 'profession', type: 'text', placeholder: 'Software Engineer' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'john@example.com' },
                { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+1 234 567 890' },
                { label: 'Location', name: 'location', type: 'text', placeholder: 'New York, USA' },
                { label: 'LinkedIn URL', name: 'linkedin', type: 'url', placeholder: 'https://linkedin.com/in/...' },
                { label: 'Website / Portfolio', name: 'website', type: 'url', placeholder: 'https://yoursite.com' },
            ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                    <input
                        type={type}
                        name={name}
                        value={data?.[name] || ''}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                </div>
            ))}
        </div>
    );
};

export default PersonalInfoForm;
