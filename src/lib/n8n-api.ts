export async function getFinancialData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-financial-data`);
  if (!res.ok) throw new Error('Error al obtener datos financieros');
  return await res.json();
}

export async function sendQuery(query: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  if (!res.ok) throw new Error('Error al procesar la consulta');
  return await res.json();
}

export async function updateFinancialGoal(goalData: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-update-goal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goalData),
  });
  
  if (!res.ok) throw new Error('Error al actualizar objetivo financiero');
  return await res.json();
}

export async function registerInvestment(investmentData: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_N8N_URL}/webhook/dante-register-investment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(investmentData),
  });
  
  if (!res.ok) throw new Error('Error al registrar inversión');
  return await res.json();
} 