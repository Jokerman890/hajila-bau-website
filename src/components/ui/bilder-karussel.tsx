"use client"

import { memo, useEffect, useLayoutEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"
import Image from "next/image"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

const projectImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400&auto=format&fit=crop"
]

const projectTitles = [
  "Wohnpark Osnabrück",
  "Logistikzentrum Hamburg",
  "Bürokomplex München",
  "Einkaufszentrum Berlin",
  "Wohnanlage Frankfurt",
  "Industriehalle Köln",
  "Geschäftshaus Dresden",
  "Wohnturm Stuttgart"
]

const transitionOverlay = { duration: 0.5 }

interface CarouselProps {
  handleClick: (imgUrl: string, index: number) => void
  controls: ReturnType<typeof useAnimation>
  cards: string[]
  titles: string[]
  isCarouselActive: boolean
}

const Carousel = memo(({
  handleClick,
  controls,
  cards,
  titles,
  isCarouselActive,
}: CarouselProps) => {
  // Define display name for the component
  Carousel.displayName = "Carousel";
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
  const cylinderWidth = isScreenSizeSm ? 1100 : 1800
  const faceCount = cards.length
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(
    rotation,
    (value) => `rotate3d(0, 1, 0, ${value}deg)`
  )

  return (
    <div
      className="flex h-full items-center justify-center bg-background"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {cards.map((imgUrl, i) => (
            <motion.div
              key={`key-${imgUrl}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl bg-card border border-border p-2 shadow-lg"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${
                  i * (360 / faceCount)
                }deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(imgUrl, i)}
            >
            <div className="relative w-full h-full">
              <Image
                src={imgUrl}
                alt={titles[i]}
                width={225}
                height={180}
                className="pointer-events-none w-full h-4/5 rounded-lg object-cover no_exif_metadata"
                style={{ filter: "blur(0px)" }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-sm rounded-md p-2">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {titles[i]}
                </h3>
                <p className="text-xs text-muted-foreground">2024</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
})

function BilderKarussel() {
  const [activeImg, setActiveImg] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const handleClick = (imgUrl: string, index: number) => {
    setActiveImg(imgUrl)
    setActiveIndex(index)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveImg(null)
    setActiveIndex(null)
    setIsCarouselActive(true)
  }

  return (
    <section className="relative z-10 py-20 px-6 bg-background">
      <div className="mx-auto max-w-7xl">
        <motion.div layout className="relative">
          <AnimatePresence mode="sync">
            {activeImg && activeIndex !== null && (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        layoutId={`img-container-${activeImg}`}
        layout="position"
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
        style={{ willChange: "opacity" }}
        transition={transitionOverlay}
      >
                <div className="relative max-w-4xl w-full">
                  <Image
                    src={activeImg}
                    alt={projectTitles[activeIndex]}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {projectTitles[activeIndex]}
                    </h3>
                    <p className="text-muted-foreground">
                      2024 · Erfolgreich abgeschlossenes Projekt
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-border">
            <Carousel
              handleClick={handleClick}
              controls={controls}
              cards={projectImages}
              titles={projectTitles}
              isCarouselActive={isCarouselActive}
            />
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Ziehen Sie das Karussell oder klicken Sie auf ein Projekt für Details
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BilderKarussel
