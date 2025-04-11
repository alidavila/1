"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaChartLine, FaCalendarAlt, FaPercent, FaInfoCircle } from 'react-icons/fa';

interface CalculadoraInteresProps {
  formatCurrency: (amount: number) => string;
}

export const CalculadoraInteres: React.FC<CalculadoraInteresProps> = ({ formatCurrency }) => {
  const [montoInicial, setMontoInicial] = useState<number>(0);
  const [aporteMensual, setAporteMensual] = useState<number>(1000);
  const [tasaAnual, setTasaAnual] = useState<number>(8);
  const [plazoAnios, setPlazoAnios] = useState<number>(5);
  const [frecuenciaCapitalizacion, setFrecuenciaCapitalizacion] = useState<number>(12); // Mensual por defecto
  const [resultados, setResultados] = useState<{
    montoFinal: number;
    montoAportado: number;
    interesesGenerados: number;
    datosGrafico: Array<{ anio: number; mes: number; aportado: number; total: number }>;
  } | null>(null);
  
  // Función para validar entradas numéricas
  const validarNumero = (valor: string, max: number = Infinity): number => {
    const numero = parseFloat(valor);
    if (isNaN(numero) || numero < 0) return 0;
    return Math.min(numero, max);
  };
  
  // Calcular interés compuesto - definido con useCallback antes de ser usado en useEffect
  const calcularInteres = useCallback(() => {
    // Validar entradas
    if (tasaAnual <= 0 || plazoAnios <= 0) {
      setResultados(null);
      return;
    }
    
    const meses = plazoAnios * 12;
    const tasaPorPeriodo = tasaAnual / 100 / frecuenciaCapitalizacion;
    
    let total = montoInicial;
    let totalAportado = montoInicial;
    
    // Array para almacenar datos del gráfico
    const datosGrafico: Array<{ anio: number; mes: number; aportado: number; total: number }> = [];
    
    // Para cada mes
    for (let mes = 1; mes <= meses; mes++) {
      // Sumar aporte mensual
      total += aporteMensual;
      totalAportado += aporteMensual;
      
      // Calcular interés según la frecuencia de capitalización
      if (mes % (12 / frecuenciaCapitalizacion) === 0) {
        total *= (1 + tasaPorPeriodo);
      }
      
      // Guardar datos para el gráfico (cada 6 meses o al final de cada año)
      if (mes % 6 === 0 || mes === meses) {
        datosGrafico.push({
          anio: Math.floor(mes / 12),
          mes: mes % 12 || 12,
          aportado: totalAportado,
          total: total
        });
      }
    }
    
    setResultados({
      montoFinal: total,
      montoAportado: totalAportado,
      interesesGenerados: total - totalAportado,
      datosGrafico
    });
  }, [montoInicial, aporteMensual, tasaAnual, plazoAnios, frecuenciaCapitalizacion]);
  
  // Calcular el interés compuesto cada vez que cambien los parámetros
  useEffect(() => {
    calcularInteres();
  }, [calcularInteres]);
  
  // Renderizar gráfico de barras
  const renderGrafico = () => {
    if (!resultados || resultados.datosGrafico.length === 0) return null;
    
    const maxValor = resultados.montoFinal * 1.05; // 5% de margen superior
    
    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Proyección de crecimiento</h4>
        <div className="relative h-[200px] mt-6">
          <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-end w-full h-0">
                <div className="text-xs text-white/60 pr-2">
                  {formatCurrency(maxValor * (4 - i) / 4)}
                </div>
                <div className="absolute left-10 w-full h-px bg-white/10"></div>
              </div>
            ))}
          </div>
          
          <div className="ml-10 h-full flex items-end">
            <div className="flex-1 flex items-end space-x-2">
              {resultados.datosGrafico.map((dato, index) => {
                const alturaTotal = (dato.total / maxValor) * 100;
                const alturaAportado = (dato.aportado / maxValor) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    {/* Barra total */}
                    <div className="w-full relative" style={{ height: `${Math.max(alturaTotal, 1)}%` }}>
                      <motion.div 
                        className="absolute inset-0 bg-[#4ade80] rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      ></motion.div>
                      
                      {/* Barra aportado */}
                      <motion.div 
                        className="absolute inset-0 bg-[#3b82f6] rounded-t"
                        style={{ height: `${(alturaAportado / alturaTotal) * 100}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(alturaAportado / alturaTotal) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      ></motion.div>
                    </div>
                    
                    {/* Etiqueta año */}
                    <div className="text-xs text-white/60 mt-1">
                      {dato.anio > 0 ? `Año ${dato.anio}` : `${dato.mes}m`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#3b82f6] rounded mr-2"></div>
            <span className="text-xs text-white/70">Aportado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#4ade80] rounded mr-2"></div>
            <span className="text-xs text-white/70">Intereses</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div>
          <div className="space-y-5">
            {/* Monto inicial */}
            <div>
              <label htmlFor="montoInicial" className="flex items-center text-sm mb-2">
                <FaCoins className="text-[#4ade80] mr-2" />
                Inversión inicial (opcional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                <input
                  type="number"
                  id="montoInicial"
                  value={montoInicial}
                  onChange={(e) => setMontoInicial(validarNumero(e.target.value))}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#4ade80]/50"
                  min="0"
                  step="1000"
                />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-white/50">Monto al comenzar</div>
                <div className="flex space-x-3">
                  {[0, 10000, 50000].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      className={`text-xs px-2 py-0.5 rounded ${
                        montoInicial === valor ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-black/30 text-white/60'
                      }`}
                      onClick={() => setMontoInicial(valor)}
                    >
                      {valor === 0 ? '$0' : formatCurrency(valor)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Aporte mensual */}
            <div>
              <label htmlFor="aporteMensual" className="flex items-center text-sm mb-2">
                <FaCalendarAlt className="text-[#4ade80] mr-2" />
                Aporte mensual
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                <input
                  type="number"
                  id="aporteMensual"
                  value={aporteMensual}
                  onChange={(e) => setAporteMensual(validarNumero(e.target.value))}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#4ade80]/50"
                  min="0"
                  step="100"
                />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-white/50">Aporte recurrente</div>
                <div className="flex space-x-3">
                  {[500, 1000, 5000].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      className={`text-xs px-2 py-0.5 rounded ${
                        aporteMensual === valor ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-black/30 text-white/60'
                      }`}
                      onClick={() => setAporteMensual(valor)}
                    >
                      {formatCurrency(valor)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tasa de rendimiento */}
            <div>
              <label htmlFor="tasaAnual" className="flex items-center text-sm mb-2">
                <FaPercent className="text-[#4ade80] mr-2" />
                Tasa de rendimiento anual
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="tasaAnual"
                  value={tasaAnual}
                  onChange={(e) => setTasaAnual(validarNumero(e.target.value, 100))}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4ade80]/50"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">%</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-white/50">
                  <FaInfoCircle />
                  <span>Promedio histórico del mercado: 7-10%</span>
                </div>
                <div className="flex space-x-3">
                  {[5, 8, 12].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      className={`text-xs px-2 py-0.5 rounded ${
                        tasaAnual === valor ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-black/30 text-white/60'
                      }`}
                      onClick={() => setTasaAnual(valor)}
                    >
                      {valor}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Plazo en años */}
            <div>
              <label htmlFor="plazoAnios" className="flex items-center text-sm mb-2">
                <FaChartLine className="text-[#4ade80] mr-2" />
                Plazo de inversión
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="plazoAnios"
                  value={plazoAnios}
                  onChange={(e) => setPlazoAnios(validarNumero(e.target.value, 50))}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4ade80]/50"
                  min="1"
                  max="50"
                  step="1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">años</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-white/50">Horizonte temporal</div>
                <div className="flex space-x-3">
                  {[3, 5, 10, 20].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      className={`text-xs px-2 py-0.5 rounded ${
                        plazoAnios === valor ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-black/30 text-white/60'
                      }`}
                      onClick={() => setPlazoAnios(valor)}
                    >
                      {valor} años
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Frecuencia de capitalización */}
            <div>
              <label htmlFor="frecuenciaCapitalizacion" className="flex items-center text-sm mb-2">
                <FaCalendarAlt className="text-[#4ade80] mr-2" />
                Frecuencia de capitalización
              </label>
              <select
                id="frecuenciaCapitalizacion"
                value={frecuenciaCapitalizacion}
                onChange={(e) => setFrecuenciaCapitalizacion(parseInt(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#4ade80]/50 appearance-none"
              >
                <option value="1">Anual</option>
                <option value="2">Semestral</option>
                <option value="4">Trimestral</option>
                <option value="12">Mensual</option>
                <option value="365">Diaria</option>
              </select>
              <div className="mt-1 text-xs text-white/50">
                Frecuencia con la que se calculan los intereses
              </div>
            </div>
          </div>
        </div>
        
        {/* Resultados */}
        <div>
          {resultados && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-base font-medium text-[#4ade80] mb-4">Resultados Proyectados</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-4 border-t-2 border-[#4ade80]">
                  <div className="text-sm text-white/70 mb-1">Capital final</div>
                  <div className="text-xl font-medium">{formatCurrency(resultados.montoFinal)}</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border-t-2 border-[#3b82f6]">
                  <div className="text-sm text-white/70 mb-1">Total aportado</div>
                  <div className="text-xl font-medium">{formatCurrency(resultados.montoAportado)}</div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border-t-2 border-[#8b5cf6]">
                  <div className="text-sm text-white/70 mb-1">Intereses generados</div>
                  <div className="text-xl font-medium">{formatCurrency(resultados.interesesGenerados)}</div>
                </div>
              </div>
              
              {/* Porcentaje de crecimiento */}
              <div className="mb-6">
                <div className="text-sm text-white/70 mb-2">Multiplicación del capital</div>
                <div className="flex items-center">
                  <div className="text-2xl font-medium text-[#4ade80] mr-2">
                    {(resultados.montoFinal / resultados.montoAportado).toFixed(2)}x
                  </div>
                  <div className="text-sm text-white/60">
                    tu inversión total
                  </div>
                </div>
              </div>
              
              {/* Gráfico */}
              {renderGrafico()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}; 