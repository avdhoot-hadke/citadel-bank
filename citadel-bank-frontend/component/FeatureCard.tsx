export const FeatureCard = ({ icon: Icon, title, description, badge }: { icon: any, title: string, description: string, badge?: string }) => (
    <div className="relative group p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-200 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                <Icon className="text-blue-600" size={28} />
            </div>

            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
                {badge && (
                    <span className="px-2 py-1 rounded text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                        {badge}
                    </span>
                )}
            </div>

            <p className="text-slate-600 leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);
export default FeatureCard;