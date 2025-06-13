// src/app/conta/page.tsx
"use client"; // ESSENCIAL para usar hooks como useState e useEffect

import React, { useState, useEffect, FormEvent } from 'react';
import SectionTitle from "../components/SectionTitle";
import Button from "../components/button";
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

// Componente local simples para inputs do formulário
const FormInput = ({ label, type = 'text', id, value, placeholder, onChange, disabled = false, icon: Icon }: {
  label: string;
  type?: string;
  id: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  icon?: React.ElementType;
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors hover:border-gray-600 ${disabled ? 'opacity-60' : ''}`}
        disabled={disabled}
      />
    </div>
  </div>
);

export default function ContaPage() {
  // ID do usuário fixo para este exemplo, já que não temos login
  const userId = 1;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Buscar dados do usuário ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`); // Use a porta do seu backend
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do usuário.');
        }
        const data = await response.json();
        setNome(data.nome || '');
        setEmail(data.email || '');
        setTelefone(data.telefone || '');
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        setMessage({ text: error.message || 'Erro ao carregar dados.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]); // Dependência: userId (embora fixo, é uma boa prática)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao atualizar dados.');
      }
      setMessage({ text: 'Dados atualizados com sucesso!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao atualizar dados.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !nome && !email) { // Mostra loading inicial apenas se não houver dados ainda
    return (
      <div className="min-h-[calc(100vh-160px)] bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-400">Carregando dados da conta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-900 flex items-center justify-center px-2">
      <div className="w-full max-w-2xl">
        {/* Título alinhado à esquerda, acima do card */}
        <div className="mb-6">
          <SectionTitle className="text-left text-3xl font-bold text-green-500">Minha Conta</SectionTitle>
          <p className="text-gray-400 text-left mt-1 ml-1">Gerencie suas informações pessoais</p>
        </div>
        {/* Card do formulário */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700/60 transition-all hover:shadow-green-900/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900/50 text-green-100 border border-green-700/50' 
                  : 'bg-red-900/50 text-red-100 border border-red-700/50'
              }`}>
                {message.text}
              </div>
            )}
            <FormInput
              label="Nome Completo"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              disabled={isLoading}
              icon={FiUser}
            />
            <FormInput
              label="Endereço de Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              disabled={isLoading}
              icon={FiMail}
            />
            <FormInput
              label="Telefone"
              type="tel"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              disabled={isLoading}
              icon={FiPhone}
            />
            <div className="pt-4">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </div>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}