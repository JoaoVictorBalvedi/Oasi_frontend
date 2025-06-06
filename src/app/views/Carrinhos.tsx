// src/app/carrinhos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SectionTitle from "../components/SectionTitle";
import Button from "../components/button";
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '../components/ProtectedRoute';

interface Cart {
  id: number;
  nome: string;
  proposito: string | null;
  criado_em: string;
}

interface ProductInCart {
  id: number;
  nome: string;
  preco: number;
  imagem_url: string;
  quantidade: number;
}

export default function CarrinhosPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    proposito: ''
  });

  const [userCarts, setUserCarts] = useState<Cart[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(true);
  const [cartsMessage, setCartsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);
  const [selectedCartProducts, setSelectedCartProducts] = useState<ProductInCart[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsMessage, setProductsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Buscar carrinhos do usuário
  const fetchUserCarts = async () => {
    if (!user?.id) return;
    
    setIsLoadingCarts(true);
    setCartsMessage(null);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
      if (!response.ok) throw new Error('Falha ao buscar carrinhos.');
      const data = await response.json();
      setUserCarts(data);
    } catch (error: any) {
      setCartsMessage({ text: error.message || 'Erro ao carregar carrinhos.', type: 'error' });
      setUserCarts([]);
    } finally {
      setIsLoadingCarts(false);
    }
  };

  useEffect(() => {
    fetchUserCarts();
  }, [user?.id]);

  // Criar novo carrinho
  const handleCreateCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setCartsMessage({ text: 'Usuário não está logado.', type: 'error' });
      return;
    }

    if (!formData.nome.trim()) {
      setCartsMessage({ text: 'Nome do carrinho é obrigatório.', type: 'error' });
      return;
    }

    setIsLoadingCarts(true);
    setCartsMessage(null);

    try {
      console.log('Enviando dados:', {
        ...formData,
        id_usuario: user.id
      });

      const response = await fetch('http://localhost:3001/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id_usuario: user.id
        }),
      });

      // Log da resposta para debug
      const responseText = await response.text();
      console.log('Resposta do servidor:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Resposta inválida do servidor. Verifique se o backend está rodando.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao criar carrinho.');
      }

      setFormData({ nome: '', proposito: '' });
      setCartsMessage({ text: 'Carrinho criado com sucesso!', type: 'success' });
      fetchUserCarts(); // Recarrega a lista de carrinhos
    } catch (error: any) {
      console.error('Erro ao criar carrinho:', error);
      setCartsMessage({ 
        text: error.message || 'Erro ao criar carrinho. Verifique se o backend está rodando.',
        type: 'error' 
      });
    } finally {
      setIsLoadingCarts(false);
    }
  };

  // Buscar produtos de um carrinho específico
  const handleToggleCartDetails = async (cartId: number) => {
    if (selectedCartId === cartId) {
      setSelectedCartId(null);
      setSelectedCartProducts([]);
      setProductsMessage(null);
      return;
    }

    setSelectedCartId(cartId);
    setIsLoadingProducts(true);
    setProductsMessage(null);
    setSelectedCartProducts([]);

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${cartId}/products`);
      if (!response.ok) throw new Error(`Falha ao buscar produtos do carrinho ${cartId}.`);
      const data: ProductInCart[] = await response.json();
      setSelectedCartProducts(data);
      if (data.length === 0) {
        setProductsMessage({ text: 'Este carrinho está vazio.', type: 'success' });
      }
    } catch (error: any) {
      setProductsMessage({ text: error.message || 'Erro ao carregar produtos do carrinho.', type: 'error' });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Remover carrinho
  const handleDeleteCart = async (cartId: number) => {
    if (!confirm('Tem certeza que deseja excluir este carrinho?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${cartId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao excluir carrinho.');
      }

      setCartsMessage({ text: 'Carrinho excluído com sucesso!', type: 'success' });
      if (selectedCartId === cartId) {
        setSelectedCartId(null);
        setSelectedCartProducts([]);
      }
      fetchUserCarts(); // Recarrega a lista de carrinhos
    } catch (error: any) {
      setCartsMessage({ text: error.message || 'Erro ao excluir carrinho.', type: 'error' });
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <SectionTitle>Meus Carrinhos</SectionTitle>
        
        {/* Mensagens de feedback */}
        {cartsMessage && (
          <div className={`mb-4 p-4 rounded-lg ${cartsMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            {cartsMessage.text}
          </div>
        )}

        <div className="mt-8 grid gap-6">
          {/* Formulário de criação de carrinho */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              Criar Novo Carrinho
            </h2>
            <form onSubmit={handleCreateCart} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Carrinho
                </label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Compras do Mês"
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="proposito" className="block text-sm font-medium text-gray-300 mb-2">
                  Propósito
                </label>
                <textarea
                  id="proposito"
                  value={formData.proposito}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposito: e.target.value }))}
                  placeholder="Descreva o propósito deste carrinho"
                  rows={3}
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoadingCarts}>
                {isLoadingCarts ? 'Criando...' : 'Criar Carrinho'}
              </Button>
            </form>
          </div>

          {/* Lista de carrinhos */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              Carrinhos Existentes
            </h2>
            {isLoadingCarts ? (
              <p className="text-gray-300">Carregando carrinhos...</p>
            ) : userCarts.length === 0 ? (
              <p className="text-gray-300">Você ainda não tem nenhum carrinho.</p>
            ) : (
              <div className="space-y-4">
                {userCarts.map(cart => (
                  <div key={cart.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-white">{cart.nome}</h3>
                        {cart.proposito && (
                          <p className="text-sm text-gray-300 mt-1">{cart.proposito}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Criado em: {new Date(cart.criado_em).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleToggleCartDetails(cart.id)}
                          variant="secondary"
                          className="text-sm"
                        >
                          {selectedCartId === cart.id ? 'Ocultar' : 'Ver Produtos'}
                        </Button>
                        <Button
                          onClick={() => handleDeleteCart(cart.id)}
                          variant="danger"
                          className="text-sm"
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>

                    {/* Produtos do carrinho */}
                    {selectedCartId === cart.id && (
                      <div className="mt-4 border-t border-gray-600 pt-4">
                        {isLoadingProducts ? (
                          <p className="text-gray-300">Carregando produtos...</p>
                        ) : productsMessage ? (
                          <p className={`text-${productsMessage.type === 'success' ? 'green' : 'red'}-400`}>
                            {productsMessage.text}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {selectedCartProducts.map(product => (
                              <div key={product.id} className="flex items-center justify-between bg-gray-600 p-3 rounded">
                                <div className="flex items-center gap-3">
                                  {product.imagem_url && (
                                    <div className="relative w-12 h-12">
                                      <Image
                                        src={product.imagem_url}
                                        alt={product.nome}
                                        fill
                                        className="object-cover rounded"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-white">{product.nome}</p>
                                    <p className="text-sm text-gray-300">
                                      Quantidade: {product.quantidade} | R$ {product.preco.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-white font-medium">
                                  R$ {(product.preco * product.quantidade).toFixed(2)}
                                </p>
                              </div>
                            ))}
                            <div className="text-right text-lg font-medium text-white">
                              Total: R$ {selectedCartProducts.reduce((total, product) => total + (product.preco * product.quantidade), 0).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}