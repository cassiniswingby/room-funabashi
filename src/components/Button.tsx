import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  showArrow?: boolean;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  showArrow = true,
  href
}) => {
  const baseClasses = 'relative overflow-hidden font-medium transition-colors duration-200 group z-10 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-sky-600 text-white',
    secondary: disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-sky-600 border-2 border-sky-600',
    outline: disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'border border-sky-300 text-sky-600',
    danger: disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-100 text-red-700'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-2 rounded-lg',
    lg: 'px-8 py-3 rounded-lg text-lg'
  };

  const hoverClasses = {
    primary: disabled ? '' : 'bg-sky-500',
    secondary: disabled ? '' : 'bg-sky-600',
    outline: disabled ? '' : 'bg-sky-50',
    danger: disabled ? '' : 'bg-red-200'
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const content = (
    <>
      {!disabled && (
        <span className={`absolute inset-0 ${hoverClasses[variant]} transform scale-x-0 origin-left transition-transform duration-200 ease-out group-hover:scale-x-100 z-[-1]`}></span>
      )}
      <span className={`relative z-10 flex items-center ${variant === 'secondary' && !disabled ? 'group-hover:text-white transition-colors duration-200' : ''}`}>
        {children}
        {showArrow && <ChevronRight size={18} className="ml-1" />}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {content}
    </button>
  );
};

export default Button;