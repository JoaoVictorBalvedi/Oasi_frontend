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

// Mapeamento de produtos com suas imagens locais
const productImages: { [key: string]: string } = {
  'Caderno Sustentável': '/caderno.webp',
  'Vaso de Plástico Reciclado': '/vaso.webp',
  'Canudo de Bambu': '/canudo.webp',
  'Garrafa Térmica': '/garrafa.webp',
  'Escova de Dentes de Bambu': '/escova.webp',
  'Eco Bag': '/ecobag.webp',
};

// Produtos de exemplo para demonstração
const sampleProducts: Product[] = [
  {
    id: 1,
    nome: 'Caderno Sustentável',
    preco: 29.90,
    nivel_sustentabilidade: 4.5,
    descricao: 'Caderno feito com papel reciclado',
    imagem_url: '/caderno.webp'
  },
  {
    id: 2,
    nome: 'Vaso de Plástico Reciclado',
    preco: 45.00,
    nivel_sustentabilidade: 4.8,
    descricao: 'Vaso feito com plástico 100% reciclado',
    imagem_url: '/vaso.webp'
  },
  {
    id: 3,
    nome: 'Canudo de Bambu',
    preco: 15.90,
    nivel_sustentabilidade: 5.0,
    descricao: 'Canudo reutilizável de bambu',
    imagem_url: '/canudo.webp'
  },
  {
    id: 4,
    nome: 'Garrafa Térmica',
    preco: 89.90,
    nivel_sustentabilidade: 4.7,
    descricao: 'Garrafa térmica sustentável',
    imagem_url: '/garrafa.webp'
  },
  {
    id: 5,
    nome: 'Escova de Dentes de Bambu',
    preco: 19.90,
    nivel_sustentabilidade: 4.9,
    descricao: 'Escova de dentes ecológica',
    imagem_url: '/escova.webp'
  },
  {
    id: 6,
    nome: 'Eco Bag',
    preco: 39.90,
    nivel_sustentabilidade: 4.6,
    descricao: 'Sacola ecológica reutilizável',
    imagem_url: '/ecobag.webp'
  }
];

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
          // Se a API não estiver disponível, use os produtos de exemplo
          setAllProducts(sampleProducts);
          return;
        }
        const data: Product[] = await response.json();
        setAllProducts(data);
      } catch (err: any) {
        // Em caso de erro, use os produtos de exemplo
        setAllProducts(sampleProducts);
        console.log('Usando produtos de exemplo devido ao erro:', err.message);
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
              imageUrl={productImages[product.nome] || '/placeholder-produto.png'}
              name={product.nome}
              price={Number(product.preco)}
              rating={product.nivel_sustentabilidade}
              // Adicione rating e reviewCount se sua API/banco os fornecer e ProductCard os usar
            />
          ))}
        </div>
      )}
    </div>
  );
}