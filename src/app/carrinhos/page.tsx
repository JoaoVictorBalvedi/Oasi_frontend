// src/app/carrinhos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import SectionTitle from "../components/SectionTitle";
import Button from "../components/button";
import Link from 'next/link';
import Image from 'next/image';

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
  const userId = 1;

  const [userCarts, setUserCarts] = useState<Cart[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(true);
  const [cartsMessage, setCartsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);
  const [selectedCartProducts, setSelectedCartProducts] = useState<ProductInCart[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  // CORREÇÃO AQUI: Definindo o tipo correto para productsMessage
  const [productsMessage, setProductsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchUserCarts = async () => {
      setIsLoadingCarts(true);
      setCartsMessage(null); // Reset message
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/carts`);
        if (!response.ok) throw new Error('Falha ao buscar carrinhos.');
        const data = await response.json();
        setUserCarts(data);
      } catch (error: any) {
        setCartsMessage({ text: error.message || 'Erro ao carregar carrinhos.', type: 'error' });
        setUserCarts([]); // Limpa em caso de erro
      } finally {
        setIsLoadingCarts(false);
      }
    };
    fetchUserCarts();
  }, [userId]);

  const handleToggleCartDetails = async (cartId: number) => {
    if (selectedCartId === cartId) {
      setSelectedCartId(null);
      setSelectedCartProducts([]);
      setProductsMessage(null); // Reset products message when hiding
      return;
    }

    setSelectedCartId(cartId);
    setIsLoadingProducts(true);
    setProductsMessage(null); // Reset products message before fetching
    setSelectedCartProducts([]);

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${cartId}/products-details`);
      if (!response.ok) throw new Error(`Falha ao buscar produtos do carrinho ${cartId}.`);
      const data: ProductInCart[] = await response.json();
      setSelectedCartProducts(data);
      if (data.length === 0) {
        // CORREÇÃO AQUI: Usando a estrutura de objeto correta
        setProductsMessage({ text: 'Este carrinho está vazio.', type: 'success' });
      }
    } catch (error: any) {
      // CORREÇÃO AQUI: Usando a estrutura de objeto correta
      setProductsMessage({ text: error.message || 'Erro ao carregar produtos do carrinho.', type: 'error' });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 md:mb-8">
        <SectionTitle>Meus Carrinhos</SectionTitle>
      </div>

      {isLoadingCarts && <p className="text-center text-gray-400">Carregando seus carrinhos...</p>}
      
      {/* CORREÇÃO JSX AQUI: Bloco para exibir cartsMessage */}
      {!isLoadingCarts && cartsMessage && (
         <div className={`p-3 rounded-md mb-4 text-center ${cartsMessage.type === 'success' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
           {cartsMessage.text}
         </div>
      )}

      {/* CORREÇÃO JSX AQUI: Bloco para exibir "nenhum carrinho ativo" */}
      {!isLoadingCarts && userCarts.length === 0 && !cartsMessage && (
        <div className="text-center py-10 bg-gray-800 rounded-lg shadow-xl">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-white">Você não tem carrinhos ativos.</h3>
          <p className="mt-1 text-sm text-gray-400">Que tal começar um novo?</p>
          <div className="mt-6">
            <Link href="/produtos">
              <Button>Ver Produtos</Button>
            </Link>
          </div>
        </div>
      )}

      {userCarts.length > 0 && (
        <div className="space-y-6">
          {userCarts.map((cart) => (
            <div key={cart.id} className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-green-400 mb-1">{cart.nome}</h2>
                  {cart.proposito && <p className="text-sm text-gray-300 mb-1">Propósito: {cart.proposito}</p>}
                  <p className="text-xs text-gray-500">Criado em: {new Date(cart.criado_em).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                  <Button onClick={() => handleToggleCartDetails(cart.id)}>
                    {selectedCartId === cart.id ? 'Ocultar Produtos' : 'Ver Produtos'}
                  </Button>
                </div>
              </div>

              {selectedCartId === cart.id && (
                <div className="mt-6 border-t border-gray-700 pt-6">
                  {isLoadingProducts && <p className="text-gray-400">Carregando produtos do carrinho...</p>}
                  {!isLoadingProducts && productsMessage && (
                    // CORREÇÃO AQUI: Acessando .type e .text de productsMessage (objeto)
                    <div className={`p-2 rounded-md text-sm ${productsMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                      {productsMessage.text}
                    </div>
                  )}
                  {!isLoadingProducts && selectedCartProducts.length > 0 && (
                    <ul className="space-y-4">
                      {selectedCartProducts.map(item => (
                        <li key={item.id} className="flex items-center gap-4 p-3 bg-gray-700 rounded-md">
                          <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imagem_url || '/images/placeholder-produto.png'}
                              alt={item.nome}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-white">{item.nome}</h4>
                            <p className="text-sm text-gray-300">Quantidade: {item.quantidade}</p>
                          </div>
                          <p className="text-md font-semibold text-green-400 whitespace-nowrap">
                            R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}