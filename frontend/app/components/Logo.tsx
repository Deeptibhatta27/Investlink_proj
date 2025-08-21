"use client";
import React from 'react';
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'lg',
  variant = 'full',
  className = ''
}) => {
  // Size configurations
  const sizes = {
    sm: { icon: 'w-10 h-10', text: 'text-xl' },
    md: { icon: 'w-16 h-16', text: 'text-2xl' },
    lg: { icon: 'w-20 h-20', text: 'text-3xl' },
    xl: { icon: 'w-28 h-28', text: 'text-4xl' }
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 hover:opacity-90 transition-opacity ${className}`}>
      {/* Icon Version */}
      {variant !== 'text' && (
        <div className={`relative ${sizes[size].icon} flex-shrink-0`}>
          <Image
            src="/logo-icon.svg" // Use SVG for best quality
            alt="InvestLink Logo"
            fill
            className="object-contain"
            priority
            quality={100}
          />
        </div>
      )}

      {/* Text Version */}
      {variant !== 'icon' && (
        <div className={`font-bold ${sizes[size].text} tracking-tight`}>
          <span className="text-gray-900">Invest</span>
          <span className="text-blue-600">Link</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;