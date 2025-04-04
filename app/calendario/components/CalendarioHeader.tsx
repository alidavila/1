'use client';

import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface CalendarioHeaderProps {
  fecha: Date;
  vista: 'mes' | 'semana';
  onCambiarVista: (vista: 'mes' | 'semana') => void;
  onCambiarMes: (direccion: 'anterior' | 'siguiente') => void;
}

const CalendarioHeader = ({
  fecha,
  vista,
  onCambiarVista,
  onCambiarMes,
}: CalendarioHeaderProps) => {
  // Formatear la fecha actual
  const mesActual = fecha.toLocaleString('es', { month: 'long' });
  const anioActual = fecha.getFullYear();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 rounded-lg p-4">
      <div className="flex items-center mb-4 sm:mb-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-700 text-gold mr-4"
          onClick={() => onCambiarMes('anterior')}
          aria-label="Mes anterior"
        >
          <FaChevronLeft />
        </motion.button>
        
        <h2 className="text-xl font-bold capitalize">
          {mesActual} <span className="text-gold">{anioActual}</span>
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-700 text-gold ml-4"
          onClick={() => onCambiarMes('siguiente')}
          aria-label="Mes siguiente"
        >
          <FaChevronRight />
        </motion.button>
      </div>
      
      <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
        <button
          className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
            vista === 'semana'
              ? 'bg-gold text-gray-900 font-medium'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => onCambiarVista('semana')}
        >
          <FaCalendarAlt className="mr-2" />
          Semana
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center ${
            vista === 'mes'
              ? 'bg-gold text-gray-900 font-medium'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => onCambiarVista('mes')}
        >
          <FaCalendarAlt className="mr-2" />
          Mes
        </button>
      </div>
    </div>
  );
};

export default CalendarioHeader; 