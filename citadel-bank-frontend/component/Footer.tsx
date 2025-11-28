import { Lock, ShieldCheck } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                <ShieldCheck size={14} />
                            </div>
                            <span className="font-bold text-lg text-slate-900">Citadel</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">
                            The next generation of banking infrastructure, built for the digital age.
                        </p>
                        <div className="flex gap-4">
                            {/* Social placeholders */}
                            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                                <span className="font-bold text-xs">𝕏</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                                <span className="font-bold text-xs">in</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Ledger</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Payments</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Exchange</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Cards</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Legal</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Developers</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2025 Citadel Bank Technologies Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono">
                        <span>Built with Spring Boot & Next.js</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;