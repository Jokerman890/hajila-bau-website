"use client";

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Hammer, Building2, LeafyGreen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tilt Component
interface TiltProps {
  children: React.ReactNode;
  className?: string;
  rotationFactor?: number;
  isReverse?: boolean;
  springOptions?: Record<string, unknown>;
}

const Tilt: React.FC<TiltProps> = ({
  children,
  className,
  rotationFactor = 15,
  isReverse = false,
  springOptions,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, springOptions);
  const ySpring = useSpring(y, springOptions);

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    isReverse
      ? [rotationFactor, -rotationFactor]
      : [-rotationFactor, rotationFactor]
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    isReverse
      ? [-rotationFactor, rotationFactor]
      : [rotationFactor, -rotationFactor]
  );

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPos = mouseX / width - 0.5;
    const yPos = mouseY / height - 0.5;

    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transform,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// 3D Logo Component (Simplified)
const Logo3D: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const animate = () => {
      const time = Date.now() * 0.001;
      logo.style.transform = `
        rotateY(${Math.sin(time * 0.5) * 10}deg) 
        rotateX(${Math.cos(time * 0.3) * 5}deg)
        translateZ(${Math.sin(time * 0.7) * 5}px)
      `;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div 
      ref={logoRef}
      className="relative w-16 h-16 [transform-style:preserve-3d] transition-transform duration-300"
    >
      {/* H Letter - Front Face */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8962F] rounded-lg shadow-lg [transform:translateZ(8px)]">
        <div className="flex items-center justify-center h-full">
          <span className="text-2xl font-bold text-white font-['Merriweather']">H</span>
        </div>
      </div>
      
      {/* H Letter - Back Face */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C3E3] to-[#005B9F] rounded-lg shadow-lg [transform:translateZ(-8px)_rotateY(180deg)]">
        <div className="flex items-center justify-center h-full">
          <span className="text-2xl font-bold text-white font-['Merriweather']">B</span>
        </div>
      </div>
      
      {/* Side Faces */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/80 to-[#00C3E3]/80 rounded-lg [transform:rotateY(90deg)_translateZ(8px)] w-4"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#00C3E3]/80 to-[#D4AF37]/80 rounded-lg [transform:rotateY(-90deg)_translateZ(8px)] w-4"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/60 to-[#00C3E3]/60 rounded-lg [transform:rotateX(90deg)_translateZ(8px)] h-4"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#00C3E3]/60 to-[#D4AF37]/60 rounded-lg [transform:rotateX(-90deg)_translateZ(8px)] h-4"></div>
    </div>
  );
};

// Glass Card Component
const GlassCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Tilt
      rotationFactor={8}
      isReverse
      springOptions={{
        stiffness: 26.7,
        damping: 4.1,
        mass: 0.2,
      }}
      className={cn('group h-[320px] w-[280px] [perspective:1000px]', className)}
    >
      <div className="relative h-full rounded-[32px] bg-gradient-to-br from-[#00C3E3]/90 via-[#005B9F]/80 to-[#00C3E3]/90 shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,195,227,0.4)_30px_50px_25px_-40px,rgba(0,91,159,0.2)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)] backdrop-blur-xl border border-white/20">
        <div className="absolute inset-2 rounded-[28px] border-b border-l border-white/30 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>

        <div className="absolute [transform:translate3d(0,0,26px)] p-6">
          <div className="flex justify-center mb-6">
            <Logo3D />
          </div>
          <div className="text-center">
            <span className="block text-xl font-black text-white font-['Merriweather'] mb-2">
              Hajila Bau GmbH
            </span>
            <span className="block text-sm text-white/90 leading-relaxed font-['Open_Sans']">
              Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück.
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
          <div className="flex gap-2 [transform-style:preserve-3d]">
            {[
              { icon: Hammer, delay: "400ms", color: "bg-[#D4AF37]" },
              { icon: Building2, delay: "600ms", color: "bg-[#00C3E3]" },
              { icon: LeafyGreen, delay: "800ms", color: "bg-[#005B9F]" },
            ].map(({ icon: Icon, delay, color }, index) => (
              <button
                key={index}
                className={cn(
                  "group/social grid h-8 w-8 place-content-center rounded-full border-none shadow-lg transition-all duration-200 ease-in-out group-hover:[box-shadow:rgba(0,0,0,0.3)_-5px_20px_10px_0px] group-hover:[transform:translate3d(0,0,50px)] hover:scale-110 active:scale-95",
                  color
                )}
                style={{ transitionDelay: delay }}
              >
                <Icon className="h-4 w-4 stroke-white" strokeWidth={2} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 cursor-pointer transition-all duration-200 ease-in-out hover:[transform:translate3d(0,0,10px)]">
            <button className="border-none bg-none text-xs font-semibold text-white/90 hover:text-white font-['Open_Sans']">
              Mehr erfahren
            </button>
            <ChevronDown className="h-3 w-3 stroke-white" strokeWidth={3} />
          </div>
        </div>

        <div className="absolute top-0 right-0 [transform-style:preserve-3d]">
          {[
            { size: "140px", pos: "8px", z: "20px", delay: "0s", opacity: "opacity-20" },
            { size: "110px", pos: "12px", z: "40px", delay: "0.4s", opacity: "opacity-30" },
            { size: "80px", pos: "18px", z: "60px", delay: "0.8s", opacity: "opacity-40" },
            { size: "50px", pos: "25px", z: "80px", delay: "1.2s", opacity: "opacity-50" },
          ].map((circle, index) => (
            <div
              key={index}
              className={cn(
                "absolute aspect-square rounded-full bg-white shadow-lg transition-all duration-500 ease-in-out",
                circle.opacity
              )}
              style={{
                width: circle.size,
                top: circle.pos,
                right: circle.pos,
                transform: `translate3d(0, 0, ${circle.z})`,
                transitionDelay: circle.delay,
              }}
            ></div>
          ))}

          <div
            className="absolute grid aspect-square w-12 h-12 place-content-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962F] shadow-lg transition-all duration-500 ease-in-out [transform:translate3d(0,0,100px)] [transition-delay:1.6s] group-hover:[transform:translate3d(0,0,120px)]"
            style={{ top: "32px", right: "32px" }}
          >
            <Hammer className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export { GlassCard, Tilt, Logo3D };
