'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    ShieldAlert, CheckCircle, XCircle, FileText, Activity,
    Link as LinkIcon, Loader2, Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// --- INTERFACES ---
interface KycDoc {
    id: number;
    documentType: string;
    documentUrl: string;
    status: string;
    user: { username: string; email: string };
}

interface FraudAlert {
    id: number;
    ruleName: string;
    reason: string;
    timestamp: string;
    user: { username: string };
}

interface LedgerBlock {
    id: number;
    transactionId: number;
    dataHash: string;
    previousHash: string;
    timestamp: string;
}

export default function AdminPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'KYC' | 'FRAUD' | 'LEDGER'>('KYC');

    // Data State
    const [kycDocs, setKycDocs] = useState<KycDoc[]>([]);
    const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
    const [ledger, setLedger] = useState<LedgerBlock[]>([]);
    const [fetching, setFetching] = useState(false);

    // --- 1. ROLE CHECK ---
    useEffect(() => {
        if (!isLoading) {
            if (!user || !user.roles.includes('ROLE_ADMIN')) {
                toast.error("Unauthorized: Admin Access Only");
                router.push('/dashboard');
            } else {
                fetchData(activeTab);
            }
        }
    }, [user, isLoading, activeTab]);

    // --- 2. FETCH DATA ---
    const fetchData = async (tab: string) => {
        setFetching(true);
        try {
            if (tab === 'KYC') {
                const res = await axios.get('/api/admin/kyc/pending'); // Need Proxy!
                setKycDocs(res.data.content || []);
            } else if (tab === 'FRAUD') {
                const res = await axios.get('/api/admin/fraud-alerts');
                setFraudAlerts(res.data.content || []);
            } else if (tab === 'LEDGER') {
                const res = await axios.get('/api/admin/ledger');
                setLedger(res.data.content || []);
            }
        } catch (error) {
            console.error("Admin Fetch Error", error);
        } finally {
            setFetching(false);
        }
    };

    // --- 3. ACTIONS ---
    const handleKycAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            await axios.post(`/api/admin/kyc/${id}/${action}`);
            toast.success(`Document ${action}d`);
            fetchData('KYC'); // Refresh
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleAudit = async () => {
        try {
            const res = await axios.get('/api/admin/ledger/audit');
            toast.success(res.data); // "Ledger Verified"
        } catch (error) {
            toast.error("Audit Failed");
        }
    };

    if (isLoading || !user) return <div className="p-20 text-center"><Loader2 className="animate-spin inline" /> Loading Admin...</div>;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <Lock className="text-red-600" /> Admin Console
                        </h1>
                        <p className="text-slate-500">System Monitoring & Compliance</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                        {['KYC', 'FRAUD', 'LEDGER'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <main>
                    {fetching ? (
                        <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-slate-400 w-8 h-8" /></div>
                    ) : (
                        <>
                            {/* --- KYC TAB --- */}
                            {activeTab === 'KYC' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {kycDocs.map(doc => (
                                        <div key={doc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                            <div className="h-48 bg-slate-100 relative group">
                                                {/* Image Preview (Click to open full) */}
                                                <a href={doc.documentUrl} target="_blank" rel="noreferrer">
                                                    <img src={doc.documentUrl} alt="Doc" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                </a>
                                            </div>
                                            <div className="p-5 flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase">{doc.documentType}</span>
                                                    <span className="text-xs text-slate-400">ID: {doc.id}</span>
                                                </div>
                                                <h3 className="font-bold text-slate-900">{doc.user.username}</h3>
                                                <p className="text-sm text-slate-500 mb-4">{doc.user.email}</p>

                                                <div className="flex gap-3 mt-auto">
                                                    <button
                                                        onClick={() => handleKycAction(doc.id, 'reject')}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-semibold"
                                                    >
                                                        <XCircle size={16} /> Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleKycAction(doc.id, 'approve')}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-semibold shadow-sm"
                                                    >
                                                        <CheckCircle size={16} /> Approve
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {kycDocs.length === 0 && <div className="col-span-full text-center p-12 text-slate-400">No pending documents.</div>}
                                </div>
                            )}

                            {/* --- FRAUD TAB --- */}
                            {activeTab === 'FRAUD' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                            <tr>
                                                <th className="p-4">User</th>
                                                <th className="p-4">Rule Triggered</th>
                                                <th className="p-4">Reason</th>
                                                <th className="p-4">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {fraudAlerts.map(alert => (
                                                <tr key={alert.id} className="hover:bg-red-50/10">
                                                    <td className="p-4 font-medium text-slate-900">{alert.user.username}</td>
                                                    <td className="p-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">{alert.ruleName}</span></td>
                                                    <td className="p-4 text-slate-600">{alert.reason}</td>
                                                    <td className="p-4 text-slate-400 text-xs font-mono">{new Date(alert.timestamp).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* --- LEDGER TAB --- */}
                            {activeTab === 'LEDGER' && (
                                <div className="space-y-4">
                                    <div className="flex justify-end">
                                        <button onClick={handleAudit} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700">
                                            <ShieldAlert size={18} /> Run Integrity Audit
                                        </button>
                                    </div>
                                    <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800">
                                        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                                            <h3 className="text-emerald-400 font-mono text-sm">Immutable Ledger Chain</h3>
                                        </div>
                                        <div className="divide-y divide-slate-800">
                                            {ledger.map(block => (
                                                <div key={block.id} className="p-4 font-mono text-xs hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex gap-4 mb-1">
                                                        <span className="text-slate-500 w-16">Block #{block.id}</span>
                                                        <span className="text-blue-400">TX ID: {block.transactionId}</span>
                                                        <span className="text-slate-600 ml-auto">{new Date(block.timestamp).toISOString()}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400">
                                                        <div className="truncate"><span className="text-slate-600 mr-2">PREV:</span>{block.previousHash}</div>
                                                        <div className="truncate"><span className="text-slate-600 mr-2">HASH:</span><span className="text-emerald-500">{block.dataHash}</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}