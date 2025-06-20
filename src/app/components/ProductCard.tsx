// src/app/components/ProductCard.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Button from './button';
import SelectCartModal from './SelectCardModal';
import ProductModal from './ProductModal';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

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
  const { setView, setSelectedProductId } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [userCarts, setUserCarts] = useState<CartForSelection[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const fetchUserCartsAndOpenModal = async () => {
    if (!user?.id) {
      setNotificationModal({
        isOpen: true,
        title: 'Atenção',
        message: 'Você precisa estar logado para adicionar produtos ao carrinho.',
        type: 'info'
      });
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
      setNotificationModal({
        isOpen: true,
        title: 'Erro',
        message: `Erro ao buscar carrinhos: ${error.message}. Você precisa ter carrinhos para adicionar produtos.`,
        type: 'error'
      });
    } finally {
      setIsLoadingCarts(false);
    }
  };

  const handleSelectCartAndAddProduct = async (selectedCartId: number) => {
    setIsCartModalOpen(false);
    setFeedbackMessage('Adicionando ao carrinho...');

    if (!productIdString) {
      setNotificationModal({
        isOpen: true,
        title: 'Erro',
        message: 'ID do produto não encontrado.',
        type: 'error'
      });
      setFeedbackMessage(null);
      return;
    }

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

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao adicionar produto ao carrinho.');
      }
      
      if (user?.id) {
        const cartsResponse = await fetch(`http://localhost:3001/api/users/${user.id}/carts`);
        if (cartsResponse.ok) {
          const cartsData = await cartsResponse.json();
          setUserCarts(cartsData);
        }
      }
      
      setNotificationModal({
        isOpen: true,
        title: 'Sucesso',
        message: result.message || 'Produto adicionado ao carrinho!',
        type: 'success'
      });

    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setNotificationModal({
        isOpen: true,
        title: 'Erro',
        message: `Erro: ${error.message}`,
        type: 'error'
      });
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <>
      <div className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 border border-gray-700/40">
        <div 
          className="flex-grow cursor-pointer" 
          onClick={() => {
            setSelectedProductId(productIdString);
            setView('produto-detalhe');
          }}
        >
          <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-500 ease-out"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4 flex-grow flex flex-col justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 truncate group-hover:text-green-400 transition-colors duration-300">
              {name}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {currency} {price.toFixed(2)}
              </p>
              {rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-xs sm:text-sm text-gray-300">{rating.toFixed(1)}</span>
                  {reviewCount && (
                    <span className="text-xs text-gray-400">({reviewCount})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Button 
            fullWidth 
            onClick={fetchUserCartsAndOpenModal} 
            disabled={isLoadingCarts}
            className="group-hover:shadow-lg group-hover:shadow-green-500/20 rounded-lg text-base sm:text-lg py-2"
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
        onSelectCart={(cartId) => handleSelectCartAndAddProduct(cartId)}
        productName={name}
      />

      <Modal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        type={notificationModal.type}
      >
        {notificationModal.message}
      </Modal>
    </>
  );
};

export default ProductCard;