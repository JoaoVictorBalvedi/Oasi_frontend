'use client';

import Footer from './footer';
import Header from './header';
import Providers from './Providers';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </Providers>
  );
} 