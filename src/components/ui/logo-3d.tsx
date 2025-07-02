"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface Logo3DProps {
  text?: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
}

const Logo3D: React.FC<Logo3DProps> = ({
  text = 'B',
  imageUrl,
  size = 'md',
  primaryColor = '#00C3E3',
  secondaryColor = '#005B9F',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateX = (y / rect.height) * -30;
    const rotateY = (x / rect.width) * 30;
    
    containerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    setIsHovered(false);
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        ref={containerRef}
        className={`relative ${sizeClasses[size]} cursor-pointer transition-transform duration-300 ease-out`}
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg flex items-center justify-center text-slate-50 font-bold overflow-hidden"
          style={{
            background: imageUrl ? 'transparent' : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            transform: 'translateZ(8px)'
          }}
        >
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt="Logo" 
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              fill
              sizes="100vw"
              priority
            />
          ) : (
            text
          )}
        </div>
        
        {/* Back face */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg flex items-center justify-center text-slate-50 font-bold overflow-hidden"
          style={{
            background: imageUrl ? 'transparent' : `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
            transform: 'translateZ(-8px) rotateY(180deg)'
          }}
        >
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt="Logo" 
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              fill
              sizes="100vw"
              priority
            />
          ) : (
            text
          )}
        </div>
        
        {/* Top face */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}dd, ${secondaryColor}dd)`,
            transform: `rotateX(90deg) translateZ(${size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'})`
          }}
        />
        
        {/* Bottom face */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${secondaryColor}aa, ${primaryColor}aa)`,
            transform: `rotateX(-90deg) translateZ(${size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'})`
          }}
        />
        
        {/* Left face */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}cc, ${secondaryColor}cc)`,
            transform: `rotateY(-90deg) translateZ(${size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'})`
          }}
        />
        
        {/* Right face */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${secondaryColor}cc, ${primaryColor}cc)`,
            transform: `rotateY(90deg) translateZ(${size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'})`
          }}
        />
        
        {/* Glow effect on hover */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-lg blur-md opacity-50 animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              transform: 'translateZ(-16px) scale(1.1)'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Logo3D;
