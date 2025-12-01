import { ArrowRight, Server } from "lucide-react";

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
            {/* Background Gradients/Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 hover:border-blue-300 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 relative">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-600 tracking-wide uppercase">
                        Citadel Core Banking System v1.0
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards">
                    Fortify Your Financial <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        Future
                    </span>
                </h1>

                <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 fill-mode-backwards">
                    Experience financial integrity with our Cryptographically Secured Ledger and Real-time Fraud Detection engine. No hidden fees. No revised history.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-200 fill-mode-backwards">
                    <button className="group transition-all duration-300 w-full sm:w-[220px]   inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700  shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
                        Open Account
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all hover:border-slate-300 shadow-sm hover:shadow-md">
                        View Ledger
                        <Server size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default Hero;