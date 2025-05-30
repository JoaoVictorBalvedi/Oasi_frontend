// src/app/produtos/page.tsx
"use client"; // Necessário para useState e useEffect

import React, { useState, useEffect } from 'react';
import SectionTitle from "../components/SectionTitle";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

// Interface para o produto como vem da API
interface Product {
  id: number; // No banco é número
  nome: string;
  preco: number;
  nivel_sustentabilidade?: number;
  descricao?: string;
  imagem_url: string;
  // id_vendedor e outros campos se a API retornar
}

export default function ProdutosPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/products'); // Seu endpoint do backend
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos do servidor.');
        }
        const data: Product[] = await response.json();
        setAllProducts(data);
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro.');
        setAllProducts([]); // Limpa em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Array de dependências vazio para rodar apenas uma vez ao montar

  return (
    <div className="container mx-auto px-6 py-8 min-h-[calc(100vh-160px)]">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <SectionTitle>Todos os Nossos Produtos</SectionTitle>
      </div>

      <SearchBar /> {/* A funcionalidade de busca virá depois */}

      {isLoading && <p className="text-center text-gray-400 mt-10">Carregando produtos...</p>}
      {error && <p className="text-center text-red-500 mt-10">Erro: {error}</p>}
      
      {!isLoading && !error && allProducts.length === 0 && (
        <p className="text-center text-gray-400 mt-10">Nenhum produto encontrado no momento.</p>
      )}

      {!isLoading && !error && allProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {allProducts.map(product => (
            <ProductCard
              key={product.id}
              id={String(product.id)} // ProductCard espera ID como string
              imageUrl={product.imagem_url || '/images/placeholder-produto.png'}
              name={product.nome}
              price={Number(product.preco)}
              // Adicione rating e reviewCount se sua API/banco os fornecer e ProductCard os usar
            />
          ))}
        </div>
      )}
    </div>
  );
}