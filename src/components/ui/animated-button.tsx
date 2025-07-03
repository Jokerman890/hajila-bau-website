import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = "Jetzt Angebot anfragen",
  onClick,
  disabled = false,
  className = "",
  variant = 'primary',
  size = 'md'
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-800 hover:to-gray-600 text-white',
    ghost: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePos({ x, y });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Create ripple effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('div');
      ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ping';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.transform = 'translate(-50%, -50%)';
      
      buttonRef.current?.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
    
    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold shadow-lg transition-all duration-300 transform-gpu',
        'focus:outline-none focus:ring-4 focus:ring-blue-300/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        isHovered && 'shadow-2xl',
        className
      )}
      style={{
        '--mouse-x': `${mousePos.x * 100}%`,
        '--mouse-y': `${mousePos.y * 100}%`,
        background: isHovered 
          ? `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          : undefined
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      disabled={disabled}
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
          backgroundPosition: isHovered ? '200% center' : '0% center'
        }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundSize: '200% 100%'
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        animate={{
          x: isHovered ? '100%' : '-100%'
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut'
        }}
        style={{
          width: '50%'
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isHovered 
            ? '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3)'
            : '0 0 0px rgba(59, 130, 246, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Text content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          letterSpacing: isHovered ? '0.05em' : '0em'
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      {/* Border animation */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent"
        animate={{
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default AnimatedButton;

// Usage example
export function AnimatedButtonDemo() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-8 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Animated Button Demo</h1>
        <p className="text-gray-300">Hover and click the buttons to see the animations</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <AnimatedButton 
          variant="primary" 
          size="md"
          onClick={handleClick}
        >
          Jetzt Angebot anfragen
        </AnimatedButton>
        
        <AnimatedButton 
          variant="secondary" 
          size="md"
          onClick={handleClick}
        >
          Secondary Button
        </AnimatedButton>
        
        <AnimatedButton 
          variant="ghost" 
          size="md"
          onClick={handleClick}
        >
          Ghost Button
        </AnimatedButton>
      </div>
      
      <div className="flex gap-4 items-center">
        <AnimatedButton 
          variant="primary" 
          size="sm"
          onClick={handleClick}
        >
          Small
        </AnimatedButton>
        
        <AnimatedButton 
          variant="primary" 
          size="lg"
          onClick={handleClick}
        >
          Large Button
        </AnimatedButton>
      </div>
      
      <AnimatedButton 
        variant="primary" 
        size="md"
        disabled
        onClick={handleClick}
      >
        Disabled Button
      </AnimatedButton>
    </div>
  );
}
