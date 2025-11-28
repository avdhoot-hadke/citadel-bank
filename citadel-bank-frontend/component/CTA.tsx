const CTASection = () => {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/30 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to secure your future?</h2>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Join over 10,000 forward-thinking companies trusting Citadel with their financial infrastructure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30">
                            Get Started Now
                        </button>
                        <button className="bg-transparent border-2 border-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-600 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default CTASection;
