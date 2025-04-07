'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import CalendarioHeader from './components/CalendarioHeader';
import EventoFinanciero from './components/EventoFinanciero';
import RegistrarEvento from './components/RegistrarEvento';
import FiltrosCalendario from './components/FiltrosCalendario';
import ResumenMes from './components/ResumenMes';

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

const CalendarioPage = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoEditar, setEventoEditar] = useState<Evento | null>(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vistaActual, setVistaActual] = useState<'mes' | 'semana'>('semana');

  // Colores para categorías
  const coloresCategorias = {
    'tarjetas': 'bg-red-accent',
    'servicios': 'bg-blue-accent',
    'renta': 'bg-purple-accent',
    'inversiones': 'bg-green-accent',
    'otros': 'bg-gold',
  };

  // Datos de ejemplo
  useEffect(() => {
    const eventosEjemplo: Evento[] = [
      {
        id: '1',
        titulo: 'Pago de tarjeta de crédito',
        monto: 5000,
        fecha: new Date(2023, new Date().getMonth(), 15),
        categoria: 'tarjetas',
        descripcion: 'Pago mínimo tarjeta Banamex',
        completado: false,
        recurrente: true,
        periodicidad: 'mensual',
        color: 'bg-red-accent',
      },
      {
        id: '2',
        titulo: 'Renta',
        monto: 12000,
        fecha: new Date(2023, new Date().getMonth(), 1),
        categoria: 'renta',
        completado: true,
        recurrente: true,
        periodicidad: 'mensual',
        color: 'bg-purple-accent',
      },
      {
        id: '3',
        titulo: 'Internet',
        monto: 899,
        fecha: new Date(2023, new Date().getMonth(), 10),
        categoria: 'servicios',
        completado: false,
        recurrente: true,
        periodicidad: 'mensual',
        color: 'bg-blue-accent',
      },
      {
        id: '4',
        titulo: 'Inversión CETES',
        monto: 3000,
        fecha: new Date(2023, new Date().getMonth(), 20),
        categoria: 'inversiones',
        descripcion: 'Inversión mensual programada',
        completado: false,
        recurrente: true,
        periodicidad: 'mensual',
        color: 'bg-green-accent',
      }
    ];
    
    setEventos(eventosEjemplo);
    setEventosFiltrados(eventosEjemplo);
  }, []);

  // Filtrar eventos
  useEffect(() => {
    if (filtroCategoria === 'todos') {
      setEventosFiltrados(eventos);
    } else {
      setEventosFiltrados(eventos.filter(evento => evento.categoria === filtroCategoria));
    }
  }, [filtroCategoria, eventos]);

  // Manejadores de eventos
  const handleAgregarEvento = (nuevoEvento: Evento) => {
    if (eventoEditar) {
      // Editar evento existente
      setEventos(eventos.map(e => e.id === nuevoEvento.id ? nuevoEvento : e));
      setEventoEditar(null);
    } else {
      // Agregar nuevo evento
      setEventos([...eventos, { ...nuevoEvento, id: Date.now().toString() }]);
    }
    setMostrarModal(false);
  };

  const handleEditarEvento = (evento: Evento) => {
    setEventoEditar(evento);
    setMostrarModal(true);
  };

  const handleEliminarEvento = (eventoId: string) => {
    setEventos(eventos.filter(evento => evento.id !== eventoId));
  };

  const handleMarcarCompletado = (eventoId: string) => {
    setEventos(eventos.map(evento => 
      evento.id === eventoId ? { ...evento, completado: !evento.completado } : evento
    ));
  };

  const handleCambiarVista = (vista: 'mes' | 'semana') => {
    setVistaActual(vista);
  };

  const handleCambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    }
    setFechaActual(nuevaFecha);
  };

  // Calcular totales para el resumen
  const totalPagosProgramados = eventosFiltrados.reduce((total, evento) => total + evento.monto, 0);
  const totalPagosCompletados = eventosFiltrados
    .filter(evento => evento.completado)
    .reduce((total, evento) => total + evento.monto, 0);
  const totalPendiente = totalPagosProgramados - totalPagosCompletados;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gold flex items-center">
            <span className="mr-2">📆</span> Calendario Económico
          </h1>
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 text-white/70 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Inicio
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel lateral con resumen y filtros */}
          <div className="lg:col-span-1">
            <ResumenMes 
              totalProgramado={totalPagosProgramados}
              totalCompletado={totalPagosCompletados}
              totalPendiente={totalPendiente}
              mes={fechaActual.toLocaleString('es', { month: 'long' })}
              año={fechaActual.getFullYear()}
            />
            
            <FiltrosCalendario 
              categoriaActual={filtroCategoria}
              onCambiarCategoria={setFiltroCategoria}
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEventoEditar(null);
                setMostrarModal(true);
              }}
              className="w-full bg-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg mt-4 flex items-center justify-center"
            >
              <span className="mr-2">+</span> Registrar Nuevo Evento
            </motion.button>
          </div>

          {/* Panel principal con calendario */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6 shadow-xl">
            <CalendarioHeader 
              fecha={fechaActual}
              vista={vistaActual}
              onCambiarVista={handleCambiarVista}
              onCambiarMes={handleCambiarMes}
            />
            
            <div className="mt-6 overflow-y-auto max-h-[calc(100vh-260px)]">
              {eventosFiltrados.length > 0 ? (
                <div className="space-y-4">
                  {eventosFiltrados
                    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
                    .map(evento => (
                      <EventoFinanciero
                        key={evento.id}
                        evento={evento}
                        onMarcarCompletado={handleMarcarCompletado}
                        onEditar={handleEditarEvento}
                        onEliminar={handleEliminarEvento}
                      />
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl mb-4">No hay eventos para mostrar</p>
                  <p>Agrega un nuevo evento o cambia los filtros</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal para registrar/editar eventos */}
        {mostrarModal && (
          <RegistrarEvento 
            onGuardar={handleAgregarEvento}
            onCancelar={() => {
              setMostrarModal(false);
              setEventoEditar(null);
            }}
            eventoEditar={eventoEditar}
            coloresCategorias={coloresCategorias}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CalendarioPage; 