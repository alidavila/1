"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaEye, FaImage, FaEllipsisV } from 'react-icons/fa';
import type { ItemInventario } from '../page';

interface TablaInventarioProps {
  items: ItemInventario[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TablaInventario({ items, onEdit, onDelete }: TablaInventarioProps) {
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  // Formatear valor como moneda
  const formatoMoneda = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  // Formatear fecha
  const formatoFecha = (fecha: Date): string => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  };

  // Estilos para los diferentes estados
  const obtenerEstiloEstado = (estado: string) => {
    switch (estado) {
      case 'Nuevo':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Usado':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Deteriorado':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Toggle para expandir/contraer un ítem
  const toggleExpansion = (id: string) => {
    if (itemExpandido === id) {
      setItemExpandido(null);
    } else {
      setItemExpandido(id);
    }
  };

  // Componente de menú desplegable de acciones
  const MenuAcciones = ({ id }: { id: string }) => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
      <div className="relative">
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-1.5 rounded-md bg-[#1a1a1a] hover:bg-[#222] transition text-white/70"
        >
          <FaEllipsisV size={14} />
        </button>

        {menuAbierto && (
          <div 
            className="absolute right-0 mt-1 w-48 bg-[#0d0d0d] border border-white/10 rounded-md shadow-lg z-10"
            onMouseLeave={() => setMenuAbierto(false)}
          >
            <button 
              onClick={() => {
                onEdit(id);
                setMenuAbierto(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-black/50 rounded-t-md"
            >
              <FaEdit size={14} /> Editar
            </button>
            <button 
              onClick={() => toggleExpansion(id)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-black/50"
            >
              <FaEye size={14} /> Ver detalles
            </button>
            <button 
              onClick={() => {
                onDelete(id);
                setMenuAbierto(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-black/50 rounded-b-md"
            >
              <FaTrash size={14} /> Eliminar
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
    >
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                  Valor Unitario
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map((item) => (
                <>
                  <tr 
                    key={item.id} 
                    className="hover:bg-black/30 cursor-pointer transition"
                    onClick={() => toggleExpansion(item.id)}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-black/30 border border-white/10">
                          {item.imagenes && item.imagenes.length > 0 ? (
                            <img 
                              src={item.imagenes[0]} 
                              alt={item.nombre} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaImage className="text-white/30" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.nombre}</div>
                          <div className="text-xs text-white/50 truncate max-w-[200px]">
                            {item.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70">
                      {item.categoria}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70">
                      {item.cantidad}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/70 text-right">
                      {formatoMoneda.format(item.valorUnitario)}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium text-right">
                      {formatoMoneda.format(item.valorTotal)}
                    </td>
                    <td className="px-4 py-3 text-xs text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border ${obtenerEstiloEstado(item.estado)}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                      <MenuAcciones id={item.id} />
                    </td>
                  </tr>
                  {itemExpandido === item.id && (
                    <tr>
                      <td colSpan={7} className="bg-black/20 px-4 py-4">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: 1, 
                            height: 'auto', 
                            transition: { duration: 0.3 } 
                          }}
                          className="text-sm"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-white/60 mb-1">Detalles</h4>
                              <p className="text-white mb-2">{item.descripcion}</p>
                              
                              <h4 className="text-white/60 mb-1">Ubicación</h4>
                              <p className="text-white mb-2">{item.ubicacion}</p>
                              
                              <h4 className="text-white/60 mb-1">Fecha de adquisición</h4>
                              <p className="text-white">{formatoFecha(item.fechaAdquisicion)}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-white/60 mb-1">Etiquetas</h4>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {item.etiquetas.map(etiqueta => (
                                  <span 
                                    key={etiqueta} 
                                    className="px-2 py-1 bg-teal-600/20 text-teal-400 border border-teal-500/30 rounded-md text-xs"
                                  >
                                    {etiqueta}
                                  </span>
                                ))}
                              </div>
                              
                              <h4 className="text-white/60 mb-1 mt-3">Valoración</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-black/30 border border-white/10 rounded-md p-2">
                                  <div className="text-xs text-white/60">Valor unitario</div>
                                  <div className="text-white">{formatoMoneda.format(item.valorUnitario)}</div>
                                </div>
                                <div className="bg-black/30 border border-white/10 rounded-md p-2">
                                  <div className="text-xs text-white/60">Valor total</div>
                                  <div className="text-white">{formatoMoneda.format(item.valorTotal)}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white/60 mb-1">Imágenes</h4>
                              {item.imagenes && item.imagenes.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                  {item.imagenes.map((img, idx) => (
                                    <div 
                                      key={idx}
                                      className="h-20 rounded-md overflow-hidden border border-white/10"
                                    >
                                      <img 
                                        src={img} 
                                        alt={`${item.nombre} - ${idx}`} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-20 flex items-center justify-center bg-black/30 rounded-md border border-white/10">
                                  <span className="text-white/30 text-xs">Sin imágenes</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 gap-2">
                            <button 
                              onClick={() => onEdit(item.id)}
                              className="flex items-center gap-2 bg-teal-600/30 hover:bg-teal-600/50 transition text-teal-300 py-1.5 px-3 rounded-md text-xs"
                            >
                              <FaEdit size={12} /> Editar
                            </button>
                            <button 
                              onClick={() => onDelete(item.id)}
                              className="flex items-center gap-2 bg-red-600/30 hover:bg-red-600/50 transition text-red-300 py-1.5 px-3 rounded-md text-xs"
                            >
                              <FaTrash size={12} /> Eliminar
                            </button>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-white/50">No hay ítems que mostrar</p>
        </div>
      )}
    </motion.div>
  );
} 