"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Printer,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';

const ReferenceWebsite: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      {/* Header with Blueprint Pattern */}
      <div className="relative overflow-hidden">
        {/* Blueprint Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Building Silhouettes */}
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 1200 300" className="w-full h-full">
            {/* Building 1 */}
            <rect x="50" y="150" width="80" height="150" fill="rgba(255,255,255,0.1)" />
            <rect x="60" y="160" width="15" height="20" fill="rgba(255,255,255,0.2)" />
            <rect x="85" y="160" width="15" height="20" fill="rgba(255,255,255,0.2)" />
            <rect x="110" y="160" width="15" height="20" fill="rgba(255,255,255,0.2)" />
            
            {/* Building 2 */}
            <rect x="150" y="100" width="100" height="200" fill="rgba(255,255,255,0.1)" />
            <rect x="165" y="120" width="20" height="25" fill="rgba(255,255,255,0.2)" />
            <rect x="195" y="120" width="20" height="25" fill="rgba(255,255,255,0.2)" />
            <rect x="225" y="120" width="20" height="25" fill="rgba(255,255,255,0.2)" />
            
            {/* Building 3 */}
            <rect x="270" y="130" width="90" height="170" fill="rgba(255,255,255,0.1)" />
            <rect x="285" y="150" width="18" height="22" fill="rgba(255,255,255,0.2)" />
            <rect x="315" y="150" width="18" height="22" fill="rgba(255,255,255,0.2)" />
            <rect x="340" y="150" width="18" height="22" fill="rgba(255,255,255,0.2)" />
            
            {/* More buildings */}
            <rect x="380" y="120" width="70" height="180" fill="rgba(255,255,255,0.1)" />
            <rect x="470" y="140" width="85" height="160" fill="rgba(255,255,255,0.1)" />
            <rect x="570" y="110" width="95" height="190" fill="rgba(255,255,255,0.1)" />
            <rect x="680" y="135" width="75" height="165" fill="rgba(255,255,255,0.1)" />
            <rect x="770" y="125" width="80" height="175" fill="rgba(255,255,255,0.1)" />
            <rect x="870" y="145" width="90" height="155" fill="rgba(255,255,255,0.1)" />
            <rect x="980" y="115" width="85" height="185" fill="rgba(255,255,255,0.1)" />
            <rect x="1080" y="140" width="70" height="160" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>

        {/* Header Content */}
        <div className="relative z-10 px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold">
                  Hajila Bau GmbH
                </h1>
              </div>
              
              <p className="text-xl lg:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto">
                Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold rounded-lg text-lg transition-all duration-300 shadow-lg"
              >
                Jetzt Angebot anfragen
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Kontakt Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-yellow-400">Kontakt</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Wildeshauser Straße 3, 49088</p>
                  <p>Osnabrück</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Büro: 0541 44026213</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Mobil: 0152 23000800</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Fax: 0541 44097451</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold">info@hajila-bau.de</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leistungen Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-yellow-400">Leistungen</h2>
            </div>
            
            <div className="space-y-3">
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                Klinkerarbeiten & Verblendmauerwerk
              </p>
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                Klinker-Detailarbeiten
              </p>
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                WDVS mit Klinkeroptik
              </p>
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                Schornstein- und Kaminverkleidungen
              </p>
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                Betonbau
              </p>
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                Eisenflechterarbeiten
              </p>
              <p className="hover:text-yellow-400 transition-colors cursor-pointer">
                Bauausführung im Rohbau
              </p>
            </div>
          </motion.div>

          {/* Öffnungszeiten Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-blue-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-yellow-400">Öffnungszeiten</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Montag - Freitag:</span>
                <span>08:00 - 17:00 Uhr</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Samstag:</span>
                <span>Nach Vereinbarung</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Sonntag:</span>
                <span>Geschlossen</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Company Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-900">HB</span>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-blue-200">
                Ihr innovativer Partner für hochwertige
              </h3>
              <p className="text-xl text-blue-300">
                Bauarbeiten und Klinkerarbeiten in Osnabrück und Umgebung.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900/80 backdrop-blur-sm border-t border-blue-700/50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-blue-200 mb-2">
                © 2025 Hajila Bau GmbH. Alle Rechte vorbehalten.
              </p>
              <p className="text-xs text-blue-300 mb-1">
                Handelsregister: Amtsgericht Osnabrück, HRB 210702
              </p>
              <p className="text-xs text-blue-300 mb-1">
                Geschäftsführerin: S. Omerovic
              </p>
              <p className="text-xs text-blue-300 mb-1">
                USt-ID: DE401804294
              </p>
              <p className="text-xs text-blue-300 mb-1">
                Versicherung: R+V
              </p>
              <p className="text-xs text-blue-300">
                Kammer: Handwerkskammer Osnabrück-Emsland-Grafschaft Bentheim
              </p>
            </div>
            
            <div className="flex flex-col md:items-end">
              <div className="flex gap-4 mb-4">
                <a href="/impressum" className="text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  Impressum
                </a>
                <a href="/datenschutz" className="text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  Datenschutz
                </a>
              </div>
              
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-blue-300 hover:text-yellow-400 transition-colors cursor-pointer" />
                <Instagram className="w-5 h-5 text-blue-300 hover:text-yellow-400 transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 text-blue-300 hover:text-yellow-400 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-blue-300 hover:text-yellow-400 transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReferenceWebsite;
