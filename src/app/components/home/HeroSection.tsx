// src/app/components/home/HeroSection.tsx
import Image from 'next/image';
import Button from '../button'; // Ajuste o caminho

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[500px] max-h-[700px] text-white"> {/* Ajuste a altura conforme necessário */}
      {/* Background Image */}
      <Image
        src="/images/hero-banner.jpg" // SUBSTITUA pelo caminho da sua imagem de hero
        alt="Karigar Bag"
        fill
        style={{ objectFit: 'cover' }}
        className="brightness-50" // Escurece a imagem para o texto ter mais contraste
        priority // Carrega a imagem com prioridade (LCP)
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black bg-opacity-30">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Oasi
        </h1>
        <p className="text-xl sm:text-2xl mb-8 max-w-2xl">
          Bem-vindo!
        </p>
        <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
          Shop Now
        </Button>
      </div>
      {/* Você pode adicionar os pontinhos de carrossel aqui se for um carrossel */}
    </section>
  );
};

export default HeroSection;