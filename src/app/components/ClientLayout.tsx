'use client';

import Footer from './footer';
import Header from './header';
import Providers from './Providers';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  );
} 