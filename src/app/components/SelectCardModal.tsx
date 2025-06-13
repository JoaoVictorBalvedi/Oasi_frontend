// src/app/components/SelectCartModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Button from './button';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

interface Cart {
  id: number;
  nome: string;
  created_at: string;
}

interface SelectCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCart: (cartId: number) => void;
  productName: string;
}

const SelectCartModal: React.FC<SelectCartModalProps> = ({
  isOpen,
  onClose,
  onSelectCart,
  productName
}) => {
  const { user } = useAuth();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCartName, setNewCartName] = useState('');
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'confirm' | 'error';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm'
  });

  // Buscar carrinhos do usuário quando o modal abrir
  useEffect(() => {
    if (isOpen && user) {
      fetchUserCarts();
    }
  }, [isOpen, user]);

  const fetchUserCarts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/carts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar carrinhos');
      }

      const data = await response.json();
      setCarts(data);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Falha ao buscar carrinhos',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCart = async () => {
    if (!user) return;
    
    if (!newCartName.trim()) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Por favor, insira um nome para o carrinho',
        type: 'error'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          nome: newCartName,
          id_usuario: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao criar carrinho');
      }

      const newCart = await response.json();
      setCarts(prev => [...prev, newCart]);
      setNewCartName('');
      setModalConfig({
        isOpen: true,
        title: 'Sucesso',
        message: 'Carrinho criado com sucesso!',
        type: 'success'
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Falha ao criar carrinho',
        type: 'error'
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
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

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </>
  );
};

export default SelectCartModal;