"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaCreditCard, FaCoins, 
  FaPiggyBank, FaMoneyBillAlt, FaBullseye, FaBoxOpen,
  FaCalendarAlt 
} from 'react-icons/fa';

// Definir un tipo para las secciones
interface MainSection {
  title: string;
  icon: JSX.Element; // Tipo para componentes React como los íconos
  description: string;
  path: string;
  color: string;
  textColor: string;
  borderColor: string;
}

export default function Home() {
  
  // Aplicar el tipo al array
  const mainSections: MainSection[] = [
    {
      title: 'Análisis',
      icon: <FaChartLine />,
      description: 'Visualiza el panorama completo de tus finanzas con gráficos y métricas',
      path: '/analisis',
      color: 'from-blue-500/20 to-blue-700/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Presupuesto',
      icon: <FaPiggyBank />,
      description: 'Crea y gestiona presupuestos inteligentes para controlar tus gastos',
      path: '/presupuesto',
      color: 'from-yellow-500/20 to-yellow-700/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    },
    {
      title: 'Deudas',
      icon: <FaMoneyBillAlt />,
      description: 'Visualiza, organiza y planifica el pago de todas tus deudas',
      path: '/deudas',
      color: 'from-red-500/20 to-red-700/20',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30'
    },
    {
      title: 'Cuentas',
      icon: <FaCreditCard />,
      description: 'Administra todas tus cuentas bancarias, tarjetas y efectivo',
      path: '/cuentas',
      color: 'from-green-500/20 to-green-700/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Objetivos',
      icon: <FaBullseye />,
      description: 'Define y sigue tus metas financieras a corto y largo plazo',
      path: '/objetivos',
      color: 'from-amber-500/20 to-amber-700/20',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30'
    },
    {
      title: 'Inversiones',
      icon: <FaCoins />,
      description: 'Gestiona y proyecta el rendimiento de tu portafolio de inversiones',
      path: '/inversiones',
      color: 'from-emerald-500/20 to-emerald-700/20',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30'
    },
    {
      title: 'Inventario',
      icon: <FaBoxOpen />,
      description: 'Controla tu inventario de activos y bienes con seguimiento detallado',
      path: '/inventario',
      color: 'from-teal-500/20 to-teal-700/20',
      textColor: 'text-teal-400',
      borderColor: 'border-teal-500/30'
    },
    {
      title: 'Calendario Económico',
      icon: <FaCalendarAlt />,
      description: 'Planifica y visualiza todos tus compromisos financieros en un calendario dinámico',
      path: '/calendario',
      color: 'from-purple-500/20 to-purple-700/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    }
  ];
  
  return (
    <main className="min-h-screen bg-[#050505] text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl text-[#eab308] font-light tracking-wider mb-8">DANTE FINANCE</h1>
        
        <h2 className="text-xl mb-6">¿Qué deseas hacer hoy?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainSections.map((section: MainSection, index: number) => (
            <Link
              key={section.title}
              href={section.path}
            >
              <motion.div
                className={`bg-gradient-to-br ${section.color} border ${section.borderColor} rounded-lg p-6 hover:shadow-lg hover:shadow-black/30 transition-all cursor-pointer h-full`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.1 * index,
                    duration: 0.5
                  }
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`text-2xl mb-4 ${section.textColor}`}>
                  {section.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                <p className="text-sm text-white/60">{section.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 text-center text-xs text-white/30">
          <p>DANTE © {new Date().getFullYear()}</p>
        </div>
      </div>
    </main>
  );
}
