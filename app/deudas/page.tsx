"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaCreditCard, FaChartLine, FaExclamationTriangle, 
  FaRegCheckCircle, FaSort, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

// Importar componentes
import { MapaDeudas, generarMapaDeuda } from './components/MapaDeuda';
import { Simulador } from './components/Simulador';

export default function Deudas() {
  const [sortBy, setSortBy] = useState('acreedor');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedDebt, setExpandedDebt] = useState<number | null>(null);
  const [simuladorOpen, setSimuladorOpen] = useState(false);
  const [simuladorDeuda, setSimuladorDeuda] = useState<any | null>(null);
  const [simuladorModo, setSimuladorModo] = useState<'mas' | 'menos'>('mas');
  
  // Datos de ejemplo para las deudas
  const deudas = [
    {
      id: 1,
      acreedor: 'Banco Santander',
      tipo: 'Préstamo Personal',
      saldoInicial: 10000,
      saldoActual: 7500,
      cuotaMensual: 350,
      plazoTotal: 36,
      plazoRestante: 24,
      tasaInteres: 12.5,
      fechaProximoPago: '15/05/2025',
      fechaInicio: '10/05/2023',
    },
    {
      id: 2,
      acreedor: 'American Express',
      tipo: 'Tarjeta de Crédito',
      saldoInicial: 5000,
      saldoActual: 3200,
      cuotaMensual: 200,
      plazoTotal: 24,
      plazoRestante: 16,
      tasaInteres: 18.9,
      fechaProximoPago: '22/05/2025',
      fechaInicio: '22/05/2024',
    },
    {
      id: 3,
      acreedor: 'BBVA',
      tipo: 'Hipoteca',
      saldoInicial: 150000,
      saldoActual: 130000,
      cuotaMensual: 850,
      plazoTotal: 240,
      plazoRestante: 210,
      tasaInteres: 7.5,
      fechaProximoPago: '05/05/2025',
      fechaInicio: '05/01/2023',
    },
    {
      id: 4,
      acreedor: 'Scotiabank',
      tipo: 'Préstamo Auto',
      saldoInicial: 25000,
      saldoActual: 18000,
      cuotaMensual: 450,
      plazoTotal: 60,
      plazoRestante: 44,
      tasaInteres: 9.9,
      fechaProximoPago: '10/05/2025',
      fechaInicio: '10/01/2024',
    }
  ];
  
  // Calcular totales
  const totalDeuda = deudas.reduce((sum, deuda) => sum + deuda.saldoActual, 0);
  const totalCuotaMensual = deudas.reduce((sum, deuda) => sum + deuda.cuotaMensual, 0);
  const numAcreedores = new Set(deudas.map(deuda => deuda.acreedor)).size;
  
  // Estimar meses restantes promedio ponderado por monto
  const mesesRestantes = Math.ceil(
    deudas.reduce((sum, deuda) => sum + (deuda.plazoRestante * deuda.saldoActual), 0) / totalDeuda
  );
  
  // Ordenar deudas
  const sortedDeudas = [...deudas].sort((a, b) => {
    const valueA = a[sortBy as keyof typeof a];
    const valueB = b[sortBy as keyof typeof b];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      return sortOrder === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
    }
  });
  
  // Manejar cambio de ordenación
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  // Manejar expansión de deuda
  const toggleExpandDebt = (id: number) => {
    setExpandedDebt(expandedDebt === id ? null : id);
  };
  
  // Abrir simulador
  const openSimulador = (deuda: any, modo: 'mas' | 'menos') => {
    setSimuladorDeuda(deuda);
    setSimuladorModo(modo);
    setSimuladorOpen(true);
  };
  
  // Renderizar indicadores clave
  const renderKPI = () => {
    return (
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors">
          <div className="text-sm text-white/70 mb-1">Deuda Total</div>
          <div className="text-2xl font-medium">${totalDeuda.toLocaleString()}</div>
        </div>
        
        <div className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors">
          <div className="text-sm text-white/70 mb-1">Acreedores</div>
          <div className="text-2xl font-medium">{numAcreedores}</div>
        </div>
        
        <div className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors">
          <div className="text-sm text-white/70 mb-1">Cuota Mensual</div>
          <div className="text-2xl font-medium">${totalCuotaMensual.toLocaleString()}</div>
        </div>
        
        <div className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors">
          <div className="text-sm text-white/70 mb-1">Tiempo Restante</div>
          <div className="text-2xl font-medium">{mesesRestantes} meses</div>
        </div>
      </motion.div>
    );
  };
  
  // Renderizar tabla de deudas
  const renderDeudasTable = () => {
    return (
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-black/30">
            <tr>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-[#eab308]"
                  onClick={() => handleSort('acreedor')}
                >
                  Acreedor
                  {sortBy === 'acreedor' && (
                    sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button 
                  className="flex items-center gap-1 hover:text-[#eab308]"
                  onClick={() => handleSort('tipo')}
                >
                  Tipo
                  {sortBy === 'tipo' && (
                    sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  className="flex items-center gap-1 hover:text-[#eab308] ml-auto"
                  onClick={() => handleSort('saldoActual')}
                >
                  Saldo Actual
                  {sortBy === 'saldoActual' && (
                    sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button 
                  className="flex items-center gap-1 hover:text-[#eab308] ml-auto"
                  onClick={() => handleSort('cuotaMensual')}
                >
                  Cuota Mensual
                  {sortBy === 'cuotaMensual' && (
                    sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button 
                  className="flex items-center gap-1 hover:text-[#eab308] mx-auto"
                  onClick={() => handleSort('plazoRestante')}
                >
                  Plazo
                  {sortBy === 'plazoRestante' && (
                    sortOrder === 'asc' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-center">Progreso</th>
            </tr>
          </thead>
          <tbody>
            {sortedDeudas.map(deuda => {
              const progress = ((deuda.saldoInicial - deuda.saldoActual) / deuda.saldoInicial) * 100;
              const isExpanded = expandedDebt === deuda.id;
              
              return (
                <>
                  <tr 
                    key={deuda.id} 
                    className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => toggleExpandDebt(deuda.id)}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{deuda.acreedor}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">{deuda.tipo}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-medium">${deuda.saldoActual.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-medium">${deuda.cuotaMensual.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm">{deuda.plazoRestante} / {deuda.plazoTotal} meses</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-full bg-[#4ade80] rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs mt-1">{progress.toFixed(1)}%</div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-black/30 border-b border-white/10">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-[#eab308] mb-2">Detalle de la deuda</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-white/70">Fecha inicio:</span>
                                <span>{deuda.fechaInicio}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Próximo pago:</span>
                                <span>{deuda.fechaProximoPago}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Tasa de interés:</span>
                                <span>{deuda.tasaInteres}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Monto inicial:</span>
                                <span>${deuda.saldoInicial.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Pagado hasta ahora:</span>
                                <span>${(deuda.saldoInicial - deuda.saldoActual).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-[#eab308] mb-2">Simulaciones</h4>
                            <div className="space-y-4">
                              <button 
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-left hover:border-[#eab308]/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Implementar vista de tabla de amortización
                                }}
                              >
                                Ver tabla de amortización
                              </button>
                              <button 
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-left hover:border-[#eab308]/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openSimulador(deuda, 'mas');
                                }}
                              >
                                ¿Qué pasa si pago más?
                              </button>
                              <button 
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-left hover:border-[#eab308]/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openSimulador(deuda, 'menos');
                                }}
                              >
                                ¿Qué pasa si pago menos?
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    );
  };
  
  // Generar mapa de deuda
  const mapaDeudaData = generarMapaDeuda(deudas);
  
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
          Gestión de Deudas
        </motion.h2>
      </header>
      
      {/* Indicadores Clave */}
      {renderKPI()}
      
      {/* Título para el mapa de deudas */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl text-[#eab308] flex items-center gap-2">
          <FaChartLine className="text-lg" />
          Ruta de Distribución de Deudas
          <span className="text-sm font-normal text-white/60 ml-2">
            Explora tu deuda paso a paso desde lo general hasta el detalle
          </span>
        </h3>
      </motion.div>
      
      {/* Mapa Jerárquico de Deudas */}
      <MapaDeudas data={mapaDeudaData} />
      
      {/* Botones de acción */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-[#eab308]">Detalle de Deudas</h3>
        <button className="bg-[#eab308] text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#eab308]/90">
          <FaCreditCard /> Añadir Nueva Deuda
        </button>
      </div>
      
      {/* Tabla de deudas */}
      {renderDeudasTable()}
      
      {/* Modal del simulador */}
      <AnimatePresence>
        {simuladorOpen && simuladorDeuda && (
          <Simulador 
            deuda={simuladorDeuda} 
            modo={simuladorModo}
            onClose={() => setSimuladorOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Navegación */}
      <motion.div 
        className="w-full max-w-4xl mx-auto my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'Inicio', path: '/' },
            { name: 'Calendario', path: '/calendario' },
            { name: 'Análisis', path: '/analisis' },
            { name: 'Presupuesto', path: '/presupuesto' },
            { name: 'Cuentas', path: '/cuentas' },
            { name: 'Objetivos', path: '/objetivos' },
            { name: 'Inversiones', path: '/inversiones' }
          ].map((option) => (
            <Link
              key={option.name}
              href={option.path}
            >
              <motion.div
                className="bg-[#1c1c1c] border border-[#eab308] rounded-md py-2 px-4 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                {option.name}
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
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="mb-1">Consigue tu libertad financiera con sabiduría</p>
        <p>DANTE © {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
} 