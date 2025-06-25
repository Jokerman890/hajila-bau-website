"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Hammer, 
  Building2, 
  Shield, 
  Wrench, 
  Truck, 
  PaintBucket,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface ServiceButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  hoverGradient: string;
  onClick?: () => void;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  icon: Icon,
  title,
  description,
  features,
  gradient,
  hoverGradient,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glassmorphism Container */}
      <div className="relative p-8 bg-white/[0.08] backdrop-blur-xl rounded-3xl border border-white/[0.15] overflow-hidden">
        {/* Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
        />

        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(45deg, transparent, ${isHovered ? 'rgba(255,255,255,0.3)' : 'transparent'}, transparent)`,
            padding: '1px',
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ duration: 2, ease: "linear", repeat: isHovered ? Infinity : 0 }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon Container */}
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-4 mb-6 border border-white/20`}
            whileHover={{ 
              scale: 1.1, 
              rotateY: 180,
              background: hoverGradient 
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-full h-full text-white" />
          </motion.div>

          {/* Title */}
          <motion.h3 
            className="text-2xl font-bold text-white mb-3"
            animate={{ 
              color: isHovered ? '#ffffff' : '#e2e8f0' 
            }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <p className="text-white/70 text-base mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <motion.div
            className="flex items-center justify-between p-4 bg-white/[0.05] rounded-xl border border-white/[0.1] group-hover:bg-white/[0.1] transition-all"
            whileHover={{ x: 5 }}
          >
            <span className="text-white font-medium">Mehr erfahren</span>
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Particles */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + (i * 10)}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}

        {/* Glass Reflection Effect */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        />
      </div>
    </motion.div>
  );
};

const ModernServiceButtons: React.FC = () => {
  const services = [
    {
      icon: Building2,
      title: "Klinkerarbeiten",
      description: "Hochwertige Klinkerverblendung für langlebige und ästhetische Fassaden.",
      features: ["Wetterbeständig", "Energieeffizient", "Wartungsarm"],
      gradient: "from-red-500/20 to-orange-500/20",
      hoverGradient: "from-red-500/30 to-orange-500/30"
    },
    {
      icon: Hammer,
      title: "Rohbau",
      description: "Solide Rohbauarbeiten als Fundament für Ihr Bauprojekt.",
      features: ["Präzise Ausführung", "Termingerecht", "Qualitätskontrolle"],
      gradient: "from-blue-500/20 to-cyan-500/20",
      hoverGradient: "from-blue-500/30 to-cyan-500/30"
    },
    {
      icon: Shield,
      title: "WDVS",
      description: "Wärmedämmverbundsysteme für optimale Energieeffizienz.",
      features: ["Energieeinsparung", "Schallschutz", "Wertsteigerung"],
      gradient: "from-green-500/20 to-emerald-500/20",
      hoverGradient: "from-green-500/30 to-emerald-500/30"
    },
    {
      icon: Wrench,
      title: "Betonbau",
      description: "Professionelle Betonarbeiten für stabile Konstruktionen.",
      features: ["Hochfester Beton", "Präzise Schalung", "Fachgerechte Nachbehandlung"],
      gradient: "from-purple-500/20 to-pink-500/20",
      hoverGradient: "from-purple-500/30 to-pink-500/30"
    },
    {
      icon: Truck,
      title: "Tiefbau",
      description: "Umfassende Tiefbauarbeiten für Infrastruktur und Fundamente.",
      features: ["Erdarbeiten", "Kanalbau", "Straßenbau"],
      gradient: "from-yellow-500/20 to-amber-500/20",
      hoverGradient: "from-yellow-500/30 to-amber-500/30"
    },
    {
      icon: PaintBucket,
      title: "Sanierung",
      description: "Fachgerechte Sanierung und Modernisierung bestehender Bausubstanz.",
      features: ["Bestandsanalyse", "Denkmalschutz", "Modernisierung"],
      gradient: "from-indigo-500/20 to-violet-500/20",
      hoverGradient: "from-indigo-500/30 to-violet-500/30"
    }
  ];

  const handleServiceClick = (serviceName: string) => {
    console.log(`Service clicked: ${serviceName}`);
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-purple-500/[0.05] to-orange-500/[0.08]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '400% 400%'
          }}
        />
        
        {/* Moving construction elements */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/6 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -120, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Hammer className="h-4 w-4 text-orange-300" />
            <span className="text-sm font-medium text-white/80">
              Unsere Leistungen
            </span>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          </motion.div>

          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Professionelle
            </span>
            <br />
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Bauleistungen
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Von der Planung bis zur Fertigstellung - wir bieten Ihnen umfassende Bauleistungen 
            mit höchster Qualität und modernster Technik.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.8 + (index * 0.1), 
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              <ServiceButton
                {...service}
                onClick={() => handleServiceClick(service.title)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              Kostenlose Beratung anfragen
              <ArrowRight className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Construction Elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${5 + (i * 8)}%`,
            top: `${15 + (i * 7)}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </section>
  );
};

export default ModernServiceButtons;
