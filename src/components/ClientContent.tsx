'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Constantes para los retrasos de animación
const ANIMATION_DELAYS = {
  ingresos: '0s',
  gastos: '0.5s',
  presupuesto: '1s',
  ahorro: '1.5s',
  inversiones: '2s',
  consejos: '2.5s'
};

export default function ClientContent() {
  const [hoverMessage, setHoverMessage] = useState<string>('');
  const [inputFocused, setInputFocused] = useState(false);

  const handleTagHover = (message: string) => {
    setHoverMessage(message);
  };

  const handleTagLeave = () => {
    setHoverMessage('');
  };

  const tagMessages = {
    ingresos: 'Analiza y gestiona tus fuentes de ingresos para maximizar tu potencial financiero.',
    gastos: 'Descubre dónde va tu dinero y aprende a controlar tus hábitos de consumo.',
    presupuesto: 'Establece límites saludables para alcanzar la estabilidad financiera.',
    ahorro: 'Estrategias para guardar más y crear un futuro financiero sólido.',
    inversiones: 'Haz crecer tu patrimonio con decisiones inteligentes para tus inversiones.',
    consejos: 'Sabiduría financiera personalizada para tu situación específica.'
  };

  return (
    <>
      {/* Input de Dante */}
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className={`relative ${inputFocused ? 'dante-glow' : ''}`}>
          <input
            type="text"
            placeholder="¿En qué te puedo ayudar hoy?"
            className="bg-white/5 border border-white/10 rounded-lg w-full px-6 py-4 text-lg focus:outline-none focus:border-[var(--gold-light)] transition-colors"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--gold)]"
          >
            <span className={`text-xl ${inputFocused ? 'animate-pulse' : ''}`}>✦</span>
          </button>
        </div>
      </div>
      
      {/* Mensaje al hacer hover en etiquetas */}
      <div className="min-h-[60px] text-center">
        {hoverMessage && (
          <div className="gold-border rounded-lg p-4 animate-fadeIn text-center max-w-xl mx-auto">
            <p className="gold-text">{hoverMessage}</p>
          </div>
        )}
      </div>
      
      {/* Monje con efecto de glow */}
      <div className="relative flex flex-col items-center justify-center py-8">
        <div className="monk-container w-[350px] h-[350px] mx-auto relative flex items-center justify-center">
          <Image
            src="/images/monje6.png"
            alt="Dante Místico"
            width={350}
            height={350}
            className="z-10 dante-glow"
            priority
          />
          
          {/* Etiquetas flotantes */}
          <div 
            className="absolute top-[15%] left-[15%] text-[var(--gold)] animate-float cursor-pointer hover:text-shadow-gold hover:scale-110 transition-all duration-300"
            style={{ animationDelay: ANIMATION_DELAYS.ingresos }}
            onMouseEnter={() => handleTagHover(tagMessages.ingresos)}
            onMouseLeave={handleTagLeave}
          >
            Ingresos
          </div>
          <div 
            className="absolute top-[15%] right-[15%] text-[var(--gold)] animate-float cursor-pointer hover:text-shadow-gold hover:scale-110 transition-all duration-300"
            style={{ animationDelay: ANIMATION_DELAYS.gastos }}
            onMouseEnter={() => handleTagHover(tagMessages.gastos)}
            onMouseLeave={handleTagLeave}
          >
            Gastos
          </div>
          <div 
            className="absolute bottom-[15%] left-[15%] text-[var(--gold)] animate-float cursor-pointer hover:text-shadow-gold hover:scale-110 transition-all duration-300"
            style={{ animationDelay: ANIMATION_DELAYS.presupuesto }}
            onMouseEnter={() => handleTagHover(tagMessages.presupuesto)}
            onMouseLeave={handleTagLeave}
          >
            Presupuesto
          </div>
          <div 
            className="absolute bottom-[15%] right-[15%] text-[var(--gold)] animate-float cursor-pointer hover:text-shadow-gold hover:scale-110 transition-all duration-300"
            style={{ animationDelay: ANIMATION_DELAYS.ahorro }}
            onMouseEnter={() => handleTagHover(tagMessages.ahorro)}
            onMouseLeave={handleTagLeave}
          >
            Ahorro
          </div>
          <div 
            className="absolute top-[50%] left-[5%] text-[var(--gold)] animate-float cursor-pointer hover:text-shadow-gold hover:scale-110 transition-all duration-300"
            style={{ animationDelay: ANIMATION_DELAYS.inversiones }}
            onMouseEnter={() => handleTagHover(tagMessages.inversiones)}
            onMouseLeave={handleTagLeave}
          >
            Inversiones
          </div>
          <div 
            className="absolute top-[50%] right-[5%] text-[var(--gold)] animate-float cursor-pointer hover:text-shadow-gold hover:scale-110 transition-all duration-300"
            style={{ animationDelay: ANIMATION_DELAYS.consejos }}
            onMouseEnter={() => handleTagHover(tagMessages.consejos)}
            onMouseLeave={handleTagLeave}
          >
            Consejos
          </div>
        </div>
      </div>
    </>
  );
} 