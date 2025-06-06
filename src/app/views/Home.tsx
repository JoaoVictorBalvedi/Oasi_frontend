'use client';

import HeroSection from '../components/home/HeroSection';
import ProductsCarousel from '../components/home/ProductsCarousel';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturedProducts from '../components/home/FeaturedProducts';

const Home = () => {
  return (
    <>
      <HeroSection />
      <ProductsCarousel />
      <CategoriesSection />
      <FeaturedProducts />
    </>
  );
};

export default Home; 