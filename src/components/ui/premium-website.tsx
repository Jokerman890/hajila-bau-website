'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import {
  ChevronDown,
  Sparkles,
  Zap,
  Cpu,
  Code,
  Layers,
  Building2,
  Hammer,
  Phone,
  Mail,
  MapPin,
  Clock,
  Scale,
  CalendarDays,
  Landmark,
  User,
  FileText,
  Lock,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { HeroSplineBackground } from './construction-hero-section'
import { GlassCard } from './glass-card'
import GlowingServiceGrid from './glowing-service-grid'
import BilderKarussel, { type CarouselSlideImage } from './bilder-karussel'
import AnimatedButton from './animated-button'

/* ------------------------------------------------------------------ */
/* Typewriter Komponente                                              */
/* ------------------------------------------------------------------ */
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
    initial: Variants['initial']
    animate: Variants['animate']
  }
  cursorClassName?: string
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = '|',
  cursorClassName = 'ml-1',
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: 'reverse',
      },
    },
  },
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentText = texts[currentTextIndex]

    const startTyping = () => {
      if (isDeleting) {
        if (displayText === '') {
          setIsDeleting(false)
          if (currentTextIndex === texts.length - 1 && !loop) return
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setCurrentIndex(0)
          timeout = setTimeout(() => {}, waitTime)
        } else {
          timeout = setTimeout(
            () => setDisplayText((prev) => prev.slice(0, -1)),
            deleteSpeed,
          )
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex])
            setCurrentIndex((prev) => prev + 1)
          }, speed)
        } else if (texts.length > 1) {
          timeout = setTimeout(() => setIsDeleting(true), waitTime)
        }
      }
    }

    if (currentIndex === 0 && !isDeleting && displayText === '') {
      timeout = setTimeout(startTyping, initialDelay)
    } else startTyping()

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
    initialDelay,
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
              ? 'hidden'
              : '',
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

/* ------------------------------------------------------------------ */
/* Navigation                                                         */
/* ------------------------------------------------------------------ */
interface NavItem {
  text: string
  items?: {
    icon?: React.ReactNode
    text: string
    description?: string
    to: string
  }[]
}

const Navigation: React.FC<{ items: NavItem[] }> = ({ items }) => (
  <nav className="hidden lg:block">
    <ul className="flex gap-x-8">
      {items.map(({ text, items }, index) => (
        <li
          key={index}
          className={cn(
            'relative [perspective:2000px]',
            items?.length && 'group',
          )}
        >
          <button className="flex items-center gap-x-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors font-['Open_Sans']">
            {text}
            {items?.length ? <ChevronDown className="h-3 w-3" /> : null}
          </button>

          {items?.length && (
            <div className="absolute -left-5 top-full w-[280px] pt-4 pointer-events-none opacity-0 origin-top-left transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)] group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none]">
              <ul className="relative flex flex-col gap-y-1 rounded-xl border border-border bg-background/95 backdrop-blur-sm p-2 shadow-lg">
                {items.map(({ icon, text, description, to }, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={to}
                      className="group/link relative flex items-center overflow-hidden rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      {icon && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted mr-3">
                          {icon}
                        </div>
                      )}
                      <div>
                        <span className="block text-sm font-medium text-foreground font-['Open_Sans']">
                          {text}
                        </span>
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
)

/* ------------------------------------------------------------------ */
/* Hauptkomponente                                                    */
/* ------------------------------------------------------------------ */
const PremiumWebsite: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark')
  const [cookieAccepted, setCookieAccepted] = useState(false)
  const [carouselImages, setCarouselImages] = useState<CarouselSlideImage[]>([])
  const [isLoadingCarousel, setIsLoadingCarousel] = useState(true)

  /* Bilder laden */
  useEffect(() => {
    const fetchCarouselImages = async () => {
      setIsLoadingCarousel(true)
      if (!isSupabaseConfigured || !supabase) {
        console.error('Supabase ist nicht konfiguriert.')
        setIsLoadingCarousel(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('carousel_images_metadata')
          .select('id, public_url, alt_text, title, description')
          .eq('is_active', true)
          .order('order', { ascending: true })

        if (error) throw error
        setCarouselImages(data ?? [])
      } catch (err) {
        console.error('Fehler beim Laden der Bilder:', err)
        setCarouselImages([])
      } finally {
        setIsLoadingCarousel(false)
      }
    }
    fetchCarouselImages()
  }, [])

  /* Theme toggeln */
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleAcceptCookies = () => setCookieAccepted(true)

  /* Menü-Konfiguration */
  const menuItems: NavItem[] = [
    {
      text: 'Leistungen',
      items: [
        {
          icon: <Building2 className="h-4 w-4" />,
          text: 'Klinkerarbeiten & Verblendmauerwerk',
          description: 'Hochwertige Klinkerfassaden',
          to: '/leistungen/klinkerarbeiten',
        },
        {
          icon: <Hammer className="h-4 w-4" />,
          text: 'Klinker-Detailarbeiten',
          description: 'Bögen, Gesimse, Pfeiler',
          to: '/leistungen/klinker-detailarbeiten',
        },
        {
          icon: <Layers className="h-4 w-4" />,
          text: 'WDVS mit Klinkeroptik',
          description: 'Energieeffiziente Lösungen',
          to: '/leistungen/wdvs',
        },
        {
          icon: <Zap className="h-4 w-4" />,
          text: 'Schornstein- & Kaminverkleidungen',
          description: 'Verkleidungen mit Klinker',
          to: '/leistungen/schornstein-kamin',
        },
        {
          icon: <Cpu className="h-4 w-4" />,
          text: 'Betonbau',
          description: 'Fundamente, Bodenplatten',
          to: '/leistungen/betonbau',
        },
        {
          icon: <Code className="h-4 w-4" />,
          text: 'Eisenflechterarbeiten',
          description: 'Bewehrung binden',
          to: '/leistungen/eisenflechterarbeiten',
        },
        {
          icon: <Hammer className="h-4 w-4" />,
          text: 'Bauausführung im Rohbau',
          description: 'Komplette Rohbauten',
          to: '/leistungen/rohbau',
        },
      ],
    },
    { text: 'Über uns' },
    { text: 'Kontakt' },
  ]

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div
      className={`min-h-screen overflow-hidden relative font-['Open_Sans'] ${
        currentTheme === 'dark' ? 'dark' : 'light'
      }`}
      style={{
        backgroundColor: currentTheme === 'dark' ? '#0A1E33' : '#F8FAFC',
        color: currentTheme === 'dark' ? '#F8FAFC' : '#0A1E33',
      }}
    >
      {/* Dynamische CSS-Variablen */}
      <style jsx global>{`
        /* ... (Root-Variablen & Themes – unverändert) ... */
      `}</style>

      {/* Hintergrund */}
      <div className="fixed inset-0 z-0">
        <HeroSplineBackground />
      </div>

      {/* Cookie-Banner */}
      <AnimatePresence>
        {!cookieAccepted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-card/90 backdrop-blur-md border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-sm text-muted-foreground text-center sm:text-left font-['Open_Sans']">
              Wir verwenden Cookies, um Ihre Nutzererfahrung zu verbessern.
              Durch die Nutzung unserer Website stimmen Sie unserer
              Datenschutzerklärung zu.
            </p>
            <AnimatedButton
              onClick={handleAcceptCookies}
              variant="primary"
              size="md"
              className="font-['Open_Sans']"
            >
              Akzeptieren
            </AnimatedButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navigation */}
      <header className="relative z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/uploads/Hexagon-logo.jpg"
                alt="Hajila Bau Logo"
                width={48}
                height={48}
                style={{ borderRadius: '8px' }}
              />
            </div>

            <Navigation items={menuItems} />

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {currentTheme === 'dark' ? '🌞' : '🌙'}
              </button>
              <AnimatedButton
                onClick={() => {
                  window.location.hash = 'contact'
                }}
              >
                Jetzt Angebot anfragen
              </AnimatedButton>
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
                    text={['& Vertrauen', 'Hochbau', 'Klinkerarbeiten', 'WDVS']}
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
                <AnimatedButton
                  onClick={() => {
                    window.location.hash = 'contact'
                  }}
                  variant="primary"
                  size="md"
                >
                  Jetzt Angebot anfragen
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => {
                    window.location.hash = 'services'
                  }}
                  variant="ghost"
                  size="md"
                >
                  Unsere Leistungen
                </AnimatedButton>
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
          {isLoadingCarousel ? (
            <div className="text-center py-10">Lade Karussell-Bilder...</div>
          ) : carouselImages.length > 0 ? (
            <BilderKarussel images={carouselImages} />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Momentan sind keine Referenzbilder verfügbar.
            </div>
          )}
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
              <h3 className="text-2xl font-bold mb-4 text-foreground font-['Merriweather']">
                Unsere Mission
              </h3>
              <ul className="space-y-3 text-muted-foreground font-['Open_Sans']">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--gold)] shrink-0 mt-1" />{' '}
                  Qualität ohne Kompromisse
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-[var(--blue-start)] shrink-0 mt-1" />{' '}
                  Strikte Termintreue
                </li>
                <li className="flex items-start gap-2">
                  <User className="h-5 w-5 text-[var(--blue-end)] shrink-0 mt-1" />{' '}
                  Persönliche Betreuung vom ersten Gespräch bis zur
                  Schlüsselübergabe
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground font-['Merriweather']">
                Unternehmensprofil
              </h3>
              <ul className="space-y-3 text-muted-foreground font-['Open_Sans']">
                <li className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[var(--gold)] shrink-0" />{' '}
                  Gegründet: 03.08.2016
                </li>
                <li className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-[var(--blue-start)] shrink-0" />{' '}
                  Handelsregister: HRB 210702 (AG Osnabrück)
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--blue-end)] shrink-0" />{' '}
                  Geschäftsführerin:{' '}
                  <strong className="text-foreground">Samia Omerovic</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[var(--gold)] shrink-0" />{' '}
                  USt-ID: DE401804294
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--blue-start)] shrink-0" />{' '}
                  Öffnungszeiten: Montag – Samstag 06:00 – 18:00 Uhr
                </li>
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
              <p className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--gold)]" /> Wildeshauser
                Straße 3, 49088 Osnabrück
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-[var(--blue-start)]" /> Büro 0541
                44026213 · Mobil 0152 23000800 · Fax 0541 44097451
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-[var(--blue-end)]" /> E-Mail
                info@hajila-bau.de
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                onClick={() => {
                  window.location.href = 'mailto:info@hajila-bau.de'
                }}
                variant="primary"
                size="md"
              >
                E-Mail senden
              </AnimatedButton>
              <AnimatedButton
                onClick={() => {
                  window.location.href = 'tel:+4915223000800'
                }}
                variant="ghost"
                size="md"
              >
                Jetzt anrufen
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground font-['Open_Sans']">
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/uploads/Hexagon-logo.jpg"
              alt="Hajila Bau Logo"
              width={48}
              height={48}
              className="mr-2"
              style={{ borderRadius: '8px' }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--blue-start)] to-[var(--blue-end)] bg-clip-text text-transparent font-['Merriweather']">
              Hajila Bau GmbH
            </span>
          </div>
          <p className="mb-2">
            Hajila Bau GmbH · Geschäftsführerin Samia Omerovic · HRB 210702,
            Amtsgericht Osnabrück
          </p>
          <p className="mb-4">USt-ID: DE401804294</p>
          <p className="mb-4">
            © 2025 Hajila Bau GmbH – Alle Rechte vorbehalten.
          </p>
          <div className="flex justify-center gap-x-6">
            <a
              href="/impressum"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <FileText className="h-4 w-4" /> Impressum
            </a>
            <a
              href="/datenschutz"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Lock className="h-4 w-4" /> Datenschutz
            </a>
            <a
              href="/cookies"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              🍪 Cookie-Hinweis
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PremiumWebsite
