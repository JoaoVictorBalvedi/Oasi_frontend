// src/app/components/home/CategoryPreview.tsx
import Image from 'next/image'; // ou um componente de Ícone se preferir
import Link from 'next/link';

interface CategoryPreviewProps {
  name: string;
  iconUrl: string; // Caminho para o ícone/imagem da categoria
  href: string;
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({ name, iconUrl, href }) => {
  return (
    <Link href={href} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-700 transition-colors group">
      <div className="w-16 h-16 sm:w-20 sm:h-20 relative mb-2 bg-gray-700 group-hover:bg-gray-600 rounded-md flex items-center justify-center">
        {/* Se for um SVG como string, você pode renderizá-lo diretamente ou usar Image se for um arquivo */}
        <Image src={iconUrl} alt={name} width={40} height={40} className="filter group-hover:brightness-110" />
        {/* Exemplo com placeholder de ícone simples (substitua ou use a imagem) */}
        {/* <span className="text-3xl text-green-400">🛍️</span> */}
      </div>
      <span className="text-sm sm:text-base text-white font-medium group-hover:text-green-400">{name}</span>
    </Link>
  );
};

export default CategoryPreview;