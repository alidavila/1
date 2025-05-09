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

// Tipos para el Dashboard Financiero
export interface PatrimonioData {
  total: number;
  estado: 'positivo' | 'equilibrio' | 'negativo';
}

export interface FlujoCajaMes {
  mes: string;
  ingresos: number;
  egresos: number;
  resultado: number;
}

export type FlujoCajaData = FlujoCajaMes[];

export interface FinancialData {
  patrimonio: PatrimonioData;
  flujoCaja: FlujoCajaData;
  consejos: string[];
  etiquetas: {
    ingresos: string;
    gastos: string;
    presupuesto: string;
    ahorro: string;
    inversiones: string;
    consejos: string;
  };
}

// Tipos para FloatingTags
export type EtiquetaKey = 'ingresos' | 'gastos' | 'presupuesto' | 'ahorro' | 'inversiones' | 'consejos'; 