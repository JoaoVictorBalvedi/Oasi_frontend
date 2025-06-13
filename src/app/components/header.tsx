"use client"
// src/app/components/Header.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import Button from './button';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const { setView } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setView('home');
  };
  
  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50 w-full">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between relative">
        {/* Logo circular */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
            <Image src="/logo-oasi.png" alt="Logo Oasi" width={36} height={36} />
          </div>
          <span className="text-xl font-bold text-black hidden sm:block">Oasi</span>
        </div>
        {/* Menu desktop */}
        <ul className="hidden md:flex flex-1 justify-center space-x-8 text-base font-medium">
          <li><span onClick={() => setView('home')} className="hover:text-green-400 transition-colors cursor-pointer text-white">Home</span></li>
          <li><span onClick={() => setView('produtos')} className="hover:text-green-400 transition-colors cursor-pointer text-white">Produtos</span></li>
          <li><span onClick={() => setView('comunidade')} className="hover:text-green-400 transition-colors cursor-pointer text-green-400">Comunidade</span></li>
          <li><span onClick={() => setView('vender')} className="hover:text-green-400 transition-colors cursor-pointer text-green-400">Vender</span></li>
        </ul>
        {/* Menu mobile (hambúrguer) */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="md:hidden text-white hover:text-green-400 transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Avatar/usuário à direita */}
        <div className="flex items-center space-x-4 ml-4">
          {user ? (
            <>
              <div onClick={() => setView('carrinhos')} className="hover:text-green-400 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <div onClick={() => setView('conta')} className="hover:text-green-400 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded transition">Sair</button>
            </>
          ) : (
            <div onClick={() => setView('login')}>
              <Button variant="primary">Login / Cadastro</Button>
            </div>
          )}
        </div>
        {/* Dropdown mobile */}
        {menuOpen && (
          <ul className="absolute top-full left-0 right-0 bg-black shadow-lg flex flex-col items-center py-4 space-y-3 md:hidden animate-fade-in z-50">
            <li><span onClick={() => {setView('home');setMenuOpen(false);}} className="hover:text-green-400 transition-colors cursor-pointer text-white">Home</span></li>
            <li><span onClick={() => {setView('produtos');setMenuOpen(false);}} className="hover:text-green-400 transition-colors cursor-pointer text-white">Produtos</span></li>
            <li><span onClick={() => {setView('comunidade');setMenuOpen(false);}} className="hover:text-green-400 transition-colors cursor-pointer text-green-400">Comunidade</span></li>
            <li><span onClick={() => {setView('vender');setMenuOpen(false);}} className="hover:text-green-400 transition-colors cursor-pointer text-green-400">Vender</span></li>
            {user && (
              <li><span onClick={() => {setView('carrinhos');setMenuOpen(false);}} className="hover:text-green-400 transition-colors cursor-pointer text-white">Carrinhos</span></li>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;