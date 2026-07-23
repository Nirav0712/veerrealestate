'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname]);

    // Define routes where Header and Footer should be hidden
    const hideNavigation =
        pathname?.startsWith('/admin') ||
        pathname === '/login' ||
        pathname === '/register';

    return (
        <>
            {!hideNavigation && <Header />}
            {children}
            {!hideNavigation && <Footer />}
        </>
    );
}
