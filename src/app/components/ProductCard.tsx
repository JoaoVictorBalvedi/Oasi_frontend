// src/app/components/ProductCard.tsx
"use client";

import React, { useState } from 'react'; // Adicionado useState
import Image from 'next/image';
import Link from 'next/link';
import Button from './button';
import SelectCartModal from './SelectCardModal'; // Importa o novo modal

interface ProductCardProps {
  id: string; // ID do produto
  imageUrl: string;
  name: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  currency?: string;
}

interface CartForSelection { // Interface simplificada para o modal
  id: number;
  nome: string;
  proposito?: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id: productIdString, // ID do produto como string
  imageUrl,
  name,
  price,
  rating,
  reviewCount,
  currency = 'R$',
}) => {
  const effectiveImageUrl = imageUrl || '/images/placeholder-produto.png';
  const userId = 1; // Usuário hardcoded

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCarts, setUserCarts] = useState<CartForSelection[]>([]);
  const [isLoadingCarts, setIsLoadingCarts] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


  const fetchUserCartsAndOpenModal = async () => {
    setIsLoadingCarts(true);
    setFeedbackMessage(null);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/carts`);
      if (!response.ok) {
        throw new Error('Falha ao buscar seus carrinhos.');
      }
      const data = await response.json();
      setUserCarts(data);
      setIsModalOpen(true); // Abre o modal APÓS buscar os carrinhos
    } catch (error: any) {
      console.error("Erro ao buscar carrinhos:", error);
      setFeedbackMessage(`Erro ao buscar carrinhos: ${error.message}`);
      // Poderia abrir o modal com uma mensagem de erro, ou apenas mostrar o alerta/feedback
      alert(`Erro ao buscar carrinhos: ${error.message}. Você precisa ter carrinhos para adicionar produtos.`);
    } finally {
      setIsLoadingCarts(false);
    }
  };

  const handleSelectCartAndAddProduct = async (selectedCartId: number) => {
    setIsModalOpen(false); // Fecha o modal
    setFeedbackMessage('Adicionando ao carrinho...');

    if (!productIdString) {
      alert('ID do produto não encontrado.');
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
          produto_id: parseInt(productIdString), // Backend espera um número
          quantidade: 1,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao adicionar produto ao carrinho.');
      }
      
      setFeedbackMessage(result.message || 'Produto adicionado ao carrinho!');
      alert(result.message || 'Produto adicionado ao carrinho!'); // Feedback simples

    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setFeedbackMessage(`Erro: ${error.message}`);
      alert(`Erro: ${error.message}`); // Feedback simples
    }
    // Limpa a mensagem após alguns segundos
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <Link href={`/produtos/${productIdString}`} className="group">
          <div className="relative w-full h-56 sm:h-64">
            <Image
              src={effectiveImageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
          <div className="p-4 flex-grow">
            <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-green-400 transition-colors">
              {name}
            </h3>
            {/* ... (rating e preço) ... */}
             <p className="text-xl font-bold text-green-500 mb-3">
               {currency} {price.toFixed(2)}
             </p>
          </div>
        </Link>
        <div className="p-4 pt-0">
          <Button 
            fullWidth 
            onClick={fetchUserCartsAndOpenModal} 
            disabled={isLoadingCarts}
          >
            {isLoadingCarts ? 'Carregando...' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
        {feedbackMessage && <p className="p-2 text-xs text-center text-yellow-300">{feedbackMessage}</p>}
      </div>

      <SelectCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        carts={userCarts}
        onSelectCart={(cartId) => handleSelectCartAndAddProduct(cartId)}
        productName={name}
      />
    </>
  );
};

export default ProductCard;