"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCoins, FaChartLine, FaCalendarAlt, FaDollarSign, 
  FaTimes, FaSave, FaBitcoin, FaBuilding, FaGlobe, FaInfoCircle, 
  FaChevronDown
} from 'react-icons/fa';
import { Inversion, TipoActivo } from '../../../types';

interface RegistrarInversionProps {
  inversion: Inversion | null;
  onSave: (inversion: Inversion) => void;
  onCancel: () => void;
  formatCurrency: (amount: number) => string;
}

export const RegistrarInversion: React.FC<RegistrarInversionProps> = ({
  inversion,
  onSave,
  onCancel,
  formatCurrency
}) => {
  // Estado inicial para nuevas inversiones
  const initialState: Inversion = {
    id: '',
    tipo: 'etf',
    nombre: '',
    valorCompra: 0,
    fechaCompra: new Date().toISOString().split('T')[0],
    montoInvertido: 0,
    valorActual: 0,
    rentabilidad: 0,
    gananciaOPerdida: 0
  };
  
  const [formData, setFormData] = useState<Inversion>(initialState);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [showTips, setShowTips] = useState(false);
  
  // Cargar datos de la inversión si estamos editando
  useEffect(() => {
    if (inversion) {
      setFormData({
        ...inversion,
        // Asegurarnos de que la fecha esté en formato YYYY-MM-DD para inputs de tipo date
        fechaCompra: inversion.fechaCompra.includes('T') 
          ? inversion.fechaCompra.split('T')[0] 
          : inversion.fechaCompra
      });
    } else {
      setFormData(initialState);
    }
  }, [inversion]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convertir a número si es un campo numérico
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Si cambia el tipo, ajustar algunos valores específicos
    if (name === 'tipo' && value === 'cripto') {
      setShowTips(true);
    } else if (name === 'tipo') {
      setShowTips(false);
    }
    
    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Calcular rentabilidad y ganancia cuando cambian valorCompra, valorActual o montoInvertido
  useEffect(() => {
    if (formData.valorCompra > 0 && formData.valorActual > 0 && formData.montoInvertido > 0) {
      // Para criptomonedas, calcular según la cantidad de tokens
      if (formData.tipo === 'cripto') {
        const cantidadTokens = formData.montoInvertido / formData.valorCompra;
        const valorActualTotal = cantidadTokens * formData.valorActual;
        const gananciaOPerdida = valorActualTotal - formData.montoInvertido;
        const rentabilidad = (gananciaOPerdida / formData.montoInvertido) * 100;
        
        setFormData(prev => ({
          ...prev,
          rentabilidad,
          gananciaOPerdida
        }));
      } else {
        // Para otros activos, usar la proporción de valorActual/valorCompra
        const proporcion = formData.valorActual / formData.valorCompra;
        const rentabilidad = ((proporcion - 1) * 100);
        const gananciaOPerdida = formData.montoInvertido * (proporcion - 1);
        
        setFormData(prev => ({
          ...prev,
          rentabilidad,
          gananciaOPerdida
        }));
      }
    }
  }, [formData.valorCompra, formData.valorActual, formData.montoInvertido, formData.tipo]);
  
  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }
    
    if (formData.valorCompra <= 0) {
      nuevosErrores.valorCompra = 'El valor de compra debe ser mayor a cero';
    }
    
    if (formData.valorActual <= 0) {
      nuevosErrores.valorActual = 'El valor actual debe ser mayor a cero';
    }
    
    if (formData.montoInvertido <= 0) {
      nuevosErrores.montoInvertido = 'El monto invertido debe ser mayor a cero';
    }
    
    if (!formData.fechaCompra) {
      nuevosErrores.fechaCompra = 'La fecha de compra es obligatoria';
    } else {
      const fechaCompra = new Date(formData.fechaCompra);
      const hoy = new Date();
      if (fechaCompra > hoy) {
        nuevosErrores.fechaCompra = 'La fecha de compra no puede ser futura';
      }
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSave(formData);
    }
  };
  
  // Obtener ícono según el tipo de activo
  const getTipoIcon = (tipo: TipoActivo) => {
    switch (tipo) {
      case 'cripto': return <FaBitcoin className="text-[#f59e0b]" />;
      case 'accion': return <FaBuilding className="text-[#3b82f6]" />;
      case 'etf': return <FaGlobe className="text-[#8b5cf6]" />;
      case 'fondo': return <FaChartLine className="text-[#14b8a6]" />;
      default: return <FaCoins className="text-[#4ade80]" />;
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-[#0a0a0a] border border-[#4ade80]/30 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-[#4ade80] font-medium">
              {inversion ? 'Editar Inversión' : 'Registrar Nueva Inversión'}
            </h2>
            <motion.button
              className="p-2 rounded-full bg-black/30 text-white/70 hover:text-white"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
            >
              <FaTimes />
            </motion.button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de activo */}
            <div>
              <label htmlFor="tipo" className="flex items-center text-sm mb-2">
                <FaCoins className="text-[#4ade80] mr-2" />
                Tipo de activo
              </label>
              <div className="relative">
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-[#4ade80]/50 appearance-none"
                >
                  <option value="cripto">Criptomoneda</option>
                  <option value="accion">Acción individual</option>
                  <option value="etf">ETF</option>
                  <option value="fondo">Fondo de inversión</option>
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {getTipoIcon(formData.tipo as TipoActivo)}
                </div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaChevronDown className="text-white/50 text-xs" />
                </div>
              </div>
            </div>
            
            {/* Nombre del activo */}
            <div>
              <label htmlFor="nombre" className="block text-sm mb-2">
                Nombre del activo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4ade80]/50"
                placeholder={formData.tipo === 'cripto' ? 'Ej. Bitcoin (BTC)' : 'Ej. Apple Inc. (AAPL)'}
              />
              {errores.nombre && (
                <p className="text-[#f87171] text-xs mt-1">{errores.nombre}</p>
              )}
            </div>
            
            {/* Monto invertido */}
            <div>
              <label htmlFor="montoInvertido" className="block text-sm mb-2">
                Monto invertido
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                <input
                  type="number"
                  id="montoInvertido"
                  name="montoInvertido"
                  value={formData.montoInvertido}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#4ade80]/50"
                  placeholder="5000"
                />
              </div>
              {errores.montoInvertido && (
                <p className="text-[#f87171] text-xs mt-1">{errores.montoInvertido}</p>
              )}
            </div>
            
            {/* Valor de compra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="valorCompra" className="block text-sm mb-2">
                  {formData.tipo === 'cripto' ? 'Precio de compra por unidad' : 'Valor al momento de compra'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                  <input
                    type="number"
                    id="valorCompra"
                    name="valorCompra"
                    value={formData.valorCompra}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#4ade80]/50"
                    placeholder={formData.tipo === 'cripto' ? '40000' : '100'}
                  />
                </div>
                {errores.valorCompra && (
                  <p className="text-[#f87171] text-xs mt-1">{errores.valorCompra}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="valorActual" className="block text-sm mb-2">
                  {formData.tipo === 'cripto' ? 'Precio actual por unidad' : 'Valor actual'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                  <input
                    type="number"
                    id="valorActual"
                    name="valorActual"
                    value={formData.valorActual}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#4ade80]/50"
                    placeholder={formData.tipo === 'cripto' ? '45000' : '120'}
                  />
                </div>
                {errores.valorActual && (
                  <p className="text-[#f87171] text-xs mt-1">{errores.valorActual}</p>
                )}
              </div>
            </div>
            
            {/* Fecha de compra */}
            <div>
              <label htmlFor="fechaCompra" className="block text-sm mb-2">
                Fecha de compra
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  id="fechaCompra"
                  name="fechaCompra"
                  value={formData.fechaCompra}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-[#4ade80]/50"
                />
              </div>
              {errores.fechaCompra && (
                <p className="text-[#f87171] text-xs mt-1">{errores.fechaCompra}</p>
              )}
            </div>
            
            {/* Consejos para criptomonedas */}
            {showTips && (
              <motion.div
                className="bg-[#0f172a] border border-[#f59e0b]/20 rounded-lg p-4 my-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-white/80">
                    <p className="font-medium text-[#f59e0b] mb-1">Consejo para criptomonedas</p>
                    <p>Para criptomonedas, ingresa el precio por unidad tanto en el momento de compra como el actual. La rentabilidad se calculará basada en la cantidad de tokens adquiridos.</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Rentabilidad calculada */}
            {formData.valorCompra > 0 && formData.valorActual > 0 && formData.montoInvertido > 0 && (
              <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Rendimiento calculado</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Rentabilidad</div>
                    <div className={`text-lg font-medium ${
                      formData.rentabilidad >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'
                    }`}>
                      {formData.rentabilidad >= 0 ? '+' : ''}{formData.rentabilidad.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Ganancia/Pérdida</div>
                    <div className={`text-lg font-medium ${
                      formData.gananciaOPerdida >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'
                    }`}>
                      {formData.gananciaOPerdida >= 0 ? '+' : ''}{formatCurrency(formData.gananciaOPerdida)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-2">
              <motion.button
                type="button"
                className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
              >
                <FaTimes />
                <span>Cancelar</span>
              </motion.button>
              
              <motion.button
                type="submit"
                className="px-4 py-2 bg-[#4ade80] text-black rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSave />
                <span>{inversion ? 'Actualizar' : 'Guardar'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}; 