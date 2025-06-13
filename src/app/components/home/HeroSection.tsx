// src/app/components/home/HeroSection.tsx
import Image from 'next/image';
import Button from '../button'; // Ajuste o caminho

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between bg-black overflow-hidden min-h-[350px] md:min-h-[450px] lg:min-h-[550px] w-full">
      {/* Texto grande à esquerda ou central */}
      <div className="z-10 flex-1 flex flex-col justify-center items-center md:items-start px-4 md:pl-12 py-12 md:py-0">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-green-500 mb-2 text-center md:text-left drop-shadow-lg">Oasi</h1>
      </div>
      {/* Folha grande à direita (só em md+) */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-2/3 md:w-1/2 pointer-events-none select-none">
        <Image src="/folha-principal.png" alt="Folha grande" fill style={{objectFit:'contain',objectPosition:'right'}} priority />
      </div>
      {/* Faixa de folhas na base com recorte */}
      <div className="absolute left-0 right-0 bottom-0 w-full h-24 md:h-32 lg:h-40 z-20" style={{pointerEvents:'none'}}>
        <Image src="/folhas-base.png" alt="Folhas base" fill style={{objectFit:'cover'}} />
        {/* Efeito de recorte */}
        <svg className="absolute left-0 right-0 bottom-0 w-full h-8 md:h-12 lg:h-16" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="#111" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;