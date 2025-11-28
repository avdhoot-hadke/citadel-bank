
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="text-black bg-slate-50 h-screen w-screen flex justify-center items-center">
            <div className="group relative p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-200 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 lg:w-1/3 sm:w-2/3 w-full py-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}