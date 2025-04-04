'use client';

import { motion } from 'framer-motion';
import { FaFilter, FaCreditCard, FaHome, FaWrench, FaChartLine, FaEllipsisH } from 'react-icons/fa';

interface FiltrosCalendarioProps {
  categoriaActual: string;
  onCambiarCategoria: (categoria: string) => void;
}

const FiltrosCalendario = ({
  categoriaActual,
  onCambiarCategoria,
}: FiltrosCalendarioProps) => {
  // Lista de categorías disponibles
  const categorias = [
    { id: 'todos', nombre: 'Todos', icono: <FaFilter />, color: 'bg-gray-600', textColor: 'text-gray-300' },
    { id: 'tarjetas', nombre: 'Tarjetas', icono: <FaCreditCard />, color: 'bg-red-accent/20', textColor: 'text-red-accent' },
    { id: 'renta', nombre: 'Renta', icono: <FaHome />, color: 'bg-purple-accent/20', textColor: 'text-purple-accent' },
    { id: 'servicios', nombre: 'Servicios', icono: <FaWrench />, color: 'bg-blue-accent/20', textColor: 'text-blue-accent' },
    { id: 'inversiones', nombre: 'Inversiones', icono: <FaChartLine />, color: 'bg-green-accent/20', textColor: 'text-green-accent' },
    { id: 'otros', nombre: 'Otros', icono: <FaEllipsisH />, color: 'bg-gold/20', textColor: 'text-gold' },
  ];
  
  return (
    <div className="mt-6 bg-gray-800 rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaFilter className="mr-2 text-gold" /> Filtrar por Categoría
      </h3>
      
      <div className="space-y-2">
        {categorias.map((categoria) => (
          <motion.button
            key={categoria.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onCambiarCategoria(categoria.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              categoriaActual === categoria.id
                ? `${categoria.color} ${categoria.textColor} font-medium border border-${categoria.textColor}`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-3">{categoria.icono}</span>
            {categoria.nombre}
            {categoriaActual === categoria.id && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto bg-gray-900/30 text-xs px-2 py-1 rounded-full"
              >
                Activo
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FiltrosCalendario; 