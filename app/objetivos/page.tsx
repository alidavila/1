"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaChartLine, FaRegCheckCircle, FaCheckCircle, 
  FaPlus, FaPencilAlt, FaTrashAlt, FaStar, FaArrowRight, FaClock
} from 'react-icons/fa';
import { CrearObjetivo } from './components/CrearObjetivo';
import { ObjetivoCard } from './components/ObjetivoCard';
import { ObjetivosCompletados } from './components/ObjetivosCompletados';
import { Objetivo, ObjetivoCategoria } from '../../types';

export default function Objetivos() {
  const [objetivosActivos, setObjetivosActivos] = useState<Objetivo[]>([]);
  const [objetivosCompletados, setObjetivosCompletados] = useState<Objetivo[]>([]);
  const [modalCrearObjetivo, setModalCrearObjetivo] = useState(false);
  const [objetivoEditar, setObjetivoEditar] = useState<Objetivo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // En un entorno real, aquí cargaríamos los datos desde la API de n8n
    // Para el ejemplo, usamos datos de prueba estáticos
    const cargarObjetivos = async () => {
      try {
        setIsLoading(true);
        
        // Datos de prueba para objetivos activos
        const mockObjetivosActivos: Objetivo[] = [
          {
            id: "obj-1",
            nombre: "Fondo de emergencia",
            categoria: "ahorro_emergencia",
            valorMeta: 50000,
            valorActual: 25000,
            montoSugerido: 2500,
            fechaEstimada: "2025-09-15",
            prioridad: 1,
            fechaCreacion: "2025-01-15",
            completado: false
          },
          {
            id: "obj-2",
            nombre: "Vacaciones en Europa",
            categoria: "viaje",
            valorMeta: 120000,
            valorActual: 18000,
            montoSugerido: 1500,
            fechaEstimada: "2026-07-10",
            prioridad: 2,
            fechaCreacion: "2025-02-01",
            completado: false
          }
        ];
        
        // Datos de prueba para objetivos completados
        const mockObjetivosCompletados: Objetivo[] = [
          {
            id: "obj-3",
            nombre: "Renovación equipo de cómputo",
            categoria: "comprar_carro",
            valorMeta: 25000,
            valorActual: 25000,
            montoSugerido: 2000,
            fechaEstimada: "2025-01-30",
            prioridad: 0,
            fechaCreacion: "2024-08-15",
            completado: true,
            fechaCompletado: "2025-01-28",
            tiempoCompletado: 166
          },
          {
            id: "obj-4",
            nombre: "Pago de tarjeta de crédito",
            categoria: "pagar_deudas",
            valorMeta: 35000,
            valorActual: 35000,
            montoSugerido: 3000,
            fechaEstimada: "2024-12-25",
            prioridad: 0,
            fechaCreacion: "2024-06-10",
            completado: true,
            fechaCompletado: "2024-12-20",
            tiempoCompletado: 193
          }
        ];
        
        setTimeout(() => {
          setObjetivosActivos(mockObjetivosActivos);
          setObjetivosCompletados(mockObjetivosCompletados);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error("Error al cargar objetivos:", error);
        setIsLoading(false);
      }
    };
    
    cargarObjetivos();
  }, []);
  
  // Formatear montos a formato de dinero
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Calcular días restantes
  const calcularDiasRestantes = (fechaEstimada: string) => {
    const hoy = new Date();
    const fechaFin = new Date(fechaEstimada);
    const diferencia = fechaFin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };
  
  // Obtener fecha formateada
  const formatearFecha = (fechaString: string) => {
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(fechaString).toLocaleDateString('es-MX', opciones);
  };
  
  // Abrir modal para crear objetivo
  const abrirModalCrear = () => {
    setObjetivoEditar(null);
    setModalCrearObjetivo(true);
  };
  
  // Abrir modal para editar objetivo
  const editarObjetivo = (objetivo: Objetivo) => {
    setObjetivoEditar(objetivo);
    setModalCrearObjetivo(true);
  };
  
  // Guardar objetivo (crear o editar)
  const guardarObjetivo = (objetivo: Objetivo) => {
    if (objetivo.id && objetivosActivos.some(o => o.id === objetivo.id)) {
      // Editar objetivo existente
      setObjetivosActivos(
        objetivosActivos.map(o => o.id === objetivo.id ? objetivo : o)
      );
    } else {
      // Crear nuevo objetivo con ID generado
      const nuevoObjetivo = {
        ...objetivo,
        id: `obj-${Date.now()}`,
        fechaCreacion: new Date().toISOString().split('T')[0],
        completado: false
      };
      
      // Validar que no se excedan los 2 objetivos activos
      if (objetivosActivos.length < 2) {
        setObjetivosActivos([...objetivosActivos, nuevoObjetivo]);
      } else {
        alert('Solo puedes tener 2 objetivos activos simultáneamente.');
      }
    }
    
    setModalCrearObjetivo(false);
  };
  
  // Eliminar objetivo
  const eliminarObjetivo = (id: string) => {
    if (confirm('¿Estás seguro que deseas eliminar este objetivo?')) {
      setObjetivosActivos(objetivosActivos.filter(o => o.id !== id));
    }
  };
  
  // Marcar objetivo como completado
  const completarObjetivo = (id: string) => {
    const objetivo = objetivosActivos.find(o => o.id === id);
    
    if (objetivo) {
      // Calcular tiempo que tomó completarlo (en días)
      const fechaInicio = new Date(objetivo.fechaCreacion);
      const fechaFin = new Date();
      const tiempoCompletado = Math.ceil(
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 3600 * 24)
      );
      
      const objetivoCompletado: Objetivo = {
        ...objetivo,
        completado: true,
        fechaCompletado: new Date().toISOString().split('T')[0],
        tiempoCompletado,
        prioridad: 0
      };
      
      // Mover a la lista de completados
      setObjetivosCompletados([objetivoCompletado, ...objetivosCompletados]);
      
      // Remover de la lista de activos
      setObjetivosActivos(objetivosActivos.filter(o => o.id !== id));
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 bg-[#050505] text-[#f4f4f4] min-h-screen">
      {/* Encabezado */}
      <header className="mb-8">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl text-[#eab308] font-light tracking-wider">DANTE</h1>
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 text-white/70 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Inicio
            </motion.div>
          </Link>
        </motion.div>
        <motion.h2 
          className="text-xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Objetivos Financieros
        </motion.h2>
      </header>
      
      {/* Sección de objetivos activos */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaStar className="text-[#eab308]" />
            <h3 className="text-lg">Objetivos Activos ({objetivosActivos.length}/2)</h3>
          </div>
          <motion.button
            className="bg-[#eab308] text-black px-4 py-2 rounded-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={abrirModalCrear}
            disabled={objetivosActivos.length >= 2}
          >
            <FaPlus /> Nuevo Objetivo
          </motion.button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <motion.div 
                key={i}
                className="h-64 bg-white/5 rounded-lg"
                animate={{ opacity: [0.1, 0.15, 0.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            ))}
          </div>
        ) : objetivosActivos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objetivosActivos.map(objetivo => (
              <ObjetivoCard 
                key={objetivo.id}
                objetivo={objetivo}
                formatCurrency={formatCurrency}
                calcularDiasRestantes={calcularDiasRestantes}
                formatearFecha={formatearFecha}
                onEditar={() => editarObjetivo(objetivo)}
                onEliminar={() => eliminarObjetivo(objetivo.id)}
                onCompletar={() => completarObjetivo(objetivo.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-black/20 border border-white/10 rounded-lg p-8 text-center"
            whileHover={{ borderColor: 'rgba(234, 179, 8, 0.3)' }}
          >
            <FaChartLine className="text-[#eab308] text-4xl mx-auto mb-4" />
            <h4 className="text-lg mb-2">No tienes objetivos activos</h4>
            <p className="text-white/60 mb-6">Define tu primer objetivo financiero para comenzar a trackearlo</p>
            <motion.button
              className="bg-[#eab308] text-black px-6 py-3 rounded-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={abrirModalCrear}
            >
              <FaPlus /> Crear Objetivo
            </motion.button>
          </motion.div>
        )}
      </motion.section>
      
      {/* Sección de objetivos completados */}
      {!isLoading && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ObjetivosCompletados 
            objetivos={objetivosCompletados}
            formatCurrency={formatCurrency}
            formatearFecha={formatearFecha}
          />
        </motion.section>
      )}
      
      {/* Modal para crear/editar objetivo */}
      <AnimatePresence>
        {modalCrearObjetivo && (
          <CrearObjetivo 
            objetivo={objetivoEditar}
            onGuardar={guardarObjetivo}
            onCancelar={() => setModalCrearObjetivo(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Botones de navegación */}
      <motion.div 
        className="w-full max-w-4xl mx-auto my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'Inicio', path: '/', icon: <FaHome /> },
            { name: 'Calendario', path: '/calendario', icon: <FaClock /> },
            { name: 'Análisis', path: '/analisis', icon: <FaChartLine /> },
            { name: 'Cuentas', path: '/cuentas', icon: <FaRegCheckCircle /> },
            { name: 'Deudas', path: '/deudas', icon: <FaArrowRight /> }
          ].map((option) => (
            <Link
              key={option.name}
              href={option.path}
            >
              <motion.div
                className="bg-[#1c1c1c] border border-[#eab308] rounded-md py-2 px-4 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                {option.icon} {option.name}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
      
      {/* Pie de página */}
      <motion.footer 
        className="mt-16 text-center text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="mb-1">Consigue tu libertad financiera con sabiduría</p>
        <p>DANTE © {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
} 