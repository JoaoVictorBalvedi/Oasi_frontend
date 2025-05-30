// src/app/vender/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import SectionTitle from "../components/SectionTitle";
import Button from "../components/button";
import ProductCard from "../components/ProductCard"; // Vamos reusar o ProductCard para listar

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
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Seção para Adicionar Novo Produto */}
      <SectionTitle>Cadastrar Novo Produto para Venda</SectionTitle>
      <p className="text-gray-400 mb-8">Adicione os detalhes do seu produto.</p>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl mb-12">
        <form onSubmit={handleSubmitProduct}>
          {message && (
            <div className={`p-3 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
              {message.text}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 md:col-span-1">
              <FormInputVender label="Nome do produto" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome claro e descritivo" disabled={isLoading} />
              <FormInputVender label="Preço (R$)" type="number" id="preco" name="preco" value={formData.preco} onChange={handleInputChange} placeholder="0.00" disabled={isLoading} />
              <FormInputVender label="Nível de Sustentabilidade (1-5)" type="number" id="nivel_sustentabilidade" name="nivel_sustentabilidade" value={formData.nivel_sustentabilidade} onChange={handleInputChange} placeholder="Ex: 5" disabled={isLoading} />
            </div>
            <div className="space-y-6 md:col-span-1">
              <FormInputVender label="Descrição" id="descricao" name="descricao" value={formData.descricao} onChange={handleInputChange} placeholder="Descreva seu produto" isTextArea disabled={isLoading} />
              <FormInputVender label="URL da Imagem" id="imagem_url" name="imagem_url" value={formData.imagem_url} onChange={handleInputChange} placeholder="https://exemplo.com/imagem.jpg" disabled={isLoading} />
            </div>
          </div>
          <div className="pt-8">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
            </Button>
          </div>
        </form>
      </div>

      {/* Seção para Listar Produtos do Usuário */}
      <SectionTitle>Meus Produtos Cadastrados</SectionTitle>
      {isLoading && userProducts.length === 0 && <p className="text-gray-400">Carregando seus produtos...</p>}
      {!isLoading && userProducts.length === 0 && <p className="text-gray-400">Você ainda não cadastrou nenhum produto.</p>}
      
      {userProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {userProducts.map(product => (
            <ProductCard
              key={product.id}
              id={String(product.id)} // 👈 CORREÇÃO: Converte ID para string
              imageUrl={product.imagem_url || '/images/placeholder-produto.png'} // 👈 CORREÇÃO: Usa imagem_url do produto ou um placeholder
              name={product.nome}
              price={Number(product.preco)} // Já estava convertendo para número, o que é bom
              // rating e reviewCount são opcionais no ProductCardProps,
              // então só passe se existirem no seu objeto 'product' do backend.
              // Ex: rating={product.nivel_sustentabilidade} se fizer sentido ou se tiver outro campo
            />
          ))}
        </div>
      )}
    </div>
  );
}