// src/app/components/SelectCartModal.tsx
"use client";

import React from 'react';
import Button from './button';

interface Cart {
  id: number;
  nome: string;
  proposito?: string | null;
}

interface SelectCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  carts: Cart[];
  onSelectCart: (cartId: number) => void; // Callback que recebe o ID do carrinho selecionado
  productName?: string; // Opcional, para mostrar o nome do produto no modal
}

const SelectCartModal: React.FC<SelectCartModalProps> = ({
  isOpen,
  onClose,
  carts,
  onSelectCart,
  productName
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-400">
            Selecionar Carrinho
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        {productName && <p className="text-gray-300 mb-4">Adicionar "{productName}" para qual carrinho?</p>}

        {carts.length === 0 ? (
          <p className="text-gray-400">Você não possui carrinhos. Crie um primeiro!</p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {carts.map(cart => (
              <li key={cart.id}>
                <button
                  onClick={() => onSelectCart(cart.id)}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-green-600 rounded-md transition-colors text-white"
                >
                  <p className="font-medium">{cart.nome}</p>
                  {cart.proposito && <p className="text-xs text-gray-400">{cart.proposito}</p>}
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={onClose} variant="secondary" fullWidth>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default SelectCartModal;