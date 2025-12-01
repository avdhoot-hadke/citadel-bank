// Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Wallet, ArrowRightLeft, Users, History, FileCheck,
    ShieldCheck, X, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', href: '/dashboard/accounts', icon: Wallet },
    { name: 'Transfer', href: '/dashboard/transfer', icon: ArrowRightLeft },
    { name: 'Beneficiaries', href: '/dashboard/beneficiaries', icon: Users },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'KYC Verification', href: '/dashboard/kyc', icon: FileCheck },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>

            <aside
                className={`fixed top-20 left-0 h-[calc(100vh-80px)] bg-slate-900 text-white transition-all duration-500
        ${isCollapsed ? "w-16" : "w-56"}
    `}
            >
                {/* Toggle button */}
                <button
                    onClick={onToggle}
                    className="block absolute -right-3 top-4 bg-blue-600 rounded-full p-1 shadow-lg hover:bg-blue-500 transition"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <nav className="flex-1 px-2 py-6 overflow-y-auto space-y-1">
                    {sidebarLinks.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all 
                                    ${active ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white' : 'hover:bg-slate-800 text-slate-300'}
                                    ${isCollapsed && 'justify-center'}
                                `}
                                title={isCollapsed ? item.name : ''}
                            >
                                <Icon size={20} />
                                <span
                                    className={`whitespace-nowrap overflow-hidden transition-all duration-1000 delay-1000
                                    ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto ml-2"}
                                    `}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
