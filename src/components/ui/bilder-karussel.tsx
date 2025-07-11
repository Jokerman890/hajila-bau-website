'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
// Import von carouselImages.json entfernt

// Interface für die Bilddaten, die vom Parent kommen (aus Supabase)
// Dieses Interface sollte dem ähneln, was wir in admin-dashboard.tsx als CarouselDisplayImage haben
// oder was die Datenbank direkt liefert.
export interface CarouselSlideImage {
  id: string // UUID
  public_url: string
  alt_text: string
  title?: string | null
  description?: string | null
  // order, is_active etc. werden hier nicht direkt benötigt, da die Parent-Komponente filtert/sortiert
}

interface ImageCarouselProps {
  images: CarouselSlideImage[] // Images Prop ist jetzt erforderlich
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
}

// getBasePath und withBasePath werden nicht mehr benötigt, da URLs absolut sind.

// defaultImages wird entfernt, da images jetzt eine erforderliche Prop ist.

export function ImageCarousel({
  images, // Keine Default-Images mehr, muss vom Parent kommen
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
  className = '',
}: ImageCarouselProps) {
  // loadedImages wird direkt mit den übergebenen images initialisiert
  const [loadedImages, setLoadedImages] = useState<CarouselSlideImage[]>(images)

  useEffect(() => {
    // Wenn sich die images Prop ändert, aktualisiere den State
    setLoadedImages(images)
  }, [images])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedImages.length)
  }, [loadedImages.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + loadedImages.length) % loadedImages.length,
    )
  }, [loadedImages.length])

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex],
  )

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, nextSlide, autoPlayInterval])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 25 : -25,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 25 : -25,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  if (loadedImages.length === 0) {
    return (
      <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
        <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl bg-background border border-border shadow-lg flex items-center justify-center">
          <p>Keine Bilder zum Anzeigen.</p>
        </div>
      </div>
    )
  }

  // console.log("Aktueller Bild-SRC:", loadedImages[currentIndex]?.public_url); // Angepasst an neues Interface
  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
      {/* Main Carousel */}
      <div
        className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl bg-background border border-border shadow-lg"
        style={{ minHeight: '500px', position: 'relative' }}
      >
        <div className="relative h-full" style={{ perspective: '1000px' }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex} // Verwende currentIndex oder besser image.id falls stabil
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.6 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  nextSlide()
                } else if (swipe > swipeConfidenceThreshold) {
                  prevSlide()
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <div className="relative h-full w-full">
                <Image
                  src={loadedImages[currentIndex].public_url}
                  alt={loadedImages[currentIndex].alt_text}
                  fill
                  className="object-cover transition-opacity duration-300 rounded-2xl"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content Overlay entfernt */}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {showControls && (
          <>
            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background/90 transition-all shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background/90 transition-all shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={togglePlayPause}
              className="absolute top-4 right-4 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background/90 transition-all shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </motion.button>
          </>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && (
        <div className="flex justify-center mt-8 gap-3">
          {loadedImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Thumbnail Navigation */}
      <div className="mt-8 flex justify-center gap-4 overflow-x-auto pb-4">
        {loadedImages.map((image, index) => (
          <motion.button
            key={image.id}
            onClick={() => goToSlide(index)}
            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? 'border-primary shadow-lg'
                : 'border-border hover:border-muted-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image.public_url}
              alt={image.alt_text}
              fill
              className="object-cover transition-opacity duration-300 rounded-lg"
            />
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-primary/20"
                layoutId="activeThumbnail"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Exportiere das Karussell direkt als Default-Export
export default ImageCarousel
