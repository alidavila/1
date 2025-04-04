"use client";

import { motion } from 'framer-motion';
import { FaBoxOpen, FaTag, FaWarehouse, FaChartLine } from 'react-icons/fa';

interface ResumenInventarioProps {
  totalItems: number;
  valorTotal: number;
  categorias: string[];
}

export default function ResumenInventario({ totalItems, valorTotal, categorias }: ResumenInventarioProps) {
  // Excluir la categoría "Todos" para el conteo
  const numCategorias = categorias.filter(cat => cat !== 'Todos').length;
  
  // Formatear valor como moneda
  const formatoMoneda = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  // Array de tarjetas de resumen
  const tarjetasResumen = [
    {
      titulo: 'Total de Items',
      valor: totalItems,
      icono: <FaBoxOpen size={24} />,
      color: 'from-teal-500/20 to-teal-600/20',
      textColor: 'text-teal-400',
      bordeColor: 'border-teal-500/30'
    },
    {
      titulo: 'Valor Total',
      valor: formatoMoneda.format(valorTotal),
      icono: <FaChartLine size={24} />,
      color: 'from-emerald-500/20 to-emerald-600/20',
      textColor: 'text-emerald-400',
      bordeColor: 'border-emerald-500/30'
    },
    {
      titulo: 'Categorías',
      valor: numCategorias,
      icono: <FaTag size={24} />,
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-400',
      bordeColor: 'border-blue-500/30'
    },
    {
      titulo: 'Valor Promedio',
      valor: totalItems > 0 ? formatoMoneda.format(valorTotal / totalItems) : formatoMoneda.format(0),
      icono: <FaWarehouse size={24} />,
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-400',
      bordeColor: 'border-purple-500/30'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {tarjetasResumen.map((tarjeta, index) => (
        <motion.div
          key={tarjeta.titulo}
          className={`bg-gradient-to-br ${tarjeta.color} border ${tarjeta.bordeColor} rounded-lg p-4 flex items-center justify-between`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              delay: 0.05 * index,
              duration: 0.5
            }
          }}
        >
          <div>
            <h3 className="text-sm text-white/60 mb-1">{tarjeta.titulo}</h3>
            <p className={`text-xl font-semibold ${tarjeta.textColor}`}>
              {tarjeta.valor}
            </p>
          </div>
          <div className={`p-3 rounded-lg bg-black/30 ${tarjeta.textColor}`}>
            {tarjeta.icono}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 