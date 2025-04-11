import React from 'react';

export default function DashboardContent() {
  return (
    <>
      {/* Dashboard financiero */}
      <div className="w-full max-w-4xl mx-auto p-6 gold-border rounded-lg backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-center gold-text mb-6">Dashboard Financiero</h2>
        
        {/* Patrimonio neto */}
        <div className="mb-8">
          <h3 className="text-xl mb-2">Patrimonio Neto</h3>
          <div className="flex items-center justify-between p-4 dashboard-card">
            <div>
              <p className="text-lg">$25,000</p>
              <p className="text-sm text-[var(--green)]">Patrimonio positivo</p>
            </div>
            <div className="w-4 h-4 rounded-full bg-[var(--green)]"></div>
          </div>
        </div>
        
        {/* Flujo de caja simple */}
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
                <tr className="border-b border-white/5">
                  <td className="py-3">Enero</td>
                  <td className="py-3 text-right text-[var(--blue)]">$5,000</td>
                  <td className="py-3 text-right text-[var(--red)]">$4,200</td>
                  <td className="py-3 text-right font-medium text-[var(--green)]">$800</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Febrero</td>
                  <td className="py-3 text-right text-[var(--blue)]">$5,000</td>
                  <td className="py-3 text-right text-[var(--red)]">$4,500</td>
                  <td className="py-3 text-right font-medium text-[var(--green)]">$500</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Marzo</td>
                  <td className="py-3 text-right text-[var(--blue)]">$5,200</td>
                  <td className="py-3 text-right text-[var(--red)]">$4,100</td>
                  <td className="py-3 text-right font-medium text-[var(--green)]">$1,100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Botones de navegación */}
      <div className="w-full max-w-4xl mx-auto my-8 px-4">
        <div className="flex flex-wrap justify-center gap-3">
          {['Calendario', 'Presupuesto', 'Análisis', 'Cuentas', 'Deudas', 'Objetivos', 'Inversiones'].map((option) => (
            <button
              key={option}
              className="nav-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
} 