'use client';

import { AuthProvider } from '../context/AuthContext';
import { NavigationProvider } from '../context/NavigationContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NavigationProvider>
  );
} 