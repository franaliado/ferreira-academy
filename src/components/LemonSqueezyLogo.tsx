import React from 'react';

interface LemonSqueezyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const LemonSqueezyLogo: React.FC<LemonSqueezyLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 select-none ${className}`}>
      {/* Icono del Limón vectorizado transparente */}
      <svg
        className={`${iconSizes[size]} shrink-0 transition-transform duration-200 hover:scale-105`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32.5 16.5C32.5 24.5 25.5 32 16.5 32C11.8 32 7.8 29.8 5.2 26.3C4.4 25.2 5.2 23.7 6.6 23.9C9.2 24.3 12.1 23.7 14.4 22.1C17.2 20.2 18.8 16.9 18.8 13.5C18.8 11.2 18.1 9 16.8 7.2C16 6 17 4.5 18.4 4.8C26.5 6.4 32.5 11 32.5 16.5Z"
          fill="#FFC233"
        />
        <path
          d="M21.5 7.5C21.5 14.5 15.5 20.5 8 20.5C5.8 20.5 3.8 20 2 19.1C1 18.6 1.3 17.1 2.4 17C6.8 16.6 10.6 14.2 12.6 10.3C14 7.6 14.3 4.5 13.5 1.7C13.2 0.6 14.4 -0.2 15.4 0.2C19.1 1.8 21.5 4.4 21.5 7.5Z"
          fill="#FFE066"
        />
        <circle cx="28" cy="10" r="1.5" fill="#FFAB00" />
      </svg>

      {/* Texto de Lemon Squeezy ajustado para diseño oscuro */}
      {showText && (
        <span className={`font-extrabold tracking-tight ${textSizes[size]}`}>
          <span className="text-white">Lemon </span>
          <span className="text-[#FFC233]">Squeezy</span>
        </span>
      )}
    </div>
  );
};

export default LemonSqueezyLogo;
