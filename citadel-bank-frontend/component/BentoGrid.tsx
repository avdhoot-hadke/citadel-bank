import {
    ArrowRight,
    ChevronRight,
    FileCheck, // For KYC
    BellRing,  // For Notifications
    Link as LinkIcon,
    Lock,
    ShieldCheck
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const BentoGrid = () => {
    return (
        <section id="features" className="py-24 bg-slate-50 relative">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="md:flex md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Infrastructure you can trust.
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Built on a foundation of cryptographic proof and redundant security systems.
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold mt-4 md:mt-0 group bg-blue-50 px-4 py-2 rounded-full transition-colors">
                        Read the documentation <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Ledger */}
                    <FeatureCard
                        icon={LinkIcon}
                        title="Immutable Ledger"
                        description="Every transaction is SHA-256 hashed and chained. Once committed, history cannot be rewritten or tampered with."
                        badge="SHA-256"
                    />

                    {/* Card 2: Fraud */}
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Fraud Guard"
                        description="Velocity checks and rule-based algorithms block suspicious activity in milliseconds, protecting assets before they leave."
                        badge="ALGORITHM"
                    />

                    {/* Card 3: Notifications (Replaces Global Exchange) */}
                    <FeatureCard
                        icon={BellRing}
                        title="Smart Notifications"
                        description="Async event-driven architecture delivering real-time OTPs and security alerts via secure SMTP gateways."
                        badge="REAL-TIME"
                    />

                    {/* Large Bottom Card (Span 2) - KYC Implementation */}
                    <div className="md:col-span-2 relative p-8 rounded-3xl bg-white border border-slate-200 overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="grid grid-cols-3 gap-2">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-12 h-12 rounded-lg bg-indigo-600 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                                    <FileCheck className="text-indigo-600" size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Digital Onboarding (KYC)</h3>
                                <p className="text-slate-600 max-w-md">
                                    Seamless identity verification with secure document upload via Cloudinary. Integrated Admin workflows ensure compliance and trust.
                                </p>
                            </div>
                            <div className="mt-8">
                                <div className="inline-flex items-center gap-2 text-sm text-indigo-600 font-bold cursor-pointer hover:text-indigo-700 hover:underline decoration-2 underline-offset-4">
                                    Verify Identity <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Card (Span 1) - Multi-Layer Security */}
                    <div className="relative p-8 rounded-3xl bg-gradient-to-b from-blue-600 to-indigo-700 border border-blue-600 flex flex-col justify-center items-center text-center shadow-lg shadow-blue-900/20 text-white">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-float backdrop-blur-sm border border-white/20">
                            <Lock size={40} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Multi-Layer Security</h3>
                        <p className="text-blue-100 text-sm mb-6">
                            JWT Stateless Auth.<br />
                            Transaction PINs.<br />
                            API Rate Limiting.<br />
                            Encrypted Data.
                        </p>
                        <button className="w-full py-2 rounded-lg bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md">
                            View Specs
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BentoGrid;