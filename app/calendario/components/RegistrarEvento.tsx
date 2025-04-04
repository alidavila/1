'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaTimes, FaMoneyBillWave, FaClock, FaInfoCircle, FaTag } from 'react-icons/fa';

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

interface RegistrarEventoProps {
  eventoEditar: Evento | null;
  onGuardar: (evento: Evento) => void;
  onCancelar: () => void;
  coloresCategorias: Record<string, string>;
}

const RegistrarEvento = ({
  eventoEditar,
  onGuardar,
  onCancelar,
  coloresCategorias,
}: RegistrarEventoProps) => {
  // Estado del formulario
  const [evento, setEvento] = useState<Partial<Evento>>({
    id: '',
    titulo: '',
    monto: 0,
    fecha: new Date(),
    categoria: 'otros',
    descripcion: '',
    completado: false,
    recurrente: false,
    periodicidad: 'mensual',
  });
  
  // Cargar datos si estamos editando
  useEffect(() => {
    if (eventoEditar) {
      setEvento(eventoEditar);
    }
  }, [eventoEditar]);
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEvento({ ...evento, [name]: checked });
    } else if (name === 'monto') {
      setEvento({ ...evento, [name]: parseFloat(value) || 0 });
    } else if (name === 'fecha') {
      setEvento({ ...evento, [name]: new Date(value) });
    } else {
      setEvento({ ...evento, [name]: value });
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Asignar color según categoría
    const color = coloresCategorias[evento.categoria || 'otros'];
    
    // Crear evento completo
    const eventoCompleto: Evento = {
      id: evento.id || Date.now().toString(),
      titulo: evento.titulo || '',
      monto: evento.monto || 0,
      fecha: evento.fecha || new Date(),
      categoria: evento.categoria || 'otros',
      descripcion: evento.descripcion,
      completado: evento.completado || false,
      recurrente: evento.recurrente || false,
      periodicidad: evento.periodicidad as 'semanal' | 'mensual' | 'trimestral' | 'anual',
      recordatorio: evento.recordatorio,
      color,
    };
    
    onGuardar(eventoCompleto);
  };
  
  // Variantes para animación
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancelar}
      >
        <motion.div
          variants={modalVariants}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-gray-800 rounded-xl p-6 w-full max-w-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gold">
              {eventoEditar ? 'Editar Evento' : 'Registrar Nuevo Evento'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
              onClick={onCancelar}
            >
              <FaTimes />
            </motion.button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Título
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="titulo"
                  value={evento.titulo}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none"
                  placeholder="Ej. Pago de Tarjeta"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium flex items-center">
                  <FaMoneyBillWave className="mr-2 text-gold" />
                  Monto
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gold">$</span>
                  <input
                    type="number"
                    name="monto"
                    value={evento.monto}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-gold" />
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={evento.fecha ? new Date(evento.fecha).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-medium flex items-center">
                <FaTag className="mr-2 text-gold" />
                Categoría
              </label>
              <select
                name="categoria"
                value={evento.categoria}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none"
              >
                <option value="tarjetas">Tarjetas de Crédito</option>
                <option value="servicios">Servicios</option>
                <option value="renta">Renta/Hipoteca</option>
                <option value="inversiones">Inversiones</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-medium flex items-center">
                <FaInfoCircle className="mr-2 text-gold" />
                Descripción (opcional)
              </label>
              <textarea
                name="descripcion"
                value={evento.descripcion || ''}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none min-h-[80px]"
                placeholder="Agrega detalles adicionales aquí..."
              ></textarea>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="completado"
                  name="completado"
                  checked={evento.completado}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-gold bg-gray-700 border-gray-600 focus:ring-gold"
                />
                <label htmlFor="completado" className="ml-2 text-gray-300">
                  Ya pagado
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurrente"
                  name="recurrente"
                  checked={evento.recurrente}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-gold bg-gray-700 border-gray-600 focus:ring-gold"
                />
                <label htmlFor="recurrente" className="ml-2 text-gray-300">
                  Es recurrente
                </label>
              </div>
            </div>
            
            {evento.recurrente && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-gray-300 mb-2 font-medium flex items-center">
                  <FaClock className="mr-2 text-gold" />
                  Periodicidad
                </label>
                <select
                  name="periodicidad"
                  value={evento.periodicidad}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold outline-none"
                >
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </motion.div>
            )}
            
            <div className="flex justify-end space-x-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onCancelar}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gold hover:bg-yellow-500 text-gray-900 font-bold rounded-lg"
              >
                {eventoEditar ? 'Actualizar' : 'Guardar'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrarEvento; 