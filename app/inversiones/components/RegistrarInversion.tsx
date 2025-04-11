"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaChartLine, FaArrowUp, FaArrowDown, 
  FaTimes, FaPlus, FaExchangeAlt, FaQuestion, FaLightbulb, FaMinus 
} from 'react-icons/fa';
import { Inversion, TipoActivo } from '@/types';
import { registerInvestment } from '../../../src/lib/n8n-api';

interface RegistrarInversionProps {
  inversion: Inversion | null;
  onSave: (inversion: Inversion) => void;
  onCancel: () => void;
  formatCurrency: (amount: number) => string;
}

export const RegistrarInversion: React.FC<RegistrarInversionProps> = ({
  inversion, onSave, onCancel, formatCurrency
}) => {
  const initialState = useCallback(() => {
    if (inversion) {
      return {
        ...inversion,
        // Asegurarnos de que la fecha esté en formato YYYY-MM-DD para inputs de tipo date
        fechaCompra: inversion.fechaCompra.includes('T') 
          ? inversion.fechaCompra.split('T')[0] 
          : inversion.fechaCompra
      };
    }
    
    return {
      id: "",
      tipo: 'accion' as TipoActivo,
      nombre: "",
      valorCompra: 0,
      fechaCompra: new Date().toISOString().split('T')[0],
      montoInvertido: 0,
      valorActual: 0,
      rentabilidad: 0,
      gananciaOPerdida: 0
    };
  }, [inversion]);
  
  const [formData, setFormData] = useState<Inversion>(initialState());
  const [loading, setLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  useEffect(() => {
    setFormData(initialState());
  }, [initialState]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calcular campos derivados si se cambiaron los valores relevantes
      if (name === 'valorCompra' || name === 'montoInvertido' || name === 'valorActual') {
        const valorCompra = parseFloat(newData.valorCompra as any) || 0;
        const montoInvertido = parseFloat(newData.montoInvertido as any) || 0;
        const valorActual = parseFloat(newData.valorActual as any) || 0;
        
        // Calcular rentabilidad y ganancia/pérdida
        if (montoInvertido > 0) {
          newData.rentabilidad = ((valorActual - montoInvertido) / montoInvertido) * 100;
          newData.gananciaOPerdida = valorActual - montoInvertido;
        }
      }
      
      return newData;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // En una aplicación real, enviaríamos esto a una API
      // Simulamos una demora para la experiencia de usuario
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Registrar la inversión con n8n
      try {
        await registerInvestment(formData);
      } catch (err) {
        console.log('Error al registrar en API, continuando con flujo local:', err);
      }
      
      onSave(formData);
    } catch (error) {
      console.error('Error al guardar inversión:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0a0a0a] border border-[#eab308]/30 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-[#eab308]">
            {inversion ? 'Editar inversión' : 'Registrar nueva inversión'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-white/70 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Tipo de activo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
            >
              <option value="accion">Acción</option>
              <option value="etf">ETF</option>
              <option value="cripto">Criptomoneda</option>
              <option value="fondo">Fondo de inversión</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder={formData.tipo === 'accion' ? 'Ej: AAPL (Apple)' : 'Nombre de la inversión'}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Monto invertido</label>
              <input
                type="number"
                name="montoInvertido"
                value={formData.montoInvertido}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Precio de compra</label>
              <input
                type="number"
                name="valorCompra"
                value={formData.valorCompra}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Fecha de compra</label>
              <input
                type="date"
                name="fechaCompra"
                value={formData.fechaCompra}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Valor actual</label>
              <input
                type="number"
                name="valorActual"
                value={formData.valorActual}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-black/20 border border-white/10 rounded-lg p-3 flex flex-col items-center">
              <span className="text-sm text-white/70 mb-1">Rentabilidad</span>
              <div className={`text-lg font-medium ${formData.rentabilidad >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {formData.rentabilidad.toFixed(2)}%
              </div>
              <div className="flex items-center mt-1">
                {formData.rentabilidad >= 0 ? (
                  <FaArrowUp className="text-[#4ade80] text-xs mr-1" />
                ) : (
                  <FaArrowDown className="text-[#f87171] text-xs mr-1" />
                )}
                <span className="text-xs">desde la compra</span>
              </div>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-3 flex flex-col items-center">
              <span className="text-sm text-white/70 mb-1">Ganancia / Pérdida</span>
              <div className={`text-lg font-medium ${formData.gananciaOPerdida >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {formatCurrency(formData.gananciaOPerdida)}
              </div>
              <div className="flex items-center mt-1">
                {formData.gananciaOPerdida >= 0 ? (
                  <FaPlus className="text-[#4ade80] text-xs mr-1" />
                ) : (
                  <FaMinus className="text-[#f87171] text-xs mr-1" />
                )}
                <span className="text-xs">total</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-[#eab308]/70 hover:text-[#eab308] flex items-center gap-1 text-sm"
            >
              <FaLightbulb className="text-xs" />
              {showTips ? 'Ocultar consejos' : 'Consejos de inversión'}
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="border border-white/10 bg-black/30 px-4 py-2 rounded-lg hover:bg-black/50"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#eab308] text-black px-4 py-2 rounded-lg hover:bg-[#eab308]/90 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-4 h-4"
                    >
                      <FaExchangeAlt />
                    </motion.div>
                    <span>Procesando</span>
                  </>
                ) : (
                  <span>Guardar</span>
                )}
              </button>
            </div>
          </div>
          
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#eab308]/10 border border-[#eab308]/20 rounded-lg p-4 mt-4"
            >
              <h4 className="text-[#eab308] flex items-center mb-2">
                <FaLightbulb className="mr-2" /> Consejos para inversores
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <FaChartLine className="min-w-[16px] mt-1 mr-2 text-[#4ade80]" />
                  <span>Diversifica tu portafolio en diferentes clases de activos para reducir el riesgo.</span>
                </li>
                <li className="flex items-start">
                  <FaQuestion className="min-w-[16px] mt-1 mr-2 text-[#38bdf8]" />
                  <span>Investiga bien antes de invertir y no tomes decisiones basadas en rumores o emociones.</span>
                </li>
                <li className="flex items-start">
                  <FaCoins className="min-w-[16px] mt-1 mr-2 text-[#eab308]" />
                  <span>Establece un plan de inversión a largo plazo y evita cambios frecuentes por movimientos de mercado a corto plazo.</span>
                </li>
              </ul>
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}; 