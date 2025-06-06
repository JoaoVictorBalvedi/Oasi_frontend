'use client';

import React, { createContext, useContext, useState } from 'react';

type View = 'home' | 'produtos' | 'comunidade' | 'vender' | 'carrinhos' | 'conta' | 'login';

interface NavigationContextType {
  currentView: View;
  setView: (view: View) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('home');

  const setView = (view: View) => {
    setCurrentView(view);
  };

  return (
    <NavigationContext.Provider value={{ currentView, setView }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 