"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';

interface FiltrosInventarioProps {
  categorias: string[];
  categoriaActiva: string;
  setCategoriaActiva: (categoria: string) => void;
}

export default function FiltrosInventario({ 
  categorias, 
  categoriaActiva, 
  setCategoriaActiva 
}: FiltrosInventarioProps) {
  
  return (
    <motion.div 
      className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1, 
        height: 'auto',
        transition: { duration: 0.3 }
      }}
    >
      <div className="mb-4">
        <h3 className="text-white/80 text-sm mb-2 flex items-center gap-2">
          <FaTag size={14} /> Categorías
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {categorias.map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`
                py-1.5 px-3 rounded-md text-xs transition
                ${categoriaActiva === categoria 
                  ? 'bg-teal-600/50 text-teal-300 border border-teal-500/30' 
                  : 'bg-black/50 text-white/70 border border-white/10 hover:border-white/20'}
              `}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h3 className="text-white/80 text-sm mb-2">Estado</h3>
          <div className="flex flex-wrap gap-2">
            {['Todos', 'Nuevo', 'Usado', 'Deteriorado'].map(estado => (
              <button
                key={estado}
                className="py-1.5 px-3 rounded-md text-xs bg-black/50 text-white/70 border border-white/10 hover:border-white/20 transition"
              >
                {estado}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white/80 text-sm mb-2">Valor</h3>
          <div className="flex flex-wrap gap-2">
            {['Todos', '< 100€', '100€ - 500€', '> 500€'].map(valor => (
              <button
                key={valor}
                className="py-1.5 px-3 rounded-md text-xs bg-black/50 text-white/70 border border-white/10 hover:border-white/20 transition"
              >
                {valor}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white/80 text-sm mb-2">Ubicación</h3>
          <div className="flex flex-wrap gap-2">
            {['Todas', 'Oficina Principal', 'Almacén', 'Casa'].map(ubicacion => (
              <button
                key={ubicacion}
                className="py-1.5 px-3 rounded-md text-xs bg-black/50 text-white/70 border border-white/10 hover:border-white/20 transition"
              >
                {ubicacion}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-white/80 text-sm mb-2">Fecha de adquisición</h3>
          <div className="flex flex-wrap gap-2">
            {['Todas', 'Este año', 'Último año', '> 2 años'].map(fecha => (
              <button
                key={fecha}
                className="py-1.5 px-3 rounded-md text-xs bg-black/50 text-white/70 border border-white/10 hover:border-white/20 transition"
              >
                {fecha}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 