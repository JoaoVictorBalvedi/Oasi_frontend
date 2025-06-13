// src/app/carrinhos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import SectionTitle from "../components/SectionTitle";
import Button from "../components/button";
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '../components/ProtectedRoute';
import Modal from '../components/Modal';

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

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

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

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${cartId}/products-details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar produtos do carrinho');
      }

      const data = await response.json();
      if (data.length === 0) {
        setProductsMessage({ text: 'Este carrinho está vazio', type: 'success' });
        setSelectedCartProducts([]);
      } else {
        // Converte o preço para número ao receber os dados
        const productsWithNumericPrice = data.map((product: any) => ({
          ...product,
          preco: parseFloat(product.preco)
        }));
        setSelectedCartProducts(productsWithNumericPrice);
      }
    } catch (error) {
      setProductsMessage({ text: 'Falha ao buscar produtos do carrinho', type: 'error' });
      setSelectedCartProducts([]);
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

  // Atualizar quantidade de um produto no carrinho
  const handleUpdateQuantity = async (cartId: number, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ quantidade: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar quantidade');
      }

      // Atualiza a lista de produtos
      setSelectedCartProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, quantidade: newQuantity } : p
        )
      );

      setModalConfig({
        isOpen: true,
        title: 'Sucesso',
        message: 'Quantidade atualizada com sucesso!',
        type: 'success'
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Falha ao atualizar quantidade',
        type: 'error'
      });
    }
  };

  // Remover produto do carrinho
  const handleRemoveProduct = async (cartId: number, productId: number) => {
    setModalConfig({
      isOpen: true,
      title: 'Remover Produto',
      message: 'Tem certeza que deseja remover este produto do carrinho?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Falha ao remover produto do carrinho');
          }

          // Atualiza a lista de produtos
          setSelectedCartProducts(prevProducts => 
            prevProducts.filter(p => p.id !== productId)
          );

          // Se não houver mais produtos, atualiza a lista de carrinhos
          if (selectedCartProducts.length === 1) {
            setUserCarts(prevCarrinhos => 
              prevCarrinhos.filter(c => c.id !== cartId)
            );
            setSelectedCartProducts([]);
            setProductsMessage({ text: 'Este carrinho está vazio', type: 'success' });
          }

          setModalConfig({
            isOpen: true,
            title: 'Sucesso',
            message: 'Produto removido com sucesso!',
            type: 'success'
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            title: 'Erro',
            message: 'Falha ao remover produto do carrinho',
            type: 'error'
          });
        }
      }
    });
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
                                    <p className="text-sm text-gray-300 mt-1">
                                      R$ {product.preco.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleUpdateQuantity(cart.id, product.id, product.quantidade - 1)}
                                      className="text-gray-300 hover:text-white bg-gray-700 rounded px-2 py-1"
                                      disabled={product.quantidade <= 1}
                                    >
                                      -
                                    </button>
                                    <span className="text-sm text-gray-300">
                                      {product.quantidade}
                                    </span>
                                    <button
                                      onClick={() => handleUpdateQuantity(cart.id, product.id, product.quantidade + 1)}
                                      className="text-gray-300 hover:text-white bg-gray-700 rounded px-2 py-1"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveProduct(cart.id, product.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
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

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        type={modalConfig.type}
      >
        {modalConfig.message}
      </Modal>
    </ProtectedRoute>
  );
}