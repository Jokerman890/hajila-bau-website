"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion';
import * as THREE from 'three';
import { ChevronDown, Sparkles, Zap, Cpu, Palette, Code, Globe, Layers, Building2, Hammer, LeafyGreen, Phone, Mail, MapPin, Clock, Scale, CalendarDays, Landmark, User, Accessibility, FileText, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard, Tilt } from './glass-card';
import GlowingServiceGrid from './glowing-service-grid';
import BilderKarussel from './bilder-karussel';
import { HeroSplineBackground } from './construction-hero-section';

// Particle Wave Background Component
interface ParticleWaveProps {
  className?: string;
}

const ParticleWave: React.FC<ParticleWaveProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    particleMaterial: THREE.ShaderMaterial;
    animationId: number | null;
    mouse: THREE.Vector2;
  } | null>(null);

  const getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  };

  const getBackgroundColor = (theme: string) => {
    return theme === 'dark'
      ? new THREE.Color(0x0A1E33) // Dark blue from brand tokens
      : new THREE.Color(0xF8FAFC);
  };

  const getParticleColor = (theme: string) => {
    return theme === 'dark'
      ? new THREE.Vector3(0.0, 0.76, 0.89) // Blue from brand tokens
      : new THREE.Vector3(0.2, 0.2, 0.8);
  };

  const particleVertex = `
    attribute float scale;
    uniform float uTime;
    uniform vec2 uMouse;
    void main() {
      vec3 p = position;
      float s = scale;
      
      // Wave animation
      p.y += (sin(p.x * 0.5 + uTime) * 0.3) + (cos(p.z * 0.3 + uTime) * 0.2);
      p.x += sin(p.z * 0.2 + uTime) * 0.1;
      
      // Mouse interaction
      float mouseDistance = distance(vec2(p.x, p.z), uMouse * 10.0);
      p.y += max(0.0, 2.0 - mouseDistance) * 0.5;
      
      s += (sin(p.x + uTime) * 0.3) + (cos(p.z + uTime) * 0.2);
      
      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = s * 8.0 * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const particleFragment = `
    uniform vec3 uColor;
    uniform float uTime;
    void main() {
      float alpha = 0.6 + sin(uTime * 2.0) * 0.2;
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  const initScene = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const aspectRatio = winWidth / winHeight;

    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.01, 1000);
    camera.position.set(0, 8, 8);

    const scene = new THREE.Scene();
    
    // Set scene background
    const currentTheme = getCurrentTheme();
    scene.background = getBackgroundColor(currentTheme);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false, // Set to false for solid background
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(winWidth, winHeight);

    // Create particles
    const gap = 0.4;
    const amountX = 120;
    const amountY = 120;
    const particleNum = amountX * amountY;
    const particlePositions = new Float32Array(particleNum * 3);
    const particleScales = new Float32Array(particleNum);

    let i = 0;
    let j = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - ((amountX * gap) / 2);
        particlePositions[i + 1] = 0;
        particlePositions[i + 2] = iy * gap - ((amountY * gap) / 2);
        particleScales[j] = Math.random() * 2 + 0.5;
        i += 3;
        j++;
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: getParticleColor(getCurrentTheme()) },
        uMouse: { value: new THREE.Vector2(-10, -10) }
      }
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const mouse = new THREE.Vector2(-10, -10);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      particleMaterial,
      animationId: null,
      mouse
    };
  };

  const animate = () => {
    if (!sceneRef.current) return;

    const { scene, camera, renderer, particleMaterial, mouse } = sceneRef.current;

    particleMaterial.uniforms.uTime.value += 0.02;
    particleMaterial.uniforms.uMouse.value = mouse;

    const currentTheme = getCurrentTheme();
    particleMaterial.uniforms.uColor.value = getParticleColor(currentTheme);
    renderer.setClearColor(getBackgroundColor(currentTheme));

    camera.lookAt(scene.position);
    renderer.render(scene, camera);

    sceneRef.current.animationId = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (!sceneRef.current) return;

    const { camera, renderer } = sceneRef.current;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!sceneRef.current) return;

    sceneRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    sceneRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    initScene();
    animate();

    const handleResizeEvent = () => handleResize();
    const handleMouseMoveEvent = (e: MouseEvent) => handleMouseMove(e);

    window.addEventListener('resize', handleResizeEvent);
    window.addEventListener('mousemove', handleMouseMoveEvent);

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      window.removeEventListener('resize', handleResizeEvent);
      window.removeEventListener('mousemove', handleMouseMoveEvent);

      if (sceneRef.current) {
        const { scene, renderer, particles } = sceneRef.current;
        scene.remove(particles);
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material) {
          if (Array.isArray(particles.material)) {
            particles.material.forEach((material: any) => material.dispose());
          } else {
            (particles.material as any).dispose();
          }
        }
        renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        width: '100vw',
        height: '100vh',
        zIndex: -1
      }}
    />
  );
};

// Blueprint Grid Background Component
interface BlueprintGridProps {
  className?: string;
  gridColor?: string;
  dotColor?: string;
  gridSize?: number; // Size of each grid square in pixels
  dotSize?: number; // Size of the dots in pixels
}

const BlueprintGrid: React.FC<BlueprintGridProps> = ({
  className,
  gridColor = 'rgba(0, 195, 227, 0.1)', // Blue from brand tokens, very subtle
  dotColor = 'rgba(0, 195, 227, 0.2)', // Blue from brand tokens, slightly more visible
  gridSize = 40,
  dotSize = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw dots at grid intersections
    ctx.fillStyle = dotColor;
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [gridColor, dotColor, gridSize, dotSize]);

  useEffect(() => {
    const handleResize = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(drawGrid);
    };

    handleResize(); // Initial draw

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [drawGrid]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 pointer-events-none z-[-2]", className)}
    />
  );
};


// Typewriter Component
interface TypewriterProps {
  text: string | string[]
  speed?: number
  initialDelay?: number
  waitTime?: number
  deleteSpeed?: number
  loop?: boolean
  className?: string
  showCursor?: boolean
  hideCursorOnType?: boolean
  cursorChar?: string | React.ReactNode
  cursorAnimationVariants?: {
    initial: Variants["initial"]
    animate: Variants["animate"]
  }
  cursorClassName?: string
}

const Typewriter = ({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: "reverse",
      },
    },
  },
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = Array.isArray(text) ? text : [text]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const currentText = texts[currentTextIndex]

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === "") {
          setIsDeleting(false)
          if (currentTextIndex === texts.length - 1 && !loop) {
            return
          }
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setCurrentIndex(0)
          timeout = setTimeout(() => { }, waitTime)
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1))
          }, deleteSpeed)
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex])
            setCurrentIndex((prev) => prev + 1)
          }, speed)
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, waitTime)
        }
      }
    }

    if (currentIndex === 0 && !isDeleting && displayText === "") {
      timeout = setTimeout(startTyping, initialDelay)
    } else {
      startTyping()
    }

    return () => clearTimeout(timeout)
  }, [
    currentIndex,
    displayText,
    isDeleting,
    speed,
    deleteSpeed,
    waitTime,
    texts,
    currentTextIndex,
    loop,
  ])

  return (
    <div className={`inline whitespace-pre-wrap tracking-tight ${className}`}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          variants={cursorAnimationVariants}
          className={cn(
            cursorClassName,
            hideCursorOnType &&
            (currentIndex < texts[currentTextIndex].length || isDeleting)
              ? "hidden"
              : ""
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </div>
  )
}


// Animated Group Component
interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: 'fade' | 'slide' | 'scale' | 'blur' | 'blur-slide';
}

const AnimatedGroup: React.FC<AnimatedGroupProps> = ({
  children,
  className,
  variants,
  preset = 'slide',
}) => {
  const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const presetVariants = {
    fade: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
    },
    slide: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      },
    },
    scale: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      },
    },
    blur: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, filter: 'blur(4px)' },
        visible: { opacity: 1, filter: 'blur(0px)' },
      },
    },
    'blur-slide': {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, filter: 'blur(4px)', y: 20 },
        visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
      },
    },
  };

  const selectedVariants = preset ? presetVariants[preset] : { container: defaultContainerVariants, item: { hidden: { opacity: 0 }, visible: { opacity: 1 } } };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// 3D Logo Component
const Logo3D: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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


// Navigation Component
interface NavItem {
  text: string;
  items?: {
    icon?: React.ReactNode;
    text: string;
    description?: string;
    to: string;
  }[];
}

const Navigation: React.FC<{ items: NavItem[] }> = ({ items }) => (
  <nav className="hidden lg:block">
    <ul className="flex gap-x-8">
      {items.map(({ text, items }, index) => (
        <li
          className={cn('relative [perspective:2000px]', items && items.length > 0 && 'group')}
          key={index}
        >
          <button className="flex items-center gap-x-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors font-['Open_Sans']">
            {text}
            {items && items.length > 0 && <ChevronDown className="h-3 w-3" />}
          </button>
          {items && items.length > 0 && (
            <div className="absolute -left-5 top-full w-[280px] pt-4 pointer-events-none opacity-0 origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)] group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]">
              <ul className="relative flex flex-col gap-y-1 rounded-xl border border-border bg-background/95 backdrop-blur-sm p-2 shadow-lg">
                {items.map(({ icon, text, description, to }, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      className="group/link relative flex items-center overflow-hidden rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      href={to}
                    >
                      {icon && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted mr-3">
                          {icon}
                        </div>
                      )}
                      <div>
                        <span className="block text-sm font-medium text-foreground font-['Open_Sans']">{text}</span>
                        {description && (
                          <span className="mt-0.5 block text-xs text-muted-foreground font-['Open_Sans']">
                            {description}
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

// Main Premium Website Component
const PremiumWebsite: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const menuItems: NavItem[] = [
    {
      text: "Leistungen",
      items: [
        {
          icon: <Building2 className="h-4 w-4" />,
          text: "Klinkerarbeiten & Verblendmauerwerk",
          description: "Hochwertige Klinkerfassaden",
          to: "/leistungen/klinkerarbeiten"
        },
        {
          icon: <Hammer className="h-4 w-4" />,
          text: "Klinker-Detailarbeiten",
          description: "Bögen, Gesimse, Pfeiler",
          to: "/leistungen/klinker-detailarbeiten"
        },
        {
          icon: <Layers className="h-4 w-4" />,
          text: "Wärmedämmverbundsysteme",
          description: "WDVS mit Klinkeroptik",
          to: "/leistungen/wdvs"
        },
        {
          icon: <Zap className="h-4 w-4" />,
          text: "Schornstein- & Kaminverkleidungen",
          description: "Verkleidungen mit Klinker",
          to: "/leistungen/schornstein-kamin"
        },
        {
          icon: <Cpu className="h-4 w-4" />,
          text: "Betonbau",
          description: "Fundamente, Bodenplatten",
          to: "/leistungen/betonbau"
        },
        {
          icon: <Code className="h-4 w-4" />,
          text: "Eisenflechterarbeiten",
          description: "Bewehrung binden",
          to: "/leistungen/eisenflechterarbeiten"
        },
        {
          icon: <Hammer className="h-4 w-4" />,
          text: "Bauausführung im Rohbau",
          description: "Komplette Rohbauten",
          to: "/leistungen/rohbau"
        }
      ]
    },
    {
      text: "Referenzen",
      items: [
        {
          icon: <Building2 className="h-4 w-4" />,
          text: "Wohnpark Osnabrück",
          description: "2024 · Osnabrück",
          to: "/referenzen/wohnpark-osnabrueck"
        },
        {
          icon: <Building2 className="h-4 w-4" />,
          text: "Logistikhalle Wallenhorst",
          description: "2023 · Wallenhorst",
          to: "/referenzen/logistikhalle-wallenhorst"
        },
        {
          icon: <Building2 className="h-4 w-4" />,
          text: "EFH Klinkervilla Belm",
          description: "2022 · Belm",
          to: "/referenzen/klinkervilla-belm"
        }
      ]
    },
    { text: "Über uns" },
    { text: "Kontakt" }
  ];

  const features = [
    {
      icon: <Building2 className="h-8 w-8 text-[#D4AF37]" />,
      title: "Klinkerarbeiten & Verblendmauerwerk",
      description: "Hochwertige Klinkerfassaden und Verblendmauerwerk für anspruchsvolle Bauprojekte."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-[#00C3E3]" />,
      title: "Klinker-Detailarbeiten",
      description: "Präzise Detailarbeiten wie Bögen, Gesimse und Pfeiler für architektonische Akzente."
    },
    {
      icon: <Layers className="h-8 w-8 text-[#005B9F]" />,
      title: "Wärmedämmverbundsysteme mit Klinkeroptik",
      description: "Energieeffiziente WDVS-Lösungen mit authentischer Klinkeroptik für moderne Gebäude."
    },
    {
      icon: <Zap className="h-8 w-8 text-[#D4AF37]" />,
      title: "Schornstein- und Kaminverkleidungen",
      description: "Hochwertige Verkleidungen für Schornsteine und Kamine mit Klinkermaterialien."
    },
    {
      icon: <Cpu className="h-8 w-8 text-[#00C3E3]" />,
      title: "Betonbau",
      description: "Fundamente, Bodenplatten und weitere Betonarbeiten als solide Basis für Ihr Bauvorhaben."
    },
    {
      icon: <Code className="h-8 w-8 text-[#005B9F]" />,
      title: "Eisenflechterarbeiten",
      description: "Professionelle Bewehrungsarbeiten - Bewehrung binden für stabile Konstruktionen."
    },
    {
      icon: <Hammer className="h-8 w-8 text-[#D4AF37]" />,
      title: "Bauausführung im Rohbau",
      description: "Komplette Rohbauten vom Fundament bis zum Dachstuhl - Ihr Partner für den gesamten Rohbau."
    }
  ];

  const references = [
    { name: "Wohnpark Osnabrück", year: "2024", location: "Osnabrück" },
    { name: "Logistikhalle Wallenhorst", year: "2023", location: "Wallenhorst" },
    { name: "EFH Klinkervilla", year: "2022", location: "Belm" },
  ];

  return (
    <div className={`min-h-screen overflow-hidden relative font-['Open_Sans'] ${currentTheme === 'dark' ? 'dark' : 'light'}`} style={{
      backgroundColor: currentTheme === 'dark' ? '#0A1E33' : '#F8FAFC',
      color: currentTheme === 'dark' ? '#F8FAFC' : '#0A1E33'
    }}>
      <style jsx global>{`
        :root {
          --blue-start: #00C3E3;
          --blue-end: #005B9F;
          --gold: #D4AF37;
          --gold-hover: #B8962F;
          --dark: #0A1E33;
        }
        .dark {
          --background: #0A1E33;
          --foreground: #F8FAFC;
          --card: #1A2B40;
          --card-foreground: #F8FAFC;
          --popover: #1A2B40;
          --popover-foreground: #F8FAFC;
          --primary: #00C3E3;
          --primary-foreground: #F8FAFC;
          --secondary: #2A3B50;
          --secondary-foreground: #F8FAFC;
          --muted: #2A3B50;
          --muted-foreground: #A0AEC0;
          --accent: #2A3B50;
          --accent-foreground: #F8FAFC;
          --destructive: #EF4444;
          --destructive-foreground: #F8FAFC;
          --border: #3A4B60;
          --input: #3A4B60;
          --ring: #00C3E3;
        }
        .light {
          --background: #F8FAFC;
          --foreground: #0A1E33;
          --card: #FFFFFF;
          --card-foreground: #0A1E33;
          --popover: #FFFFFF;
          --popover-foreground: #0A1E33;
          --primary: #005B9F;
          --primary-foreground: #FFFFFF;
          --secondary: #E2E8F0;
          --secondary-foreground: #0A1E33;
          --muted: #E2E8F0;
          --muted-foreground: #718096;
          --accent: #E2E8F0;
          --accent-foreground: #0A1E33;
          --destructive: #EF4444;
          --destructive-foreground: #FFFFFF;
          --border: #E2E8F0;
          --input: #E2E8F0;
          --ring: #005B9F;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Merriweather', serif;
        }
        body {
          font-family: 'Open Sans', sans-serif;
          background-color: ${currentTheme === 'dark' ? '#0A1E33' : '#F8FAFC'} !important;
        }
        html {
          background-color: ${currentTheme === 'dark' ? '#0A1E33' : '#F8FAFC'} !important;
        }
      `}</style>
      <div className="fixed inset-0 z-0">
        <HeroSplineBackground />
      </div>

      {/* Cookie Banner */}
      <AnimatePresence>
        {true && ( // In a real app, this would be controlled by a state variable
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-card/90 backdrop-blur-md border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-sm text-muted-foreground text-center sm:text-left font-['Open_Sans']">
              Wir verwenden Cookies, um Ihre Nutzererfahrung zu verbessern. Durch die Nutzung unserer Website stimmen Sie unserer Datenschutzerklärung zu.
            </p>
            <button
              onClick={() => { /* Implement cookie acceptance logic here */ }}
              className="px-4 py-2 bg-[var(--blue-start)] hover:bg-[var(--blue-end)] text-white rounded-lg font-medium transition-colors font-['Open_Sans']"
            >
              Akzeptieren
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <header className="relative z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="https://hajila-bau.de/logo_2d.png" alt="Hajila Bau Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] bg-clip-text text-transparent font-['Merriweather']">
                Hajila Bau GmbH
              </span>
            </div>

            <Navigation items={menuItems} />

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {currentTheme === 'dark' ? '🌞' : '🌙'}
              </button>
              <a href="#contact" className="px-4 py-2 bg-[var(--blue-start)] hover:bg-[var(--blue-end)] text-white rounded-lg font-medium transition-colors font-['Open_Sans']">
                Jetzt Angebot anfragen
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--blue-start)]/10 border border-[var(--blue-start)]/20 text-[var(--blue-start)] text-sm font-medium font-['Open_Sans']"
                >
                  <Building2 className="h-4 w-4" />
                  Ihr Partner für Bauprojekte
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight font-['Merriweather']">
                  <span className="bg-gradient-to-r from-[var(--blue-start)] via-[var(--blue-end)] to-[var(--blue-start)] bg-clip-text text-transparent">
                    Bauen mit Präzision
                  </span>
                  <br />
                  <Typewriter
                    text={[
                      "& Vertrauen",
                      "Hochbau",
                      "Klinkerarbeiten",
                      "WDVS"
                    ]}
                    speed={80}
                    className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    waitTime={2000}
                    deleteSpeed={50}
                    cursorChar="_"
                    cursorClassName="text-[var(--gold)]"
                  />
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-['Open_Sans']">
                  Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] hover:from-[var(--blue-end)] hover:to-[var(--blue-start)] text-white rounded-xl font-semibold shadow-lg shadow-[var(--blue-start)]/25 transition-all duration-300 text-center font-['Open_Sans']"
                >
                  Jetzt Angebot anfragen
                </motion.a>
                <motion.a
                  href="#services"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-border hover:bg-muted/50 rounded-xl font-semibold transition-all duration-300 text-center font-['Open_Sans']"
                >
                  Unsere Leistungen
                </motion.a>
              </div>

              {/* Unternehmensinformationen entfernt */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <GlassCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section (Features) - Integrated with GlowingServiceGrid */}
      <section id="services" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-['Merriweather']">
              <span className="bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] bg-clip-text text-transparent">
                Unsere Leistungen
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-['Open_Sans']">
              Qualität und Präzision für Ihr Bauvorhaben
            </p>
          </motion.div>
          <GlowingServiceGrid />
        </div>
      </section>

      {/* References Section */}
      <section id="references" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-['Merriweather']">
              <span className="bg-gradient-to-r from-[var(--blue-end)] to-[var(--gold)] bg-clip-text text-transparent">
                Unsere Referenzen
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-['Open_Sans']">
              Erfolgreich abgeschlossene Projekte
            </p>
          </motion.div>
          <BilderKarussel />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-['Merriweather']">
              <span className="bg-gradient-to-r from-[var(--blue-end)] to-[var(--gold)] bg-clip-text text-transparent">
                Über uns
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-['Open_Sans']">
              Ihre Zufriedenheit ist unser Antrieb
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground font-['Merriweather']">Unsere Mission</h3>
              <ul className="space-y-3 text-muted-foreground font-['Open_Sans']">
                <li className="flex items-start gap-2"><Sparkles className="h-5 w-5 text-[var(--gold)] shrink-0 mt-1" /> Qualität ohne Kompromisse</li>
                <li className="flex items-start gap-2"><Clock className="h-5 w-5 text-[var(--blue-start)] shrink-0 mt-1" /> Strikte Termintreue</li>
                <li className="flex items-start gap-2"><User className="h-5 w-5 text-[var(--blue-end)] shrink-0 mt-1" /> Persönliche Betreuung vom ersten Gespräch bis zur Schlüsselübergabe</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground font-['Merriweather']">Unternehmensprofil</h3>
              <ul className="space-y-3 text-muted-foreground font-['Open_Sans']">
                <li className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-[var(--gold)] shrink-0" /> Gegründet: 03.08.2016</li>
                <li className="flex items-center gap-2"><Landmark className="h-5 w-5 text-[var(--blue-start)] shrink-0" /> Handelsregister: HRB 210702 (AG Osnabrück)</li>
                <li className="flex items-center gap-2"><User className="h-5 w-5 text-[var(--blue-end)] shrink-0" /> Geschäftsführerin: <strong className="text-foreground">Samia Omerovic</strong></li>
                <li className="flex items-center gap-2"><Scale className="h-5 w-5 text-[var(--gold)] shrink-0" /> USt-ID: DE401804294</li>
                <li className="flex items-center gap-2"><Clock className="h-5 w-5 text-[var(--blue-start)] shrink-0" /> Öffnungszeiten: Montag – Samstag 06:00 – 18:00 Uhr</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-[var(--blue-start)]/10 via-[var(--blue-end)]/10 to-[var(--gold)]/10 border border-[var(--blue-start)]/20 backdrop-blur-sm"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-['Merriweather']">
              <span className="bg-gradient-to-r from-[var(--blue-start)] to-[var(--gold)] bg-clip-text text-transparent">
                Kontaktieren Sie uns
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-['Open_Sans']">
              Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich.
            </p>
            <div className="space-y-4 mb-8 text-foreground font-['Open_Sans']">
              <p className="flex items-center justify-center gap-2"><MapPin className="h-5 w-5 text-[var(--gold)]" /> Wildeshauser Straße 3, 49088 Osnabrück</p>
              <p className="flex items-center justify-center gap-2"><Phone className="h-5 w-5 text-[var(--blue-start)]" /> Büro 0541 44026213 · Mobil 0152 23000800 · Fax 0541 44097451</p>
              <p className="flex items-center justify-center gap-2"><Mail className="h-5 w-5 text-[var(--blue-end)]" /> E-Mail info@hajila-bau.de</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:info@hajjila-bau.de"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] hover:from-[var(--blue-end)] hover:to-[var(--blue-start)] text-white rounded-xl font-semibold shadow-lg shadow-[var(--blue-start)]/25 transition-all duration-300 text-center font-['Open_Sans']"
              >
                E-Mail senden
              </motion.a>
              <motion.a
                href="tel:+4915223000800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-border hover:bg-muted/50 rounded-xl font-semibold transition-all duration-300 text-center font-['Open_Sans']"
              >
                Jetzt anrufen
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground font-['Open_Sans']">
          <div className="flex justify-center items-center mb-4">
            <img src="https://hajila-bau.de/logo_2d.png" alt="Hajila Bau Logo" className="h-8 w-8 object-contain mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] bg-clip-text text-transparent font-['Merriweather']">
              Hajila Bau GmbH
            </span>
          </div>
          <p className="mb-2">Hajila Bau GmbH · Geschäftsführerin Samia Omerovic · HRB 210702, Amtsgericht Osnabrück</p>
          <p className="mb-4">USt-ID: DE401804294</p>
          <p className="mb-4">© 2025 Hajila Bau GmbH – Alle Rechte vorbehalten.</p>
          <div className="flex justify-center gap-x-6">
            <a href="/impressum" className="hover:text-foreground transition-colors flex items-center gap-1"><FileText className="h-4 w-4" /> Impressum</a>
            <a href="/datenschutz" className="hover:text-foreground transition-colors flex items-center gap-1"><Lock className="h-4 w-4" /> Datenschutz</a>
            <a href="/cookies" className="hover:text-foreground transition-colors flex items-center gap-1">🍪 Cookie-Hinweis</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumWebsite;
