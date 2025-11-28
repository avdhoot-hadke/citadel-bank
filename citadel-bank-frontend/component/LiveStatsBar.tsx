import { Activity, Globe, ShieldCheck } from "lucide-react";

const LiveStatsBar = () => {
    return (
        <div className="w-full bg-white border-y border-slate-200 overflow-hidden py-3 relative shadow-sm z-20">
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

            <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm font-mono text-slate-500 items-center">
                {/* Duplicating content for seamless loop */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-12 items-center">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            BLOCK HEIGHT: <span className="text-slate-900 font-semibold">14,052,991</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-blue-600" />
                            SECURED: <span className="text-slate-900 font-semibold">$1.24B</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Activity size={14} className="text-purple-600" />
                            TPS: <span className="text-slate-900 font-semibold">4,200</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-emerald-500">●</span>
                            SYSTEM STATUS: <span className="text-slate-900 font-semibold">OPERATIONAL</span>
                        </span>
                        {/* <span className="flex items-center gap-2">
                            <Globe size={14} className="text-indigo-600" />
                            NODES: <span className="text-slate-900 font-semibold">842</span>
                        </span> */}
                    </div>
                ))}
            </div>

            {/* Inline styles for custom marquee animation since it's not default Tailwind */}
            <style>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
};

export default LiveStatsBar