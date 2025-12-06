'use client'
import React, { useEffect, useState, useMemo } from 'react';
import {
    Plus, ShieldCheck, Wallet, CreditCard, MoreHorizontal,
    ArrowRightLeft, Users, History,
    TrendingUp, TrendingDown // <--- 1. IMPORT THESE
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// --- INTERFACES ---
interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    accountType: string;
    username: string;
    email: string;
}

interface Transaction {
    id: number;
    description: string;
    amount: number;
    timestamp: string;
    status: string;
    sourceAccountNumber: string;
    targetAccountNumber: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [accRes, txnRes] = await Promise.all([
                    axios.get('/api/accounts'),
                    axios.get('/api/transactions/history', {
                        params: { page: 0, size: 10 }
                    })
                ]);

                if (Array.isArray(accRes.data)) {
                    setAccounts(accRes.data);
                } else if (accRes.data && Array.isArray(accRes.data.content)) {
                    setAccounts(accRes.data.content);
                } else {
                    setAccounts([]);
                }

                if (txnRes.data && Array.isArray(txnRes.data.content)) {
                    setTransactions(txnRes.data.content);
                } else {
                    setTransactions([]);
                }

            } catch (err) {
                console.error("Dashboard Error:", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    // --- CALCULATIONS ---
    const totalBalance = useMemo(() => {
        if (!Array.isArray(accounts)) return 0;
        return accounts.reduce((sum, acc) => sum + acc.balance, 0);
    }, [accounts]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const handleOpenAccount = async () => {
        router.push("/dashboard/accounts");
    };

    if (loading) return <DashboardSkeleton />;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    if (accounts.length === 0) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center text-center px-4">
                <div className="bg-indigo-50 p-6 rounded-full mb-6 text-indigo-600 animate-bounce">
                    <Wallet size={64} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {user?.username}</h1>
                <button onClick={handleOpenAccount} className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">
                    Open Savings Account
                </button>
            </div>
        );
    }

    const primaryAccount = accounts[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
                    <p className="text-slate-500">Welcome back, {primaryAccount.username}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Wallet size={18} />
                            <span className="text-sm font-medium uppercase tracking-wide">Total Balance</span>
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight mb-4">{formatCurrency(totalBalance)}</h2>
                        <div className="inline-flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50 text-sm text-emerald-400">
                            <TrendingUp size={14} /> <span>+2.4% this month</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Account Details */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                            <CreditCard size={24} />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{primaryAccount.accountType}</p>
                        <p className="text-xl font-bold text-slate-900">•••• {primaryAccount.accountNumber.slice(-4)}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="md:col-span-3">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/dashboard/transfer"><QuickAction icon={<ArrowRightLeft />} label="Transfer" /></Link>
                        <Link href="/dashboard/beneficiaries"><QuickAction icon={<Users />} label="Beneficiaries" /></Link>
                        <Link href="/dashboard/history"><QuickAction icon={<History />} label="History" /></Link>
                        <Link href="/dashboard/kyc"><QuickAction icon={<ShieldCheck />} label="Verify Identity" /></Link>
                    </div>
                </div>

                {/* --- 2. UPDATED TRANSACTIONS TABLE --- */}
                <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                        <Link href="/dashboard/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Transactions</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.length > 0 ? transactions.map((txn) => {
                                    const isDeposit = accounts.some(acc => acc.accountNumber === txn.targetAccountNumber);

                                    return (
                                        <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${isDeposit ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                        {isDeposit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{txn.description}</p>
                                                        <p className="text-xs text-slate-500">{isDeposit ? 'Credit' : 'Debit'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(txn.timestamp).toLocaleDateString()}
                                            </td>

                                            {/* Amount */}
                                            <td className={`px-6 py-4 text-right font-bold ${isDeposit ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {isDeposit ? '+' : '-'}{formatCurrency(txn.amount)}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No recent transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuickAction = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
        <div className="bg-slate-50 p-3 rounded-full text-slate-600 mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            {icon}
        </div>
        <span className="font-medium text-slate-700 group-hover:text-indigo-700">{label}</span>
    </div>
);

const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-48 bg-slate-200 rounded-2xl"></div>
            <div className="h-48 bg-slate-200 rounded-2xl"></div>
            <div className="md:col-span-3 h-32 bg-slate-200 rounded-2xl"></div>
            <div className="md:col-span-3 h-64 bg-slate-200 rounded-2xl"></div>
        </div>
    </div>
);