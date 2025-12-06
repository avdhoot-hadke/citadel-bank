'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Loader2, ChevronLeft, ChevronRight, Filter, Download,
    ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// 1. Interface Matches JSON exactly
interface Transaction {
    id: number;
    description: string;
    amount: number;
    timestamp: string;
    status: string;
    sourceAccountNumber: string; // Changed from Object to String
    targetAccountNumber: string; // Changed from Object to String
}

interface Account {
    id: number;
    accountNumber: string;
    accountType: string;
}

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // Store full object

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await axios.get('/api/accounts');
                if (res.data.length > 0) {
                    setAccounts(res.data);
                    setSelectedAccount(res.data[0]);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                toast.error("Failed to load accounts");
            }
        };
        fetchAccounts();
    }, []);

    // 2. Fetch History
    useEffect(() => {
        if (!selectedAccount) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/transactions/history', {
                    params: {
                        accountId: selectedAccount.id, // Send ID to backend
                        page: page,
                        size: 10
                    }
                });
                setTransactions(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [selectedAccount, page]); // Re-run when selectedAccount changes

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
                    <p className="text-slate-500">View and export your financial statements.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <select
                            value={selectedAccount?.id || ''}
                            onChange={(e) => {
                                const acc = accounts.find(a => a.id === Number(e.target.value));
                                if (acc) {
                                    setSelectedAccount(acc);
                                    setPage(0);
                                }
                            }}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.accountType} (•••• {acc.accountNumber.slice(-4)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>
                ) : transactions.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        No transactions found for this account.
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Description</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((txn) => {
                                    const isCredit = txn.targetAccountNumber === selectedAccount?.accountNumber;

                                    return (
                                        <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCredit ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{txn.description}</td>
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                                {formatDate(txn.timestamp)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${txn.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                                                    txn.status === 'FRAUD_DETECTED' ? 'bg-red-50 text-red-700' :
                                                        'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-xs text-slate-500">
                                Page {page + 1} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}