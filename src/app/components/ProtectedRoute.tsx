'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Button from './button';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-green-500 mb-4">Acesso Restrito</h1>
          <p className="text-gray-300 text-lg mb-8">
            Esta página está disponível apenas para usuários cadastrados. 
            Por favor, faça login ou crie uma conta para acessar este conteúdo.
          </p>
          <Link href="/login">
            <Button variant="primary" className="px-8 py-3">
              Login / Cadastro
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 