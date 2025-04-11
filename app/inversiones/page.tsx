"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaChartLine, FaMoneyBillWave, FaPlus, FaTable, 
  FaChartArea, FaCalculator, FaBook, FaCoins, FaBitcoin, 
  FaRegListAlt, FaArrowUp, FaArrowDown, FaSort, FaTimes
} from 'react-icons/fa';

import { RegistrarInversion } from './components/RegistrarInversion';
import { ListaInversiones } from './components/ListaInversiones';
import { GraficoEvolucion } from './components/GraficoEvolucion';
import { CalculadoraInteres } from './components/CalculadoraInteres';
import { Inversion, TipoActivo } from '@/types';

export default function Inversiones() {
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [inversionEditar, setInversionEditar] = useState<Inversion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'grafico'>('lista');
  
  // Efecto para cargar datos de inversiones
  useEffect(() => {
    const cargarInversiones = async () => {
      setIsLoading(true);
      
      // Datos de ejemplo para inversiones
      const inversionesEjemplo: Inversion[] = [
        {
          id: "inv-1",
          tipo: "cripto",
          nombre: "Bitcoin (BTC)",
          valorCompra: 45000,
          fechaCompra: "2024-11-15",
          montoInvertido: 1000,
          valorActual: 52000,
          rentabilidad: 15.56,
          gananciaOPerdida: 155.56,
          historialValores: [
            { fecha: "2024-11-15", valor: 45000 },
            { fecha: "2024-12-15", valor: 47500 },
            { fecha: "2025-01-15", valor: 46000 },
            { fecha: "2025-02-15", valor: 48000 },
            { fecha: "2025-03-15", valor: 52000 }
          ]
        },
        {
          id: "inv-2",
          tipo: "accion",
          nombre: "Apple Inc. (AAPL)",
          valorCompra: 150.75,
          fechaCompra: "2024-10-01",
          montoInvertido: 3000,
          valorActual: 175.25,
          rentabilidad: 16.25,
          gananciaOPerdida: 487.5,
          historialValores: [
            { fecha: "2024-10-01", valor: 150.75 },
            { fecha: "2024-11-01", valor: 155.20 },
            { fecha: "2024-12-01", valor: 160.15 },
            { fecha: "2025-01-01", valor: 168.75 },
            { fecha: "2025-02-01", valor: 172.30 },
            { fecha: "2025-03-01", valor: 175.25 }
          ]
        },
        {
          id: "inv-3",
          tipo: "etf",
          nombre: "Vanguard S&P 500 ETF (VOO)",
          valorCompra: 380.25,
          fechaCompra: "2024-09-10",
          montoInvertido: 5000,
          valorActual: 415.80,
          rentabilidad: 9.35,
          gananciaOPerdida: 467.5,
          historialValores: [
            { fecha: "2024-09-10", valor: 380.25 },
            { fecha: "2024-10-10", valor: 385.50 },
            { fecha: "2024-11-10", valor: 390.10 },
            { fecha: "2024-12-10", valor: 400.35 },
            { fecha: "2025-01-10", valor: 408.20 },
            { fecha: "2025-02-10", valor: 415.80 }
          ]
        },
        {
          id: "inv-4",
          tipo: "fondo",
          nombre: "Blackrock Global Allocation Fund",
          valorCompra: 20.15,
          fechaCompra: "2024-08-20",
          montoInvertido: 2500,
          valorActual: 19.40,
          rentabilidad: -3.72,
          gananciaOPerdida: -93.00,
          historialValores: [
            { fecha: "2024-08-20", valor: 20.15 },
            { fecha: "2024-09-20", valor: 20.30 },
            { fecha: "2024-10-20", valor: 20.05 },
            { fecha: "2024-11-20", valor: 19.85 },
            { fecha: "2024-12-20", valor: 19.60 },
            { fecha: "2025-01-20", valor: 19.40 }
          ]
        }
      ];
      
      setTimeout(() => {
        setInversiones(inversionesEjemplo);
        setIsLoading(false);
      }, 1200);
    };
    
    cargarInversiones();
  }, []);
  
  // Calcular totales
  const calcularTotales = () => {
    const totalInvertido = inversiones.reduce((sum, inv) => sum + inv.montoInvertido, 0);
    const valorActualTotal = inversiones.reduce((sum, inv) => {
      // Para cripto, considerar el valor del token por la cantidad adquirida
      if (inv.tipo === 'cripto') {
        const cantidadTokens = inv.montoInvertido / inv.valorCompra;
        return sum + (inv.valorActual * cantidadTokens);
      }
      // Para acciones, ETFs y fondos
      return sum + (inv.montoInvertido * (1 + inv.rentabilidad / 100));
    }, 0);
    
    const gananciaTotal = valorActualTotal - totalInvertido;
    const rentabilidadPromedio = totalInvertido > 0 
      ? (valorActualTotal / totalInvertido - 1) * 100 
      : 0;
    
    return {
      totalInvertido,
      valorActualTotal,
      gananciaTotal,
      rentabilidadPromedio
    };
  };
  
  const { totalInvertido, valorActualTotal, gananciaTotal, rentabilidadPromedio } = calcularTotales();
  
  // Formatear montos a formato de dinero
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Formatear porcentaje
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Abrir modal para registrar nueva inversión
  const abrirModalRegistro = () => {
    setInversionEditar(null);
    setModalRegistro(true);
  };
  
  // Editar inversión existente
  const editarInversion = (inversion: Inversion) => {
    setInversionEditar(inversion);
    setModalRegistro(true);
  };
  
  // Guardar inversión (nueva o editada)
  const guardarInversion = (inversion: Inversion) => {
    if (inversion.id && inversiones.some(i => i.id === inversion.id)) {
      // Editar inversión existente
      setInversiones(
        inversiones.map(i => i.id === inversion.id ? inversion : i)
      );
    } else {
      // Crear nueva inversión con ID generado
      const nuevaInversion = {
        ...inversion,
        id: `inv-${Date.now()}`
      };
      setInversiones([...inversiones, nuevaInversion]);
    }
    
    setModalRegistro(false);
  };
  
  // Eliminar inversión
  const eliminarInversion = (id: string) => {
    if (confirm('¿Estás seguro que deseas eliminar esta inversión?')) {
      setInversiones(inversiones.filter(i => i.id !== id));
    }
  };
  
  // Obtener consejo de inversión personalizado
  const obtenerConsejo = () => {
    // Calcular el porcentaje de activos por tipo
    const porcentajePorTipo: Record<TipoActivo, number> = {
      cripto: 0,
      accion: 0,
      etf: 0,
      fondo: 0
    };
    
    const inversionesPorTipo: Record<TipoActivo, number> = {
      cripto: 0,
      accion: 0,
      etf: 0,
      fondo: 0
    };
    
    inversiones.forEach(inv => {
      inversionesPorTipo[inv.tipo] += inv.montoInvertido;
    });
    
    if (totalInvertido > 0) {
      Object.keys(inversionesPorTipo).forEach(tipo => {
        porcentajePorTipo[tipo as TipoActivo] = (inversionesPorTipo[tipo as TipoActivo] / totalInvertido) * 100;
      });
    }
    
    // Consejos basados en el portafolio actual
    if (totalInvertido === 0) {
      return "Comienza con una inversión pequeña pero constante, de preferencia en ETFs diversificados.";
    } else if (porcentajePorTipo.cripto > 20) {
      return "Tu exposición a criptomonedas es alta. Considera diversificar más hacia activos tradicionales como ETFs.";
    } else if (porcentajePorTipo.accion > 70) {
      return "Tu cartera está muy concentrada en acciones individuales. Considera añadir ETFs para mayor diversificación.";
    } else if (porcentajePorTipo.etf + porcentajePorTipo.fondo > 80) {
      return "Tienes una cartera conservadora. Para potenciar rendimientos, podrías incluir algunas acciones de crecimiento.";
    } else {
      return "Tu portafolio tiene una buena diversificación. Mantén aportes regulares para aprovechar el interés compuesto.";
    }
  };
  
  const consejo = obtenerConsejo();
  
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
          Gestión de Inversiones
        </motion.h2>
      </header>
      
      {/* Resumen de inversiones */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-[#4ade80]" />
            <h3 className="text-lg">Resumen de Inversiones</h3>
          </div>
          <motion.button
            className="bg-[#4ade80] text-black px-4 py-2 rounded-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={abrirModalRegistro}
          >
            <FaPlus /> Nueva Inversión
          </motion.button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i}
                className="h-24 bg-white/5 rounded-lg"
                animate={{ opacity: [0.1, 0.15, 0.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#4ade80]/30 transition-colors"
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(74,222,128,0.1)' }}
            >
              <div className="text-sm text-white/70 mb-1">Total Invertido</div>
              <div className="text-xl font-medium">{formatCurrency(totalInvertido)}</div>
              <div className="text-xs text-white/70 mt-1">{inversiones.length} activos</div>
            </motion.div>
            
            <motion.div 
              className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#4ade80]/30 transition-colors"
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(74,222,128,0.1)' }}
            >
              <div className="text-sm text-white/70 mb-1">Valor Actual</div>
              <div className="text-xl font-medium">{formatCurrency(valorActualTotal)}</div>
              <div className="text-xs text-white/70 mt-1">Actualizado hoy</div>
            </motion.div>
            
            <motion.div 
              className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#4ade80]/30 transition-colors"
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(74,222,128,0.1)' }}
            >
              <div className="text-sm text-white/70 mb-1">Ganancia Total</div>
              <div className={`text-xl font-medium ${gananciaTotal >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {gananciaTotal >= 0 ? '+' : ''}{formatCurrency(gananciaTotal)}
              </div>
              <div className="flex items-center text-xs mt-1">
                <span className={gananciaTotal >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                  {gananciaTotal >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                </span>
                <span className="ml-1 text-white/70">Desde compra</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#4ade80]/30 transition-colors"
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(74,222,128,0.1)' }}
            >
              <div className="text-sm text-white/70 mb-1">Rentabilidad</div>
              <div className={`text-xl font-medium ${rentabilidadPromedio >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {formatPercent(rentabilidadPromedio)}
              </div>
              <div className="text-xs text-white/70 mt-1">Promedio global</div>
            </motion.div>
          </div>
        )}
      </motion.section>
      
      {/* Consejos de inversión */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-[#0f172a] border border-[#4ade80]/20 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-[#4ade80]/10 flex-shrink-0">
              <FaBook className="text-[#4ade80]" />
            </div>
            <div>
              <h4 className="text-base font-medium text-[#4ade80]">Consejo de inversión personalizado</h4>
              <p className="mt-1 text-sm text-white/80">{consejo}</p>
              <p className="mt-3 text-sm italic text-white/60">
                Si inviertes $1,000 mensuales durante 5 años con un rendimiento anual promedio del 8%, 
                podrías acumular aproximadamente ${(1000 * 12 * 5 * 1.08).toLocaleString()} pesos.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Pestaña de lista de inversiones y gráfico */}
      {!isLoading && inversiones.length > 0 && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex border-b border-white/10 mb-4">
            <button
              className={`py-2 px-4 flex items-center gap-2 ${
                vistaActiva === 'lista' ? 'border-b-2 border-[#4ade80] text-[#4ade80]' : 'text-white/60'
              }`}
              onClick={() => setVistaActiva('lista')}
            >
              <FaTable />
              <span>Lista de Inversiones</span>
            </button>
            <button
              className={`py-2 px-4 flex items-center gap-2 ${
                vistaActiva === 'grafico' ? 'border-b-2 border-[#4ade80] text-[#4ade80]' : 'text-white/60'
              }`}
              onClick={() => setVistaActiva('grafico')}
            >
              <FaChartArea />
              <span>Evolución</span>
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {vistaActiva === 'lista' ? (
              <motion.div
                key="lista"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ListaInversiones 
                  inversiones={inversiones} 
                  formatCurrency={formatCurrency} 
                  formatPercent={formatPercent}
                  formatDate={formatDate}
                  onEdit={editarInversion}
                  onDelete={eliminarInversion}
                />
              </motion.div>
            ) : (
              <motion.div
                key="grafico"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <GraficoEvolucion 
                  inversiones={inversiones} 
                  formatCurrency={formatCurrency}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}
      
      {/* Mensaje para comenzar a invertir */}
      {!isLoading && inversiones.length === 0 && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-black/20 border border-white/10 rounded-lg p-8 text-center">
            <FaCoins className="text-[#4ade80] text-4xl mx-auto mb-4 opacity-50" />
            <h4 className="text-lg mb-2">Comienza tu portafolio de inversiones</h4>
            <p className="text-white/60 mb-6">Registra tus primeras inversiones para visualizar su evolución</p>
            <motion.button
              className="bg-[#4ade80] text-black px-6 py-3 rounded-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={abrirModalRegistro}
            >
              <FaPlus /> Registrar Inversión
            </motion.button>
          </div>
        </motion.section>
      )}
      
      {/* Calculadora de interés compuesto */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FaCalculator className="text-[#4ade80]" />
          <h3 className="text-lg">Calculadora de Interés Compuesto</h3>
        </div>
        
        <CalculadoraInteres formatCurrency={formatCurrency} />
      </motion.section>
      
      {/* Modal para registro de inversión */}
      <AnimatePresence>
        {modalRegistro && (
          <RegistrarInversion 
            inversion={inversionEditar}
            onSave={guardarInversion}
            onCancel={() => setModalRegistro(false)}
            formatCurrency={formatCurrency}
          />
        )}
      </AnimatePresence>
      
      {/* Botones de navegación */}
      <motion.div 
        className="w-full max-w-4xl mx-auto my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'Inicio', path: '/', icon: <FaHome /> },
            { name: 'Análisis', path: '/analisis', icon: <FaChartLine /> },
            { name: 'Cuentas', path: '/cuentas', icon: <FaRegListAlt /> },
            { name: 'Deudas', path: '/deudas', icon: <FaArrowDown /> },
            { name: 'Objetivos', path: '/objetivos', icon: <FaArrowUp /> }
          ].map((option) => (
            <Link
              key={option.name}
              href={option.path}
            >
              <motion.div
                className="bg-[#1c1c1c] border border-[#4ade80] rounded-md py-2 px-4 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)] flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)' }}
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
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="mb-1">Consigue tu libertad financiera con sabiduría</p>
        <p>DANTE © {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
} 