'use client'

import { usePathname } from 'next/navigation';
import List from '../list';
import Navbar from '../navbar';
import Footer from '../foot';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login/signin' || pathname === '/login/signup';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-[#0c1322]">
            <List />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
} 