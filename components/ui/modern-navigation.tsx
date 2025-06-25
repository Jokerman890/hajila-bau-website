'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail } from 'lucide-react'
import Image from 'next/image'

interface NavigationProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'Leistungen', href: '#services', id: 'services' },
  { name: 'Referenzen', href: '#references', id: 'references' },
  { name: 'Über uns', href: '#about', id: 'about' },
  { name: 'Kontakt', href: '#contact', id: 'contact' }
]

export default function ModernNavigation({ activeSection = 'home', onSectionChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId: string) => {
    onSectionChange?.(sectionId)
    setIsMobileMenuOpen(false)
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-2xl' 
            : 'backdrop-blur-sm bg-slate-900/60'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                  <span className="text-orange-400 font-bold text-xl">HB</span>
                </div>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Hajila Bau</h1>
                <p className="text-orange-400 text-xs">Premium Bauunternehmen</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-orange-400 bg-white/10'
                      : 'text-white/80 hover:text-orange-400 hover:bg-white/5'
                  }`}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Contact Info & CTA */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Quick Contact */}
              <div className="flex items-center space-x-4 text-sm">
                <motion.a
                  href="tel:+4954144026213"
                  className="flex items-center space-x-2 text-white/70 hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Phone className="w-4 h-4" />
                  <span>0541 44026213</span>
                </motion.a>
                <motion.a
                  href="mailto:info@hajila-bau.de"
                  className="flex items-center space-x-2 text-white/70 hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="w-4 h-4" />
                  <span>info@hajila-bau.de</span>
                </motion.a>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => handleNavClick('contact')}
                className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full text-white font-semibold text-sm shadow-lg"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 30px rgba(255,165,0,0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Kostenlos beraten lassen</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="relative flex flex-col items-center justify-center h-full space-y-8 px-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                    <span className="text-orange-400 font-bold text-2xl">HB</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-white font-bold text-2xl">Hajila Bau</h1>
                  <p className="text-orange-400 text-sm">Premium Bauunternehmen</p>
                </div>
              </motion.div>

              {/* Navigation Items */}
              <div className="space-y-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`block text-2xl font-semibold transition-colors ${
                      activeSection === item.id
                        ? 'text-orange-400'
                        : 'text-white hover:text-orange-400'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              {/* Contact Info */}
              <motion.div
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.a
                  href="tel:+4954144026213"
                  className="flex items-center justify-center space-x-3 text-white/80 hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">0541 44026213</span>
                </motion.a>
                <motion.a
                  href="mailto:info@hajila-bau.de"
                  className="flex items-center justify-center space-x-3 text-white/80 hover:text-orange-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">info@hajila-bau.de</span>
                </motion.a>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                onClick={() => handleNavClick('contact')}
                className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 15px 40px rgba(255,165,0,0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                Kostenlos beraten lassen
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
