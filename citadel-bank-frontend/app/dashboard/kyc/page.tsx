'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck
} from 'lucide-react';

export default function KycPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [documentType, setDocumentType] = useState('AADHAAR');

    // UI States
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'LOADING' | 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED'>('LOADING');

    // 1. Fetch Current KYC Status on Load
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // Calls Next.js Proxy -> Spring Boot GET /api/kyc/status
                const res = await axios.get('/api/kyc/status');
                setStatus(res.data.status || 'NOT_SUBMITTED');
            } catch (e) {
                // If 404 or error, assume user hasn't submitted yet
                setStatus('NOT_SUBMITTED');
            }
        };
        fetchStatus();
    }, []);

    // 2. Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate Size (Max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            setFile(selectedFile);
            // Create preview only if it's an image
            if (selectedFile.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    // 3. Handle Upload
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        try {
            await axios.post('/api/kyc/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Document uploaded successfully!");
            setStatus('PENDING'); // Update UI immediately to Pending state
            setFile(null);
            setPreviewUrl(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    // --- RENDER STATES ---

    if (status === 'LOADING') {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
    }

    // STATE: APPROVED (Show Success, Hide Form)
    if (status === 'APPROVED') {
        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Identity Verification</h1>
                </div>
                <div className="p-10 text-center bg-white rounded-2xl shadow-sm border border-emerald-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-sm">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">You are Verified</h2>
                    <p className="text-slate-500 max-w-md">
                        Your identity has been successfully verified. You now have access to higher transaction limits and all banking features.
                    </p>
                </div>
            </div>
        );
    }

    // STATE: FORM (Not Submitted / Pending / Rejected)
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Identity Verification</h1>
                <p className="text-slate-500">Upload a government-issued ID to verify your account.</p>
            </div>

            {/* Status Banners */}
            {status === 'PENDING' && (
                <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800 flex items-start gap-3">
                    <Loader2 className="animate-spin mt-0.5" size={20} />
                    <div>
                        <p className="font-bold text-sm">Verification In Progress</p>
                        <p className="text-xs opacity-80 mt-1">
                            Your document is currently under review by our team. If you uploaded the wrong file, you can submit a new one below.
                        </p>
                    </div>
                </div>
            )}

            {status === 'REJECTED' && (
                <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-800 flex items-start gap-3">
                    <AlertCircle className="mt-0.5" size={20} />
                    <div>
                        <p className="font-bold text-sm">Verification Rejected</p>
                        <p className="text-xs opacity-80 mt-1">
                            Your previous document was rejected. Please ensure the image is clear, not expired, and all text is readable.
                        </p>
                    </div>
                </div>
            )}

            {/* Upload Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                <form onSubmit={handleUpload} className="space-y-6">

                    {/* Document Type Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {['AADHAAR', 'PAN', 'PASSPORT'].map((type) => (
                                <div
                                    key={type}
                                    onClick={() => setDocumentType(type)}
                                    className={`cursor-pointer rounded-xl border p-4 text-center text-sm font-medium transition-all ${documentType === type
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* File Dropzone */}
                    {!file ? (
                        <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors group">
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={32} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                                    <p className="text-sm text-slate-500 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // File Preview State
                        <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-4">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                                ) : (
                                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
                                        <FileText size={24} />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-slate-900 text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={clearFile}
                                className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? <Loader2 className="animate-spin" /> : <> <ShieldCheck size={18} /> Submit for Verification</>}
                    </button>
                </form>
            </div>
        </div>
    );
}