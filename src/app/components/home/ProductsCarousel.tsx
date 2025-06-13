// src/app/components/ProductsCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import SectionTitle from '../SectionTitle'; // Ajuste o caminho se estiver em ../components/SectionTitle
import ProductCard from '../ProductCard';   // Ajuste o caminho

interface Product {
  id: number;
  nome: string;
  preco: number;
  imagem_url: string;
  nivel_sustentabilidade?: number;
  descricao?: string;
  // ... outros campos se necessários
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

const ProductsCarousel: React.FC = () => {
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Adicione estado de erro se desejar

  useEffect(() => {
    const fetchPromoProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/products?limit=5'); // Ex: buscar 5 produtos para o carrossel
                                                                                  // NOTA: seu backend precisa suportar ?limit=X ou você busca todos e fatia
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos para o carrossel.');
        }
        let data: Product[] = await response.json();
        // Se o backend não suporta limit, fatie aqui:
        // data = data.slice(0, 5); 
        setPromoProducts(data.slice(0, 5)); // Pegando os 5 primeiros como exemplo
      } catch (error) {
        console.error("Erro no carrossel:", error);
        setPromoProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromoProducts();
  }, []);

  if (isLoading) return <div className="container mx-auto px-6 py-8 text-center"><p>Carregando promoções...</p></div>;
  if (!promoProducts.length) return null; // Não renderiza nada se não houver produtos

  return (
    <section className="py-12 md:py-16 bg-gray-900"> {/* Ajuste a cor de fundo se necessário */}
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <SectionTitle>Promoção</SectionTitle>
          {/* Setas de navegação do carrossel podem vir aqui */}
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {promoProducts.map(product => (
            <div key={product.id} className="flex-shrink-0 w-72 sm:w-80">
              <ProductCard
                id={String(product.id)}
                imageUrl={productImages[product.nome] || '/placeholder-produto.png'}
                name={product.nome}
                price={Number(product.preco)}
                rating={product.nivel_sustentabilidade}
                description={product.descricao}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsCarousel;