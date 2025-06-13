// src/app/conta/page.tsx
"use client"; // ESSENCIAL para usar hooks como useState e useEffect

import React, { useState, useEffect, FormEvent } from 'react';
import SectionTitle from "../components/SectionTitle"; // Ajuste o caminho se necessário
import Button from "../components/button";       // Ajuste o caminho se necessário
import { FaTree, FaLeaf, FaSeedling } from 'react-icons/fa';

// Componente local simples para inputs do formulário
const FormInput = ({ label, type = 'text', id, value, placeholder, onChange, disabled = false }: {
  label: string;
  type?: string;
  id: string;
  value: string; // Agora é controlado
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value} // Controlado pelo estado
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
      disabled={disabled}
    />
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
  const [sustentabilidade, setSustentabilidade] = useState<{ arvores_plantadas: number, pontos_verdes: number, impacto_kg_co2: number } | null>(null);
  const [loadingSust, setLoadingSust] = useState(false);

  // Buscar dados do usuário ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`); // Use a porta do seu backend
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do usuário. Verifique se o ID do usuário existe no banco.');
        }
        const data = await response.json();
        setNome(data.nome || '');
        setEmail(data.email || '');
        setTelefone(data.telefone || '');
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        setMessage({ text: error.message || 'Erro ao carregar dados. Tente novamente.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]); // Dependência: userId (embora fixo, é uma boa prática)

  // Buscar dados de sustentabilidade
  useEffect(() => {
    async function fetchSust() {
      setLoadingSust(true);
      try {
        const res = await fetch(`http://localhost:3001/api/users/${userId}/sustentabilidade`);
        if (res.ok) {
          setSustentabilidade(await res.json());
        }
      } finally {
        setLoadingSust(false);
      }
    }
    fetchSust();
  }, [userId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, telefone }),
      });

      const data = await response.json(); // Tenta ler a resposta mesmo se não for ok, para pegar a mensagem de erro do backend

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao atualizar dados. Tente novamente.');
      }
      
      setMessage({ text: data.message || 'Dados atualizados com sucesso!', type: 'success' });

    } catch (error: any) {
      console.error("Erro ao atualizar dados:", error);
      setMessage({ text: error.message || 'Erro ao atualizar dados. Tente novamente.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Plantar árvore
  async function handlePlantarArvore() {
    setLoadingSust(true);
    await fetch(`http://localhost:3001/api/users/${userId}/plantar-arvore`, { method: 'POST' });
    // Atualiza painel
    const res = await fetch(`http://localhost:3001/api/users/${userId}/sustentabilidade`);
    if (res.ok) setSustentabilidade(await res.json());
    setLoadingSust(false);
  }

  if (isLoading && !nome && !email) { // Mostra loading inicial apenas se não houver dados ainda
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-xl">Carregando dados da conta...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <SectionTitle>Minha Conta</SectionTitle>

      <div className="mt-8 max-w-2xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {message && (
              <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
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
            />
            <FormInput
              label="Endereço de Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              disabled={isLoading}
            />
            <FormInput
              label="Telefone"
              type="tel"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              disabled={isLoading}
            />
            {/* Campos de senha foram removidos para simplificar, pois não estão na tabela e exigem hashing */}
            <div className="pt-4">
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Painel de sustentabilidade */}
      <div className="mt-8 max-w-2xl mx-auto bg-green-900/20 p-6 sm:p-8 rounded-lg shadow flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-1 flex flex-col items-center">
          <FaTree className="text-green-500 text-4xl mb-2" />
          <div className="text-2xl font-bold text-green-400">{loadingSust || !sustentabilidade ? '--' : sustentabilidade.arvores_plantadas}</div>
          <div className="text-green-200 text-sm">Árvores Plantadas</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <FaLeaf className="text-green-400 text-3xl mb-2" />
          <div className="text-2xl font-bold text-green-300">{loadingSust || !sustentabilidade ? '--' : sustentabilidade.pontos_verdes}</div>
          <div className="text-green-200 text-sm">Pontos Verdes</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <FaSeedling className="text-green-300 text-3xl mb-2" />
          <div className="text-2xl font-bold text-green-200">{loadingSust || !sustentabilidade ? '--' : sustentabilidade.impacto_kg_co2 + ' kg'}</div>
          <div className="text-green-200 text-sm">CO₂ Economizado</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <button onClick={handlePlantarArvore} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition mt-4 sm:mt-0" disabled={loadingSust}>
            {loadingSust ? 'Plantando...' : 'Plantar Árvore'}
          </button>
        </div>
      </div>
    </div>
  );
}