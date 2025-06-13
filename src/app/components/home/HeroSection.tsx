// src/app/components/home/HeroSection.tsx
import Image from 'next/image';
import Button from '../button'; // Ajuste o caminho

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between bg-black overflow-hidden min-h-[350px] md:min-h-[450px] lg:min-h-[550px] w-full">
      {/* Texto grande um pouco afastado da borda esquerda */}
      <div className="z-10 flex-1 flex flex-col justify-center items-start px-8 md:pl-64 py-12 md:py-0">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-green-500 mb-2 text-left drop-shadow-lg">Oasi</h1>
      </div>
      {/* Imagem planta2.png gigante, quase no fim da tela e com menos blur */}
      <div className="md:block absolute right-[-25vw] bottom-[-2vw] h-[140%] w-[90vw] max-w-[1500px] pointer-events-none select-none flex items-end justify-end">
        <div className="relative w-full h-full flex items-end justify-end">
          <Image src="/planta2.png" alt="Planta" fill style={{objectFit:'contain',objectPosition:'right bottom', filter:'blur(1.2px)'}} priority />
        </div>
      </div>
      {/* Faixa de folhas na base com recorte */}
      <div className="absolute left-0 right-0 bottom-0 w-full h-24 md:h-32 lg:h-40 z-20" style={{pointerEvents:'none'}}>
        {/* <Image src="/folhas-base.png" alt="Folhas base" fill style={{objectFit:'cover'}} /> */}
        {/* Efeito de recorte */}
        <svg className="absolute left-0 right-0 bottom-0 w-full h-8 md:h-12 lg:h-16" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" fill="#111" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;