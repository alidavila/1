// Tipos para el módulo de Calendario
export interface Evento {
  id: string;
  titulo: string;
  monto: number;
  fecha: Date;
  categoria: string;
  descripcion?: string;
  completado: boolean;
  recurrente: boolean;
  periodicidad?: 'semanal' | 'mensual' | 'trimestral' | 'anual';
  recordatorio?: Date;
  color?: string;
}

// Tipos para el módulo de Inversiones
export type TipoActivo = 'cripto' | 'accion' | 'etf' | 'fondo';

export interface ValorHistorico {
  fecha: string;
  valor: number;
}

export interface Inversion {
  id: string;
  tipo: TipoActivo;
  nombre: string;
  valorCompra: number;
  fechaCompra: string;
  montoInvertido: number;
  valorActual: number;
  rentabilidad: number;
  gananciaOPerdida: number;
  historialValores?: ValorHistorico[];
}

// Tipos para el módulo de Objetivos
export type ObjetivoCategoria = 
  'ahorro_emergencia' | 
  'viaje' | 
  'comprar_carro' | 
  'comprar_casa' | 
  'pagar_deudas' | 
  'educacion' | 
  'retiro' | 
  'capital_negocio' |
  'fondo_inversion' |
  'otro';

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
  tiempoCompletado?: number;
}

// Tipos para el módulo de Análisis
export interface Transaccion {
  id: number;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

export interface CategoriaGasto {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DatosAnalisis {
  ingresos: number[];
  gastos: number[];
  meses: string[];
}

export interface PreguntaAnalisis {
  id: number;
  pregunta: string;
  respuesta: string;
}

export interface Deuda {
  id: number;
  acreedor: string;
  tipo: string;
  saldoInicial: number;
  saldoActual: number;
  cuotaMensual: number;
  plazoTotal: number;
  plazoRestante: number;
  tasaInteres: number;
}

// Tipos para el módulo de Inventario
export interface Item {
  id: string;
  nombre: string;
  categoria: string;
  valorCompra: number;
  valorActual: number;
  fechaCompra: string;
  ubicacion: string;
  estado: 'excelente' | 'bueno' | 'regular' | 'malo';
  descripcion?: string;
  imagen?: string;
  seguro?: boolean;
}

// Tipos para el módulo de Cuentas
export type TipoCuenta = 'corriente' | 'ahorro' | 'digital' | 'ewallet' | 'efectivo';

export interface Cuenta {
  id: string;
  nombre: string;
  tipo: TipoCuenta;
  saldo: number;
  ultimaActualizacion: string;
} 