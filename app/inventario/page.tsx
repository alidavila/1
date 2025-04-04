"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import RegistrarItem from './components/RegistrarItem';
import ResumenInventario from './components/ResumenInventario';
import TablaInventario from './components/TablaInventario';
import FiltrosInventario from './components/FiltrosInventario';

// Tipo para los ítems del inventario
export type ItemInventario = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
  ubicacion: string;
  fechaAdquisicion: Date;
  imagenes: string[];
  estado: 'Nuevo' | 'Usado' | 'Deteriorado';
  etiquetas: string[];
};

// Datos de ejemplo
const ejemploItems: ItemInventario[] = [
  {
    id: '1',
    nombre: 'MacBook Pro 16"',
    categoria: 'Electrónicos',
    descripcion: 'Laptop Apple M1 Pro, 16GB RAM, 512GB SSD',
    cantidad: 1,
    valorUnitario: 2500,
    valorTotal: 2500,
    ubicacion: 'Oficina Principal',
    fechaAdquisicion: new Date(2022, 5, 10),
    imagenes: ['/images/placeholder.jpg'],
    estado: 'Nuevo',
    etiquetas: ['Trabajo', 'Apple', 'Ordenador']
  },
  {
    id: '2',
    nombre: 'Monitor LG 27"',
    categoria: 'Electrónicos',
    descripcion: 'Monitor 4K UHD HDR',
    cantidad: 2,
    valorUnitario: 350,
    valorTotal: 700,
    ubicacion: 'Oficina Principal',
    fechaAdquisicion: new Date(2022, 3, 15),
    imagenes: ['/images/placeholder.jpg'],
    estado: 'Usado',
    etiquetas: ['Trabajo', 'LG', 'Periférico']
  },
  {
    id: '3',
    nombre: 'Escritorio Ajustable',
    categoria: 'Mobiliario',
    descripcion: 'Escritorio de altura regulable eléctrico',
    cantidad: 1,
    valorUnitario: 600,
    valorTotal: 600,
    ubicacion: 'Oficina Principal',
    fechaAdquisicion: new Date(2021, 11, 5),
    imagenes: ['/images/placeholder.jpg'],
    estado: 'Usado',
    etiquetas: ['Mueble', 'Ergonomía', 'Trabajo']
  }
];

export default function Inventario() {
  const [items, setItems] = useState<ItemInventario[]>(ejemploItems);
  const [filteredItems, setFilteredItems] = useState<ItemInventario[]>(ejemploItems);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemInventario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos');
  
  // Manejar la búsqueda y filtrado
  useEffect(() => {
    let resultado = items;
    
    // Filtrar por búsqueda
    if (busqueda.trim() !== "") {
      resultado = resultado.filter(item => 
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.etiquetas.some(tag => tag.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }
    
    // Filtrar por categoría
    if (categoriaActiva !== 'Todos') {
      resultado = resultado.filter(item => item.categoria === categoriaActiva);
    }
    
    setFilteredItems(resultado);
  }, [busqueda, categoriaActiva, items]);

  // Calcular estadísticas
  const totalItems = filteredItems.reduce((sum, item) => sum + item.cantidad, 0);
  const valorTotal = filteredItems.reduce((sum, item) => sum + item.valorTotal, 0);
  
  // Obtener categorías únicas
  const categorias = ['Todos', ...new Set(items.map(item => item.categoria))];
  
  // Función para guardar un nuevo ítem
  const guardarItem = (item: ItemInventario) => {
    if (currentItem) {
      // Actualizar ítem existente
      setItems(items.map(i => i.id === item.id ? item : i));
    } else {
      // Crear nuevo ítem
      setItems([...items, { ...item, id: Date.now().toString() }]);
    }
    setModalAbierto(false);
    setCurrentItem(null);
  };
  
  // Función para editar un ítem
  const editarItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setCurrentItem(item);
      setModalAbierto(true);
    }
  };
  
  // Función para eliminar un ítem
  const eliminarItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition">
                <FaArrowLeft /> Volver
              </span>
            </Link>
            <h1 className="text-2xl md:text-3xl text-[#20b2aa] font-light tracking-wider">
              Inventario
            </h1>
          </div>
          
          <button 
            onClick={() => { setModalAbierto(true); setCurrentItem(null); }}
            className="bg-teal-600 hover:bg-teal-500 transition text-white py-2 px-4 rounded-md flex items-center gap-2 text-sm"
          >
            <FaPlus /> Nuevo Item
          </button>
        </motion.div>
        
        {/* Resumen */}
        <ResumenInventario 
          totalItems={totalItems}
          valorTotal={valorTotal}
          categorias={categorias}
        />
        
        {/* Filtros y búsqueda */}
        <motion.div 
          className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Buscar en inventario..."
              className="w-full bg-black/50 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-teal-500 transition"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
              className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] transition py-2 px-4 rounded-md text-sm"
            >
              <FaFilter /> Filtros
            </button>
            
            <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] transition py-2 px-4 rounded-md text-sm">
              <FaSortAmountDown /> Ordenar
            </button>
          </div>
        </motion.div>
        
        {/* Panel de filtros condicional */}
        {filtrosAbiertos && (
          <FiltrosInventario 
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
          />
        )}
        
        {/* Tabla de Inventario */}
        <TablaInventario 
          items={filteredItems}
          onEdit={editarItem}
          onDelete={eliminarItem}
        />
        
        {/* Modal para registrar/editar ítem */}
        {modalAbierto && (
          <RegistrarItem 
            onClose={() => {
              setModalAbierto(false);
              setCurrentItem(null);
            }}
            onSave={guardarItem}
            item={currentItem}
            categorias={categorias.filter(cat => cat !== 'Todos')}
          />
        )}
      </div>
    </main>
  );
} 