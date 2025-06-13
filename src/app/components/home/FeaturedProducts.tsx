// src/app/components/FeaturedProducts.tsx
"use client";

import React, { useState, useEffect } from 'react';
import SectionTitle from '../SectionTitle'; // Ajuste o caminho
import ProductCard from '../ProductCard';   // Ajuste o caminho

interface Product {
  id: number;
  nome: string;
  preco: number;
  imagem_url: string;
  nivel_sustentabilidade?: number;
  descricao?: string;
  // ... outros campos
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

const FeaturedProducts: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/products'); // Busca todos
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos em destaque.');
        }
        const data: Product[] = await response.json();
        // Lógica para selecionar "destaques" - ex: pegar do 6º ao 8º, ou aleatórios, ou com flag "featured" do backend
        setFeatured(data.slice(0, 3)); // Pegando os 3 primeiros como exemplo simples de "destaque"
      } catch (error) {
        console.error("Erro nos destaques:", error);
        setFeatured([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (isLoading) return <div className="container mx-auto px-6 py-8 text-center"><p>Carregando destaques...</p></div>;
  if (!featured.length) return null;

  return (
    <section className="py-12 md:py-16 bg-gray-900"> {/* Ajuste a cor de fundo se necessário */}
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <SectionTitle>Destaque</SectionTitle>
          {/* Link para "Ver todos" pode vir aqui */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map(product => (
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
      </div>
    </section>
  );
};

export default FeaturedProducts;