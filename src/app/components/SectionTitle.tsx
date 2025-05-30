// src/app/components/SectionTitle.tsx
import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Permite escolher a tag semântica
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = '',
  as: Tag = 'h2', // Default para h2 por ser comum em seções
}) => {
  return (
    <Tag
      className={`text-3xl sm:text-4xl font-bold text-green-500 mb-6 md:mb-8 ${className}`}
    >
      {children}
    </Tag>
  );
};

export default SectionTitle;