// src/app/components/ui/SearchBar.tsx
import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="mb-8">
      <input
        type="search"
        placeholder="Buscar produtos..."
        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
      />
      {/* Botão de busca pode ser adicionado aqui se necessário */}
    </div>
  );
};

export default SearchBar;