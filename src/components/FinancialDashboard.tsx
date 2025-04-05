'use client';

import React from 'react';

import { useEffect, useState } from 'react';
import { getFinancialData } from '../lib/n8n-api';
import { FinancialData, PatrimonioData, FlujoCajaData } from '../../types';

const FinancialDashboard = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        const data = await getFinancialData();
        setFinancialData(data);
      } catch (error) {
        console.error('Error al cargar datos financieros:', error);
      } finally {
        setLoading(false);
      }
    };

    // Datos de ejemplo para desarrollo
    // En producción, usar loadFinancialData()
    setFinancialData({
      patrimonio: {
        total: 25000,
        estado: 'positivo'
      },
      flujoCaja: [
        { mes: 'Enero', ingresos: 5000, egresos: 4200, resultado: 800 },
        { mes: 'Febrero', ingresos: 5000, egresos: 4500, resultado: 500 },
        { mes: 'Marzo', ingresos: 5200, egresos: 4100, resultado: 1100 }
      ],
      consejos: [
        'Considera invertir en un fondo de emergencia primero',
        'Limita tus gastos en entretenimiento al 10% de tus ingresos',
        'Automatiza tus ahorros para mejorar tu disciplina financiera'
      ],
      etiquetas: {
        ingresos: 'Analiza tus fuentes de ingresos',
        gastos: 'Descubre dónde va tu dinero',
        presupuesto: 'Establece límites para tus finanzas',
        ahorro: 'Estrategias para guardar más',
        inversiones: 'Haz crecer tu patrimonio',
        consejos: 'Sabiduría financiera personalizada'
      }
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse text-[var(--gold)]">Cargando sabiduría financiera...</div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <div className="text-[var(--red)]">La sabiduría está en silencio por ahora...</div>
      </div>
    );
  }

  const { patrimonio, flujoCaja } = financialData;

  // Función para obtener el color del estado del patrimonio
  const getPatrimonioColor = (estado: string) => {
    switch (estado) {
      case 'positivo':
        return 'var(--green)';
      case 'equilibrio':
        return 'var(--purple)';
      case 'negativo':
        return 'var(--red)';
      default:
        return 'var(--text-primary)';
    }
  };

  // Función para formatear montos a formato de dinero
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 gold-border rounded-lg backdrop-blur-sm">
      <h2 className="text-2xl font-semibold text-center gold-text mb-6">Dashboard Financiero</h2>
      
      {/* Patrimonio neto */}
      <div className="mb-8">
        <h3 className="text-xl mb-2">Patrimonio Neto</h3>
        <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
          <div>
            <p className="text-lg">{formatCurrency(patrimonio.total)}</p>
            <p 
              className="text-sm" 
              style={{ color: getPatrimonioColor(patrimonio.estado) }}
            >
              {patrimonio.estado === 'positivo' && 'Patrimonio positivo'}
              {patrimonio.estado === 'equilibrio' && 'En equilibrio'}
              {patrimonio.estado === 'negativo' && 'Patrimonio negativo'}
            </p>
          </div>
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: getPatrimonioColor(patrimonio.estado) }}
          ></div>
        </div>
      </div>
      
      {/* Flujo de caja */}
      <div>
        <h3 className="text-xl mb-2">Flujo de Caja (últimos 3 meses)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 text-left">Mes</th>
                <th className="py-2 text-right">Ingresos</th>
                <th className="py-2 text-right">Egresos</th>
                <th className="py-2 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {flujoCaja.map((mes, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3">{mes.mes}</td>
                  <td className="py-3 text-right text-[var(--blue)]">{formatCurrency(mes.ingresos)}</td>
                  <td className="py-3 text-right text-[var(--red)]">{formatCurrency(mes.egresos)}</td>
                  <td 
                    className="py-3 text-right font-medium"
                    style={{ 
                      color: mes.resultado >= 0 ? 'var(--green)' : 'var(--red)' 
                    }}
                  >
                    {formatCurrency(mes.resultado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard; 