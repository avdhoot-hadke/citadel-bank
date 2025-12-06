'use client'

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Lock, Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            await logout();
            toast.success("Logged out successfully");
            router.push('/');
            router.refresh();
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <nav className={`fixed top-0 w-full shadow-2xs  z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'backdrop-blur-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all">
                                <ShieldCheck size={18} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                Citadel
                            </span>
                        </div>
                    </Link>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Features</Link>
                        {/* <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Enterprise</a> */}
                        {/* <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Developers</a> */}
                        <div className="h-4 w-px bg-slate-200 mx-2"></div>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 cursor-pointer text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"                                >
                                    Log Out
                                </button>

                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin">
                                    <button className="bg-slate-900 cursor-pointer text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                        Log In
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden  border-b border-slate-200 animate-in slide-in-from-top-5 duration-200 shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <a href="#" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md">Features</a>
                        <div className="border-t border-slate-100 my-2 bg-yellow-200"></div>
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 cursor-pointer w-full text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin">
                                    <button className="bg-slate-900 w-full cursor-pointer text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                        Log In
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar