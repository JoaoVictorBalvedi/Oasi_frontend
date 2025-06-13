// src/app/components/home/CategoryPreview.tsx
import Image from 'next/image';
import Link from 'next/link';

interface CategoryPreviewProps {
  name: string;
  iconUrl: string;
  href: string;
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({ name, iconUrl, href }) => {
  return (
    <Link href={href} className="flex flex-col items-center text-center p-4 sm:p-5 rounded-xl bg-gray-800 hover:bg-gray-700 shadow-md hover:shadow-green-500/10 transition-all group border border-gray-700/40">
      <div className="w-16 h-16 sm:w-20 sm:h-20 relative mb-2 bg-gray-700 group-hover:bg-gray-600 rounded-lg flex items-center justify-center shadow overflow-hidden">
        <Image 
          src={iconUrl} 
          alt={name} 
          width={80} 
          height={80} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" 
        />
      </div>
      <span className="text-sm sm:text-base text-white font-medium group-hover:text-green-400 mt-1">{name}</span>
    </Link>
  );
};

export default CategoryPreview;