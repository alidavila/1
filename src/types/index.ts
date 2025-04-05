// Tipos para los datos financieros

export interface FinancialData {
  patrimonio: PatrimonioData;
  flujoCaja: FlujoCajaData[];
  consejos: string[];
  etiquetas: Record<EtiquetaKey, string>;
}

export interface PatrimonioData {
  total: number;
  estado: 'negativo' | 'equilibrio' | 'positivo';
}

export interface FlujoCajaData {
  mes: string;
  ingresos: number;
  egresos: number;
  resultado: number;
}

export type EtiquetaKey = 'ingresos' | 'gastos' | 'presupuesto' | 'ahorro' | 'inversiones' | 'consejos';

// Tipos para objetivos financieros
export type ObjetivoCategoria = 
  | 'ahorro_emergencia' 
  | 'comprar_carro' 
  | 'comprar_casa' 
  | 'viaje' 
  | 'pagar_deudas' 
  | 'capital_negocio' 
  | 'fondo_inversion';

export interface Objetivo {
  id: string;
  nombre: string;
  categoria: ObjetivoCategoria;
  valorMeta: number;
  valorActual: number;
  montoSugerido: number;
  fechaEstimada: string;
  prioridad: number;
  fechaCreacion: string;
  completado: boolean;
  fechaCompletado?: string;
  tiempoCompletado?: number; // en días
}

// Tipos para inversiones
export type TipoActivo = 
  | 'cripto'
  | 'accion'
  | 'etf'
  | 'fondo';

export interface ValorHistorico {
  fecha: string;
  valor: number;
}

export interface Inversion {
  id: string;
  tipo: string;
  nombre: string;
  valorCompra: number;
  fechaCompra: string;
  montoInvertido: number;
  valorActual: number;
  rentabilidad: number;
  gananciaOPerdida: number;
  historialValores?: ValorHistorico[];
}

// Tipos para deudas
export type TipoDeuda = 'tdc' | 'prestamo' | 'credito' | 'otro';

export interface Deuda {
  id: string;
  acreedor: string;
  tipo: TipoDeuda;
  saldoActual: number;
  cuotaMensual: number;
  plazoTotal: number; // en meses
  plazoRestante: number; // en meses
  tasaInteres: number;
  fechaInicio: string;
}

// Tipos para cuentas
export type TipoCuenta = 'corriente' | 'ahorro' | 'digital' | 'ewallet';

export interface Cuenta {
  id: string;
  nombre: string;
  tipo: TipoCuenta;
  saldo: number;
  ultimaActualizacion: string;
} 