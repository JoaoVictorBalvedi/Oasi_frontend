import HeroSection from './components/home/HeroSection';
import ProductsCarousel from './components/home/ProductsCarousel';
import CategoriesSection from './components/home/CategoriesSection';
import FeaturedProducts from './components/home/FeaturedProducts';// Ex: para "Destaque"

export default function HomePage() {
  return (
    <>
      <HeroSection /> {/* Banner principal, chamativo */}

      {/* Seção de Promoções/Recentes (Carrossel) */}
      {/* O componente ProductsCarousel já tem um SectionTitle interno como "Promoção" */}
      <ProductsCarousel />

      {/* Seção de Categorias */}
      {/* O componente CategoriesSection já tem um SectionTitle interno como "Categorias" */}
      <CategoriesSection />

      {/* Seção de Produtos em Destaque (Grid menor que a página de todos os produtos) */}
      {/* O componente FeaturedProducts já tem um SectionTitle interno como "Destaque" */}
      <FeaturedProducts />

      {/* Você pode adicionar mais seções de apresentação aqui se desejar */}
    </>
  );
}