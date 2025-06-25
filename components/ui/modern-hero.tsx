'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play, Award, Users, Clock } from 'lucide-react'

interface ModernHeroProps {
  onContactClick?: () => void
  onServicesClick?: () => void
}

const typewriterWords = [
  "Klinkerarbeiten",
  "Rohbau", 
  "WDVS",
  "Qualität",
  "Zuverlässigkeit"
]

const stats = [
  { icon: Award, value: "8+", label: "Jahre Erfahrung" },
  { icon: Users, value: "200+", label: "Zufriedene Kunden" },
  { icon: Clock, value: "100%", label: "Termintreue" }
]

export default function ModernHero({ onContactClick, onServicesClick }: ModernHeroProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -300])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  // Typewriter effect
  useEffect(() => {
    const currentWord = typewriterWords[currentWordIndex]
    
    if (isTyping) {
      if (displayText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % typewriterWords.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentWordIndex])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 text-center max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Main Heading */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              Hajila Bau
            </span>
          </h1>
          
          {/* Typewriter Effect */}
          <div className="h-16 md:h-20 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              Ihr Partner für{' '}
              <span className="relative">
                <span className="text-orange-400">{displayText}</span>
                <motion.span
                  className="inline-block w-1 h-8 md:h-12 bg-orange-400 ml-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Seit 2016 Ihr zuverlässiger Partner für hochwertige Bauarbeiten in Osnabrück. 
          Spezialisiert auf Klinkerarbeiten und Rohbau mit Leidenschaft für Perfektion.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={onContactClick}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-2xl"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 50px rgba(255,165,0,0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Projekt anfragen</span>
              <motion.div
                className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
              </motion.div>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            onClick={onServicesClick}
            className="group relative overflow-hidden border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-full text-white font-semibold text-lg"
            whileHover={{ 
              backgroundColor: "rgba(255,255,255,0.1)", 
              scale: 1.05,
              borderColor: "rgba(255,255,255,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Leistungen ansehen</span>
            </span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-xl bg-white/[0.08] rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              whileHover={{ 
                y: -5, 
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,165,0,0.3)"
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center space-y-2 text-white/60 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={onServicesClick}
        >
          <span className="text-sm font-medium">Scrollen für mehr</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Background Decoration */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
    </section>
  )
}
