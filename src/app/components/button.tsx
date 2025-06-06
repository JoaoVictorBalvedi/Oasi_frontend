// src/app/components/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out';

  const variantStyles = {
    primary: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500', // Exemplo de variante
    outline: 'bg-transparent hover:bg-green-500 text-green-500 hover:text-white border border-green-500 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type="button" // Default type, pode ser sobrescrito por props
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;