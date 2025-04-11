'use client';

import { useState } from 'react';
import Image from 'next/image';
import FloatingTags from './FloatingTags';
import { EtiquetaKey } from '@/types';

const MonkDisplay = () => {
  const [hoverMessage, setHoverMessage] = useState<string>('');

  const handleTagHover = (tag: EtiquetaKey, message: string) => {
    setHoverMessage(message);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Mensaje dinámico sobre el monje */}
      <div className="mb-6 min-h-[60px] text-center">
        {hoverMessage && (
          <div className="gold-border rounded-lg p-4 animate-fadeIn text-center max-w-xl mx-auto">
            <p className="gold-text">{hoverMessage}</p>
          </div>
        )}
      </div>
      
      {/* Contenedor del monje y etiquetas */}
      <div className="monk-container w-[350px] h-[350px] mx-auto my-8 relative">
        <Image
          src="/images/monk.png"
          alt="Dante Místico"
          width={350}
          height={350}
          className="z-10"
          priority
        />
        
        {/* Etiquetas flotantes alrededor del monje */}
        <FloatingTags onTagHover={handleTagHover} />
      </div>
    </div>
  );
};

export default MonkDisplay; 