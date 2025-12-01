// DashboardLayout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from '@/component/Sidebar';
import Navbar from '@/component/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen relative text-white">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <Navbar />

            <main className="pt-20 min-h-screen relative">

                <Sidebar
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)}
                />

                <div
                    className={`transition-all duration-500  px-6 py-4 text-black min-h-screen
            ${isCollapsed ? "ml-16" : "ml-56"}
        `}
                >
                    {children}
                </div>
            </main>

        </div>
    );
}
