/**
 * API de n8n para la comunicación con el backend
 * Este archivo simula la comunicación con n8n para propósitos de desarrollo
 */

/**
 * Obtiene datos financieros desde el backend de n8n
 * @returns Datos financieros simulados para desarrollo
 */
export async function getFinancialData(): Promise<any> {
  try {
    // Intentar usar la API real si está configurada
    if (process.env.NEXT_PUBLIC_N8N_URL) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-financial-data`);
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (error) {
    console.log('Usando datos simulados para desarrollo');
  }
  
  // Simulación de tiempo de respuesta del servidor
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Devolver datos financieros simulados
  return {
    patrimonio: {
      activos: 125000,
      pasivos: 45000,
      patrimonioNeto: 80000,
      tendenciaPatrimonio: [65000, 68000, 72000, 75000, 80000],
      distribucionActivos: {
        efectivo: 15000,
        inversiones: 35000,
        bienes: 60000,
        otrosActivos: 15000
      },
      distribucionPasivos: {
        hipoteca: 30000,
        prestamos: 10000,
        tarjetas: 5000,
        otrosPasivos: 0
      }
    },
    flujoCaja: {
      ingresosMensuales: 8500,
      gastosMensuales: 5500,
      ahorroMensual: 3000,
      tendenciaIngresos: [8000, 8200, 8300, 8500, 8500],
      tendenciaGastos: [5200, 5400, 5300, 5600, 5500],
      distribucionIngresos: {
        salario: 7500,
        inversiones: 500,
        otros: 500
      },
      distribucionGastos: {
        vivienda: 2000,
        alimentacion: 1200,
        transporte: 600,
        servicios: 800,
        ocio: 400,
        otros: 500
      }
    }
  };
}

/**
 * Envía una consulta al backend de n8n y devuelve la respuesta
 * @param query La consulta a enviar
 * @returns La respuesta del servidor
 */
export async function sendQuery(query: string): Promise<any> {
  try {
    // Intentar usar la API real si está configurada
    if (process.env.NEXT_PUBLIC_N8N_URL) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (error) {
    console.log('Usando respuesta simulada para desarrollo');
  }
  
  // Simulación de tiempo de respuesta del servidor
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Devolver una respuesta simulada
  return {
    success: true,
    query,
    response: `Respuesta simulada para: ${query}`,
    timestamp: new Date().toISOString()
  };
}

/**
 * Actualiza un objetivo financiero
 * @param goalData Datos del objetivo a actualizar
 * @returns Respuesta del servidor
 */
export async function updateFinancialGoal(goalData: any) {
  try {
    // Intentar usar la API real si está configurada
    if (process.env.NEXT_PUBLIC_N8N_URL) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-update-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (error) {
    console.log('Usando respuesta simulada para desarrollo');
  }
  
  // Simulación de tiempo de respuesta del servidor
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Devolver una respuesta simulada
  return {
    success: true,
    message: "Objetivo actualizado correctamente (simulado)",
    goal: { ...goalData, id: goalData.id || Math.random().toString(36).substr(2, 9) }
  };
}

/**
 * Registra una nueva inversión
 * @param investmentData Datos de la inversión a registrar
 * @returns Respuesta del servidor
 */
export async function registerInvestment(investmentData: any) {
  try {
    // Intentar usar la API real si está configurada
    if (process.env.NEXT_PUBLIC_N8N_URL) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-register-investment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      });
      
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (error) {
    console.log('Usando respuesta simulada para desarrollo');
  }
  
  // Simulación de tiempo de respuesta del servidor
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Devolver una respuesta simulada
  return {
    success: true,
    message: "Inversión registrada correctamente (simulado)",
    investment: { ...investmentData, id: Math.random().toString(36).substr(2, 9) }
  };
} 