"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
  
  const renderNode = (node: DebtNode, depth: number = 0, parentWidth: number = 100) => {
    const nodeWidth = parentWidth * (node.amount / data.amount);
    const isHovered = hoveredNode === node.id;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="flex flex-col mb-2">
        <motion.div 
          className={`rounded-md p-3 mb-1 ${isHovered ? 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' : ''}`}
          style={{ 
            width: `${parentWidth}%`, 
            backgroundColor: node.color,
            marginLeft: `${depth * 20}px`
          }}
          whileHover={{ scale: 1.02 }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className="flex justify-between">
            <div>
              <span className="font-medium">{node.name}</span>
              {hasChildren && <span className="ml-2 text-xs opacity-70">({node.children?.length})</span>}
            </div>
            <div className="flex items-center gap-2">
              <span>${node.amount.toLocaleString()}</span>
              <span className="text-xs opacity-70">({node.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        </motion.div>
        
        {hasChildren && (
          <div className="pl-6">
            {node.children?.map(child => renderNode(child, depth + 1, nodeWidth))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg p-4 mb-6">
      <h3 className="text-lg text-[#eab308] mb-4">Distribución de Deuda</h3>
      <div className="overflow-x-auto">
        {renderNode(data)}
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