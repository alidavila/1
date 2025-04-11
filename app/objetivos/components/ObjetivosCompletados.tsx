"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRegCheckCircle, FaSort, FaChevronDown, FaChevronUp, 
  FaDownload, FaTrophy
} from 'react-icons/fa';
import { Objetivo } from '@/types';

interface ObjetivosCompletadosProps {
  objetivos: Objetivo[];
  formatCurrency: (amount: number) => string;
  formatearFecha: (fechaString: string) => string;
}

export const ObjetivosCompletados: React.FC<ObjetivosCompletadosProps> = ({
  objetivos,
  formatCurrency,
  formatearFecha
}) => {
  const [sortBy, setSortBy] = useState('fechaCompletado');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Ordenar objetivos
  const objetivosOrdenados = [...objetivos].sort((a, b) => {
    let valorA = a[sortBy as keyof Objetivo];
    let valorB = b[sortBy as keyof Objetivo];
    
    // Para fechas y strings
    if (typeof valorA === 'string' && typeof valorB === 'string') {
      return sortOrder === 'asc' 
        ? valorA.localeCompare(valorB) 
        : valorB.localeCompare(valorA);
    }
    
    // Para números
    return sortOrder === 'asc' 
      ? Number(valorA) - Number(valorB) 
      : Number(valorB) - Number(valorA);
  });
  
  // Cambiar orden de clasificación
  const cambiarOrden = (columna: string) => {
    if (sortBy === columna) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columna);
      setSortOrder('desc');
    }
  };
  
  // Renderizar ícono de ordenamiento
  const renderSortIcon = (columna: string) => {
    if (sortBy === columna) {
      return sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />;
    }
    return <FaSort className="text-xs text-white/50" />;
  };
  
  // Obtener nombre formateado de la categoría
  const getNombreCategoria = (categoria: string) => {
    switch (categoria) {
      case 'ahorro_emergencia': return 'Ahorro de emergencia';
      case 'comprar_carro': return 'Compra de vehículo';
      case 'comprar_casa': return 'Compra de vivienda';
      case 'viaje': return 'Viaje';
      case 'pagar_deudas': return 'Pago de deudas';
      case 'capital_negocio': return 'Capital para negocio';
      case 'fondo_inversion': return 'Fondo de inversión';
      default: return categoria;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaRegCheckCircle className="text-[#4ade80]" />
          <h3 className="text-lg">Objetivos Alcanzados</h3>
        </div>
        {objetivos.length > 0 && (
          <motion.button
            className="p-2 rounded-lg bg-black/30 text-white/70 hover:text-white"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload />
          </motion.button>
        )}
      </div>
      
      {objetivos.length > 0 ? (
        <div className="bg-black/20 border border-white/10 rounded-lg p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse">
              <thead className="bg-black/30">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button 
                      className="flex items-center gap-1 hover:text-[#eab308]"
                      onClick={() => cambiarOrden('nombre')}
                    >
                      Objetivo {renderSortIcon('nombre')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      className="flex items-center gap-1 hover:text-[#eab308]"
                      onClick={() => cambiarOrden('categoria')}
                    >
                      Categoría {renderSortIcon('categoria')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button 
                      className="flex items-center gap-1 ml-auto hover:text-[#eab308]"
                      onClick={() => cambiarOrden('valorMeta')}
                    >
                      Meta {renderSortIcon('valorMeta')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <button 
                      className="flex items-center gap-1 mx-auto hover:text-[#eab308]"
                      onClick={() => cambiarOrden('fechaCompletado')}
                    >
                      Completado {renderSortIcon('fechaCompletado')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <button 
                      className="flex items-center gap-1 mx-auto hover:text-[#eab308]"
                      onClick={() => cambiarOrden('tiempoCompletado')}
                    >
                      Tiempo {renderSortIcon('tiempoCompletado')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {objetivosOrdenados.map((objetivo) => (
                  <motion.tr 
                    key={objetivo.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{objetivo.nombre}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">{getNombreCategoria(objetivo.categoria)}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-medium">{formatCurrency(objetivo.valorMeta)}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm">
                        {objetivo.fechaCompletado && formatearFecha(objetivo.fechaCompletado)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm">
                        {objetivo.tiempoCompletado ? `${objetivo.tiempoCompletado} días` : '-'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <motion.div 
          className="bg-black/20 border border-white/10 rounded-lg p-8 text-center"
          whileHover={{ borderColor: 'rgba(234, 179, 8, 0.3)' }}
        >
          <FaTrophy className="text-[#eab308] text-4xl mx-auto mb-4 opacity-50" />
          <h4 className="text-lg mb-2">Aún no has completado objetivos</h4>
          <p className="text-white/60">Tus objetivos completados aparecerán aquí para motivarte a seguir</p>
        </motion.div>
      )}
    </div>
  );
}; 