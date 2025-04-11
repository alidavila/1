'use client';

import { useState, useEffect } from 'react';
import { EtiquetaKey } from '@/types';

interface FloatingTagsProps {
  onTagHover: (tag: EtiquetaKey, message: string) => void;
}

const FloatingTags = ({ onTagHover }: FloatingTagsProps) => {
  const [messages, setMessages] = useState<Record<EtiquetaKey, string>>({
    ingresos: 'Analiza tus fuentes de ingresos',
    gastos: 'Descubre dónde va tu dinero',
    presupuesto: 'Establece límites para tus finanzas',
    ahorro: 'Estrategias para guardar más',
    inversiones: 'Haz crecer tu patrimonio',
    consejos: 'Sabiduría financiera personalizada',
  });

  useEffect(() => {
    // Aquí podríamos cargar mensajes dinámicos desde la API
    const loadTagMessages = async () => {
      try {
        // En futuras implementaciones, cargar desde n8n
        // const data = await getFinancialData();
        // setMessages(data.etiquetas);
      } catch (error) {
        console.error('Error al cargar mensajes de etiquetas:', error);
      }
    };

    loadTagMessages();
  }, []);

  // Posiciones de cada etiqueta alrededor del monje
  const tagPositions: Record<EtiquetaKey, { top?: string; bottom?: string; left?: string; right?: string }> = {
    ingresos: { top: '15%', left: '15%' },
    gastos: { top: '15%', right: '15%' },
    presupuesto: { bottom: '15%', left: '15%' },
    ahorro: { bottom: '15%', right: '15%' },
    inversiones: { top: '50%', left: '5%' },
    consejos: { top: '50%', right: '5%' },
  };

  return (
    <div className="relative w-full h-full">
      {Object.entries(tagPositions).map(([tag, position]) => (
        <div
          key={tag}
          className="tag-floating"
          style={{
            ...position,
            animation: `float 3s ease-in-out infinite ${Math.random() * 2}s, pulse 4s ease-in-out infinite ${Math.random() * 2}s`,
          }}
          onMouseEnter={() => onTagHover(tag as EtiquetaKey, messages[tag as EtiquetaKey])}
        >
          {tag.charAt(0).toUpperCase() + tag.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default FloatingTags; 