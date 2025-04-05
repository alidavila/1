"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPencilAlt, FaTrashAlt, FaSort, FaChevronUp, 
  FaChevronDown, FaArrowUp, FaArrowDown, FaBitcoin, 
  FaChartLine, FaBuilding, FaGlobe
} from 'react-icons/fa';
import { Inversion } from '../../../types';

interface ListaInversionesProps {
  inversiones: Inversion[];
  formatCurrency: (amount: number) => string;
  formatPercent: (value: number) => string;
  formatDate: (dateString: string) => string;
  onEdit: (inversion: Inversion) => void;
  onDelete: (id: string) => void;
}

export const ListaInversiones: React.FC<ListaInversionesProps> = ({
  inversiones,
  formatCurrency,
  formatPercent,
  formatDate,
  onEdit,
  onDelete
}) => {
  const [sortBy, setSortBy] = useState<keyof Inversion>('fechaCompra');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Ordenar inversiones
  const inversionesOrdenadas = [...inversiones].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Para números
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    return 0;
  });
  
  // Manejar cambio de ordenación
  const handleSort = (column: keyof Inversion) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Renderizar ícono de ordenación
  const renderSortIcon = (column: keyof Inversion) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />;
    }
    return <FaSort className="text-xs text-white/50" />;
  };
  
  // Obtener ícono según el tipo de activo
  const getActivoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cripto':
        return <FaBitcoin className="text-[#f59e0b]" />;
      case 'accion':
        return <FaBuilding className="text-[#3b82f6]" />;
      case 'etf':
        return <FaGlobe className="text-[#8b5cf6]" />;
      case 'fondo':
        return <FaChartLine className="text-[#14b8a6]" />;
      default:
        return <FaChartLine className="text-[#4ade80]" />;
    }
  };
  
  // Obtener nombre formateado del tipo de activo
  const getTipoNombre = (tipo: string) => {
    switch (tipo) {
      case 'cripto': return 'Criptomoneda';
      case 'accion': return 'Acción';
      case 'etf': return 'ETF';
      case 'fondo': return 'Fondo de Inversión';
      default: return tipo;
    }
  };
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className="bg-black/30">
            <tr>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-[#4ade80]"
                  onClick={() => handleSort('nombre')}
                >
                  Activo {renderSortIcon('nombre')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-[#4ade80]"
                  onClick={() => handleSort('tipo')}
                >
                  Tipo {renderSortIcon('tipo')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover:text-[#4ade80]"
                  onClick={() => handleSort('montoInvertido')}
                >
                  Inversión {renderSortIcon('montoInvertido')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover:text-[#4ade80]"
                  onClick={() => handleSort('valorActual')}
                >
                  Valor Actual {renderSortIcon('valorActual')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover:text-[#4ade80]"
                  onClick={() => handleSort('rentabilidad')}
                >
                  Rendimiento {renderSortIcon('rentabilidad')}
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button 
                  className="flex items-center gap-1 mx-auto hover:text-[#4ade80]"
                  onClick={() => handleSort('fechaCompra')}
                >
                  Compra {renderSortIcon('fechaCompra')}
                </button>
              </th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inversionesOrdenadas.map((inversion) => (
              <motion.tr 
                key={inversion.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-black/30">
                      {getActivoIcon(inversion.tipo)}
                    </div>
                    <div className="font-medium">{inversion.nombre}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">{getTipoNombre(inversion.tipo)}</div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="font-medium">{formatCurrency(inversion.montoInvertido)}</div>
                  <div className="text-xs text-white/60">
                    {inversion.tipo === 'cripto' 
                      ? `Precio: ${formatCurrency(inversion.valorCompra)}` 
                      : ''
                    }
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="font-medium">
                    {inversion.tipo === 'cripto' 
                      ? formatCurrency(inversion.valorActual * (inversion.montoInvertido / inversion.valorCompra))
                      : formatCurrency(inversion.montoInvertido * (1 + inversion.rentabilidad / 100))
                    }
                  </div>
                  <div className="text-xs text-white/60">
                    {inversion.tipo === 'cripto' 
                      ? `Actual: ${formatCurrency(inversion.valorActual)}` 
                      : ''
                    }
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className={`flex items-center justify-end gap-1 font-medium ${
                    inversion.rentabilidad >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'
                  }`}>
                    {inversion.rentabilidad >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                    <span>{formatPercent(inversion.rentabilidad)}</span>
                  </div>
                  <div className="text-xs text-white/60">
                    {formatCurrency(inversion.gananciaOPerdida)}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="text-sm">{formatDate(inversion.fechaCompra)}</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <motion.button
                      className="p-2 rounded-full bg-black/30 text-white/70 hover:text-white"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(inversion)}
                    >
                      <FaPencilAlt className="text-sm" />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full bg-black/30 text-white/70 hover:text-[#f87171]"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(248, 113, 113, 0.1)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(inversion.id)}
                    >
                      <FaTrashAlt className="text-sm" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 