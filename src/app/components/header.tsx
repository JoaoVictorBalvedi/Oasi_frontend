"use client"
// src/app/components/Header.tsx
import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Importe o useAuth
import { useRouter } from 'next/navigation';
import Button from './button';

const Header = () => {
  const { user, logout } = useAuth(); // Use o contexto
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redireciona para a home após o logout
  };
  
  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50"> {/* Adicionado sticky top-0 z-50 para fixar no topo */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-500 hover:text-green-400 transition-colors">
          Oasi
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/produtos" className="hover:text-green-400 transition-colors">
              Produtos
            </Link>
          </li>
          <li>
            <Link href="/comunidade" className="hover:text-green-400 transition-colors">
              Comunidade
            </Link>
          </li>
          <li>
            {/* O link "Vender" estava no design original. Se você não criou uma página /vender, pode remover este item ou apontar para outra página */}
            <Link href="/vender" className="hover:text-green-400 transition-colors">
              Vender
            </Link>
          </li>
          <li>
            <Link href="/carrinhos" className="hover:text-green-400 transition-colors">
              Carrinhos
            </Link>
          </li>
        </ul>
        {/* Parte Direita do Header (Dinâmica) */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm hidden sm:block">Olá, {user.nome}!</span>
              <Link href="/conta">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:text-green-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary">Login / Cadastro</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;