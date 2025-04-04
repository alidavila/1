"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaCoins, FaCalendarAlt, FaTimes } from 'react-icons/fa';

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
}

interface SimuladorProps {
  deuda: Deuda;
  onClose: () => void;
  modo: 'mas' | 'menos';
}

export const Simulador: React.FC<SimuladorProps> = ({ deuda, onClose, modo }) => {
  const [monto, setMonto] = useState<number>(
    modo === 'mas' 
      ? Math.round(deuda.cuotaMensual * 1.5) 
      : Math.round(deuda.cuotaMensual * 0.8)
  );
  const [resultados, setResultados] = useState<{
    tiempoOriginal: number;
    tiempoNuevo: number;
    interesOriginal: number;
    interesNuevo: number;
    ahorroTiempo: number;
    ahorroInteres: number;
  } | null>(null);
  
  useEffect(() => {
    calcularSimulacion();
  }, [monto]);
  
  const calcularSimulacion = () => {
    // Calcular amortización original
    const resultadoOriginal = calcularAmortizacion(
      deuda.saldoActual, 
      deuda.tasaInteres / 100 / 12, 
      deuda.cuotaMensual
    );
    
    // Calcular nueva amortización
    const resultadoNuevo = calcularAmortizacion(
      deuda.saldoActual,
      deuda.tasaInteres / 100 / 12,
      monto
    );
    
    setResultados({
      tiempoOriginal: resultadoOriginal.meses,
      tiempoNuevo: resultadoNuevo.meses,
      interesOriginal: resultadoOriginal.interesTotal,
      interesNuevo: resultadoNuevo.interesTotal,
      ahorroTiempo: resultadoOriginal.meses - resultadoNuevo.meses,
      ahorroInteres: resultadoOriginal.interesTotal - resultadoNuevo.interesTotal
    });
  };
  
  const calcularAmortizacion = (saldo: number, tasaMensual: number, cuota: number) => {
    let balance = saldo;
    let meses = 0;
    let interesTotal = 0;
    
    // Para casos donde la cuota es menor que el interés
    if (cuota <= balance * tasaMensual) {
      return {
        meses: Infinity,
        interesTotal: Infinity
      };
    }
    
    while (balance > 0 && meses < 1000) { // Límite para evitar bucles infinitos
      meses++;
      const interesMes = balance * tasaMensual;
      interesTotal += interesMes;
      
      const amortizacion = cuota - interesMes;
      balance -= amortizacion;
      
      if (balance < 0.01) balance = 0; // Evitar problemas de redondeo
    }
    
    return {
      meses,
      interesTotal
    };
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0a0a0a] border border-[#eab308]/30 rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-[#eab308]">
            {modo === 'mas' ? '¿Qué pasa si pago más?' : '¿Qué pasa si pago menos?'}
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
          <p className="text-sm text-white/70 mb-4">Saldo actual: ${deuda.saldoActual.toLocaleString()}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Cuota actual: ${deuda.cuotaMensual}/mes</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={modo === 'mas' ? deuda.cuotaMensual : deuda.cuotaMensual * 0.5}
                  max={modo === 'mas' ? deuda.cuotaMensual * 3 : deuda.cuotaMensual}
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="w-20 bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-right"
                />
              </div>
            </div>
          </div>
        </div>
        
        {resultados && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2 text-[#eab308]">
                  <FaCalendarAlt />
                  <span className="text-sm">Tiempo</span>
                </div>
                <div className="text-lg font-medium">
                  {resultados.tiempoNuevo === Infinity ? (
                    <span className="text-[#f87171]">Nunca se pagará</span>
                  ) : (
                    <>
                      <span className={modo === 'mas' ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                        {resultados.tiempoNuevo} meses
                      </span>
                      <span className="text-xs text-white/50 ml-1">
                        ({(resultados.tiempoNuevo / 12).toFixed(1)} años)
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-white/70 mt-1">
                  {resultados.tiempoOriginal === Infinity ? (
                    "Original: Nunca se pagará"
                  ) : (
                    `Original: ${resultados.tiempoOriginal} meses`
                  )}
                </div>
                {resultados.tiempoNuevo !== Infinity && resultados.tiempoOriginal !== Infinity && (
                  <div className={`text-xs ${modo === 'mas' ? 'text-[#4ade80]' : 'text-[#f87171]'} mt-1`}>
                    {modo === 'mas' 
                      ? `Terminarás ${resultados.ahorroTiempo} meses antes` 
                      : `Terminarás ${Math.abs(resultados.ahorroTiempo)} meses después`}
                  </div>
                )}
              </div>
              
              <div className="bg-black/20 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2 text-[#eab308]">
                  <FaCoins />
                  <span className="text-sm">Interés total</span>
                </div>
                <div className="text-lg font-medium">
                  {resultados.interesNuevo === Infinity ? (
                    <span className="text-[#f87171]">Interés indefinido</span>
                  ) : (
                    <span className={modo === 'mas' ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                      ${resultados.interesNuevo.toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/70 mt-1">
                  {resultados.interesOriginal === Infinity ? (
                    "Original: Interés indefinido"
                  ) : (
                    `Original: $${resultados.interesOriginal.toFixed(0)}`
                  )}
                </div>
                {resultados.interesNuevo !== Infinity && resultados.interesOriginal !== Infinity && (
                  <div className={`text-xs ${modo === 'mas' ? 'text-[#4ade80]' : 'text-[#f87171]'} mt-1`}>
                    {modo === 'mas' 
                      ? `Ahorras $${resultados.ahorroInteres.toFixed(0)} en intereses` 
                      : `Pagas $${Math.abs(resultados.ahorroInteres).toFixed(0)} más en intereses`}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2 text-[#eab308]">
                <FaChartLine />
                <span className="text-sm">Análisis</span>
              </div>
              <p className="text-sm">
                {modo === 'mas' ? (
                  resultados.tiempoNuevo === Infinity ? (
                    "Incluso con este incremento, la cuota sigue siendo insuficiente para cubrir los intereses generados mensualmente. Considera aumentar más el pago mensual."
                  ) : (
                    `Aumentando tu pago mensual a $${monto}, terminarás de pagar ${resultados.ahorroTiempo} meses antes y ahorrarás $${resultados.ahorroInteres.toFixed(0)} en intereses.`
                  )
                ) : (
                  resultados.tiempoNuevo === Infinity ? (
                    "Esta reducción en la cuota es insostenible, ya que el pago mensual es menor que el interés generado. Tu deuda nunca se terminaría de pagar."
                  ) : (
                    `Reduciendo tu pago mensual a $${monto}, tu deuda tardará ${Math.abs(resultados.ahorroTiempo)} meses adicionales en pagarse y pagarás $${Math.abs(resultados.ahorroInteres).toFixed(0)} más en intereses.`
                  )
                )}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
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