'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2, ShieldCheck, Wallet, UserCheck } from 'lucide-react';

interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    accountType: string;
}

export default function TransferPage() {
    const router = useRouter();

    // State
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [targetAccount, setTargetAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [pin, setPin] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. Fetch User Accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await axios.get<Account[]>('/api/accounts');
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setAccounts(res.data);
                    setSelectedAccount(res.data[0].accountNumber);
                }
            } catch (error) {
                toast.error("Failed to load accounts");
            } finally {
                setFetching(false);
            }
        };
        fetchAccounts();
    }, []);

    // 2. Handle Transfer
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the Next.js Route Handler Proxy
            await axios.post('/api/transactions/transfer', {
                sourceAccountNumber: selectedAccount,
                targetAccountNumber: targetAccount,
                amount: parseFloat(amount),
                description: description || "Transfer",
                pin: pin
            });

            toast.success("Transfer Successful!");
            router.push('/dashboard');
        } catch (error: any) {
            const msg = error.response?.data?.message || "Transfer failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    // Get selected account details for validation UI
    const currentAcc = accounts.find(a => a.accountNumber === selectedAccount);
    const currentBalance = currentAcc?.balance || 0;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Transfer Money</h1>
                <p className="text-slate-500">Securely send funds to another Citadel account.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleTransfer} className="space-y-6">

                    {/* FROM: Select Account */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">From Account</label>
                        <div className="relative">
                            <select
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-900"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.accountNumber}>
                                        {acc.accountType} - •••• {acc.accountNumber.slice(-4)} (${acc.balance})
                                    </option>
                                ))}
                            </select>
                            <Wallet className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                        <p className="text-xs text-right mt-2 text-slate-500">
                            Available: <span className="font-bold text-emerald-600">${currentBalance}</span>
                        </p>
                    </div>

                    {/* TO: Target Account */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Account Number</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter 10-digit account number"
                                value={targetAccount}
                                onChange={(e) => setTargetAccount(e.target.value)}
                                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                                minLength={10}
                                maxLength={10}
                            />
                            <UserCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    {/* Amount & Note */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-500 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                    min="1"
                                    max={currentBalance} // UI Validation
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Note (Optional)</label>
                            <input
                                type="text"
                                placeholder="Lunch, Rent..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* PIN Authorization */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Authorize with PIN</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter 4-digit PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                                maxLength={4}
                            />
                            <ShieldCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading || parseFloat(amount) > currentBalance || !targetAccount || !pin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Transfer Funds <ArrowRight size={20} /></>}
                    </button>

                </form>
            </div>
        </div>
    );
}