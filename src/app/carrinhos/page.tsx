// src/app/carrinhos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import SectionTitle from "../components/SectionTitle";
import Button from "../components/button";
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

interface Cart {
  id: number;
  nome: string;
  proposito?: string;
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

  const [userCarts, setUserCarts] = useState<Cart[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(true);
  const [cartsMessage, setCartsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);
  const [selectedCartProducts, setSelectedCartProducts] = useState<ProductInCart[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsMessage, setProductsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchUserCarts = async () => {
      if (!user?.id) return;
      
      setIsLoadingCarts(true);
      setCartsMessage(null);
      try {
        const response = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Falha ao buscar carrinhos.');
        }
        const data = await response.json();
        setUserCarts(data);
      } catch (error: any) {
        setCartsMessage({ text: error.message || 'Erro ao carregar carrinhos.', type: 'error' });
        setUserCarts([]);
      } finally {
        setIsLoadingCarts(false);
      }
    };
    fetchUserCarts();
  }, [user?.id]);

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
      const response = await fetch(`http://localhost:3001/api/carts/${cartId}/products-details`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Falha ao buscar produtos do carrinho ${cartId}.`);
      }
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
      if (user?.id) {
        const updatedResponse = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setUserCarts(updatedData);
        }
      }
    } catch (error: any) {
      setCartsMessage({ text: error.message || 'Erro ao excluir carrinho.', type: 'error' });
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <SectionTitle>Meus Carrinhos</SectionTitle>
        <div className="mt-8 grid gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              Criar Novo Carrinho
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Carrinho
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
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
                  name="proposito"
                  placeholder="Descreva o propósito deste carrinho"
                  rows={3}
                  className="w-full p-3 bg-gray-700 rounded text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Criar Carrinho
              </Button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-400 mb-4">
              Carrinhos Existentes
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                Seus carrinhos aparecerão aqui quando você criar algum.
              </p>
            </div>
          </div>
        </div>

        {cartsMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            cartsMessage.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
          }`}>
            {cartsMessage.text}
          </div>
        )}

        <div className="space-y-6">
          {isLoadingCarts ? (
            <p className="text-gray-300">Carregando carrinhos...</p>
          ) : userCarts.length === 0 ? (
            <p className="text-gray-300">Você ainda não tem nenhum carrinho.</p>
          ) : (
            userCarts.map(cart => (
              <div key={cart.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">{cart.nome}</h2>
                      {cart.proposito && (
                        <p className="text-gray-300 mb-2">{cart.proposito}</p>
                      )}
                      <p className="text-sm text-gray-400">
                        Criado em: {new Date(cart.criado_em).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleToggleCartDetails(cart.id)}
                        variant="secondary"
                        size="sm"
                      >
                        {selectedCartId === cart.id ? 'Ocultar' : 'Ver Produtos'}
                      </Button>
                      <Button
                        onClick={() => handleDeleteCart(cart.id)}
                        variant="danger"
                        size="sm"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>

                  {selectedCartId === cart.id && (
                    <div className="mt-6 border-t border-gray-700 pt-6">
                      {isLoadingProducts ? (
                        <p className="text-gray-300">Carregando produtos...</p>
                      ) : productsMessage ? (
                        <p className={`text-${productsMessage.type === 'success' ? 'green' : 'red'}-400`}>
                          {productsMessage.text}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedCartProducts.map(product => (
                            <div key={product.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                              <div className="flex items-center gap-4">
                                {product.imagem_url && (
                                  <div className="relative w-16 h-16">
                                    <Image
                                      src={product.imagem_url}
                                      alt={product.nome}
                                      fill
                                      className="object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-white font-medium">{product.nome}</h3>
                                  <p className="text-sm text-gray-300">
                                    Quantidade: {product.quantidade}
                                  </p>
                                  <p className="text-green-400 font-semibold">
                                    R$ {product.preco.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">
                                  R$ {(product.preco * product.quantidade).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400">Total</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}