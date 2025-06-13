// src/app/components/home/CategoriesSection.tsx
import SectionTitle from '../SectionTitle'; // Ajuste o caminho
import CategoryPreview from './CategoryPreview';

// Categorias com suas imagens
const categories = [
  { name: 'Bolsas', iconUrl: '/bolsa.png', href: '/produtos?categoria=bolsas' },
  { name: 'Beleza', iconUrl: '/beleza.png', href: '/produtos?categoria=beleza' },
  { name: 'Decoração', iconUrl: '/decoracao.png', href: '/produtos?categoria=decoracao' },
  { name: 'Utensílios', iconUrl: '/utensilios.png', href: '/produtos?categoria=utensilios' },
  { name: 'Mobília', iconUrl: '/mobilia.png', href: '/produtos?categoria=mobilia' },
];
// CRIE os ícones em public/icons/ ou use placeholders

const CategoriesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-800"> {/* Cor de fundo pode variar conforme o design */}
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <SectionTitle>Categorias</SectionTitle>
          {/* Setas de navegação se for um carrossel de categorias */}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map(category => (
            <CategoryPreview key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;