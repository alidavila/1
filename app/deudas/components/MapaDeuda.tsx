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
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root': true, // El nodo raíz siempre está expandido por defecto
  });
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
    const isExpanded = expandedNodes[node.id] || depth === 0; // Forzar expansión para el nodo raíz
    
    return (
      <div key={node.id} className="mb-2">
        <div 
          className={`p-3 rounded-md flex items-center transition-all duration-300 ${isHovered ? 'shadow-[0_0_10px_rgba(234,179,8,0.2)]' : ''}`}
          style={{ 
            backgroundColor: node.color,
            marginLeft: `${depth * 16}px`,
            width: depth === 0 ? '100%' : 'auto',
            cursor: hasChildren ? 'pointer' : 'default'
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
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="font-medium">
              {node.name}
              {hasChildren && (
                <span className="ml-2 text-xs opacity-70">
                  ({node.children?.length})
                </span>
              )}
            </div>
            
            {/* Valores y porcentaje */}
            <div className="flex items-center gap-2">
              <span>${node.amount.toLocaleString()}</span>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
                {node.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Nodos hijos - solo se renderizan si están expandidos */}
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 pl-4 border-l border-dashed border-white/20">
            {node.children?.map(child => renderNode(child, depth + 1, parentWidth))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-[#eab308] flex items-center">
          Distribución de Deuda
          <button 
            className="ml-2 text-white/50 hover:text-white/80 transition-colors text-sm"
            onClick={() => setShowInfo(!showInfo)}
          >
            <FaInfoCircle />
          </button>
        </h3>
        
        <div className="text-sm text-white/60">
          Total: ${data.amount.toLocaleString()}
        </div>
      </div>
      
      {/* Información de ayuda */}
      {showInfo && (
        <div className="mb-4 p-3 bg-black/30 rounded text-sm text-white/70">
          <p>Este mapa muestra la distribución jerárquica de tus deudas. Haz clic en cada categoría para expandir/contraer y ver más detalles.</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        {renderNode(data)}
      </div>
      
      {/* Leyenda de colores simple */}
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
            <div>{category.name}</div>
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
  
  // Colores para los tipos
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