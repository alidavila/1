"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Inversion } from '@/types';

interface GraficoEvolucionProps {
  inversiones: Inversion[];
  formatCurrency: (amount: number) => string;
}

export const GraficoEvolucion: React.FC<GraficoEvolucionProps> = ({
  inversiones,
  formatCurrency
}) => {
  const [selectedInversion, setSelectedInversion] = useState<string | null>(null);
  
  // Colores para cada tipo de inversión
  const getColorByType = (tipo: string) => {
    switch (tipo) {
      case 'cripto': return '#f59e0b';
      case 'accion': return '#3b82f6';
      case 'etf': return '#8b5cf6';
      case 'fondo': return '#14b8a6';
      default: return '#4ade80';
    }
  };
  
  // Filtrar inversiones con historial
  const inversionesConHistorial = inversiones.filter(inv => 
    inv.historialValores && inv.historialValores.length > 0
  );
  
  // Si no hay inversiones con historial, mostrar mensaje
  if (inversionesConHistorial.length === 0) {
    return (
      <div className="bg-black/20 border border-white/10 rounded-lg p-6 text-center">
        <p className="text-white/70">No hay suficientes datos históricos para mostrar la evolución.</p>
      </div>
    );
  }
  
  // Obtener todas las fechas únicas de los historiales ordenadas cronológicamente
  const allDates = inversionesConHistorial
    .flatMap(inv => inv.historialValores!.map(entry => entry.fecha))
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  // Encontrar valor mínimo y máximo para escalar el gráfico
  const allValues = inversionesConHistorial.flatMap(inv => {
    if (inv.tipo === 'cripto') {
      // Para cripto, considerar el valor según la cantidad
      const cantidadTokens = inv.montoInvertido / inv.valorCompra;
      return inv.historialValores!.map(entry => entry.valor * cantidadTokens);
    }
    
    // Para otros activos, el valor es una proporción del monto invertido
    const valorInicial = inv.historialValores![0].valor;
    return inv.historialValores!.map(entry => {
      const proporcion = entry.valor / valorInicial;
      return inv.montoInvertido * proporcion;
    });
  });
  
  const minValue = Math.min(...allValues) * 0.95;
  const maxValue = Math.max(...allValues) * 1.05;
  const range = maxValue - minValue;
  
  // Altura del gráfico
  const graphHeight = 300;
  
  // Renderizar una línea para cada inversión
  const renderLines = () => {
    return inversionesConHistorial.map((inv) => {
      // Para cada inversión, transformar el historial en puntos del gráfico
      const points = inv.historialValores!.map((entry, index, array) => {
        // Encontrar la posición x basada en el índice entre todas las fechas
        const dateIndex = allDates.indexOf(entry.fecha);
        const x = (dateIndex / (allDates.length - 1)) * 100;
        
        // Calcular el valor normalizado para la posición y
        let valor;
        if (inv.tipo === 'cripto') {
          const cantidadTokens = inv.montoInvertido / inv.valorCompra;
          valor = entry.valor * cantidadTokens;
        } else {
          const valorInicial = array[0].valor;
          const proporcion = entry.valor / valorInicial;
          valor = inv.montoInvertido * proporcion;
        }
        
        const normalizedValue = (valor - minValue) / range;
        const y = graphHeight - (normalizedValue * graphHeight);
        
        return `${x},${y}`;
      }).join(' ');
      
      const color = getColorByType(inv.tipo);
      const isSelected = selectedInversion === inv.id || selectedInversion === null;
      
      return (
        <g key={inv.id} opacity={isSelected ? 1 : 0.3}>
          {/* Línea de tendencia */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          
          {/* Círculos en los puntos de datos */}
          {inv.historialValores!.map((entry, index) => {
            const dateIndex = allDates.indexOf(entry.fecha);
            const x = (dateIndex / (allDates.length - 1)) * 100;
            
            let valor;
            if (inv.tipo === 'cripto') {
              const cantidadTokens = inv.montoInvertido / inv.valorCompra;
              valor = entry.valor * cantidadTokens;
            } else {
              const valorInicial = inv.historialValores![0].valor;
              const proporcion = entry.valor / valorInicial;
              valor = inv.montoInvertido * proporcion;
            }
            
            const normalizedValue = (valor - minValue) / range;
            const y = graphHeight - (normalizedValue * graphHeight);
            
            return (
              <motion.circle
                key={`${inv.id}-${index}`}
                cx={x + '%'}
                cy={y}
                r={4}
                fill={color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
              />
            );
          })}
        </g>
      );
    });
  };
  
  // Renderizar el eje X con fechas
  const renderXAxis = () => {
    const displayedDates = allDates.filter((_, index) => 
      index === 0 || index === allDates.length - 1 || index % Math.ceil(allDates.length / 5) === 0
    );
    
    return displayedDates.map((date, index) => {
      const position = (allDates.indexOf(date) / (allDates.length - 1)) * 100;
      
      return (
        <div 
          key={`date-${index}`} 
          className="absolute transform -translate-x-1/2"
          style={{ left: `${position}%`, bottom: '-25px' }}
        >
          <div className="text-xs text-white/60">
            {new Date(date).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })}
          </div>
        </div>
      );
    });
  };
  
  // Renderizar el eje Y con valores
  const renderYAxis = () => {
    // Generar 5 puntos equidistantes para el eje Y
    const steps = 5;
    return Array.from({ length: steps }).map((_, index) => {
      const value = minValue + (range * (index / (steps - 1)));
      const position = graphHeight - ((value - minValue) / range) * graphHeight;
      
      return (
        <div 
          key={`value-${index}`} 
          className="absolute transform -translate-y-1/2"
          style={{ left: '-5px', top: `${position}px` }}
        >
          <div className="text-xs text-white/60 text-right w-20 pr-2">
            {formatCurrency(value)}
          </div>
          <div className="absolute left-[78px] top-1/2 w-full h-px bg-white/10 -translate-y-1/2"></div>
        </div>
      );
    });
  };
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-6">
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          className={`px-3 py-1 rounded-full text-xs ${
            selectedInversion === null ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-black/30 text-white/60'
          }`}
          onClick={() => setSelectedInversion(null)}
        >
          Todas
        </button>
        
        {inversionesConHistorial.map(inv => (
          <button
            key={inv.id}
            className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
              selectedInversion === inv.id 
                ? `bg-[${getColorByType(inv.tipo)}]/20 text-[${getColorByType(inv.tipo)}]` 
                : 'bg-black/30 text-white/60'
            }`}
            style={{ 
              backgroundColor: selectedInversion === inv.id ? `${getColorByType(inv.tipo)}20` : '',
              color: selectedInversion === inv.id ? getColorByType(inv.tipo) : '' 
            }}
            onClick={() => setSelectedInversion(inv.id === selectedInversion ? null : inv.id)}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getColorByType(inv.tipo) }}
            ></span>
            {inv.nombre}
          </button>
        ))}
      </div>
      
      <div className="relative h-[350px] pt-6">
        {/* Eje Y con valores */}
        <div className="absolute top-0 left-0 h-[300px] w-20">
          {renderYAxis()}
        </div>
        
        {/* Área del gráfico */}
        <div className="relative ml-20 h-[300px]">
          <svg width="100%" height="100%" viewBox={`0 0 100 ${graphHeight}`} preserveAspectRatio="none">
            {renderLines()}
          </svg>
          
          {/* Eje X con fechas */}
          <div className="relative h-6">
            {renderXAxis()}
          </div>
        </div>
      </div>
      
      {/* Leyenda y estadísticas */}
      <div className="mt-8 border-t border-white/10 pt-4">
        <h4 className="text-sm font-medium mb-3">Rendimiento desde compra</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inversionesConHistorial
            .filter(inv => selectedInversion === null || selectedInversion === inv.id)
            .map(inv => {
              const primerValor = inv.historialValores![0].valor;
              const ultimoValor = inv.historialValores![inv.historialValores!.length - 1].valor;
              const cambioPorc = ((ultimoValor - primerValor) / primerValor) * 100;
              
              return (
                <div 
                  key={inv.id}
                  className="bg-black/30 rounded-lg p-3 border-l-2"
                  style={{ borderLeftColor: getColorByType(inv.tipo) }}
                >
                  <div className="text-sm font-medium mb-1">{inv.nombre}</div>
                  <div className={`text-lg font-medium ${cambioPorc >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {cambioPorc >= 0 ? '+' : ''}{cambioPorc.toFixed(2)}%
                  </div>
                  <div className="text-xs text-white/60">
                    {formatCurrency(primerValor)} → {formatCurrency(ultimoValor)}
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
}; 