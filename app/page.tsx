'use client'

import { useState } from 'react'
import ModernNavigation from '@/components/ui/modern-navigation'
import ModernHero from '@/components/ui/modern-hero'
import ModernServiceButtons from '@/components/ui/modern-service-buttons'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  const handleContactClick = () => {
    setActiveSection('contact')
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleServicesClick = () => {
    setActiveSection('services')
    const element = document.getElementById('services')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <ModernNavigation 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Hero Section */}
      <ModernHero 
        onContactClick={handleContactClick}
        onServicesClick={handleServicesClick}
      />

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Unsere <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Leistungen</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Von Klinkerarbeiten bis zum kompletten Rohbau - wir sind Ihr zuverlässiger Partner 
              für alle Bauvorhaben in Osnabrück und Umgebung.
            </p>
          </div>
          
          <ModernServiceButtons />
        </div>
      </section>

      {/* Placeholder sections for other content */}
      <section id="references" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Unsere <span className="text-orange-400">Referenzen</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Referenzen-Sektion wird hier implementiert...
          </p>
        </div>
      </section>

      <section id="about" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Über <span className="text-orange-400">uns</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Über uns-Sektion wird hier implementiert...
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            <span className="text-orange-400">Kontakt</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Kontakt-Sektion wird hier implementiert...
          </p>
          
          {/* Quick Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/[0.08] rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Telefon</h3>
              <p className="text-orange-400">0541 44026213</p>
            </div>
            <div className="backdrop-blur-xl bg-white/[0.08] rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">E-Mail</h3>
              <p className="text-orange-400">info@hajila-bau.de</p>
            </div>
            <div className="backdrop-blur-xl bg-white/[0.08] rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Adresse</h3>
              <p className="text-orange-400">Wildeshauser Straße 3<br />49088 Osnabrück</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
