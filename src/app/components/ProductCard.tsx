// src/app/components/ProductCard.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Button from './button';
import SelectCartModal from './SelectCardModal';
import ProductModal from './ProductModal';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  currency?: string;
  description?: string;
}

interface CartForSelection {
  id: number;
  nome: string;
  proposito?: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id: productIdString,
  imageUrl,
  name,
  price,
  rating,
  reviewCount,
  currency = 'R$',
  description,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [userCarts, setUserCarts] = useState<CartForSelection[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchUserCartsAndOpenModal = async () => {
    if (!user?.id) {
      setFeedbackMessage('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }

    setIsLoadingCarts(true);
    setFeedbackMessage(null);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
      if (!response.ok) {
        throw new Error('Falha ao buscar seus carrinhos.');
      }
      const data = await response.json();
      setUserCarts(data);
      setIsCartModalOpen(true);
    } catch (error: any) {
      console.error("Erro ao buscar carrinhos:", error);
      setFeedbackMessage(`Erro ao buscar carrinhos: ${error.message}`);
      alert(`Erro ao buscar carrinhos: ${error.message}. Você precisa ter carrinhos para adicionar produtos.`);
    } finally {
      setIsLoadingCarts(false);
    }
  };

  const handleSelectCartAndAddProduct = async (selectedCartId: number) => {
    setIsCartModalOpen(false);
    setFeedbackMessage('Adicionando ao carrinho...');

    if (!productIdString) {
      alert('ID do produto não encontrado.');
      setFeedbackMessage(null);
      return;
    }

    console.log('ID do produto:', productIdString);
    console.log('ID do produto convertido:', parseInt(productIdString));

    try {
      const response = await fetch(`http://localhost:3001/api/carts/${selectedCartId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produto_id: parseInt(productIdString),
          quantidade: 1
        }),
      });

      const result = await response.json();
      console.log('Resposta da API:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao adicionar produto ao carrinho.');
      }
      
      // Recarrega os carrinhos após adicionar o produto
      if (user?.id) {
        const cartsResponse = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
        if (cartsResponse.ok) {
          const cartsData = await cartsResponse.json();
          setUserCarts(cartsData);
        }
      }
      
      setFeedbackMessage(result.message || 'Produto adicionado ao carrinho!');
      alert(result.message || 'Produto adicionado ao carrinho!');

    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setFeedbackMessage(`Erro: ${error.message}`);
      alert(`Erro: ${error.message}`);
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <>
      <div className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1">
        <div 
          className="flex-grow cursor-pointer" 
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative w-full h-56 sm:h-64 overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-110 transition-transform duration-500 ease-out"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-5 flex-grow">
            <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-green-400 transition-colors duration-300">
              {name}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {currency} {price.toFixed(2)}
              </p>
              {rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-300">{rating.toFixed(1)}</span>
                  {reviewCount && (
                    <span className="text-xs text-gray-400">({reviewCount})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-5 pt-0">
          <Button 
            fullWidth 
            onClick={fetchUserCartsAndOpenModal} 
            disabled={isLoadingCarts}
            className="group-hover:shadow-lg group-hover:shadow-green-500/20"
          >
            {isLoadingCarts ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </span>
            ) : (
              'Adicionar ao Carrinho'
            )}
          </Button>
        </div>
        {feedbackMessage && (
          <div className="px-5 pb-4">
            <p className="text-sm text-center text-yellow-300 bg-yellow-900/20 py-2 px-3 rounded-lg">
              {feedbackMessage}
            </p>
          </div>
        )}
      </div>

      <ProductModal
        product={{
          id: parseInt(productIdString),
          nome: name,
          preco: price,
          nivel_sustentabilidade: rating,
          descricao: description,
          imagem_url: imageUrl
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={fetchUserCartsAndOpenModal}
      />

      <SelectCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        carts={userCarts}
        onSelectCart={(cartId) => handleSelectCartAndAddProduct(cartId)}
        productName={name}
      />
    </>
  );
};

export default ProductCard;