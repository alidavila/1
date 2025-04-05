'use client';

import { useState } from 'react';
import { sendQuery } from '../lib/n8n-api';

interface DanteInputProps {
  onResponseReceived?: (response: any) => void;
}

const DanteInput = ({ onResponseReceived }: DanteInputProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const response = await sendQuery(query);
      
      if (onResponseReceived) {
        onResponseReceived(response);
      }
      
      setQuery('');
    } catch (error) {
      console.error('Error al enviar consulta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿En qué te puedo ayudar hoy?"
          className="input-box w-full px-6 py-4 text-lg focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 gold-text"
        >
          {loading ? (
            <span className="animate-pulse">✨</span>
          ) : (
            <span className="text-xl">✦</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default DanteInput; 