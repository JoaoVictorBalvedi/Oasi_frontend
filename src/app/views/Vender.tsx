// src/app/vender/page.tsx
"use client";

import ProtectedRoute from '../components/ProtectedRoute';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/button';
import ProductCard from "../components/ProductCard"; // Vamos reusar o ProductCard para listar
import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editFormData, setEditFormData] = useState<ProductFormData | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

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

  // Editar produto
  const handleEditProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct || !editFormData) return;
    setEditLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:3001/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editFormData, preco: parseFloat(editFormData.preco), nivel_sustentabilidade: editFormData.nivel_sustentabilidade ? parseInt(editFormData.nivel_sustentabilidade) : null }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Falha ao editar produto.');
      setMessage({ text: 'Produto editado com sucesso!', type: 'success' });
      setSelectedProduct(null);
      fetchUserProducts();
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao editar produto.', type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  // Remover produto
  const handleRemoveProduct = async () => {
    if (!selectedProduct) return;
    setRemoveLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`http://localhost:3001/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Falha ao remover produto.');
      setMessage({ text: 'Produto removido com sucesso!', type: 'success' });
      setSelectedProduct(null);
      fetchUserProducts();
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro ao remover produto.', type: 'error' });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <SectionTitle>Vender na Oasi</SectionTitle>
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar: Lista de produtos do usuário */}
          <div className="w-full lg:max-w-md flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-green-400">Seus Produtos</h2>
              <button onClick={() => { setShowAddForm(true); setFormData(initialFormState); }} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition">Adicionar Produto</button>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 space-y-2 h-72 lg:h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="text-gray-400 text-center my-8">Carregando...</div>
              ) : userProducts.length === 0 ? (
                <div className="text-gray-400 text-center my-8">Você ainda não cadastrou nenhum produto.</div>
              ) : (
                userProducts.map(prod => (
                  <div key={prod.id} className={`p-3 rounded cursor-pointer transition flex flex-col border ${selectedProduct?.id === prod.id ? 'bg-green-900/40 border-green-500 text-green-300' : 'hover:bg-gray-700 border-transparent text-gray-200'}`} onClick={() => { setSelectedProduct(prod); setEditFormData({ ...prod, preco: String(prod.preco), nivel_sustentabilidade: String(prod.nivel_sustentabilidade ?? '') }); }}>
                    <span className="font-bold">{prod.nome}</span>
                    <span className="text-xs text-gray-400">R$ {Number(prod.preco).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Centro: Detalhes, editar/remover produto */}
          <div className="flex-1 min-w-0">
            {!selectedProduct ? (
              <div className="text-gray-400 text-center mt-24">Selecione um produto para ver detalhes, editar ou remover.</div>
            ) : (
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full relative flex flex-col h-full">
                <h2 className="text-2xl font-bold text-green-400 mb-2">{selectedProduct.nome}</h2>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-gray-300 font-semibold">R$ {Number(selectedProduct.preco).toFixed(2)}</span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">Nível sustentável: {selectedProduct.nivel_sustentabilidade ?? '-'}</span>
                </div>
                <p className="text-gray-300 mb-6">{selectedProduct.descricao}</p>
                {/* Editar produto */}
                <form onSubmit={handleEditProduct} className="space-y-4 mb-4">
                  <FormInputVender label="Nome" id="edit-nome" name="nome" value={editFormData?.nome || ''} onChange={e => setEditFormData(f => f ? { ...f, nome: e.target.value } : f)} />
                  <FormInputVender label="Descrição" id="edit-descricao" name="descricao" value={editFormData?.descricao || ''} onChange={e => setEditFormData(f => f ? { ...f, descricao: e.target.value } : f)} isTextArea />
                  <FormInputVender label="Preço" id="edit-preco" name="preco" type="number" value={editFormData?.preco || ''} onChange={e => setEditFormData(f => f ? { ...f, preco: e.target.value } : f)} />
                  <FormInputVender label="Nível Sustentabilidade" id="edit-nivel" name="nivel_sustentabilidade" type="number" value={editFormData?.nivel_sustentabilidade || ''} onChange={e => setEditFormData(f => f ? { ...f, nivel_sustentabilidade: e.target.value } : f)} />
                  <FormInputVender label="Imagem (URL)" id="edit-imagem" name="imagem_url" value={editFormData?.imagem_url || ''} onChange={e => setEditFormData(f => f ? { ...f, imagem_url: e.target.value } : f)} />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition disabled:opacity-60" disabled={editLoading}>{editLoading ? 'Salvando...' : 'Salvar Alterações'}</button>
                    <button type="button" className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-lg transition" onClick={() => setSelectedProduct(null)}>Cancelar</button>
                  </div>
                </form>
                {/* Remover produto */}
                <button onClick={handleRemoveProduct} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition w-full" disabled={removeLoading}>{removeLoading ? 'Removendo...' : 'Remover Produto'}</button>
              </div>
            )}
          </div>
          {/* Modal de adicionar produto */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl" onClick={() => setShowAddForm(false)}>&times;</button>
                <h2 className="text-2xl font-bold text-green-400 mb-4">Adicionar Produto</h2>
                <form onSubmit={handleSubmitProduct} className="space-y-4">
                  <FormInputVender label="Nome" id="add-nome" name="nome" value={formData.nome} onChange={handleInputChange} />
                  <FormInputVender label="Descrição" id="add-descricao" name="descricao" value={formData.descricao} onChange={handleInputChange} isTextArea />
                  <FormInputVender label="Preço" id="add-preco" name="preco" type="number" value={formData.preco} onChange={handleInputChange} />
                  <FormInputVender label="Nível Sustentabilidade" id="add-nivel" name="nivel_sustentabilidade" type="number" value={formData.nivel_sustentabilidade} onChange={handleInputChange} />
                  <FormInputVender label="Imagem (URL)" id="add-imagem" name="imagem_url" value={formData.imagem_url} onChange={handleInputChange} />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition w-full" disabled={isLoading}>{isLoading ? 'Adicionando...' : 'Adicionar Produto'}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}