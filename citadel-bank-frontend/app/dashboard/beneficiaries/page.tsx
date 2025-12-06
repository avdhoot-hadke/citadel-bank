'use client';

import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
    Loader2, UserPlus, CheckCircle2, ShieldAlert, Plus, X,
    ChevronLeft, ChevronRight, ShieldCheck
} from 'lucide-react';

interface Beneficiary {
    id: number;
    name: string;
    accountNumber: string;
    active: boolean;
}

export default function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [currentBeneficiaryId, setCurrentBeneficiaryId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Fetch Data
    const fetchBeneficiaries = async (pageNum = 0) => {
        try {
            const res = await axios.get(`/api/beneficiaries?page=${pageNum}&size=5`);
            setBeneficiaries(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
            setPage(pageNum);
        } catch (error) {
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBeneficiaries(0); }, []);

    // 2. Add Beneficiary
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await axios.post('/api/beneficiaries', { name, accountNumber });
            toast.success("Contact added! Check email for OTP.");
            setShowAddModal(false);
            setName('');
            setAccountNumber('');
            fetchBeneficiaries(0); // Refresh list
        } catch (error: unknown) {
            if (isAxiosError(error)) toast.error(error.response?.data?.message || "Failed to add");
        } finally {
            setActionLoading(false);
        }
    };

    // 3. Verify OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBeneficiaryId) return;

        setActionLoading(true);
        try {
            await axios.post('/api/beneficiaries/validate-otp', {
                beneficiaryId: currentBeneficiaryId,
                otp: otp
            });
            toast.success("Identity Verified!");
            setShowOtpModal(false);
            setOtp('');
            fetchBeneficiaries(page); // Refresh current page
        } catch (error) {
            toast.error("Invalid Code");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Beneficiaries</h1>
                    <p className="text-slate-500">Manage your trusted contacts.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-500/20"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {beneficiaries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <UserPlus size={48} className="mx-auto mb-4 text-slate-300" />
                        <p>No beneficiaries yet. Add one to start transferring!</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Account Number</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {beneficiaries.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{b.name}</td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{b.accountNumber}</td>
                                        <td className="px-6 py-4">
                                            {b.active ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <CheckCircle2 size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                    <ShieldAlert size={12} /> Pending OTP
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!b.active && (
                                                <button
                                                    onClick={() => { setCurrentBeneficiaryId(b.id); setShowOtpModal(true); }}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                >
                                                    Verify Now
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchBeneficiaries(page - 1)}
                                    disabled={page === 0}
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => fetchBeneficiaries(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* --- ADD MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Add Contact</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nickname</label>
                                <input
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="e.g. Mom"
                                    value={name} onChange={e => setName(e.target.value)} required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                                <input
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                                    placeholder="10-digit number"
                                    value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required
                                    minLength={10} maxLength={10}
                                />
                            </div>
                            <button type="submit" disabled={actionLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center">
                                {actionLoading ? <Loader2 className="animate-spin" /> : "Add Contact"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- OTP MODAL --- */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Verify Identity</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">
                            Enter the 6-digit code sent to your email to activate this beneficiary.
                        </p>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <input
                                className="w-full text-center text-2xl tracking-widest p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                placeholder="000000"
                                maxLength={6}
                                value={otp} onChange={e => setOtp(e.target.value)} required
                            />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowOtpModal(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex justify-center">
                                    {actionLoading ? <Loader2 className="animate-spin" /> : "Verify"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}