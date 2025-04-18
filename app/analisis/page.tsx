// cSpell:disable
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartPie, FaChartLine, FaChartBar, FaArrowUp, FaArrowDown, 
  FaCalendarAlt, FaWallet, FaCoins, FaExchangeAlt, FaFilter, 
  FaSearch, FaDownload, FaHome, FaQuestion, FaRobot, FaCreditCard, 
  FaRegLightbulb, FaPaperPlane, FaBalanceScale, FaMoneyBillWave,
  FaPercentage, FaChartArea, FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';
// Importar tipos correctamente desde la ruta types
import { Transaccion, CategoriaGasto, DatosAnalisis, PreguntaAnalisis, Deuda, PatrimonioData } from '@/types';

// Interfaz para la distribución de ingresos
interface DistribucionIngreso {
  categoria: string;
  porcentajeIdeal: number;
  porcentajeReal: number;
  color: string;
  descripcion: string;
}

export default function Analisis() {
  const [activeTab, setActiveTab] = useState('general');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  
  // Datos simulados para los gráficos
  const monthlyData = {
    ingresos: [4800, 5200, 4900, 5100, 5300, 5500],
    gastos: [3800, 4100, 3900, 4000, 4200, 3900],
    meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
  };
  
  const categories = {
    gastos: [
      { name: 'Vivienda', amount: 1200, percentage: 30, color: '#f87171' },
      { name: 'Alimentación', amount: 800, percentage: 20, color: '#fb923c' },
      { name: 'Transporte', amount: 600, percentage: 15, color: '#facc15' },
      { name: 'Entretenimiento', amount: 400, percentage: 10, color: '#a3e635' },
      { name: 'Servicios', amount: 500, percentage: 12.5, color: '#38bdf8' },
      { name: 'Otros', amount: 500, percentage: 12.5, color: '#a78bfa' }
    ],
    ingresos: [
      { name: 'Salario', amount: 4000, percentage: 75, color: '#4ade80' },
      { name: 'Freelance', amount: 800, percentage: 15, color: '#22d3ee' },
      { name: 'Inversiones', amount: 400, percentage: 7.5, color: '#818cf8' },
      { name: 'Otros', amount: 100, percentage: 2.5, color: '#e879f9' }
    ]
  };
  
  const transactions = [
    { 
      id: 1, 
      description: 'Salario Mensual', 
      amount: 4000, 
      type: 'ingreso', 
      category: 'Salario', 
      date: '05/06/2025'
    },
    { 
      id: 2, 
      description: 'Alquiler', 
      amount: 1200, 
      type: 'gasto', 
      category: 'Vivienda', 
      date: '07/06/2025'
    },
    { 
      id: 3, 
      description: 'Supermercado', 
      amount: 200, 
      type: 'gasto', 
      category: 'Alimentación', 
      date: '10/06/2025'
    },
    { 
      id: 4, 
      description: 'Proyecto Freelance', 
      amount: 800, 
      type: 'ingreso', 
      category: 'Freelance', 
      date: '15/06/2025'
    },
    { 
      id: 5, 
      description: 'Restaurante', 
      amount: 120, 
      type: 'gasto', 
      category: 'Alimentación', 
      date: '18/06/2025'
    },
    { 
      id: 6, 
      description: 'Gasolina', 
      amount: 150, 
      type: 'gasto', 
      category: 'Transporte', 
      date: '20/06/2025'
    },
    { 
      id: 7, 
      description: 'Dividendos', 
      amount: 400, 
      type: 'ingreso', 
      category: 'Inversiones', 
      date: '22/06/2025'
    },
    { 
      id: 8, 
      description: 'Netflix', 
      amount: 15, 
      type: 'gasto', 
      category: 'Entretenimiento', 
      date: '25/06/2025'
    }
  ];
  
  // Calcular totales
  const totalIngresos = transactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalGastos = transactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIngresos - totalGastos;
  const ahorro = (totalIngresos > 0) 
    ? ((totalIngresos - totalGastos) / totalIngresos * 100).toFixed(1) 
    : '0';
  
  // Datos de ejemplo de deudas
  const deudas: Deuda[] = [
    {
      id: "1",
      acreedor: 'Banco Santander',
      tipo: 'prestamo',
      saldoActual: 7500,
      cuotaMensual: 350,
      plazoTotal: 36,
      plazoRestante: 24,
      tasaInteres: 12.5,
      fechaInicio: '2022-06-15'
    },
    {
      id: "2",
      acreedor: 'American Express',
      tipo: 'tdc',
      saldoActual: 3200,
      cuotaMensual: 200,
      plazoTotal: 24,
      plazoRestante: 16,
      tasaInteres: 18.9,
      fechaInicio: '2022-09-01'
    },
    {
      id: "3",
      acreedor: 'BBVA',
      tipo: 'credito',
      saldoActual: 130000,
      cuotaMensual: 850,
      plazoTotal: 240,
      plazoRestante: 210,
      tasaInteres: 7.5,
      fechaInicio: '2021-03-10'
    }
  ];
  
  // Calcular totales de deudas
  const totalDeudas = deudas.reduce((sum, deuda) => sum + deuda.saldoActual, 0);
  const totalCuotasMensuales = deudas.reduce((sum, deuda) => sum + deuda.cuotaMensual, 0);
  
  // Datos simulados para cuentas
  const cuentas = [
    { id: "1", nombre: "Cuenta Nómina", saldo: 3850.75 },
    { id: "2", nombre: "Ahorros", saldo: 15200.50 },
    { id: "3", nombre: "Inversión", saldo: 4250.33 }
  ];
  const totalCuentas = cuentas.reduce((sum, cuenta) => sum + cuenta.saldo, 0);

  // Datos simulados para activos
  const activos = [
    { id: "1", nombre: "Vehículo", valor: 12000 },
    { id: "2", nombre: "Propiedad", valor: 180000 },
    { id: "3", nombre: "Electrónicos", valor: 5000 }
  ];
  const totalActivos = activos.reduce((sum, activo) => sum + activo.valor, 0);

  // Datos simulados para la distribución ideal vs real de ingresos
  const distribucionIngresos: DistribucionIngreso[] = [
    {
      categoria: "Gastos fijos",
      porcentajeIdeal: 50,
      porcentajeReal: 65,
      color: "#f87171",
      descripcion: "Vivienda, servicios, alimentación, transporte, etc."
    },
    {
      categoria: "Inversiones",
      porcentajeIdeal: 10,
      porcentajeReal: 5,
      color: "#38bdf8",
      descripcion: "Inversiones en acciones, fondos, etc."
    },
    {
      categoria: "Ahorro",
      porcentajeIdeal: 10,
      porcentajeReal: 3,
      color: "#4ade80",
      descripcion: "Ahorro para imprevistos y objetivos a corto plazo"
    },
    {
      categoria: "Fondo de emergencia",
      porcentajeIdeal: 10,
      porcentajeReal: 7,
      color: "#a78bfa",
      descripcion: "Reserva para emergencias (3-6 meses de gastos)"
    },
    {
      categoria: "Deudas",
      porcentajeIdeal: 10,
      porcentajeReal: 15,
      color: "#fb923c",
      descripcion: "Pago de préstamos, tarjetas de crédito, etc."
    },
    {
      categoria: "Objetivos",
      porcentajeIdeal: 10,
      porcentajeReal: 5,
      color: "#22d3ee",
      descripcion: "Ahorro para metas específicas"
    }
  ];

  // Calcular patrimonio neto
  const patrimonioNeto = totalActivos + totalCuentas - totalDeudas;

  // Determinar estado del patrimonio
  const determinarEstadoPatrimonio = (): PatrimonioData['estado'] => {
    if (patrimonioNeto < 0) return 'negativo';
    if (patrimonioNeto < totalGastos * 6) return 'equilibrio'; // menos de 6 meses de gastos
    return 'positivo';
  };

  const estadoPatrimonio = determinarEstadoPatrimonio();
  
  // Preguntas predefinidas para análisis
  const preguntasAnalisis = [
    {
      id: 1,
      pregunta: "¿Cuál es el ingreso y gasto promedio mensual?",
      respuesta: `El ingreso promedio mensual es de $${totalIngresos.toLocaleString()}, mientras que el gasto promedio es de $${totalGastos.toLocaleString()}, lo que resulta en un balance mensual de $${balance.toLocaleString()}.`
    },
    {
      id: 2,
      pregunta: "¿Cuánto puedes destinar mensualmente al pago de deudas?",
      respuesta: `Considerando tu ingreso mensual de $${totalIngresos.toLocaleString()} y gastos mensuales de $${totalGastos.toLocaleString()}, tu capacidad actual de pago de deudas es de $${balance.toLocaleString()} mientras que actualmente estás pagando $${totalCuotasMensuales.toLocaleString()} en cuotas mensuales.`
    },
    {
      id: 3,
      pregunta: "¿En cuánto tiempo podrías eliminar las deudas actuales con el pago mensual asignado?",
      respuesta: `Con un balance mensual de $${balance.toLocaleString()} dedicado completamente al pago de deudas, podrías liquidar tu deuda total de $${totalDeudas.toLocaleString()} en aproximadamente ${Math.ceil(totalDeudas / balance)} meses, manteniendo tus ingresos y gastos actuales.`
    },
    {
      id: 4,
      pregunta: "¿Cuánto tiempo tomará que el patrimonio sea positivo?",
      respuesta: `Con un ahorro mensual de $${balance.toLocaleString()} y una deuda total de $${totalDeudas.toLocaleString()}, alcanzarás un patrimonio positivo en aproximadamente ${Math.ceil(totalDeudas / balance)} meses, siempre que mantengas tus hábitos financieros actuales.`
    },
    {
      id: 5,
      pregunta: "¿Cómo puedo aumentar el porcentaje de ingreso destinado a eliminar la deuda?",
      respuesta: `Para aumentar el porcentaje destinado a deudas, considera: 1) Reducir gastos en entretenimiento y comidas fuera, 2) Renegociar servicios existentes, 3) Vender artículos no esenciales, 4) Generar ingresos adicionales con trabajos secundarios, y 5) Consolidar deudas de alto interés.`
    },
    {
      id: 6,
      pregunta: "¿Es posible reducir algunos gastos para aumentar el ingreso neto mensual?",
      respuesta: `Analizando tus gastos, identificamos potenciales ahorros en: Entretenimiento (${categories.gastos.find(c => c.name === 'Entretenimiento')?.amount}$), que podrías reducir un 30%; servicios digitales redundantes; y optimizar gastos de alimentación (${categories.gastos.find(c => c.name === 'Alimentación')?.amount}$) mediante planificación de comidas.`
    },
    {
      id: 7,
      pregunta: "¿Qué otras fuentes de ingresos podrían ayudar a alcanzar un patrimonio positivo?",
      respuesta: `Basándonos en tu perfil, las mejores fuentes adicionales de ingresos podrían ser: 1) Trabajo freelance similar a tu ingreso actual de $${categories.ingresos.find(c => c.name === 'Freelance')?.amount}, 2) Monetización de habilidades con cursos online, 3) Alquiler de espacio o bienes, y 4) Inversiones a largo plazo en activos de bajo riesgo.`
    },
    {
      id: 8,
      pregunta: "¿Puedo refinanciar mis deudas a una tasa menor para pagar menos intereses?",
      respuesta: `El refinanciamiento sería beneficioso principalmente para tu tarjeta de crédito (${deudas.find(d => d.tipo === 'tdc')?.tasaInteres}%) y préstamo personal (${deudas.find(d => d.tipo === 'prestamo')?.tasaInteres}%). Consolidando estas deudas podrías ahorrar aproximadamente $${Math.round((deudas.find(d => d.tipo === 'tdc')?.saldoActual || 0) * 0.08)} en intereses anualmente.`
    },
    {
      id: 9,
      pregunta: "¿Cómo comenzar a invertir después de salir de deudas?",
      respuesta: `Después de liquidar tus deudas, considera esta estrategia: 1) Crear un fondo de emergencia de $${totalGastos * 3} (3 meses de gastos), 2) Maximizar aportes a planes de retiro, 3) Invertir 60% en fondos indexados, 20% en bonos y 20% en acciones de crecimiento, 4) Reinvertir dividendos y 5) Revisar tu cartera trimestralmente.`
    }
  ];
  
  // Manejar clic en pregunta predefinida
  const handlePreguntaClick = (respuesta: string) => {
    setIsAnswering(true);
    
    // Simulamos un pequeño retraso para dar la sensación de procesamiento
    setTimeout(() => {
      setCurrentAnswer(respuesta);
      setIsAnswering(false);
    }, 800);
  };
  
  // Manejar envío de pregunta personalizada
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userQuestion.trim()) return;
    
    setIsAnswering(true);
    
    // En un entorno real, aquí haríamos una llamada a una API
    // Para el ejemplo, generamos una respuesta ficticia
    setTimeout(() => {
      setCurrentAnswer(`Basado en tu situación financiera actual, con ingresos de $${totalIngresos} y gastos de $${totalGastos}, puedo responder que: ${userQuestion}
      
      Tu balance mensual de $${balance} te permite cierta flexibilidad, pero con una deuda total de $${totalDeudas.toLocaleString()}, es importante mantener un enfoque disciplinado en tus finanzas personales.`);
      
      setIsAnswering(false);
      setUserQuestion('');
    }, 1500);
  };
  
  // Renderizar gráfico de barras (simplificado con divs)
  const renderBarChart = () => {
    const maxValue = Math.max(...monthlyData.ingresos, ...monthlyData.gastos);
    
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg text-[#eab308]">Ingresos vs Gastos</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#4ade80] rounded-full mr-2"></div>
              <span>Ingresos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#f87171] rounded-full mr-2"></div>
              <span>Gastos</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-end h-60 gap-2 mt-4 border-b border-white/10 pb-2">
          {monthlyData.meses.map((mes, idx) => (
            <div key={mes} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-1">
                <motion.div 
                  className="w-full bg-[#4ade80] rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${(monthlyData.ingresos[idx] / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{ maxWidth: '24px', marginLeft: 'auto', marginRight: 'auto' }}
                ></motion.div>
                
                <motion.div 
                  className="w-full bg-[#f87171] rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${(monthlyData.gastos[idx] / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                  style={{ maxWidth: '24px', marginLeft: 'auto', marginRight: 'auto' }}
                ></motion.div>
              </div>
              <span className="text-xs mt-1 text-white/70">{mes.substring(0, 3)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Renderizar gráfico de pastel (simplificado con divs)
  const renderPieChart = () => {
    const categoryData = activeTab === 'gastos' ? categories.gastos : categories.ingresos;
    
    return (
      <div className="mt-6">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-[#eab308] capitalize">
              Distribución por {activeTab === 'general' ? 'Categoría' : activeTab === 'gastos' ? 'Gastos' : 'Ingresos'}
            </h3>
          </div>
          
          {/* Tabs movidos del encabezado a aquí */}
          <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden self-start">
            {['general', 'ingresos', 'gastos'].map(tab => (
              <motion.button
                key={tab}
                className={`px-4 py-1.5 text-xs capitalize ${
                  activeTab === tab ? 'bg-[#eab308] text-black font-medium' : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
                whileHover={activeTab !== tab ? { backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
          {/* Gráfico circular simplificado */}
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border border-white/10"></div>
            
            {categoryData.map((category, idx) => (
              <motion.div
                key={category.name}
                className="absolute w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  background: `conic-gradient(transparent ${idx * (360 / categoryData.length)}deg, ${category.color} ${idx * (360 / categoryData.length)}deg, ${category.color} ${(idx + 1) * (360 / categoryData.length)}deg, transparent ${(idx + 1) * (360 / categoryData.length)}deg)`,
                  borderRadius: '50%',
                }}
                onMouseEnter={() => setSelectedCategory(category.name)}
                onMouseLeave={() => setSelectedCategory(null)}
              ></motion.div>
            ))}
            
            <div className="absolute inset-[25%] bg-[#050505] rounded-full flex items-center justify-center">
              <span className="font-medium text-sm">
                {selectedCategory || (activeTab === 'gastos' ? 'Gastos' : activeTab === 'ingresos' ? 'Ingresos' : 'Categorías')}
              </span>
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="grid grid-cols-2 gap-3">
            {categoryData.map((category) => (
              <motion.div 
                key={category.name}
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setSelectedCategory(category.name)}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <div>
                  <div className="text-sm">{category.name}</div>
                  <div className="text-xs text-white/70">${category.amount} ({category.percentage}%)</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar sección de análisis inteligente
  const renderAnalisisInteligente = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FaRobot className="text-[#eab308] text-xl" />
          <h3 className="font-medium text-lg">Análisis Inteligente</h3>
        </div>
        
        {/* Área de preguntas y respuestas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de preguntas predefinidas */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="text-sm font-medium text-[#eab308]">Preguntas sugeridas</h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {preguntasAnalisis.map(item => (
                <motion.button
                  key={item.id}
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-left hover:border-[#eab308]/30 transition-colors text-sm"
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  onClick={() => handlePreguntaClick(item.respuesta)}
                >
                  <div className="flex items-start gap-2">
                    <FaQuestion className="text-[#eab308] mt-0.5 flex-shrink-0" />
                    <span>{item.pregunta}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Área de respuesta y formulario de pregunta */}
          <div className="md:col-span-2 space-y-4">
            {/* Respuesta actual */}
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
              {isAnswering ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 1.5
                    }}
                  >
                    Analizando información financiera...
                  </motion.div>
                </div>
              ) : currentAnswer ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-[#eab308]/20">
                      <FaRegLightbulb className="text-[#eab308]" />
                    </div>
                    <div className="text-sm leading-relaxed">
                      {currentAnswer.split('\n').map((parrafo, idx) => (
                        <p key={idx} className="mb-2">{parrafo}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white/50 text-sm">
                  Selecciona una pregunta sugerida o escribe tu propia consulta financiera
                </div>
              )}
            </div>
            
            {/* Formulario de pregunta personalizada */}
            <form onSubmit={handleSubmitQuestion} className="flex gap-2">
              <input
                type="text"
                placeholder="Pregunta algo sobre tus finanzas personales..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />
              <motion.button
                type="submit"
                className="bg-[#eab308] text-black rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnswering || !userQuestion.trim()}
              >
                <FaPaperPlane />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar indicador de patrimonio neto
  const renderPatrimonioNeto = () => {
    const getColorForEstado = () => {
      switch (estadoPatrimonio) {
        case 'positivo': return 'text-[#4ade80]';
        case 'equilibrio': return 'text-[#facc15]';
        case 'negativo': return 'text-[#f87171]';
        default: return 'text-white';
      }
    };

    const getDescripcionEstado = () => {
      switch (estadoPatrimonio) {
        case 'positivo': return 'Base sólida financiera. Continúa construyendo y diversificando tus activos e inversiones.';
        case 'equilibrio': return 'Situación estable pero vulnerable. Enfócate en reducir deudas y aumentar tus activos.';
        case 'negativo': return 'Patrimonio en riesgo. Prioriza reducir deudas y construir un fondo de emergencia.';
        default: return '';
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBalanceScale className="text-[#eab308]" />
            <h3 className="font-medium">Patrimonio Neto</h3>
          </div>
        </div>
        
        {/* Resumen principal */}
        <div className="p-4 bg-black/20 border border-white/10 rounded-lg mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-white/70 mb-1">Tu patrimonio neto total</div>
              <div className={`text-3xl font-light ${getColorForEstado()}`}>
                ${patrimonioNeto.toLocaleString()}
              </div>
              <div className="flex items-center mt-2 gap-2">
                <div className={`px-3 py-1 rounded-full text-xs ${
                  estadoPatrimonio === 'positivo' ? 'bg-[#4ade80]/20 text-[#4ade80]' :
                  estadoPatrimonio === 'equilibrio' ? 'bg-[#facc15]/20 text-[#facc15]' :
                  'bg-[#f87171]/20 text-[#f87171]'
                }`}>
                  {estadoPatrimonio === 'positivo' ? 'Crecimiento' :
                   estadoPatrimonio === 'equilibrio' ? 'Equilibrio' : 'Riesgo'}
                </div>
                <span className="text-xs text-white/60">{getDescripcionEstado()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="text-center">
                <div className="bg-[#4ade80]/10 rounded-lg p-3">
                  <FaMoneyBillWave className="text-[#4ade80] mx-auto mb-1" />
                  <div className="text-xs text-white/60">Activos</div>
                  <div className="text-sm text-[#4ade80]">${totalActivos.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#818cf8]/10 rounded-lg p-3">
                  <FaWallet className="text-[#818cf8] mx-auto mb-1" />
                  <div className="text-xs text-white/60">Cuentas</div>
                  <div className="text-sm text-[#818cf8]">${totalCuentas.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-[#f87171]/10 rounded-lg p-3">
                  <FaCreditCard className="text-[#f87171] mx-auto mb-1" />
                  <div className="text-xs text-white/60">Deudas</div>
                  <div className="text-sm text-[#f87171]">${totalDeudas.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
          <div className="text-sm text-white/70 mb-2">Evolución del patrimonio</div>
          <div className="h-4 bg-black/30 rounded-full overflow-hidden mb-1">
            <div 
              className={`h-full ${
                estadoPatrimonio === 'positivo' ? 'bg-[#4ade80]' :
                estadoPatrimonio === 'equilibrio' ? 'bg-[#facc15]' : 'bg-[#f87171]'
              }`} 
              style={{ width: `${Math.max(0, Math.min(100, (patrimonioNeto / (totalActivos + totalCuentas)) * 100))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <div>Deudas totales</div>
            <div>Fortuna total</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar sección de deudas
  const renderResumenDeudas = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCreditCard className="text-[#eab308]" />
            <h3 className="font-medium">Resumen de Deudas</h3>
          </div>
          <Link href="/deudas">
            <motion.button
              className="text-sm text-[#eab308] hover:underline flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver detalle completo →
            </motion.button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-black/20 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-white/70 mb-1">Deuda Total</div>
            <div className="text-xl font-medium">${totalDeudas.toLocaleString()}</div>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-white/70 mb-1">Cuota Mensual</div>
            <div className="text-xl font-medium">${totalCuotasMensuales.toLocaleString()}</div>
          </div>
          
          <div className="bg-black/20 border border-white/10 rounded-lg p-4">
            <div className="text-sm text-white/70 mb-1">Capacidad de Pago</div>
            <div className={`text-xl font-medium ${balance > totalCuotasMensuales ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              ${balance.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-black/30">
              <tr>
                <th className="px-4 py-3 text-left">Acreedor</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-right">Saldo</th>
                <th className="px-4 py-3 text-right">Cuota</th>
                <th className="px-4 py-3 text-right">Tasa</th>
              </tr>
            </thead>
            <tbody>
              {deudas.map(deuda => (
                <motion.tr 
                  key={deuda.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <td className="px-4 py-3">{deuda.acreedor}</td>
                  <td className="px-4 py-3 text-sm">{deuda.tipo}</td>
                  <td className="px-4 py-3 text-right">${deuda.saldoActual.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">${deuda.cuotaMensual.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{deuda.tasaInteres}%</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Renderizar comparación de distribución ideal vs real de ingresos
  const renderDistribucionIngresos = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartArea className="text-[#eab308]" />
            <h3 className="font-medium">Distribución de Ingresos: Ideal vs Real</h3>
          </div>
        </div>
        
        <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
          <div className="text-sm text-white/70 mb-4">
            Compara cómo deberías distribuir tus ingresos mensuales (distribución ideal) con cómo los estás distribuyendo actualmente (distribución real).
          </div>
          
          <div className="space-y-6">
            {distribucionIngresos.map((item) => {
              const diferencia = item.porcentajeReal - item.porcentajeIdeal;
              const estaEquilibrado = Math.abs(diferencia) <= 2; // Consideramos equilibrado si la diferencia es menor o igual a 2%
              const tieneDeficit = diferencia < -2;
              const tieneExceso = diferencia > 2;
              
              return (
                <div key={item.categoria} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="text-sm font-medium">{item.categoria}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {estaEquilibrado && <FaCheckCircle className="text-[#4ade80] text-sm" />}
                      {tieneDeficit && <FaExclamationTriangle className="text-[#facc15] text-sm" />}
                      {tieneExceso && <FaExclamationTriangle className="text-[#f87171] text-sm" />}
                      <div className="text-xs text-white/70">{item.descripcion}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-16 text-right text-xs text-white/70">Ideal: {item.porcentajeIdeal}%</div>
                    <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${item.porcentajeIdeal}%`, 
                          backgroundColor: item.color,
                          opacity: 0.6
                        }}
                      ></div>
                    </div>
                    <div className="w-14 text-xs text-white/70"><FaPercentage className="inline-block" /> {item.porcentajeIdeal}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-16 text-right text-xs text-white/70">Real: {item.porcentajeReal}%</div>
                    <div className="flex-1 h-3 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${item.porcentajeReal}%`, 
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                    <div className="w-14 text-xs text-white/70"><FaPercentage className="inline-block" /> {item.porcentajeReal}</div>
                  </div>

                  <div className="pl-16 mt-1">
                    {tieneDeficit && (
                      <div className="text-xs text-[#facc15]">
                        ¡Estás destinando {Math.abs(diferencia)}% menos de lo recomendado!
                      </div>
                    )}
                    {tieneExceso && (
                      <div className="text-xs text-[#f87171]">
                        ¡Estás destinando {diferencia}% más de lo recomendado!
                      </div>
                    )}
                    {estaEquilibrado && (
                      <div className="text-xs text-[#4ade80]">
                        ¡Excelente balance en esta categoría!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-3 bg-black/30 rounded-lg border border-white/10">
            <div className="flex items-start gap-2">
              <FaRegLightbulb className="text-[#eab308] mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="mb-1"><strong>50/30/20</strong> es una regla general para distribuir ingresos:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>50% para necesidades básicas (vivienda, alimentación, servicios)</li>
                  <li>30% para objetivos personales (ahorro, inversión, deudas)</li>
                  <li>20% para deseos (entretenimiento, lujos, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8 bg-[#050505] text-[#f4f4f4] min-h-screen">
      {/* Encabezado */}
      <header className="mb-8">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl text-[#eab308] font-light tracking-wider">DANTE</h1>
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 text-white/70 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome /> Inicio
            </motion.div>
          </Link>
        </motion.div>
        <motion.h2 
          className="text-xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Análisis Financiero
        </motion.h2>
      </header>
      
      {/* Selector de período - ahora solo con el selector de tiempo, sin los tabs */}
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-[#eab308]" />
          <span>Periodo:</span>
          <select 
            className="bg-black/30 border border-white/10 rounded-md py-1 px-2 text-sm focus:outline-none focus:border-[#eab308]/50"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
        </div>
      </motion.div>
      
      {/* Resumen - Tarjetas de datos */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div 
          className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors"
          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(234,179,8,0.1)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg">Ingresos</h3>
            <FaCoins className="text-[#4ade80]" />
          </div>
          <div className="text-2xl font-semibold text-[#4ade80]">${totalIngresos}</div>
          <div className="text-xs text-white/70 mt-1">Último mes</div>
        </motion.div>
        
        <motion.div 
          className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors"
          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(234,179,8,0.1)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg">Gastos</h3>
            <FaWallet className="text-[#f87171]" />
          </div>
          <div className="text-2xl font-semibold text-[#f87171]">${totalGastos}</div>
          <div className="text-xs text-white/70 mt-1">Último mes</div>
        </motion.div>
        
        <motion.div 
          className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-[#eab308]/30 transition-colors"
          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(234,179,8,0.1)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg">Balance</h3>
            <FaExchangeAlt className="text-[#eab308]" />
          </div>
          <div className={`text-2xl font-semibold ${balance >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
            ${balance}
          </div>
          <div className="text-xs text-white/70 mt-1">Tasa de ahorro: {ahorro}%</div>
        </motion.div>
      </motion.div>
      
      {/* Sección de análisis inteligente - Ahora más prominente */}
      <motion.div
        className="bg-black/20 border border-[#eab308]/30 rounded-lg p-6 mb-8 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {renderAnalisisInteligente()}
      </motion.div>
      
      {/* Patrimonio Neto */}
      <motion.div
        className="bg-black/20 border border-white/10 rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {renderPatrimonioNeto()}
      </motion.div>
      
      {/* Gráficos y análisis */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-black/20 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <FaChartBar className="text-[#eab308]" />
            <h3 className="font-medium">Evolución Mensual</h3>
          </div>
          {renderBarChart()}
        </div>
        
        <div className="bg-black/20 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <FaChartPie className="text-[#eab308]" />
            <h3 className="font-medium">Distribución</h3>
          </div>
          {renderPieChart()}
        </div>
      </motion.div>
      
      {/* Resumen de deudas */}
      <motion.div
        className="bg-black/20 border border-white/10 rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {renderResumenDeudas()}
      </motion.div>
      
      {/* Comparación de distribución ideal vs real de ingresos */}
      <motion.div
        className="bg-black/20 border border-white/10 rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {renderDistribucionIngresos()}
      </motion.div>
      
      {/* Botones de navegación */}
      <motion.div 
        className="w-full max-w-4xl mx-auto my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'Inicio', path: '/', icon: <FaHome /> },
            { name: 'Calendario', path: '/calendario', icon: <FaCalendarAlt /> },
            { name: 'Presupuesto', path: '/presupuesto', icon: <FaChartLine /> },
            { name: 'Cuentas', path: '/cuentas', icon: <FaWallet /> },
            { name: 'Deudas', path: '/deudas', icon: <FaWallet /> },
            { name: 'Objetivos', path: '/objetivos', icon: <FaChartLine /> },
            { name: 'Inversiones', path: '/inversiones', icon: <FaCoins /> }
          ].map((option) => (
            <Link
              key={option.name}
              href={option.path}
            >
              <motion.div
                className="bg-[#1c1c1c] border border-[#eab308] rounded-md py-2 px-4 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                {option.icon} {option.name}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
      
      {/* Pie de página */}
      <motion.footer 
        className="mt-16 text-center text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="mb-1">Consigue tu libertad financiera con sabiduría</p>
        <p>DANTE © {new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
} 