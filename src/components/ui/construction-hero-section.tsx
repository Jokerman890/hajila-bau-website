"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from '@/lib/utils';
import * as THREE from 'three';
import Image from "next/image";
import Logo3D from './logo-3d';

// Moving Border Button Component
export function MovingBorderButton({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--orange-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: unknown;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

// Background Boxes Component
export const BoxesCore = ({ className = "", ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  
  const colors = [
    "rgb(251 146 60)", // orange-400
    "rgb(245 101 101)", // red-400
    "rgb(96 165 250)", // blue-400
    "rgb(34 197 94)", // green-500
    "rgb(168 85 247)", // purple-500
    "rgb(14 165 233)", // sky-500
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn("absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0", className)}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-700 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);

// 3D Floating Elements Component
const FloatingElements = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {isClient && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-orange-500/20 rounded-sm"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotateX: 0,
            rotateY: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotateX: 360,
            rotateY: 360,
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        />
      ))}
    </div>
  );
};

export function HeroSplineBackground() {
  const [isClient, setIsClient] = React.useState(false);
  const mouseRef = React.useRef<THREE.Vector2>(new THREE.Vector2(-10, -10));

  React.useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      {isClient && <Boxes />}
      {isClient && <FloatingElements />}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none z-30" />
    </div>
  );
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-11 md:mt-12">
      <motion.div 
        ref={screenshotRef} 
        className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 w-full md:w-[80%] lg:w-[70%] mx-auto"
        whileHover={{ scale: 1.02, rotateY: 5 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div>
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=3840&h=2160&q=80&auto=format&fit=crop"
            alt="Construction Project"
            width={3840}
            height={2160}
            className="w-full h-auto block rounded-lg mx-auto"
          />
        </div>
      </motion.div>
    </section>
  );
}


function HeroContent() {
  return (
    <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-16 relative z-40">
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none z-50">
        <Logo3D
          imageUrl="https://hajila-bau.de/3d%20logo%20ohne%20bg.png"
          size="lg"
          primaryColor="#00C3E3"
          secondaryColor="#005B9F"
        />
      </div>
      <motion.div 
        className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Hajila Bau GmbH
        </motion.h1>
<motion.h2 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 leading-tight tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück
        </motion.h2>
        <motion.div 
          className="text-sm text-gray-300 opacity-90 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          HOCHBAU \ KLINKER \ PRÄZISION \ QUALITÄT
        </motion.div>
      </motion.div>

      <motion.div 
        className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.p 
          className="text-base sm:text-lg opacity-80 mb-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Bauen mit Präzision - Ihr Partner für Hochbau & Klinkerarbeiten mit jahrelanger Erfahrung und höchsten Qualitätsstandards.
        </motion.p>
        <motion.div 
          className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <MovingBorderButton
            borderRadius="1.75rem"
            className="bg-transparent text-white border-neutral-200 dark:border-slate-800 w-full sm:w-auto"
            containerClassName="w-full sm:w-48 h-12"
            duration={3000}
          >
            Kontakt aufnehmen
          </MovingBorderButton>
          <MovingBorderButton
            borderRadius="1.75rem"
            className="bg-white text-black border-neutral-200 w-full sm:w-auto"
            containerClassName="w-full sm:w-48 h-12"
            duration={2000}
            borderClassName="bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]"
          >
            <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" />
            </svg>
            Projekt starten
          </MovingBorderButton>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Navbar() {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/30 backdrop-blur-md border-b border-slate-700/20 rounded-b-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <motion.div 
            className="text-white"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Logo3D
              imageUrl="https://hajila-bau.de/3d%20logo%20ohne%20bg.png"
              size="md"
              primaryColor="#00C3E3"
              secondaryColor="#005B9F"
            />
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            {['Home', 'Projekte', 'Leistungen', 'Über uns'].map((item, index) => (
              <motion.a 
                key={item}
                href="#" 
                className="text-gray-300 hover:text-white text-sm transition duration-150"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MovingBorderButton
            borderRadius="2rem"
            className="bg-transparent text-white border-neutral-200 dark:border-slate-800"
            containerClassName="w-40 h-10"
            duration={2500}
          >
            Beratung anfragen
          </MovingBorderButton>
        </motion.div>
      </div>
    </motion.nav>
  );
}

const ConstructionHeroSection: React.FC<Record<string, never>> = ({}) => {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (screenshotRef.current && heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;

          if (screenshotRef.current) {
            screenshotRef.current.style.transform = `translateY(-${scrollPosition * 0.5}px)`;
          }

          const maxScroll = 400;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
          if (heroContentRef.current) {
            heroContentRef.current.style.opacity = opacity.toString();
          }
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <Navbar />

      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>

                <div 
          ref={heroContentRef} 
          className="absolute inset-0 z-40 flex justify-center items-center pointer-events-none"
        >
          <HeroContent />
        </div>
      </div>

            <div className="bg-slate-900 relative z-10 -mt-[10vh]">
        <ScreenshotSection screenshotRef={screenshotRef} />
        <motion.div 
          className="container mx-auto px-4 py-16 text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Unsere Leistungen
          </motion.h2>
          <motion.p 
            className="text-center max-w-xl mx-auto opacity-80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Professionelle Baudienstleistungen mit höchsten Qualitätsstandards und jahrelanger Erfahrung im Hochbau und Klinkerarbeiten.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ConstructionHeroSection;
