"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion';
import * as THREE from 'three';
import { ChevronDown, Sparkles, Zap, Cpu, Palette, Code, Globe, Layers, Building2, Hammer, LeafyGreen, Phone, Mail, MapPin, Clock, Scale, CalendarDays, Landmark, User, Accessibility, FileText, Lock } from 'lucide-react';

// Utility function for cn
function cnUtil(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Use cnUtil as fallback for cn
const cnFallback = cnUtil;

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

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(winWidth, winHeight);

    const currentTheme = getCurrentTheme();
    renderer.setClearColor(getBackgroundColor(currentTheme));

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
        uTime: { type: 'f', value: 0 },
        uColor: { type: 'v3', value: getParticleColor(getCurrentTheme()) },
        uMouse: { type: 'v2', value: new THREE.Vector2(-10, -10) }
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
            particles.material.forEach(material => material.dispose());
          } else {
            particles.material.dispose();
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
  gridSize?: number;
  dotSize?: number;
}

const BlueprintGrid: React.FC<BlueprintGridProps> = ({
  className,
  gridColor = 'rgba(0, 195, 227, 0.1)',
  dotColor = 'rgba(0, 195, 227, 0.2)',
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

    handleResize();

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
      className={cnFallback("fixed inset-0 pointer-events-none z-[-2]", className)}
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
          className={cnFallback(
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

// Tilt Component
interface TiltProps {
  children: React.ReactNode;
  className?: string;
  rotationFactor?: number;
  isReverse?: boolean;
  springOptions?: any;
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
      className={cnFallback(className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
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
      className={cnFallback('group h-[320px] w-[280px] [perspective:1000px]', className)}
    >
      <div className="relative h-full rounded-[32px] bg-gradient-to-br from-[#00C3E3]/90 via-[#005B9F]/80 to-[#00C3E3]/90 shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,195,227,0.4)_30px_50px_25px_-40px,rgba(0,91,159,0.2)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)] backdrop-blur-xl border border-white/20">
        <div className="absolute inset-2 rounded-[28px] border-b border-l border-white/30 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>

        <div className="absolute [transform:translate3d(0,0,26px)] p-6">
          <div className="pt-16">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-6 w-6 text-[#D4AF37]" />
              <span className="block text-xl font-black text-white font-['Merriweather']">
                Hajila Bau GmbH
              </span>
            </div>
            <span className="mt-4 block text-sm text-white/90 leading-relaxed font-['Open_Sans']">
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
                className={cnFallback(
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
              className={cnFallback(
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
          className={cnFallback('relative [perspective:2000px]', items && items.length > 0 && 'group')}
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
          text: "Klinkerarbeiten",
          description: "Hochwertige Fassaden",
          to: "/klinkerarbeiten"
        },
        {
          icon: <Hammer className="h-4 w-4" />,
          text: "Rohbau",
          description: "Fundament bis Dachstuhl",
          to: "/rohbau"
        },
        {
          icon: <Layers className="h-4 w-4" />,
          text: "WDVS",
          description: "Energieeffiziente Dämmung",
          to: "/
