// src/app/login/page.tsx
"use client";

import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../components/button';
import SectionTitle from '../components/SectionTitle';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
  });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const body = isLoginMode
      ? { email: formData.email, senha: formData.senha }
      : { nome: formData.nome, email: formData.email, senha: formData.senha, telefone: formData.telefone };

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro.');
      }
      
      setMessage({ text: data.message, type: 'success' });
      
      if (isLoginMode) {
        login(data.token, data.user);
        router.push('/conta'); // Redireciona para a página da conta após o login
      } else {
        // Após o registro, alterna para o modo de login para que o usuário possa entrar
        setIsLoginMode(true);
      }

    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl">
        <SectionTitle>{isLoginMode ? 'Login' : 'Criar Conta'}</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {!isLoginMode && (
            <input name="nome" type="text" placeholder="Nome Completo" onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded text-white" />
          )}
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded text-white" />
          <input name="senha" type="password" placeholder="Senha" onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded text-white" />
          {!isLoginMode && (
             <input name="telefone" type="tel" placeholder="Telefone (Opcional)" onChange={handleChange} className="w-full p-3 bg-gray-700 rounded text-white" />
          )}
          
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Aguarde...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}
          </Button>

          {message && (
            <p className={`mt-4 text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button onClick={() => setIsLoginMode(!isLoginMode)} className="ml-2 font-semibold text-green-400 hover:text-green-300">
            {isLoginMode ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;