// src/app/produtos/page.tsx
"use client"; // Necessário para useState e useEffect

import React, { useState, useEffect } from 'react';
import SectionTitle from "../components/SectionTitle";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

// Interface para o produto como vem da API
interface Product {
  id: number;
  nome: string;
  preco: number;
  nivel_sustentabilidade?: number;
  descricao?: string;
  imagem_url: string;
}

// Mapeamento de produtos com suas imagens
const productImages: { [key: string]: string } = {
  'Ecobag de Algodão Orgânico': '/images/ecobag-algodao.jpg',
  'Kit Escovas de Dente de Bambu (4un)': '/images/kit-escovas-bambu.jpg',
  'Garrafa Térmica Inox Sustentável': '/images/garrafa-inox.jpg',
  'Canudos de Inox Reutilizáveis (Kit)': '/images/canudos-inox.jpg',
  'Vaso Auto Irrigável Pequeno': '/images/vaso-autoirrigavel.jpg',
  'Caderno Ecológico Reciclado': '/images/caderno-reciclado.jpg'
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
        console.log('Fetching products from API...');
        const response = await fetch('http://localhost:3001/api/products');
        console.log('API Response status:', response.status);
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        const data: Product[] = await response.json();
        console.log('Products loaded:', data);
        setAllProducts(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 min-h-[calc(100vh-160px)]">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <SectionTitle>Todos os Nossos Produtos</SectionTitle>
      </div>

      <SearchBar />

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
              id={String(product.id)}
              imageUrl={product.imagem_url || productImages[product.nome] || '/placeholder-produto.png'}
              name={product.nome}
              price={Number(product.preco)}
              rating={product.nivel_sustentabilidade}
              description={product.descricao}
            />
          ))}
        </div>
      )}
    </div>
  );
}