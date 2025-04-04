"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaCalendarAlt, FaCoins, FaCreditCard, FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';

export default function CalendarioLegacy() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [animateDirection, setAnimateDirection] = useState<'left' | 'right'>('right');
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  
  // Eventos financieros de ejemplo
  const eventos = {
    5: { tipo: 'ingreso', descripcion: 'Pago de salario', monto: 1500 },
    10: { tipo: 'gasto', descripcion: 'Alquiler', monto: 600 },
    15: { tipo: 'transferencia', descripcion: 'Envío a cuenta de ahorros', monto: 200 },
    18: { tipo: 'gasto', descripcion: 'Servicios públicos', monto: 100 },
    22: { tipo: 'ingreso', descripcion: 'Ingreso freelance', monto: 300 },
    25: { tipo: 'inversión', descripcion: 'Compra de acciones', monto: 400 }
  };
  
  // Obtener etiqueta según tipo de evento
  const getTagMessage = (tipo: string): string => {
    switch (tipo) {
      case 'ingreso': return 'Los ingresos regulares son fundamentales para tu estabilidad financiera.';
      case 'gasto': return 'Controla tus gastos y prioriza lo esencial para alcanzar tus metas.';
      case 'transferencia': return 'Organizarte en diferentes cuentas mejora tu administración financiera.';
      case 'inversión': return 'Las inversiones inteligentes son el camino hacia la libertad financiera.';
      default: return '';
    }
  };
  
  // Funciones para gestionar el calendario
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long' });
  };
  
  const getYear = (date: Date) => {
    return date.getFullYear();
  };
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const prevMonth = () => {
    setAnimateDirection('left');
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDay(null);
  };
  
  const nextMonth = () => {
    setAnimateDirection('right');
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null);
  };
  
  // Construir el calendario
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    
    // Ajuste para que el domingo sea el día 7 en lugar del 0
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    let days = [];
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-16 border border-white/10 rounded-md bg-black/20"
        />
      );
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const hasEvent = eventos[i as keyof typeof eventos];
      const isSelected = selectedDay === i;
      
      days.push(
        <motion.div 
          key={`day-${i}`} 
          className={`h-16 border ${isSelected ? 'border-[#eab308]' : 'border-white/10'} rounded-md bg-black/20 hover:bg-white/5 transition-colors flex flex-col p-2 cursor-pointer relative gold-glow`}
          onClick={() => setSelectedDay(isSelected ? null : i)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm">{i}</span>
          
          {hasEvent && (
            <motion.div 
              className={`text-xs mt-1 flex items-center gap-1 truncate ${
                hasEvent.tipo === 'ingreso' ? 'text-[#4ade80]' : 
                hasEvent.tipo === 'gasto' ? 'text-[#f87171]' : 
                hasEvent.tipo === 'transferencia' ? 'text-[#38bdf8]' : 
                'text-[#a78bfa]'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onMouseEnter={() => setHoveredTag(hasEvent.tipo)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {hasEvent.tipo === 'ingreso' ? <FaCoins className="text-[#4ade80]" /> : 
               hasEvent.tipo === 'gasto' ? <FaCreditCard className="text-[#f87171]" /> : 
               hasEvent.tipo === 'transferencia' ? <FaArrowRight className="text-[#38bdf8]" /> : 
               <FaCoins className="text-[#a78bfa]" />}
              {hasEvent.descripcion}
            </motion.div>
          )}
          
          {isSelected && (
            <motion.div 
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#eab308] rounded-full"
              layoutId="selectedIndicator"
            />
          )}
        </motion.div>
      );
    }
    
    return days;
  };
  
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  return (
    <div className="container mx-auto px-4 py-8 bg-[#050505] text-[#f4f4f4] min-h-screen">
      {/* Encabezado */}
      <header className="mb-8 text-center">
        <motion.h1 
          className="text-3xl text-[#eab308] font-light tracking-wider"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          DANTE
        </motion.h1>
        <motion.h2 
          className="text-xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Calendario Financiero
        </motion.h2>
      </header>
      
      {/* Mensaje al hacer hover en etiquetas */}
      <AnimatePresence>
        {hoveredTag && (
          <motion.div 
            className="w-full max-w-4xl mx-auto mb-6 p-4 border border-[#eab308] rounded-lg bg-black/30 backdrop-blur-sm text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[#eab308]">{getTagMessage(hoveredTag)}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Calendario */}
      <motion.div 
        className="w-full max-w-4xl mx-auto border border-[#eab308] rounded-lg bg-black/20 p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Navegación del mes */}
        <div className="flex justify-between items-center mb-6">
          <motion.button 
            onClick={prevMonth} 
            className="text-[#eab308] p-2 flex items-center gap-2 hover:bg-white/5 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Mes anterior
          </motion.button>
          <motion.h3 
            className="text-xl capitalize"
            key={currentMonth.toString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {getMonthName(currentMonth)} {getYear(currentMonth)}
          </motion.h3>
          <motion.button 
            onClick={nextMonth} 
            className="text-[#eab308] p-2 flex items-center gap-2 hover:bg-white/5 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mes siguiente <FaArrowRight />
          </motion.button>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm text-[#eab308] font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Días del mes */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentMonth.toString()}
            className="grid grid-cols-7 gap-2"
            initial={{ 
              x: animateDirection === 'right' ? 50 : -50, 
              opacity: 0 
            }}
            animate={{ 
              x: 0, 
              opacity: 1 
            }}
            exit={{ 
              x: animateDirection === 'right' ? -50 : 50, 
              opacity: 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {renderCalendar()}
          </motion.div>
        </AnimatePresence>
        
        {/* Detalle del día seleccionado */}
        <AnimatePresence>
          {selectedDay && eventos[selectedDay as keyof typeof eventos] && (
            <motion.div 
              className="mt-6 p-4 border border-white/10 rounded-lg bg-black/30"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-lg mb-2 capitalize text-[#eab308]">
                {eventos[selectedDay as keyof typeof eventos]?.descripcion}
              </h4>
              <div className="flex justify-between items-center">
                <span className={`
                  ${eventos[selectedDay as keyof typeof eventos]?.tipo === 'ingreso' ? 'text-[#4ade80]' : 
                  eventos[selectedDay as keyof typeof eventos]?.tipo === 'gasto' ? 'text-[#f87171]' : 
                  eventos[selectedDay as keyof typeof eventos]?.tipo === 'transferencia' ? 'text-[#38bdf8]' : 
                  'text-[#a78bfa]'}
                `}>
                  {eventos[selectedDay as keyof typeof eventos]?.tipo === 'ingreso' ? '+' : 
                   eventos[selectedDay as keyof typeof eventos]?.tipo === 'gasto' ? '-' : ''} 
                  ${eventos[selectedDay as keyof typeof eventos]?.monto}
                </span>
                <span className="text-sm text-white/70">
                  {selectedDay} de {getMonthName(currentMonth)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Botón de agregar evento */}
        <motion.button 
          className="mt-4 ml-auto flex items-center gap-2 text-[#eab308] bg-black/40 border border-[#eab308]/30 px-4 py-2 rounded-full"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Agregar evento
        </motion.button>
      </motion.div>
      
      {/* Leyenda */}
      <motion.div 
        className="w-full max-w-4xl mx-auto mt-8 p-4 border border-white/10 rounded-lg backdrop-blur-sm bg-black/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg mb-4">Eventos Financieros</h3>
        <div className="flex flex-wrap gap-4">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 bg-[#4ade80] rounded-full mr-2"></div>
            <span>Ingresos</span>
          </motion.div>
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 bg-[#f87171] rounded-full mr-2"></div>
            <span>Gastos</span>
          </motion.div>
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 bg-[#38bdf8] rounded-full mr-2"></div>
            <span>Transferencias</span>
          </motion.div>
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-3 h-3 bg-[#a78bfa] rounded-full mr-2"></div>
            <span>Inversiones</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Botones de navegación */}
      <motion.div 
        className="w-full max-w-4xl mx-auto my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { nombre: 'Inicio', ruta: '/' },
            { nombre: 'Presupuesto', ruta: '/presupuesto' },
            { nombre: 'Análisis', ruta: '/analisis' },
            { nombre: 'Cuentas', ruta: '/cuentas' },
            { nombre: 'Deudas', ruta: '/deudas' },
            { nombre: 'Objetivos', ruta: '/objetivos' },
            { nombre: 'Inversiones', ruta: '/inversiones' }
          ].map((option) => (
            <Link
              key={option.nombre}
              href={option.ruta}
            >
              <motion.div
                className="bg-[#1c1c1c] border border-[#eab308] rounded-md py-2 px-4 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)] cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                {option.nombre}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
      
      {/* Pie de página */}
      <motion.footer 
        className="mt-16 text-center text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="mb-1">Consigue tu libertad financiera con sabiduría</p>
        <p>DANTE © {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
} 