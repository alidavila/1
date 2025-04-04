"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCoins, FaRegCalendarAlt, FaCheck, FaTimes, FaStar,
  FaHome, FaCar, FaPlane, FaCreditCard, FaStore, FaChartLine
} from 'react-icons/fa';
import { Objetivo, ObjetivoCategoria } from '@/types';

interface CrearObjetivoProps {
  objetivo: Objetivo | null;
  onGuardar: (objetivo: Objetivo) => void;
  onCancelar: () => void;
}

export const CrearObjetivo: React.FC<CrearObjetivoProps> = ({
  objetivo,
  onGuardar,
  onCancelar
}) => {
  // Estado inicial del formulario
  const estadoInicial: Objetivo = {
    id: '',
    nombre: '',
    categoria: 'ahorro_emergencia',
    valorMeta: 0,
    valorActual: 0,
    montoSugerido: 0,
    fechaEstimada: '',
    prioridad: 1,
    fechaCreacion: '',
    completado: false
  };
  
  const [formValues, setFormValues] = useState<Objetivo>(estadoInicial);
  const [fechaAutoCalculada, setFechaAutoCalculada] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Cargar datos del objetivo si estamos editando
  useEffect(() => {
    if (objetivo) {
      setFormValues(objetivo);
      setFechaAutoCalculada(false);
    } else {
      setFormValues(estadoInicial);
      
      // Establecer fecha estimada automática (6 meses desde hoy)
      const fechaEstimada = new Date();
      fechaEstimada.setMonth(fechaEstimada.getMonth() + 6);
      
      setFormValues(prev => ({
        ...prev,
        fechaEstimada: fechaEstimada.toISOString().split('T')[0]
      }));
    }
  }, [objetivo]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convertir a número si es un campo numérico
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormValues(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Actualizar fecha estimada automáticamente si cambia el valor meta o el monto sugerido
    if (fechaAutoCalculada && (name === 'valorMeta' || name === 'montoSugerido' || name === 'valorActual')) {
      calcularFechaEstimada();
    }
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Calcular fecha estimada basada en valores actuales
  const calcularFechaEstimada = () => {
    const { valorMeta, valorActual, montoSugerido } = formValues;
    
    if (montoSugerido > 0) {
      const montoRestante = valorMeta - valorActual;
      const mesesEstimados = Math.ceil(montoRestante / montoSugerido);
      
      const fechaEstimada = new Date();
      fechaEstimada.setMonth(fechaEstimada.getMonth() + mesesEstimados);
      
      setFormValues(prev => ({
        ...prev,
        fechaEstimada: fechaEstimada.toISOString().split('T')[0]
      }));
    }
  };
  
  // Validar el formulario
  const validarFormulario = (): boolean => {
    const nuevoErrors: Record<string, string> = {};
    
    if (!formValues.nombre.trim()) {
      nuevoErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (formValues.valorMeta <= 0) {
      nuevoErrors.valorMeta = 'La meta debe ser mayor a cero';
    }
    
    if (formValues.valorActual < 0) {
      nuevoErrors.valorActual = 'El valor actual no puede ser negativo';
    }
    
    if (formValues.valorActual > formValues.valorMeta) {
      nuevoErrors.valorActual = 'El valor actual no puede ser mayor a la meta';
    }
    
    if (formValues.montoSugerido <= 0) {
      nuevoErrors.montoSugerido = 'El monto sugerido debe ser mayor a cero';
    }
    
    if (!formValues.fechaEstimada) {
      nuevoErrors.fechaEstimada = 'La fecha estimada es obligatoria';
    }
    
    setErrors(nuevoErrors);
    return Object.keys(nuevoErrors).length === 0;
  };
  
  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onGuardar(formValues);
    }
  };
  
  // Categorías disponibles
  const categorias: { valor: ObjetivoCategoria, nombre: string, icono: JSX.Element }[] = [
    { valor: 'ahorro_emergencia', nombre: 'Ahorro para emergencia', icono: <FaCoins className="text-[#f59e0b]" /> },
    { valor: 'comprar_carro', nombre: 'Comprar un carro', icono: <FaCar className="text-[#3b82f6]" /> },
    { valor: 'comprar_casa', nombre: 'Comprar una casa', icono: <FaHome className="text-[#4ade80]" /> },
    { valor: 'viaje', nombre: 'Viaje', icono: <FaPlane className="text-[#8b5cf6]" /> },
    { valor: 'pagar_deudas', nombre: 'Pagar deudas', icono: <FaCreditCard className="text-[#ef4444]" /> },
    { valor: 'capital_negocio', nombre: 'Capital para negocio', icono: <FaStore className="text-[#ec4899]" /> },
    { valor: 'fondo_inversion', nombre: 'Fondo para inversión', icono: <FaChartLine className="text-[#14b8a6]" /> }
  ];
  
  // Opciones de prioridad
  const prioridades = [
    { valor: 1, nombre: 'Alta (1)' },
    { valor: 2, nombre: 'Media (2)' }
  ];
  
  // Formatear montos a formato de dinero
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancelar}
    >
      <motion.div
        className="bg-[#0a0a0a] border border-[#eab308]/30 rounded-lg w-full max-w-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl text-[#eab308] font-medium mb-6">
            {objetivo ? 'Editar Objetivo' : 'Crear Nuevo Objetivo'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del objetivo */}
            <div>
              <label htmlFor="nombre" className="block text-sm mb-1">
                Nombre del objetivo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formValues.nombre}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
                placeholder="Ej. Fondo de emergencia"
              />
              {errors.nombre && (
                <p className="text-[#f87171] text-xs mt-1">{errors.nombre}</p>
              )}
            </div>
            
            {/* Categoría */}
            <div>
              <label htmlFor="categoria" className="block text-sm mb-1">
                Categoría
              </label>
              <div className="relative">
                <select
                  id="categoria"
                  name="categoria"
                  value={formValues.categoria}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50 appearance-none"
                >
                  {categorias.map(cat => (
                    <option key={cat.valor} value={cat.valor}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaChevronDown className="text-white/50" />
                </div>
              </div>
            </div>
            
            {/* Valor meta y actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="valorMeta" className="block text-sm mb-1">
                  Valor meta
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                  <input
                    type="number"
                    id="valorMeta"
                    name="valorMeta"
                    value={formValues.valorMeta}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#eab308]/50"
                    placeholder="10000"
                  />
                </div>
                {errors.valorMeta && (
                  <p className="text-[#f87171] text-xs mt-1">{errors.valorMeta}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="valorActual" className="block text-sm mb-1">
                  Valor actual
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                  <input
                    type="number"
                    id="valorActual"
                    name="valorActual"
                    value={formValues.valorActual}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#eab308]/50"
                    placeholder="0"
                  />
                </div>
                {errors.valorActual && (
                  <p className="text-[#f87171] text-xs mt-1">{errors.valorActual}</p>
                )}
              </div>
            </div>
            
            {/* Monto sugerido y fecha estimada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="montoSugerido" className="block text-sm mb-1">
                  Aporte mensual
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                  <input
                    type="number"
                    id="montoSugerido"
                    name="montoSugerido"
                    value={formValues.montoSugerido}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#eab308]/50"
                    placeholder="1000"
                  />
                </div>
                {errors.montoSugerido && (
                  <p className="text-[#f87171] text-xs mt-1">{errors.montoSugerido}</p>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="fechaEstimada" className="block text-sm">
                    Fecha estimada
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id="fechaAutoCalculada"
                      checked={fechaAutoCalculada}
                      onChange={() => setFechaAutoCalculada(!fechaAutoCalculada)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className={`text-xs px-2 py-1 rounded ${
                        fechaAutoCalculada 
                          ? 'bg-[#eab308]/20 text-[#eab308]' 
                          : 'bg-black/20 text-white/60'
                      }`}
                      onClick={() => {
                        setFechaAutoCalculada(!fechaAutoCalculada);
                        if (!fechaAutoCalculada) {
                          calcularFechaEstimada();
                        }
                      }}
                    >
                      Auto
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  id="fechaEstimada"
                  name="fechaEstimada"
                  value={formValues.fechaEstimada}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
                  disabled={fechaAutoCalculada}
                />
                {errors.fechaEstimada && (
                  <p className="text-[#f87171] text-xs mt-1">{errors.fechaEstimada}</p>
                )}
              </div>
            </div>
            
            {/* Prioridad */}
            <div>
              <label htmlFor="prioridad" className="block text-sm mb-1">
                Prioridad
              </label>
              <div className="flex gap-4">
                {prioridades.map(p => (
                  <label 
                    key={p.valor} 
                    className={`flex-1 flex items-center gap-2 p-3 border ${
                      formValues.prioridad === p.valor 
                        ? 'border-[#eab308] bg-[#eab308]/10' 
                        : 'border-white/10 bg-black/30'
                    } rounded-lg cursor-pointer hover:bg-black/40`}
                  >
                    <input
                      type="radio"
                      name="prioridad"
                      value={p.valor}
                      checked={formValues.prioridad === p.valor}
                      onChange={() => setFormValues({...formValues, prioridad: p.valor})}
                      className="hidden"
                    />
                    <FaStar className={formValues.prioridad === p.valor ? 'text-[#eab308]' : 'text-white/50'} />
                    <span>{p.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Resumen calculado */}
            {formValues.valorMeta > 0 && formValues.montoSugerido > 0 && (
              <div className="bg-black/20 border border-white/10 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Resumen estimado</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCoins className="text-white/50" />
                    <div>
                      <div className="text-xs text-white/60">Meta total</div>
                      <div>{formatCurrency(formValues.valorMeta)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegCalendarAlt className="text-white/50" />
                    <div>
                      <div className="text-xs text-white/60">Tiempo estimado</div>
                      <div>
                        {formValues.montoSugerido > 0
                          ? `${Math.ceil((formValues.valorMeta - formValues.valorActual) / formValues.montoSugerido)} meses`
                          : 'Indefinido'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones */}
            <div className="flex justify-end gap-3 pt-2">
              <motion.button
                type="button"
                className="px-4 py-2 bg-black/30 border border-white/10 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancelar}
              >
                <FaTimes />
                <span>Cancelar</span>
              </motion.button>
              
              <motion.button
                type="submit"
                className="px-4 py-2 bg-[#eab308] text-black rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCheck />
                <span>{objetivo ? 'Actualizar' : 'Crear'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}; 