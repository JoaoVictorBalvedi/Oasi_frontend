"use client"
// src/app/components/Header.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import Button from './button';

const Header = () => {
  const { user, logout } = useAuth();
  const { setView } = useNavigation();

  const handleLogout = () => {
    logout();
    setView('home');
  };
  
  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => setView('home')} 
          className="text-2xl font-bold text-green-500 hover:text-green-400 transition-colors cursor-pointer"
        >
          Oasi
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center">
          <li>
            <span 
              onClick={() => setView('home')} 
              className="hover:text-green-400 transition-colors cursor-pointer"
            >
              Home
            </span>
          </li>
          <li>
            <span 
              onClick={() => setView('produtos')} 
              className="hover:text-green-400 transition-colors cursor-pointer"
            >
              Produtos
            </span>
          </li>
          <li>
            <span 
              onClick={() => setView('comunidade')} 
              className="hover:text-green-400 transition-colors cursor-pointer"
            >
              Comunidade
            </span>
          </li>
          <li>
            <span 
              onClick={() => setView('vender')} 
              className="hover:text-green-400 transition-colors cursor-pointer"
            >
              Vender
            </span>
          </li>
          <li>
            <span 
              onClick={() => setView('carrinhos')} 
              className="hover:text-green-400 transition-colors cursor-pointer"
            >
              Carrinhos
            </span>
          </li>
        </ul>

        {/* Parte Direita do Header (Dinâmica) */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm hidden sm:block">Olá, {user.nome}!</span>
              <div 
                onClick={() => setView('conta')} 
                className="hover:text-green-400 transition-colors cursor-pointer"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded"
              >
                Sair
              </button>
            </>
          ) : (
            <div onClick={() => setView('login')}>
              <Button variant="primary">Login / Cadastro</Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;