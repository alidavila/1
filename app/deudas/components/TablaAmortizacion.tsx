"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaCoins, FaChartLine, FaDownload, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Deuda {
  id: number;
  acreedor: string;
  tipo: string;
  saldoInicial: number;
  saldoActual: number;
  cuotaMensual: number;
  plazoTotal: number;
  plazoRestante: number;
  tasaInteres: number;
  fechaProximoPago?: string;
  fechaInicio?: string;
}

interface TablaAmortizacionProps {
  deuda: Deuda;
  onClose: () => void;
}

interface Pago {
  numeroPago: number;
  fechaPago: string;
  cuota: number;
  capital: number;
  interes: number;
  saldoRestante: number;
}

export const TablaAmortizacion: React.FC<TablaAmortizacionProps> = ({ deuda, onClose }) => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const pagosPorPagina = 12; // Un año de pagos
  
  // Calcular tabla de amortización
  const calcularTablaAmortizacion = useCallback(() => {
    const tasaMensual = deuda.tasaInteres / 100 / 12;
    let saldoRestante = deuda.saldoActual;
    const cuotaMensual = deuda.cuotaMensual;
    const tablaPagos: Pago[] = [];
    
    // Crear fecha de inicio
    let fechaPago = deuda.fechaInicio ? new Date(deuda.fechaInicio) : new Date();
    // Si el préstamo ya está en progreso, ajustar la fecha al próximo pago
    if (deuda.plazoTotal !== deuda.plazoRestante) {
      fechaPago.setMonth(fechaPago.getMonth() + (deuda.plazoTotal - deuda.plazoRestante));
    }
    
    // Calcular cada pago
    for (let i = 1; i <= deuda.plazoRestante; i++) {
      const interesMes = saldoRestante * tasaMensual;
      const capitalMes = cuotaMensual - interesMes;
      
      saldoRestante -= capitalMes;
      
      // Avanzar al siguiente mes para la fecha de pago
      fechaPago.setMonth(fechaPago.getMonth() + 1);
      
      // Formatear fecha como DD/MM/YYYY
      const fechaFormateada = fechaPago.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      tablaPagos.push({
        numeroPago: i,
        fechaPago: fechaFormateada,
        cuota: cuotaMensual,
        capital: capitalMes,
        interes: interesMes,
        saldoRestante: Math.max(0, saldoRestante) // Evitar saldos negativos por redondeo
      });
      
      // Si el saldo es muy pequeño, considerarlo como cero y terminar
      if (saldoRestante < 0.01) {
        break;
      }
    }
    
    setPagos(tablaPagos);
  }, [deuda]);
  
  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const totalPagado = pagos.reduce((total, pago) => total + pago.cuota, 0);
    const totalInteres = pagos.reduce((total, pago) => total + pago.interes, 0);
    const totalCapital = pagos.reduce((total, pago) => total + pago.capital, 0);
    
    return {
      totalPagado,
      totalInteres,
      totalCapital,
      porcentajeInteres: (totalInteres / totalPagado) * 100
    };
  };
  
  // Inicializar tabla de amortización
  useEffect(() => {
    calcularTablaAmortizacion();
  }, [calcularTablaAmortizacion]);
  
  // Paginación
  const indiceUltimoPago = paginaActual * pagosPorPagina;
  const indicePrimerPago = indiceUltimoPago - pagosPorPagina;
  const pagosActuales = pagos.slice(indicePrimerPago, indiceUltimoPago);
  const totalPaginas = Math.ceil(pagos.length / pagosPorPagina);
  
  // Cambiar de página
  const cambiarPagina = (numPagina: number) => {
    if (numPagina > 0 && numPagina <= totalPaginas) {
      setPaginaActual(numPagina);
    }
  };
  
  // Calcular estadísticas
  const estadisticas = calcularEstadisticas();
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0a0a0a] border border-[#eab308]/30 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-[#eab308]">
            Tabla de Amortización
          </h3>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <h4 className="mb-2">{deuda.acreedor} - {deuda.tipo}</h4>
          <p className="text-sm text-white/70 mb-4">
            Préstamo de ${deuda.saldoActual.toLocaleString()} a una tasa del {deuda.tasaInteres}% anual,
            pagadero en {deuda.plazoRestante} cuotas mensuales de ${deuda.cuotaMensual.toLocaleString()}
          </p>
          
          {/* Resumen estadístico */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#eab308] mb-2">
                <FaCoins />
                <span className="text-sm">Total a pagar</span>
              </div>
              <p className="text-lg font-medium">${estadisticas.totalPagado.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#eab308] mb-2">
                <FaChartLine />
                <span className="text-sm">Intereses</span>
              </div>
              <p className="text-lg font-medium">${estadisticas.totalInteres.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-white/50">({estadisticas.porcentajeInteres.toFixed(1)}% del total)</p>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#eab308] mb-2">
                <FaCalendarAlt />
                <span className="text-sm">Plazo</span>
              </div>
              <p className="text-lg font-medium">{deuda.plazoRestante} meses</p>
              <p className="text-xs text-white/50">({(deuda.plazoRestante / 12).toFixed(1)} años)</p>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-[#eab308] mb-2">
                <FaCoins />
                <span className="text-sm">Cuota mensual</span>
              </div>
              <p className="text-lg font-medium">${deuda.cuotaMensual.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Tabla de amortización */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/30">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-right">Cuota</th>
                  <th className="px-4 py-2 text-right">Capital</th>
                  <th className="px-4 py-2 text-right">Interés</th>
                  <th className="px-4 py-2 text-right">Saldo restante</th>
                </tr>
              </thead>
              <tbody>
                {pagosActuales.map((pago) => (
                  <tr key={pago.numeroPago} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-2">{pago.numeroPago}</td>
                    <td className="px-4 py-2">{pago.fechaPago}</td>
                    <td className="px-4 py-2 text-right">${pago.cuota.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${pago.capital.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${pago.interes.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${pago.saldoRestante.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-white/50">
              Mostrando {indicePrimerPago + 1}-{Math.min(indiceUltimoPago, pagos.length)} de {pagos.length} pagos
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`p-2 rounded ${paginaActual === 1 ? 'text-white/30' : 'text-white/70 hover:bg-white/10'}`}
              >
                <FaArrowLeft />
              </button>
              <span className="text-white/70">
                {paginaActual} / {totalPaginas}
              </span>
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`p-2 rounded ${paginaActual === totalPaginas ? 'text-white/30' : 'text-white/70 hover:bg-white/10'}`}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              // Implementación del botón de descarga (podría generar un PDF o CSV)
              alert('Funcionalidad de descarga aún no implementada');
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <FaDownload /> Descargar tabla
          </button>
          <button
            onClick={onClose}
            className="bg-[#eab308] text-black px-4 py-2 rounded-lg hover:bg-[#eab308]/90"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 