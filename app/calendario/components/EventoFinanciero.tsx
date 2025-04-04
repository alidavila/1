'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaEdit, FaTrash, FaClock, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

interface Evento {
  id: string;
  titulo: string;
  monto: number;
  fecha: Date;
  categoria: string;
  descripcion?: string;
  completado: boolean;
  recurrente: boolean;
  periodicidad?: 'semanal' | 'mensual' | 'trimestral' | 'anual';
  recordatorio?: Date;
  color?: string;
}

interface EventoFinancieroProps {
  evento: Evento;
  onMarcarCompletado: (id: string) => void;
  onEditar: (evento: Evento) => void;
  onEliminar: (id: string) => void;
}

const EventoFinanciero = ({
  evento,
  onMarcarCompletado,
  onEditar,
  onEliminar,
}: EventoFinancieroProps) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Formatear fecha
  const fechaFormateada = new Date(evento.fecha).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
  });
  
  // Formatear cantidad
  const montoFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(evento.monto);
  
  // Determinar el color del borde basado en la categoría o usar un valor por defecto
  const colorBorde = evento.color || 'border-gold';
  
  // Calcular días restantes
  const hoy = new Date();
  const fechaEvento = new Date(evento.fecha);
  const diferenciaTiempo = fechaEvento.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
  
  // Determinar estado visual
  let estadoVisual = '';
  let textoEstado = '';
  
  if (evento.completado) {
    estadoVisual = 'bg-green-accent/20 border-green-accent';
    textoEstado = 'Completado';
  } else if (diasRestantes < 0) {
    estadoVisual = 'bg-red-accent/20 border-red-accent';
    textoEstado = 'Vencido';
  } else if (diasRestantes <= 3) {
    estadoVisual = 'bg-gold/20 border-gold';
    textoEstado = 'Próximo';
  } else {
    estadoVisual = 'bg-gray-700/50 border-gray-600';
    textoEstado = 'Pendiente';
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`border-l-4 ${colorBorde} rounded-lg ${estadoVisual} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300`}
    >
      <div className="p-4 cursor-pointer" onClick={() => setMostrarDetalles(!mostrarDetalles)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-start space-x-3 mb-2 sm:mb-0">
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{evento.titulo}</span>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <FaCalendarAlt className="mr-1" />
                <span>{fechaFormateada}</span>
                {evento.recurrente && (
                  <span className="ml-2 bg-blue-accent/30 text-blue-accent px-2 py-0.5 rounded-full text-xs">
                    {evento.periodicidad}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="font-bold text-xl text-gold">{montoFormateado}</span>
            <span className={`text-sm mt-1 px-2 py-0.5 rounded-full ${
              evento.completado 
                ? 'bg-green-accent/30 text-green-accent' 
                : diasRestantes < 0 
                  ? 'bg-red-accent/30 text-red-accent' 
                  : diasRestantes <= 3 
                    ? 'bg-gold/30 text-gold' 
                    : 'bg-gray-700 text-gray-400'
            }`}>
              {textoEstado}
            </span>
          </div>
        </div>
        
        {mostrarDetalles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            {evento.descripcion && (
              <div className="mb-3 text-gray-300 flex items-start">
                <FaInfoCircle className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                <p>{evento.descripcion}</p>
              </div>
            )}
            
            <div className="flex items-center mb-3">
              <FaMoneyBillWave className="mr-2 text-gray-400" />
              <span className="text-gray-300">Monto: <span className="text-gold font-semibold">{montoFormateado}</span></span>
            </div>
            
            {diasRestantes > 0 && !evento.completado && (
              <div className="flex items-center mb-3">
                <FaClock className="mr-2 text-gray-400" />
                <span className="text-gray-300">
                  {diasRestantes === 1 ? 'Mañana' : `${diasRestantes} días restantes`}
                </span>
              </div>
            )}
            
            <div className="flex space-x-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  evento.completado
                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    : 'bg-green-accent/20 text-green-accent hover:bg-green-accent/30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarcarCompletado(evento.id);
                }}
              >
                <FaCheck className="mr-2" />
                {evento.completado ? 'Desmarcar' : 'Completado'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-2 rounded-lg bg-blue-accent/20 text-blue-accent hover:bg-blue-accent/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditar(evento);
                }}
              >
                <FaEdit className="mr-2" />
                Editar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-2 rounded-lg bg-red-accent/20 text-red-accent hover:bg-red-accent/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onEliminar(evento.id);
                }}
              >
                <FaTrash className="mr-2" />
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EventoFinanciero; 