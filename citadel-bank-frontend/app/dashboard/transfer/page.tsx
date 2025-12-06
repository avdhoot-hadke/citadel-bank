'use client';

import { useEffect, useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2, ShieldCheck, Wallet, UserCheck, ChevronDown } from 'lucide-react';

interface Account {
    id: number;
    accountNumber: string;
    balance: number;
    accountType: string;
}

interface Beneficiary {
    id: number;
    name: string;
    accountNumber: string;
    active: boolean;
}

export default function TransferPage() {
    const router = useRouter();

    // State
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [targetAccount, setTargetAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [pin, setPin] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. Fetch User Accounts & Beneficiaries
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetching
                const [accRes, benRes] = await Promise.all([
                    axios.get<Account[]>('/api/accounts'),
                    axios.get('/api/beneficiaries?size=100') // Get all for dropdown
                ]);

                if (Array.isArray(accRes.data) && accRes.data.length > 0) {
                    setAccounts(accRes.data);
                    setSelectedAccount(accRes.data[0].accountNumber);
                }

                // Only show ACTIVE beneficiaries
                const activeBeneficiaries = (benRes.data.content || []).filter((b: Beneficiary) => b.active);
                setBeneficiaries(activeBeneficiaries);

            } catch (error) {
                toast.error("Failed to load banking data");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    // 2. Handle Transfer
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/transactions/transfer', {
                sourceAccountNumber: selectedAccount,
                targetAccountNumber: targetAccount,
                amount: parseFloat(amount),
                description: description || "Transfer",
                pin: pin
            });

            toast.success("Transfer Successful!");
            router.push('/dashboard');
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                // Handle Spring Boot Error Message
                const msg = error.response?.data?.message || "Transfer failed";
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;

    const currentAcc = accounts.find(a => a.accountNumber === selectedAccount);
    const currentBalance = currentAcc?.balance || 0;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Transfer Money</h1>
                <p className="text-slate-500">Securely send funds to another Citadel account.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                <form onSubmit={handleTransfer} className="space-y-6">

                    {/* FROM: Select Account */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">From Account</label>
                        <div className="relative">
                            <select
                                value={selectedAccount}
                                onChange={(e) => setSelectedAccount(e.target.value)}
                                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none text-slate-900 font-medium"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.accountNumber}>
                                        {acc.accountType} - •••• {acc.accountNumber.slice(-4)} (${acc.balance})
                                    </option>
                                ))}
                            </select>
                            <Wallet className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        </div>
                        <p className="text-xs text-right mt-2 text-slate-500">
                            Available: <span className="font-bold text-emerald-600">${currentBalance}</span>
                        </p>
                    </div>

                    {/* TO: Target Account (Smart Input) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Recipient</label>

                        {/* Option A: Dropdown if beneficiaries exist */}
                        {beneficiaries.length > 0 && (
                            <div className="mb-3 relative">
                                <select
                                    onChange={(e) => setTargetAccount(e.target.value)}
                                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-slate-900"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a beneficiary...</option>
                                    {beneficiaries.map(b => (
                                        <option key={b.id} value={b.accountNumber}>
                                            {b.name} ({b.accountNumber})
                                        </option>
                                    ))}
                                </select>
                                <UserCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                            </div>
                        )}

                        {/* Option B: Manual Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Or enter 10-digit account number manually"
                                value={targetAccount}
                                onChange={(e) => setTargetAccount(e.target.value)}
                                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
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
                                    className="w-full p-3 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-900"
                                    required
                                    min="1"
                                    step="0.01"
                                    max={currentBalance}
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
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* PIN Authorization */}
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <label className="block text-sm font-medium text-indigo-900 mb-2">Authorize with PIN</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Enter 4-digit PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full p-3 pl-10 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all tracking-widest font-bold"
                                required
                                maxLength={4}
                            />
                            <ShieldCheck className="absolute left-3 top-3.5 text-indigo-400" size={18} />
                        </div>
                        <p className="text-xs text-indigo-600/70 mt-2 flex items-center gap-1">
                            <ShieldCheck size={12} /> Secure Transaction via Citadel Protocol
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading || parseFloat(amount) > currentBalance || !targetAccount || pin.length < 4}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Transfer Funds <ArrowRight size={20} /></>}
                    </button>

                </form>
            </div>
        </div>
    );
}