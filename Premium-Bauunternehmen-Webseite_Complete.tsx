"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion';
import * as THREE from 'three';
import { ChevronDown, Sparkles, Building2, Hammer, LeafyGreen, Phone, Mail, MapPin, Clock, Scale, CalendarDays, Landmark, User, Accessibility, FileText, Lock, Layers } from 'lucide-react';

// Utility function for cn
function cnUtil(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const cnFallback = cnUtil;

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
  cursorChar?: string | React.ReactNode
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
  cursorChar = "|",
  cursorClassName = "ml-1",
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
  }, [currentIndex, displayText, isDeleting, speed, deleteSpeed, waitTime, texts, currentTextIndex, loop])

  return (
    <div className={`inline whitespace-pre-wrap tracking-tight ${className}`}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          className={cnFallback(cursorClassName)}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.01,
              repeat: Infinity,
              repeatDelay: 0.4,
              repeatType: "reverse",
            },
          }}
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
    isReverse ? [rotationFactor, -rotationFactor] : [-rotationFactor, rotationFactor]
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    isReverse ? [-rotationFactor, rotationFactor] : [rotationFactor, -rotationFactor]
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
              <span className="block text-xl font-black text-white">
                Hajila Bau GmbH
              </span>
            </div>
            <span className="mt-4 block text-sm text-white/90 leading-relaxed">
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
            <button className="border-none bg-none text-xs font-semibold text-white/90 hover:text-white">
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

// Main Premium Website Component
const PremiumWebsite: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const features = [
    {
      icon: <Building2 className="h-8 w-8 text-[#D4AF37]" />,
      title: "Klinkerarbeiten & Verblendmauerwerk",
      description: "Hochwertige Klinkerfassaden für Neubau- und Sanierungsprojekte."
    },
    {
      icon: <Hammer className="h-8 w-8 text-[#00C3E3]" />,
      title: "Bauausführung im Rohbau",
      description: "Termintreue Rohbauleistungen vom Fundament bis zum Dachstuhl."
    },
    {
      icon: <Layers className="h-8 w-8 text-[#005B9F]" />,
      title: "Wärmedämmverbundsysteme",
      description: "Energieeffiziente WDVS-Lösungen für Neu- und Bestandsgebäude."
    },
    {
      icon: <LeafyGreen className="h-8 w-8 text-[#D4AF37]" />,
      title: "Garten- & Landschaftsbau mit Klinker",
      description: "Stilvolle Klinkermauern, Wege und Außenanlagen – alles aus einer Hand."
    }
  ];

  const references = [
    { name: "Wohnpark Osnabrück", year: "2024", location: "Osnabrück" },
    { name: "Logistikhalle Wallenhorst", year: "2023", location: "Wallenhorst" },
    { name: "EFH Klinkervilla", year: "2022", location: "Belm" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-950 text-white overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --blue-start: #00C3E3;
          --blue-end: #005B9F;
          --gold: #D4AF37;
          --gold-hover: #B8962F;
          --dark: #0A1E33;
        }
        .dark {
          --background: var(--dark);
          --foreground: #F8FAFC;
          --card: #1A2B40;
          --card-foreground: #F8FAFC;
          --muted: #2A3B50;
          --muted-foreground: #A0AEC0;
          --border: #3A4B60;
        }
        .light {
          --background: #F8FAFC;
          --foreground: #0A1E33;
          --card: #FFFFFF;
          --card-foreground: #0A1E33;
          --muted: #E2E8F0;
          --muted-foreground: #718096;
          --border: #E2E8F0;
        }
      `}} />

      {/* Navigation */}
      <header className="relative z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-[#D4AF37]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] bg-clip-text text-transparent">
                Hajila Bau GmbH
              </span>
            </div>

            <nav className="hidden lg:flex space-x-8">
              <a href="#services" className="text-white/80 hover:text-white transition-colors">Leistungen</a>
              <a href="#references" className="text-white/80 hover:text-white transition-colors">Referenzen</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">Über uns</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Kontakt</a>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {currentTheme === 'dark' ? '🌞' : '🌙'}
              </button>
              <a href="#contact" className="px-4 py-2 bg-[var(--blue-start)] hover:bg-[var(--blue-end)] text-white rounded-lg font-medium transition-colors">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--blue-start)]/10 border border-[var(--blue-start)]/20 text-[var(--blue-start)] text-sm font-medium"
                >
                  <Building2 className="h-4 w-4" />
                  Ihr Partner für Bauprojekte
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
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

                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Ihr Partner für Hochbau & Klinkerarbeiten in Osnabrück. Seit 2016 setzen wir auf Qualität, Termintreue und persönliche Betreuung.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] hover:from-[var(--blue-end)] hover:to-[var(--blue-start)] text-white rounded-xl font-semibold shadow-lg shadow-[var(--blue-start)]/25 transition-all duration-300 text-center"
                >
                  Jetzt Angebot anfragen
                </motion.a>
                <motion.a
                  href="#services"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 hover:bg-white/10 rounded-xl font-semibold transition-all duration-300 text-center"
                >
                  Unsere Leistungen
                </motion.a>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--blue-start)]">2016</div>
                  <div className="text-sm text-gray-400">Gegründet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--gold)]">HRB 210702</div>
                  <div className="text-sm text-gray-400">Handelsregister</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--blue-end)]">Osnabrück</div>
                  <div className="text-sm text-gray-400">Standort</div>
                </div>
              </div>
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

      {/* Services Section */}
      <section id="services" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] bg-clip-text text-transparent">
                Unsere Leistungen
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Qualität und Präzision für Ihr Bauvorhaben
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Tilt
                key={index}
                rotationFactor={5}
                springOptions={{ stiffness: 300, damping: 20 }}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[var(--blue-start)]/10">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Tilt>
            ))}
          </div>
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
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[var(--gold)] to-[var(--blue-end)] bg-clip-text text-transparent">
                Unsere Referenzen
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Erfolgreich abgeschlossene Projekte
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {references.map((ref, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{ref.name}</h3>
                <p className="text-gray-300">{ref.year} · {ref.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[var(--blue-end)] to-[var(--gold)] bg-clip-text text-transparent">
                Über uns
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ihre Zufriedenheit ist unser Antrieb
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Unsere Mission</h3>
              <ul className="space-y-3 text-gray-300">
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
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Unternehmensprofil</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-[var(--gold)] shrink-0" /> Gegründet: 03.08.2016</li>
                <li className="flex items-center gap-2"><Landmark className="h-5 w-5 text-[var(--blue-start)] shrink-0" /> Handelsregister: HRB 210702 (AG Osnabrück)</li>
                <li className="flex items-center gap-2"><User className="h-5 w-5 text-[var(--blue-end)] shrink-0" /> Geschäftsführerin: <strong className="text-white">S. Omerovic</strong></li>
                <li className="flex items-center gap-2"><Scale className="h-5 w-5 text-[var(--gold)] shrink-0" /> Letzte Bilanz: 01.03.2024 (GJ 2022)</li>
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
            className="p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[var(--blue-start)] to-[var(--gold)] bg-clip-text text-transparent">
                Kontaktieren Sie uns
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich.
            </p>
            <div className="space-y-4 mb-8 text-white">
              <p className="flex items-center justify-center gap-2"><MapPin className="h-5 w-5 text-[var(--gold)]" /> Wildeshauser Straße 3, 49088 Osnabrück</p>
              <p className="flex items-center justify-center gap-2"><Phone className="h-5 w-5 text-[var(--blue-start)]" /> Büro 0541 44026213 · Mobil 0152 23000800</p>
              <p className="flex items-center justify-center gap-2"><Mail className="h-5 w-5 text-[var(--blue-end)]" /> E-Mail info@hajila-bau.de</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:info@hajila-bau.de"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] hover:from-[var(--blue-end)] hover:to-[var(--blue-start)] text-white rounded-xl font-semibold shadow-lg shadow-[var(--blue-start)]/25 transition-all duration-300 text-center"
              >
                E-Mail senden
              </motion.a>
              <motion.a
                href="tel:+4915223000800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/20 hover:bg-white/10 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Jetzt anrufen
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-400">
          <p className="mb-2">Hajila Bau GmbH · Geschäftsführerin S. Omerovic · HRB 210702, Amtsgericht Osnabrück</p>
          <p className="mb-4">(USt-ID wird nachgereicht.)</p>
          <p className="mb-4">© 2025 Hajila Bau GmbH – Alle Rechte vorbehalten.</p>
          <div className="flex justify-center gap-x-6">
            <a href="/impressum" className="hover:text-white transition-colors flex items-center gap-1"><FileText className="h-4 w-4" /> Impressum</a>
            <a href="/datenschutz" className="hover:text-white transition-colors flex items-center gap-1"><Lock className="h-4 w-4" /> Datenschutz</a>
            <a href="/barrierefreiheit" className="hover:text-white transition-colors flex items-center gap-1"><Accessibility className="h-4 w-4" /> Barrierefreiheit</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumWebsite;
