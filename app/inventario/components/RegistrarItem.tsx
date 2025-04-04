"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCamera, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import type { ItemInventario } from '../page';

interface RegistrarItemProps {
  onClose: () => void;
  onSave: (item: ItemInventario) => void;
  item: ItemInventario | null;
  categorias: string[];
}

export default function RegistrarItem({ onClose, onSave, item, categorias }: RegistrarItemProps) {
  // Valores iniciales para un nuevo ítem
  const itemVacio: ItemInventario = {
    id: '',
    nombre: '',
    categoria: categorias.length > 0 ? categorias[0] : '',
    descripcion: '',
    cantidad: 1,
    valorUnitario: 0,
    valorTotal: 0,
    ubicacion: '',
    fechaAdquisicion: new Date(),
    imagenes: [],
    estado: 'Nuevo',
    etiquetas: []
  };

  // Estado para el formulario
  const [formData, setFormData] = useState<ItemInventario>(item || itemVacio);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);

  // Actualizar el valor total cuando cambie la cantidad o valor unitario
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      valorTotal: prev.cantidad * prev.valorUnitario
    }));
  }, [formData.cantidad, formData.valorUnitario]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormTouched(true);
    
    if (name === 'cantidad' || name === 'valorUnitario') {
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue
      });
    } else if (name === 'fechaAdquisicion') {
      setFormData({
        ...formData,
        [name]: new Date(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Función para agregar una etiqueta
  const agregarEtiqueta = () => {
    if (nuevaEtiqueta.trim() !== '' && !formData.etiquetas.includes(nuevaEtiqueta.trim())) {
      setFormData({
        ...formData,
        etiquetas: [...formData.etiquetas, nuevaEtiqueta.trim()]
      });
      setNuevaEtiqueta('');
    }
  };

  // Función para eliminar una etiqueta
  const eliminarEtiqueta = (etiqueta: string) => {
    setFormData({
      ...formData,
      etiquetas: formData.etiquetas.filter(e => e !== etiqueta)
    });
  };

  // Función para validar el formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.categoria.trim()) {
      nuevosErrores.categoria = 'La categoría es requerida';
    }

    if (formData.cantidad <= 0) {
      nuevosErrores.cantidad = 'La cantidad debe ser mayor a 0';
    }

    if (formData.valorUnitario < 0) {
      nuevosErrores.valorUnitario = 'El valor unitario no puede ser negativo';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-[#0d0d0d] border border-white/10 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-xl text-white">
            {item ? 'Editar Item' : 'Registrar Nuevo Item'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/30 text-white/70 hover:text-white transition"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-white/80 text-sm mb-1" htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errores.nombre ? 'border-red-500' : 'border-white/10'} rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition`}
                  placeholder="Nombre del artículo"
                />
                {errores.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
                )}
              </div>
              
              {/* Categoría */}
              <div>
                <label className="block text-white/80 text-sm mb-1" htmlFor="categoria">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`w-full bg-black/50 border ${errores.categoria ? 'border-red-500' : 'border-white/10'} rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition`}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Nueva Categoría">+ Nueva Categoría</option>
                </select>
                {errores.categoria && (
                  <p className="text-red-500 text-xs mt-1">{errores.categoria}</p>
                )}
              </div>
              
              {/* Descripción */}
              <div>
                <label className="block text-white/80 text-sm mb-1" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="Descripción detallada del artículo"
                />
              </div>
              
              {/* Cantidad y Valor Unitario */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-1" htmlFor="cantidad">
                    Cantidad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    min="1"
                    className={`w-full bg-black/50 border ${errores.cantidad ? 'border-red-500' : 'border-white/10'} rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition`}
                  />
                  {errores.cantidad && (
                    <p className="text-red-500 text-xs mt-1">{errores.cantidad}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1" htmlFor="valorUnitario">
                    Valor Unitario (€)
                  </label>
                  <input
                    type="number"
                    id="valorUnitario"
                    name="valorUnitario"
                    value={formData.valorUnitario}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full bg-black/50 border ${errores.valorUnitario ? 'border-red-500' : 'border-white/10'} rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition`}
                  />
                  {errores.valorUnitario && (
                    <p className="text-red-500 text-xs mt-1">{errores.valorUnitario}</p>
                  )}
                </div>
              </div>
              
              {/* Estado */}
              <div>
                <label className="block text-white/80 text-sm mb-1">Estado</label>
                <div className="flex gap-3">
                  {['Nuevo', 'Usado', 'Deteriorado'].map(estado => (
                    <label key={estado} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="estado"
                        value={estado}
                        checked={formData.estado === estado}
                        onChange={() => setFormData({...formData, estado: estado as 'Nuevo' | 'Usado' | 'Deteriorado'})}
                        className="sr-only"
                      />
                      <span className={`
                        inline-block py-1.5 px-3 rounded-md text-sm transition
                        ${formData.estado === estado 
                          ? estado === 'Nuevo' 
                            ? 'bg-green-500/30 text-green-300 border border-green-500/30' 
                            : estado === 'Usado'
                              ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                              : 'bg-red-500/30 text-red-300 border border-red-500/30'
                          : 'bg-black/30 text-white/70 border border-white/10 hover:border-white/30'
                        }
                      `}>
                        {estado}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-5">
              {/* Ubicación */}
              <div>
                <label className="block text-white/80 text-sm mb-1" htmlFor="ubicacion">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="Oficina, Almacén, Casa..."
                />
              </div>
              
              {/* Fecha de adquisición */}
              <div>
                <label className="block text-white/80 text-sm mb-1" htmlFor="fechaAdquisicion">
                  Fecha de adquisición
                </label>
                <input
                  type="date"
                  id="fechaAdquisicion"
                  name="fechaAdquisicion"
                  value={formData.fechaAdquisicion.toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition"
                />
              </div>
              
              {/* Etiquetas */}
              <div>
                <label className="block text-white/80 text-sm mb-1">
                  Etiquetas
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={nuevaEtiqueta}
                    onChange={(e) => setNuevaEtiqueta(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        agregarEtiqueta();
                      }
                    }}
                    className="flex-1 bg-black/50 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:border-teal-500 transition"
                    placeholder="Agregar etiqueta..."
                  />
                  <button
                    type="button"
                    onClick={agregarEtiqueta}
                    className="bg-teal-600/50 hover:bg-teal-600/80 transition text-white py-2 px-3 rounded-md text-sm"
                  >
                    Agregar
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.etiquetas.map(etiqueta => (
                    <span
                      key={etiqueta}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-teal-600/20 text-teal-300 border border-teal-600/30 rounded-md text-xs"
                    >
                      {etiqueta}
                      <button
                        type="button"
                        onClick={() => eliminarEtiqueta(etiqueta)}
                        className="ml-1 hover:text-white"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Imágenes */}
              <div>
                <label className="block text-white/80 text-sm mb-1">
                  Imágenes
                </label>
                <div className="border border-dashed border-white/20 rounded-md p-4 text-center">
                  <FaCamera className="mx-auto text-white/30 text-3xl mb-2" />
                  <p className="text-white/50 text-sm mb-2">
                    Arrastra imágenes o haz clic para seleccionar
                  </p>
                  <button
                    type="button"
                    className="bg-[#1a1a1a] hover:bg-[#222] transition text-white py-1.5 px-4 rounded-md text-sm"
                  >
                    Seleccionar archivos
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Valor Total (calculado automáticamente) */}
          <div className="mt-6 p-4 bg-black/30 border border-white/10 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Valor Total:</span>
              <span className="text-xl font-semibold text-teal-400">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2
                }).format(formData.valorTotal)}
              </span>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-[#1a1a1a] hover:bg-[#222] transition text-white rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 py-2 px-4 bg-teal-600 hover:bg-teal-500 transition text-white rounded-md"
            >
              <FaSave /> {item ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 