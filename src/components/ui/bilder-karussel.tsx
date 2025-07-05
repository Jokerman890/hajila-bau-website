"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from 'next/image'
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface ImageItem {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
}

interface ImageCarouselProps {
  images?: ImageItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
}

const defaultImages: ImageItem[] = [
  { id: "1", src: "/uploads/carousel/5e360067-9ad3-4601-8a3e-79dd542a0527.JPG", alt: "Referenzprojekt 1" },
  { id: "2", src: "/uploads/carousel/48a7d956-25b4-41fd-8f26-c54d3dffd5d4.JPG", alt: "Referenzprojekt 2" },
  { id: "3", src: "/uploads/carousel/b21f7119-84f5-47fe-9cbe-c428ca2dfa97.JPG", alt: "Referenzprojekt 3" },
  { id: "4", src: "/uploads/carousel/IMG_0179.jpg", alt: "Referenzprojekt 4" },
  { id: "5", src: "/uploads/carousel/IMG_0180.jpg", alt: "Referenzprojekt 5" },
  { id: "6", src: "/uploads/carousel/IMG_0181.jpg", alt: "Referenzprojekt 6" },
  { id: "7", src: "/uploads/carousel/IMG_1171.jpg", alt: "Referenzprojekt 7" },
  { id: "8", src: "/uploads/carousel/IMG_1172.jpg", alt: "Referenzprojekt 8" },
  { id: "9", src: "/uploads/carousel/IMG_1173.jpg", alt: "Referenzprojekt 9" },
  { id: "10", src: "/uploads/carousel/IMG_1174.jpg", alt: "Referenzprojekt 10" },
  { id: "11", src: "/uploads/carousel/IMG_1175.jpg", alt: "Referenzprojekt 11" },
  { id: "12", src: "/uploads/carousel/IMG_1176.jpg", alt: "Referenzprojekt 12" },
  { id: "13", src: "/uploads/carousel/IMG_1177.jpg", alt: "Referenzprojekt 13" },
  { id: "14", src: "/uploads/carousel/IMG_1178.jpg", alt: "Referenzprojekt 14" },
  { id: "15", src: "/uploads/carousel/IMG_1179.jpg", alt: "Referenzprojekt 15" },
  { id: "16", src: "/uploads/carousel/IMG_1189.jpg", alt: "Referenzprojekt 16" },
  { id: "17", src: "/uploads/carousel/IMG_1191.jpg", alt: "Referenzprojekt 17" },
  { id: "18", src: "/uploads/carousel/IMG_1192.PNG", alt: "Referenzprojekt 18" },
  { id: "19", src: "/uploads/carousel/IMG_1727.jpg", alt: "Referenzprojekt 19" },
  { id: "20", src: "/uploads/carousel/IMG_1728.jpg", alt: "Referenzprojekt 20" },
  { id: "21", src: "/uploads/carousel/IMG_1729.jpg", alt: "Referenzprojekt 21" },
  { id: "22", src: "/uploads/carousel/IMG_1730.jpg", alt: "Referenzprojekt 22" },
  { id: "23", src: "/uploads/carousel/IMG_1731.jpg", alt: "Referenzprojekt 23" },
  { id: "24", src: "/uploads/carousel/IMG_1740.jpg", alt: "Referenzprojekt 24" },
  { id: "25", src: "/uploads/carousel/IMG_1741.jpg", alt: "Referenzprojekt 25" },
  { id: "26", src: "/uploads/carousel/IMG_1742.jpg", alt: "Referenzprojekt 26" },
  { id: "27", src: "/uploads/carousel/IMG_1743.jpg", alt: "Referenzprojekt 27" },
  { id: "28", src: "/uploads/carousel/IMG_2927.jpg", alt: "Referenzprojekt 28" },
  { id: "29", src: "/uploads/carousel/IMG_2932.jpg", alt: "Referenzprojekt 29" },
  { id: "30", src: "/uploads/carousel/IMG_2933.jpg", alt: "Referenzprojekt 30" },
  { id: "31", src: "/uploads/carousel/IMG_2938.jpg", alt: "Referenzprojekt 31" },
  { id: "32", src: "/uploads/carousel/IMG_2941.jpg", alt: "Referenzprojekt 32" },
  { id: "33", src: "/uploads/carousel/IMG_2943.jpg", alt: "Referenzprojekt 33" },
  { id: "34", src: "/uploads/carousel/IMG_3144.jpg", alt: "Referenzprojekt 34" },
  { id: "35", src: "/uploads/carousel/IMG_3145.jpg", alt: "Referenzprojekt 35" },
  { id: "36", src: "/uploads/carousel/IMG_3146.jpg", alt: "Referenzprojekt 36" },
  { id: "37", src: "/uploads/carousel/IMG_3148.jpg", alt: "Referenzprojekt 37" },
  { id: "38", src: "/uploads/carousel/IMG_3150.jpg", alt: "Referenzprojekt 38" },
  { id: "39", src: "/uploads/carousel/IMG_3151.jpg", alt: "Referenzprojekt 39" },
  { id: "40", src: "/uploads/carousel/IMG_3153.jpg", alt: "Referenzprojekt 40" },
  { id: "41", src: "/uploads/carousel/IMG_3164.jpg", alt: "Referenzprojekt 41" },
  { id: "42", src: "/uploads/carousel/IMG_3165.jpg", alt: "Referenzprojekt 42" },
  { id: "43", src: "/uploads/carousel/IMG_5803.jpg", alt: "Referenzprojekt 43" },
  { id: "44", src: "/uploads/carousel/IMG_5805.jpg", alt: "Referenzprojekt 44" },
  { id: "45", src: "/uploads/carousel/IMG_5806.jpg", alt: "Referenzprojekt 45" },
  { id: "46", src: "/uploads/carousel/IMG_5807.jpg", alt: "Referenzprojekt 46" },
  { id: "47", src: "/uploads/carousel/IMG_5810.jpg", alt: "Referenzprojekt 47" },
  { id: "48", src: "/uploads/carousel/IMG_5812.jpg", alt: "Referenzprojekt 48" },
  { id: "49", src: "/uploads/carousel/IMG_5813.jpg", alt: "Referenzprojekt 49" },
  { id: "50", src: "/uploads/carousel/IMG_5815.jpg", alt: "Referenzprojekt 50" },
  { id: "51", src: "/uploads/carousel/IMG_7876.jpg", alt: "Referenzprojekt 51" },
  { id: "52", src: "/uploads/carousel/IMG_7878.jpg", alt: "Referenzprojekt 52" }
];

export function ImageCarousel({
  images = defaultImages,
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
  className = ""
}: ImageCarouselProps) {
  const [loadedImages, setLoadedImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (images && images.length > 0) {
      setLoadedImages(images);
    } else {
      setLoadedImages(defaultImages);
    }
  }, [images]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [direction, setDirection] = useState(0)

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedImages.length)
  }, [loadedImages.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + loadedImages.length) % loadedImages.length)
  }, [loadedImages.length])

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex])

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
      rotateY: direction > 0 ? 25 : -25
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 25 : -25
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }


  if (loadedImages.length === 0) {
    return (
      <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Unsere Referenzen
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Erfolgreich abgeschlossene Projekte
          </motion.p>
        </div>
        <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl bg-background border border-border shadow-lg flex items-center justify-center">
          <p>Keine Bilder zum Anzeigen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Unsere Referenzen
        </motion.h2>
        <motion.p 
          className="text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Erfolgreich abgeschlossene Projekte
        </motion.p>
      </div>

      {/* Main Carousel */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl bg-background border border-border shadow-lg">
        <div 
          className="relative h-full"
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.6 }
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
                  src={loadedImages[currentIndex].src}
                  alt={loadedImages[currentIndex].alt}
                  layout="fill"
                  objectFit="cover"
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
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
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
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
            />
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-primary/20"
                layoutId="activeThumbnail"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function BilderKarussellDemo() {
  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <ImageCarousel
          autoPlay={true}
          autoPlayInterval={5000}
          showControls={true}
          showIndicators={true}
        />
      </div>
    </div>
  )
}
