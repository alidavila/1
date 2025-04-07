"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAngleRight, FaAngleDown, FaInfoCircle } from 'react-icons/fa';

type DebtNode = {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  children?: DebtNode[];
  color: string;
};

type MapaDeudasProps = {
  data: DebtNode;
};

export const MapaDeudas: React.FC<MapaDeudasProps> = ({ data }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [showInfo, setShowInfo] = useState<boolean>(false);
  
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  const renderNode = (node: DebtNode, depth: number = 0, parentWidth: number = 100) => {
    const isHovered = hoveredNode === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];
    const nodeWidthPercentage = parentWidth * (node.amount / data.amount);
    const minVisualWidth = Math.max(nodeWidthPercentage, 30); // Asegurar visibilidad mínima
    
    return (
      <div key={node.id} className="mb-2">
        <motion.div 
          className={`flex flex-col rounded-md overflow-hidden ${isHovered ? 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Encabezado de la deuda */}
          <div 
            className={`p-3 flex items-center cursor-pointer transition-all duration-300`}
            style={{ 
              backgroundColor: node.color,
              marginLeft: `${depth * 16}px`,
              width: depth === 0 ? '100%' : `${minVisualWidth}%`,
              borderLeft: depth > 0 ? `4px solid ${node.color.replace(/[^,]+(?=\))/, '1')}` : 'none',
            }}
            onClick={() => hasChildren && toggleNode(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Icono expandir/colapsar */}
            {hasChildren && (
              <div className="mr-2 text-white/80">
                {isExpanded ? <FaAngleDown /> : <FaAngleRight />}
              </div>
            )}
            
            {/* Información de la deuda */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <div className="font-medium flex items-center">
                {node.name}
                {hasChildren && (
                  <span className="ml-2 text-xs opacity-70 bg-black/20 px-1.5 py-0.5 rounded-full">
                    {node.children?.length}
                  </span>
                )}
              </div>
              
              {/* Valores y porcentaje */}
              <div className="flex items-center gap-3 text-white/90">
                <span className="font-mono">${node.amount.toLocaleString()}</span>
                <div className="flex items-center justify-center min-w-[60px] px-2 py-0.5 rounded-full bg-black/20 text-xs">
                  {node.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso visual */}
          {depth === 0 && (
            <div className="h-1 bg-black/30 w-full">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${node.percentage}%`,
                  backgroundColor: node.color.replace(/[^,]+(?=\))/, '1')
                }}
              ></div>
            </div>
          )}
        </motion.div>
        
        {/* Nodos hijos */}
        {hasChildren && isExpanded && (
          <motion.div 
            className="ml-4 mt-2 pl-4 border-l-2 border-dashed"
            style={{ borderLeftColor: node.color.replace(/[^,]+(?=\))/, '0.4') }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {node.children?.map(child => renderNode(child, depth + 1, nodeWidthPercentage))}
          </motion.div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-[#eab308] font-light flex items-center">
          Distribución de Deuda
          <button 
            className="ml-2 text-white/50 hover:text-white/80 transition-colors text-sm"
            onClick={() => setShowInfo(!showInfo)}
          >
            <FaInfoCircle />
          </button>
        </h3>
        
        <div className="text-xs text-white/60">
          Total: ${data.amount.toLocaleString()}
        </div>
      </div>
      
      {/* Información de ayuda */}
      {showInfo && (
        <motion.div 
          className="mb-4 p-3 bg-black/30 rounded border border-white/10 text-sm text-white/70"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>Este mapa muestra la distribución jerárquica de tus deudas. Haz clic en cada categoría para expandir/contraer y ver más detalles. El ancho representa visualmente la proporción de cada deuda.</p>
        </motion.div>
      )}
      
      <div className="overflow-x-auto pb-2">
        {renderNode(data)}
      </div>
      
      {/* Leyenda de colores */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.children?.map(category => (
          <div 
            key={category.id} 
            className="flex items-center gap-2 text-xs"
            onClick={() => toggleNode(category.id)}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="flex-1 truncate">{category.name}</div>
            <div className="text-white/70">{category.percentage.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const generarMapaDeuda = (deudas: any[]) => {
  // Agrupar por tipo
  const tipoMap = new Map<string, any[]>();
  deudas.forEach(deuda => {
    if (!tipoMap.has(deuda.tipo)) {
      tipoMap.set(deuda.tipo, []);
    }
    tipoMap.get(deuda.tipo)?.push(deuda);
  });
  
  // Colores para los tipos - Paleta más armónica
  const colores = {
    "Préstamo Personal": "rgba(246, 173, 85, 0.7)",
    "Tarjeta de Crédito": "rgba(243, 128, 128, 0.7)",
    "Hipoteca": "rgba(129, 140, 248, 0.7)",
    "Préstamo Auto": "rgba(74, 222, 128, 0.7)",
    "Otros": "rgba(167, 139, 250, 0.7)"
  };
  
  // Calcular total
  const totalDeuda = deudas.reduce((sum, deuda) => sum + deuda.saldoActual, 0);
  
  // Construir jerarquía
  const root: DebtNode = {
    id: 'root',
    name: 'Deuda Total',
    amount: totalDeuda,
    percentage: 100,
    color: 'rgba(234, 179, 8, 0.5)',
    children: []
  };
  
  // Añadir nodos por tipo
  Array.from(tipoMap.entries()).forEach(([tipo, deudasPorTipo]) => {
    const tipoAmount = deudasPorTipo.reduce((sum, deuda) => sum + deuda.saldoActual, 0);
    const tipoPercentage = (tipoAmount / totalDeuda) * 100;
    
    const tipoNode: DebtNode = {
      id: `tipo-${tipo}`,
      name: tipo,
      amount: tipoAmount,
      percentage: tipoPercentage,
      color: colores[tipo as keyof typeof colores] || 'rgba(167, 139, 250, 0.7)',
      children: []
    };
    
    // Añadir deudas individuales
    deudasPorTipo.forEach(deuda => {
      const percentageOfType = (deuda.saldoActual / tipoAmount) * 100;
      tipoNode.children?.push({
        id: `deuda-${deuda.id}`,
        name: deuda.acreedor,
        amount: deuda.saldoActual,
        percentage: (deuda.saldoActual / totalDeuda) * 100,
        color: colores[tipo as keyof typeof colores] ?
          colores[tipo as keyof typeof colores].replace('0.7', '0.5') :
          'rgba(167, 139, 250, 0.5)',
      });
    });
    
    root.children?.push(tipoNode);
  });
  
  return root;
}; 