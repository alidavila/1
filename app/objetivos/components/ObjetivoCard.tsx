"use client";

import { motion } from 'framer-motion';
import { 
  FaCoins, FaRegCalendarAlt, FaPencilAlt, 
  FaTrashAlt, FaCheckCircle, FaLightbulb,
  FaHome, FaCar, FaPlane, FaCreditCard, 
  FaStore, FaChartLine
} from 'react-icons/fa';
import { Objetivo } from '../../../types';

interface ObjetivoCardProps {
  objetivo: Objetivo;
  formatCurrency: (amount: number) => string;
  calcularDiasRestantes: (fechaEstimada: string) => number;
  formatearFecha: (fechaString: string) => string;
  onEditar: () => void;
  onEliminar: () => void;
  onCompletar: () => void;
}

export const ObjetivoCard: React.FC<ObjetivoCardProps> = ({
  objetivo,
  formatCurrency,
  calcularDiasRestantes,
  formatearFecha,
  onEditar,
  onEliminar,
  onCompletar
}) => {
  const porcentajeCompletado = Math.min(100, Math.round((objetivo.valorActual / objetivo.valorMeta) * 100));
  const diasRestantes = calcularDiasRestantes(objetivo.fechaEstimada);
  
  // Determinar color de progreso basado en el avance
  const getColorProgreso = () => {
    // Días transcurridos desde la creación
    const diasTranscurridos = Math.ceil(
      (new Date().getTime() - new Date(objetivo.fechaCreacion).getTime()) / (1000 * 3600 * 24)
    );
    
    // Días totales planificados
    const diasTotales = Math.ceil(
      (new Date(objetivo.fechaEstimada).getTime() - new Date(objetivo.fechaCreacion).getTime()) / (1000 * 3600 * 24)
    );
    
    // Porcentaje ideal que debería llevar completado
    const porcentajeIdeal = (diasTranscurridos / diasTotales) * 100;
    
    // Comparar el porcentaje real con el ideal
    if (porcentajeCompletado >= porcentajeIdeal + 10) return 'bg-[#4ade80]'; // Verde (adelantado)
    if (porcentajeCompletado <= porcentajeIdeal - 20) return 'bg-[#f87171]'; // Rojo (muy retrasado)
    return 'bg-[#facc15]'; // Amarillo (en promedio)
  };
  
  // Generar mensaje de sugerencia
  const getSugerencia = () => {
    if (porcentajeCompletado < 25) {
      return "Considera aumentar tus aportes mensuales para alcanzar el objetivo más rápido.";
    } else if (porcentajeCompletado < 50) {
      return "Buscando reducir algunos gastos podrías aumentar tu progreso.";
    } else if (porcentajeCompletado < 75) {
      return "Ya estás a más de la mitad, ¡mantén el ritmo para cumplir antes de la fecha!";
    } else {
      return "Estás muy cerca. Un pequeño esfuerzo adicional podría completar tu objetivo antes.";
    }
  };
  
  // Obtener ícono según la categoría del objetivo
  const getIconoCategoria = () => {
    switch (objetivo.categoria) {
      case 'ahorro_emergencia':
        return <FaCoins className="text-[#f59e0b]" />;
      case 'comprar_carro':
        return <FaCar className="text-[#3b82f6]" />;
      case 'comprar_casa':
        return <FaHome className="text-[#4ade80]" />;
      case 'viaje':
        return <FaPlane className="text-[#8b5cf6]" />;
      case 'pagar_deudas':
        return <FaCreditCard className="text-[#ef4444]" />;
      case 'capital_negocio':
        return <FaStore className="text-[#ec4899]" />;
      case 'fondo_inversion':
        return <FaChartLine className="text-[#14b8a6]" />;
      default:
        return <FaCoins className="text-[#eab308]" />;
    }
  };
  
  // Obtener nombre formateado de la categoría
  const getNombreCategoria = () => {
    switch (objetivo.categoria) {
      case 'ahorro_emergencia': return 'Ahorro de emergencia';
      case 'comprar_carro': return 'Compra de vehículo';
      case 'comprar_casa': return 'Compra de vivienda';
      case 'viaje': return 'Viaje';
      case 'pagar_deudas': return 'Pago de deudas';
      case 'capital_negocio': return 'Capital para negocio';
      case 'fondo_inversion': return 'Fondo de inversión';
      default: return objetivo.categoria;
    }
  };
  
  const colorProgreso = getColorProgreso();
  const sugerencia = getSugerencia();
  
  return (
    <motion.div
      className="bg-black/20 border border-[#eab308]/30 rounded-lg overflow-hidden"
      whileHover={{ borderColor: 'rgba(234, 179, 8, 0.5)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Barra de progreso superior */}
      <div className="w-full h-1.5 bg-black/30">
        <motion.div 
          className={`h-full ${colorProgreso}`}
          initial={{ width: 0 }}
          animate={{ width: `${porcentajeCompletado}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      
      {/* Cabecera con información general */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-[#eab308]/10 flex items-center justify-center">
              {getIconoCategoria()}
            </div>
            <div>
              <h3 className="font-medium text-lg">{objetivo.nombre}</h3>
              <p className="text-sm text-white/60">{getNombreCategoria()}</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-full px-2 py-1 text-xs flex items-center">
            <span className="text-[#eab308]">Prioridad {objetivo.prioridad}</span>
          </div>
        </div>
        
        {/* Valores y progreso */}
        <div className="flex justify-between items-center mt-4 mb-3">
          <div>
            <div className="text-sm text-white/60 mb-1">Meta</div>
            <div className="text-xl font-medium">{formatCurrency(objetivo.valorMeta)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/60 mb-1">Progreso</div>
            <div className="text-xl font-medium text-[#eab308]">{porcentajeCompletado}%</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60 mb-1">Actual</div>
            <div className="text-xl font-medium text-[#4ade80]">{formatCurrency(objetivo.valorActual)}</div>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2">
            <FaCoins className="text-white/60" />
            <div>
              <div className="text-xs text-white/60">Aporte mensual</div>
              <div className="text-sm">{formatCurrency(objetivo.montoSugerido)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaRegCalendarAlt className="text-white/60" />
            <div>
              <div className="text-xs text-white/60">Fecha estimada</div>
              <div className="text-sm">{formatearFecha(objetivo.fechaEstimada)}</div>
            </div>
          </div>
        </div>
        
        {/* Tiempo restante */}
        <div className="flex items-center gap-2 mt-4 text-white/80">
          <div className={`w-2 h-2 rounded-full ${colorProgreso}`}></div>
          <div className="text-sm">
            {diasRestantes > 0
              ? `${diasRestantes} días restantes`
              : "¡Fecha cumplida! Actualiza tu progreso."}
          </div>
        </div>
        
        {/* Sugerencia para acelerar */}
        <div className="mt-4 bg-black/30 rounded-lg p-3 flex items-start gap-2">
          <FaLightbulb className="text-[#eab308] flex-shrink-0 mt-1" />
          <p className="text-xs text-white/80">{sugerencia}</p>
        </div>
      </div>
      
      {/* Acciones */}
      <div className="p-3 bg-black/30 flex justify-between">
        <div className="flex gap-2">
          <motion.button
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEditar}
          >
            <FaPencilAlt className="text-white/70" />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEliminar}
          >
            <FaTrashAlt className="text-white/70" />
          </motion.button>
        </div>
        <motion.button
          className="px-3 py-2 rounded-lg bg-[#eab308]/10 text-[#eab308] hover:bg-[#eab308]/20 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCompletar}
        >
          <FaCheckCircle />
          <span className="text-sm">Marcar como completado</span>
        </motion.button>
      </div>
    </motion.div>
  );
}; 