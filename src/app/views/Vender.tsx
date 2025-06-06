// src/app/vender/page.tsx
"use client";

import ProtectedRoute from '../components/ProtectedRoute';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/button';
import ProductCard from "../components/ProductCard"; // Vamos reusar o ProductCard para listar
import { FormEvent, useEffect, useState } from 'react';

// Interface para os dados do formulário e do produto
interface ProductFormData {
  nome: string;
  preco: string; // Manter como string no form, converter para número ao enviar
  nivel_sustentabilidade: string; // Pode ser string ou number
  descricao: string;
  imagem_url: string;
}

interface Product extends ProductFormData {
  id: number;
  id_vendedor: number;
}

const initialFormState: ProductFormData = {
  nome: '',
  preco: '',
  nivel_sustentabilidade: '',
  descricao: '',
  imagem_url: '',
};

// Componente local simples para inputs do formulário (igual ao da página de conta, pode ser movido para /components/ui se quiser)
const FormInputVender = ({ label, type = 'text', id, name, value, placeholder, onChange, isTextArea = false, disabled = false }: {
  label: string;
  type?: string;
  id: string;
  name: keyof ProductFormData; // Para tipagem
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  disabled?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        id={id}
        name={name}
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        disabled={disabled}
      />
    )}
  </div>
);

export default function VenderPage() {
  const idVendedorLogado = 1; // Usuário hardcoded para a aula

  const [formData, setFormData] = useState<ProductFormData>(initialFormState);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const fetchUserProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${idVendedorLogado}/products`);
      if (!response.ok) {
        throw new Error('Falha ao buscar produtos do usuário.');
      }
      const data = await response.json();
      setUserProducts(data);
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao carregar produtos.', type: 'error' });
      setUserProducts([]); // Limpa em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, [idVendedorLogado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!formData.nome || !formData.preco) {
        setMessage({ text: 'Nome e preço são obrigatórios.', type: 'error'});
        setIsLoading(false);
        return;
    }
    const precoNumerico = parseFloat(formData.preco);
    if (isNaN(precoNumerico) || precoNumerico < 0) {
        setMessage({ text: 'Preço inválido.', type: 'error'});
        setIsLoading(false);
        return;
    }

    try {
      const productDataToSend = {
        ...formData,
        preco: precoNumerico, // Envia como número
        nivel_sustentabilidade: formData.nivel_sustentabilidade ? parseInt(formData.nivel_sustentabilidade) : null,
        id_vendedor: idVendedorLogado,
      };

      const response = await fetch(`http://localhost:3001/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productDataToSend),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Falha ao cadastrar produto.');
      }
      
      setMessage({ text: result.message || 'Produto cadastrado com sucesso!', type: 'success' });
      setFormData(initialFormState); // Limpa o formulário
      fetchUserProducts(); // Re-busca a lista de produtos para incluir o novo

    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao cadastrar produto.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <SectionTitle>Vender na Oasi</SectionTitle>
        <div className="mt-8 grid gap-8">
          {/* Formulário de cadastro de produto */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-6">
              Cadastrar Novo Produto
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={4}
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-gray-300 mb-2">
                  Preço
                </label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  step="0.01"
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="sustentabilidade" className="block text-sm font-medium text-gray-300 mb-2">
                  Nível de Sustentabilidade (1-5)
                </label>
                <input
                  type="number"
                  id="sustentabilidade"
                  name="sustentabilidade"
                  min="1"
                  max="5"
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Cadastrar Produto
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}