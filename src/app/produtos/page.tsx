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
}

// Mapeamento de produtos com suas imagens
const productImages: { [key: string]: string } = {
  'Ecobag de Algodão Orgânico': '/ecobag.png',
  'Kit Escovas de Dente de Bambu (4un)': '/escova.png',
  'Garrafa Térmica Inox Sustentável': '/garrafa.png',
  'Canudos de Inox Reutilizáveis (Kit)': '/canudo.png',
  'Vaso Auto Irrigável Pequeno': '/vaso.png',
  'Caderno Ecológico Reciclado': '/caderno.png'
};

export default function ProdutosPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/products');
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
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <SectionTitle>Todos os Nossos Produtos</SectionTitle>
        </div>

        <div className="mb-8">
          <SearchBar />
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Carregando produtos...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">Erro: {error}</p>
          </div>
        )}
        
        {!isLoading && !error && allProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum produto encontrado no momento.</p>
          </div>
        )}

        {!isLoading && !error && allProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {allProducts.map(product => (
              <ProductCard
                key={product.id}
                id={String(product.id)}
                imageUrl={productImages[product.nome] || '/placeholder-produto.png'}
                name={product.nome}
                price={Number(product.preco)}
                rating={product.nivel_sustentabilidade}
                description={product.descricao}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}