'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Wallet, Shield, CheckCircle2, Loader2, PiggyBank, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    accountType: string;
}

export default function AccountsPage() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // State for the "Open Account" Modal/Section
    const [showCreateFlow, setShowCreateFlow] = useState(false);
    const [selectedType, setSelectedType] = useState<'SAVINGS' | 'CHECKING'>('SAVINGS');

    // 1. Fetch Accounts
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/accounts');
            if (Array.isArray(res.data)) {
                setAccounts(res.data);
            }
        } catch (error) {
            toast.error("Failed to load accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // 2. Handle Creation
    const handleCreateAccount = async () => {
        try {
            setCreating(true);
            await axios.post('/api/accounts', { accountType: selectedType });

            toast.success(`${selectedType} Account Opened!`);
            setShowCreateFlow(false);
            fetchAccounts(); // Refresh list
            router.refresh();
        } catch (error) {
            toast.error("Failed to open account. Try again.");
        } finally {
            setCreating(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Accounts</h1>
                    <p className="text-slate-500">Manage your banking portfolios and open new accounts.</p>
                </div>
                {!showCreateFlow && (
                    <button
                        onClick={() => setShowCreateFlow(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} /> Open New Account
                    </button>
                )}
            </div>

            {/* --- CREATE ACCOUNT SECTION (Conditional Render) --- */}
            {showCreateFlow && (
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Select Account Type</h2>
                        <button onClick={() => setShowCreateFlow(false)} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Savings Option */}
                        <div
                            onClick={() => setSelectedType('SAVINGS')}
                            className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col gap-3 ${selectedType === 'SAVINGS' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedType === 'SAVINGS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <PiggyBank size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Citadel Savings</h3>
                                <p className="text-sm text-slate-500">High yield savings for your future.</p>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1 mt-2">
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 5.00% APY Interest</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Monthly Payouts</li>
                            </ul>
                        </div>

                        {/* Checking Option */}
                        <div
                            onClick={() => setSelectedType('CHECKING')}
                            className={`cursor-pointer p-5 rounded-xl border-2 transition-all flex flex-col gap-3 ${selectedType === 'CHECKING' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedType === 'CHECKING' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Citadel Checking</h3>
                                <p className="text-sm text-slate-500">Day-to-day spending with zero fees.</p>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1 mt-2">
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Zero Maintenance Fees</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Instant Transfers</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleCreateAccount}
                        disabled={creating}
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {creating ? <Loader2 className="animate-spin" /> : 'Confirm & Open Account'}
                    </button>
                </div>
            )}

            {/* --- EXISTING ACCOUNTS LIST --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((acc) => (
                    <div key={acc.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">

                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-blue-50"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {acc.accountType === 'SAVINGS' ? <PiggyBank size={24} /> : <Wallet size={24} />}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${acc.accountType === 'SAVINGS' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {acc.accountType}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-slate-500 font-medium">Account Balance</p>
                                <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(acc.balance)}</h3>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Number</p>
                                    <p className="font-mono text-slate-700 mt-1 flex items-center gap-2">
                                        {acc.accountNumber}
                                    </p>
                                </div>
                                <Shield className="text-slate-200" size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}