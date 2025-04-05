/**
 * API de n8n para la comunicación con el backend
 * Este archivo simula la comunicación con n8n para propósitos de desarrollo
 */

/**
 * Envía una consulta al backend de n8n y devuelve la respuesta
 * @param query La consulta a enviar
 * @returns La respuesta del servidor
 */
export async function sendQuery(query: string): Promise<any> {
  // En un entorno real, esta función haría una llamada a la API de n8n
  // Para propósitos de desarrollo, simulamos una respuesta después de un tiempo
  console.log(`Enviando consulta a n8n: ${query}`);
  
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
 * Obtiene datos financieros desde el backend de n8n
 * @returns Datos financieros simulados para desarrollo
 */
export async function getFinancialData(): Promise<any> {
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