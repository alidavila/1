'use client';

import { motion } from 'framer-motion';
import { FaChartPie, FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';

interface ResumenMesProps {
  totalProgramado: number;
  totalCompletado: number;
  totalPendiente: number;
  mes: string;
  año: number;
}

const ResumenMes = ({
  totalProgramado,
  totalCompletado,
  totalPendiente,
  mes,
  año,
}: ResumenMesProps) => {
  // Formatear cantidades
  const formatearCantidad = (cantidad: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(cantidad);
  };
  
  // Calcular porcentaje de completado
  const porcentajeCompletado = totalProgramado > 0
    ? Math.round((totalCompletado / totalProgramado) * 100)
    : 0;
  
  // Definir estilos y textos basados en el estado
  let estadoColor = 'text-gold';
  let estadoFondo = 'bg-gold/20';
  let estadoTexto = 'Normal';
  let estadoIcono = null;
  
  if (porcentajeCompletado >= 80) {
    estadoColor = 'text-green-accent';
    estadoFondo = 'bg-green-accent/20';
    estadoTexto = 'Excelente';
    estadoIcono = <FaArrowUp className="mr-1" />;
  } else if (porcentajeCompletado <= 30 && totalProgramado > 0) {
    estadoColor = 'text-red-accent';
    estadoFondo = 'bg-red-accent/20';
    estadoTexto = 'Atención';
    estadoIcono = <FaExclamationTriangle className="mr-1" />;
  } else if (porcentajeCompletado > 30 && porcentajeCompletado < 80) {
    estadoColor = 'text-gold';
    estadoFondo = 'bg-gold/20';
    estadoTexto = 'En progreso';
    estadoIcono = <FaArrowDown className="mr-1" />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-5 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FaChartPie className="mr-2 text-gold" />
          Resumen Financiero
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${estadoFondo} ${estadoColor}`}>
          {estadoIcono}
          {estadoTexto}
        </div>
      </div>
      
      <p className="text-gray-400 mb-4 capitalize">
        {mes} {año}
      </p>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Total Programado</span>
            <span className="font-semibold text-white">{formatearCantidad(totalProgramado)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gray-500 h-2 rounded-full"
            ></motion.div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Completado</span>
            <span className="font-semibold text-green-accent">{formatearCantidad(totalCompletado)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentajeCompletado}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="bg-green-accent h-2 rounded-full"
            ></motion.div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-300">Pendiente</span>
            <span className="font-semibold text-red-accent">{formatearCantidad(totalPendiente)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - porcentajeCompletado}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="bg-red-accent h-2 rounded-full"
            ></motion.div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 rounded-lg bg-gray-700/50 border border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Progreso</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold text-gold">{porcentajeCompletado}%</span>
          </motion.div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${porcentajeCompletado}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
            className={`h-3 rounded-full ${
              porcentajeCompletado >= 80
                ? 'bg-green-accent'
                : porcentajeCompletado <= 30
                  ? 'bg-red-accent'
                  : 'bg-gold'
            }`}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumenMes; 