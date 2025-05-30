// src/app/components/Header.tsx
import Link from 'next/link';

const Header = () => {
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
        {/* Profile Icon/Link para Configurações da Conta */}
        <div>
          {/* Certifique-se que este href aponta para a sua página de configurações da conta */}
          <Link href="/conta" className="hover:text-green-400 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8" // Removido hover daqui, pois já está no Link pai
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;