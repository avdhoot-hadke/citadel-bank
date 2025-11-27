
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="text-black bg-slate-50 h-screen w-screen flex justify-center items-center" >
            <div className="bg-white shadow-xs rounded-4xl lg:w-1/3 sm:w-2/3 w-full py-12">
                {children}
            </div>
        </div>
    );
}