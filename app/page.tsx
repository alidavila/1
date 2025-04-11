"use client";

import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartLine, FaCreditCard, FaCoins, 
  FaPiggyBank, FaMoneyBillAlt, FaBullseye, FaBoxOpen,
  FaCalendarAlt, FaPaperPlane 
} from 'react-icons/fa';

// Definir un tipo para las secciones
interface MainSection {
  title: string;
  icon: JSX.Element;
  description: string;
  path: string;
  position: {
    top: string;
    left: string;
    rotate: number;
  };
}

// Definir interfaces para los datos del dashboard
interface DashboardData {
  balance: number;
  ingresos: number;
  gastos: number;
  ahorro: number;
  objetivos: number;
  deudas: number;
  inversiones: number;
  activos: number;
  proxPagos: {
    concepto: string;
    monto: number;
    fecha: string;
  }[];
}

// Componente optimizado para secciones
const SectionIcon = memo(({ section, isActive, onHover }: { 
  section: MainSection, 
  isActive: boolean,
  onHover: (title: string | null) => void
}) => {
  // Calcular dirección de flotación basada en la posición
  const isLeftSide = parseFloat(section.position.left) < 50;
  const floatDirection = isLeftSide ? -5 : 5; // Flotar hacia adentro
  
  return (
    <motion.div
      className="absolute z-10"
      style={{
        top: section.position.top,
        left: section.position.left,
        transform: `rotate(${section.position.rotate}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: [0, floatDirection, 0], // Efecto de flotación horizontal
        y: [0, -7, 0] // Efecto de flotación vertical
      }}
      transition={{ 
        duration: 0.5, 
        x: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          // Añadir un retraso aleatorio para cada sección
          delay: Math.random() * 2
        },
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          // Añadir un retraso aleatorio para cada sección
          delay: Math.random() * 2
        }
      }}
      onMouseEnter={() => onHover(section.title)}
      onMouseLeave={() => onHover(null)}
    >
      <Link href={section.path}>
        <div className="flex flex-col items-center group">
          <motion.div
            className="text-[#eab308] text-3xl mb-2 group-hover:text-yellow-300"
            whileHover={{ 
              scale: 1.2,
              textShadow: "0 0 15px rgba(234,179,8,0.8)"
            }}
          >
            {section.icon}
          </motion.div>
          <motion.h3 
            className="text-lg font-light text-yellow-500/90 group-hover:text-yellow-300"
            whileHover={{ 
              textShadow: "0 0 8px rgba(234,179,8,0.7)"
            }}
          >
            {section.title}
          </motion.h3>
        </div>
      </Link>
    </motion.div>
  );
});
// Asignar displayName para resolver el error de ESLint
SectionIcon.displayName = 'SectionIcon';

// Componente de respuesta
const ResponseBox = memo(({ activeSection, response, mainSections }: {
  activeSection: string | null,
  response: string,
  mainSections: MainSection[]
}) => (
  <motion.div 
    className="w-full max-w-2xl min-h-[100px] rounded-xl bg-black/40 border border-yellow-600/30 p-6 mb-8 relative z-10 -mt-40"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection || 'default'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-yellow-100/80"
      >
        {activeSection ? (
          <div>
            <h3 className="text-yellow-400 mb-2 font-medium">{mainSections.find(s => s.title === activeSection)?.title}</h3>
            <p>{mainSections.find(s => s.title === activeSection)?.description}</p>
          </div>
        ) : (
          <p>{response}</p>
        )}
      </motion.div>
    </AnimatePresence>
  </motion.div>
));
// Asignar displayName para resolver el error de ESLint
ResponseBox.displayName = 'ResponseBox';

// Componente para el monje central
const MonkImage = memo(() => (
  <div className="absolute inset-0 flex items-start justify-center">
    <div className="relative h-[80%] aspect-square flex justify-center items-center z-10">
      {/* Aura dorada sutil detrás del monje */}
      <div className="absolute inset-0 rounded-full bg-yellow-600/5 animate-pulse filter blur-md" 
           style={{transform: 'scale(0.95)'}}></div>
      <div className="absolute inset-0 rounded-full bg-yellow-500/3 animate-pulse delay-300 filter blur-lg" 
           style={{transform: 'scale(0.90)'}}></div>
      <div className="absolute inset-0 rounded-full bg-yellow-400/2 animate-pulse delay-700 filter blur-xl" 
           style={{transform: 'scale(0.85)'}}></div>
      
      {/* Imagen del monje con animación de flotación */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -15, 0]  // Efecto de flotación vertical
        }}
        transition={{ 
          duration: 0.7,
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative h-full aspect-square z-20"
      >
        <Image
          src="/images/monje6.png"
          alt="Monje Zen"
          fill
          style={{ objectFit: 'contain' }}
          className="drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          priority
        />
      </motion.div>
    </div>
  </div>
));
// Asignar displayName para resolver el error de ESLint
MonkImage.displayName = 'MonkImage';

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Bienvenido a DANTE, tu guía espiritual financiera. ¿En qué puedo ayudarte hoy?');
  const [isLoading, setIsLoading] = useState(false);
  
  // Memoizar función de hover para evitar re-renders
  const handleHover = useCallback((title: string | null) => {
    setActiveSection(title);
  }, []);
  
  // Aplicar el tipo al array
  const mainSections: MainSection[] = [
    {
      title: 'Análisis',
      icon: <FaChartLine />,
      description: 'Visualiza el panorama completo de tus finanzas con gráficos intuitivos y métricas precisas. Obtén una perspectiva zen de tu situación financiera actual y tendencias.',
      path: '/analisis',
      position: {
        top: '15%',
        left: '15%',
        rotate: -25
      }
    },
    {
      title: 'Presupuesto',
      icon: <FaPiggyBank />,
      description: 'Crea y gestiona presupuestos inteligentes para controlar tus gastos. Equilibra tu flujo de dinero como un monje equilibra su energía vital.',
      path: '/presupuesto',
      position: {
        top: '30%',
        left: '8%',
        rotate: -15
      }
    },
    {
      title: 'Deudas',
      icon: <FaMoneyBillAlt />,
      description: 'Visualiza, organiza y planifica el pago de todas tus deudas. Libérate de cargas financieras y encuentra tu camino hacia la paz económica.',
      path: '/deudas',
      position: {
        top: '55%',
        left: '8%',
        rotate: 15
      }
    },
    {
      title: 'Cuentas',
      icon: <FaCreditCard />,
      description: 'Administra todas tus cuentas bancarias, tarjetas y efectivo. Mantén el orden y la armonía en tus recursos como un monje en su templo.',
      path: '/cuentas',
      position: {
        top: '70%',
        left: '15%',
        rotate: 25
      }
    },
    {
      title: 'Objetivos',
      icon: <FaBullseye />,
      description: 'Define y sigue tus metas financieras a corto y largo plazo. Enfoca tu energía en los objetivos que te llevarán a la prosperidad espiritual y material.',
      path: '/objetivos',
      position: {
        top: '15%',
        left: '80%',
        rotate: 25
      }
    },
    {
      title: 'Inversiones',
      icon: <FaCoins />,
      description: 'Gestiona y proyecta el rendimiento de tu portafolio de inversiones. Cultiva la paciencia y sabiduría para hacer crecer tu riqueza como un jardín zen.',
      path: '/inversiones',
      position: {
        top: '30%',
        left: '85%',
        rotate: 15
      }
    },
    {
      title: 'Inventario',
      icon: <FaBoxOpen />,
      description: 'Controla tu inventario de activos y bienes con seguimiento detallado. Conoce y valora tus posesiones materiales mientras mantienes un espíritu desapegado.',
      path: '/inventario',
      position: {
        top: '55%',
        left: '85%',
        rotate: -15
      }
    },
    {
      title: 'Calendario',
      icon: <FaCalendarAlt />,
      description: 'Planifica y visualiza todos tus compromisos financieros en un calendario dinámico. Mantén la armonía entre el tiempo y el dinero, el presente y el futuro.',
      path: '/calendario',
      position: {
        top: '70%',
        left: '80%',
        rotate: -25
      }
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simular una respuesta después de un breve retraso
    setTimeout(() => {
      let newResponse;
      
      // Buscar si la consulta contiene palabras clave relacionadas con las secciones
      const activeSection = mainSections.find(section => 
        query.toLowerCase().includes(section.title.toLowerCase())
      );
      
      if (activeSection) {
        newResponse = `${activeSection.description} Puedes acceder a esta sección desde el menú principal.`;
      } else {
        newResponse = `Estoy aquí para guiarte en tu camino financiero. Para obtener información específica, puedes preguntar sobre: Análisis, Presupuesto, Deudas, Cuentas, Objetivos, Inversiones, Inventario o Calendario.`;
      }
      
      setResponse(newResponse);
      setIsLoading(false);
      setQuery('');
    }, 1000);
  };
  
  // Datos simulados para el dashboard
  const dashboardData: DashboardData = {
    balance: 8750.42,
    ingresos: 4500,
    gastos: 3200,
    ahorro: 1300,
    objetivos: 2,
    deudas: 12500,
    inversiones: 25000,
    activos: 150000,
    proxPagos: [
      { concepto: 'Hipoteca', monto: 950, fecha: '15 Abril' },
      { concepto: 'Préstamo Auto', monto: 320, fecha: '22 Abril' }
    ]
  };

  const SubmitButton = memo(({ isLoading }: { isLoading: boolean }) => (
    <button
      type="submit"
      disabled={isLoading}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-400 transition-colors"
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FaPaperPlane />
        </motion.div>
      ) : (
        <FaPaperPlane />
      )}
    </button>
  ));
  // Asignar displayName para resolver el error de ESLint
  SubmitButton.displayName = 'SubmitButton';

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Fondo simple sin partículas */}
      
      <div className="relative container mx-auto py-4 px-4 min-h-screen flex flex-col items-center z-10 gap-4">
        {/* Título principal */}
        <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 font-light tracking-wider relative z-10">
          <span className="golden-glow">DANTE FINANCE</span>
        </h1>
        
        {/* Cuadro de consulta superior */}
        <div className="w-full max-w-2xl mb-0 relative z-10">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué quieres saber sobre tus finanzas?"
              className="w-full px-6 py-4 rounded-full bg-black/40 border border-yellow-600/30 text-white focus:outline-none focus:border-yellow-500/70 focus:ring-2 focus:ring-yellow-500/20 placeholder-yellow-100/30 transition-all duration-300"
            />
            <SubmitButton isLoading={isLoading} />
          </form>
          </div>
        
        {/* Contenedor central con el monje y las secciones */}
        <div className="relative w-full max-w-4xl aspect-square mt-0 -mt-4">
          {/* Imagen del monje centrada */}
          <MonkImage />
          
          {/* Secciones posicionadas alrededor del monje */}
          {mainSections.map((section) => (
            <SectionIcon 
              key={section.title} 
              section={section} 
              isActive={activeSection === section.title}
              onHover={handleHover}
            />
          ))}
        </div>
        
        {/* Cuadro de respuesta debajo del monje */}
        <ResponseBox 
          activeSection={activeSection} 
          response={response} 
          mainSections={mainSections} 
        />
        
        {/* Dashboard general resumen - Componente memoizado para el dashboard */}
        <Dashboard dashboardData={dashboardData} />
        
        {/* Pie de página */}
        <div className="relative z-10 mt-auto text-center text-xs text-yellow-500/30">
          <p>DANTE © {new Date().getFullYear()} — Tu guía espiritual financiera</p>
        </div>
            </div>
            
      {/* Estilos CSS para efectos de neón y brillos */}
      <style jsx global>{`
        .golden-glow {
          text-shadow: 0 0 10px rgba(234,179,8,0.5), 0 0 20px rgba(234,179,8,0.3), 0 0 30px rgba(234,179,8,0.1);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </main>
  );
}

// Componente separado para el dashboard
const Dashboard = memo(({ dashboardData }: { dashboardData: DashboardData }) => (
  <motion.div 
    className="w-full max-w-4xl rounded-xl bg-black/40 border border-yellow-600/30 p-6 mb-2 relative z-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-xl text-yellow-400 mb-4 font-light flex items-center">
      <FaChartLine className="mr-2" />
      Vista General Financiera
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Gráfico de balance */}
      <div className="col-span-1 bg-black/60 rounded-lg p-4 border border-yellow-500/20">
        <h3 className="text-sm text-yellow-300/70 mb-3">Balance Total</h3>
        <p className="text-2xl text-yellow-400 font-light">${dashboardData.balance.toLocaleString()}</p>
        
        {/* Mini gráfico de barras */}
        <div className="mt-4 h-12 flex items-end space-x-1">
          {[4300, 5100, 4850, 6200, 7400, 6900, 8750].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full ${i === 6 ? 'bg-yellow-400' : 'bg-yellow-600/50'} rounded-t`}
                style={{ height: `${(val / 10000) * 100}%` }}
              ></div>
              {i === 6 && (
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-yellow-400"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex justify-between text-xs text-white/60">
          <span>Enero</span>
          <span>Julio</span>
            </div>
        
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-green-400">+${dashboardData.ingresos.toLocaleString()}</span>
            </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-xs text-red-400">-${dashboardData.gastos.toLocaleString()}</span>
            </div>
            </div>
            </div>
      
      {/* Gráfico de activos vs pasivos */}
      <div className="col-span-1 bg-black/60 rounded-lg p-4 border border-yellow-500/20">
        <h3 className="text-sm text-yellow-300/70 mb-3">Activos vs Pasivos</h3>
        
        {/* Gráfico de dona */}
        <div className="relative h-32 flex justify-center items-center">
          <svg className="w-32 h-32" viewBox="0 0 100 100">
            {/* Arco de fondo */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#4444" 
              strokeWidth="8"
            />
            
            {/* Arco de activos */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#4ade80" 
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            
            {/* Arco de pasivos */}
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#f87171" 
              strokeWidth="8"
              strokeDasharray={`${(dashboardData.deudas/dashboardData.activos) * 251.2} 251.2`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Texto central */}
          <div className="absolute flex flex-col items-center">
            <span className="text-xs text-white/60">Ratio</span>
            <span className="text-lg text-yellow-400 font-light">
              {Math.round((dashboardData.activos / (dashboardData.activos + dashboardData.deudas)) * 100)}%
            </span>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex flex-col">
            <span className="text-xs text-white/60">Activos</span>
            <span className="text-sm text-green-400">+${dashboardData.activos.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/60">Pasivos</span>
            <span className="text-sm text-red-400">-${dashboardData.deudas.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/60">Patrimonio Neto</span>
            <span className="text-sm text-yellow-400">+${(dashboardData.activos - dashboardData.deudas).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Próximos movimientos */}
      <div className="col-span-1 bg-black/60 rounded-lg p-4 border border-yellow-500/20">
        <h3 className="text-sm text-yellow-300/70 mb-3">Próximos Movimientos</h3>
        
        <div className="space-y-3 mt-1">
          {dashboardData.proxPagos.map((pago, index) => (
            <div key={index} className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
              <div className="flex items-center">
                <div className="w-2 h-8 bg-red-400 rounded-l-sm mr-2"></div>
                <div>
                  <span className="text-xs text-white/80 block">{pago.concepto}</span>
                  <span className="text-xs text-white/50 block">{pago.fecha}</span>
                </div>
              </div>
              <span className="text-sm text-red-400 font-mono">-${pago.monto}</span>
            </div>
          ))}
          
          <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-green-400 rounded-l-sm mr-2"></div>
              <div>
                <span className="text-xs text-white/80 block">Sueldo</span>
                <span className="text-xs text-white/50 block">30 Abril</span>
              </div>
            </div>
            <span className="text-sm text-green-400 font-mono">+$3,500</span>
          </div>
          
          <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-white/5">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-yellow-400 rounded-l-sm mr-2"></div>
          <div>
                <span className="text-xs text-white/80 block">Meta ahorro</span>
                <span className="text-xs text-white/50 block">Viaje verano</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400" style={{width: '65%'}}></div>
              </div>
              <span className="text-xs text-yellow-400/70">65%</span>
            </div>
          </div>
          </div>
        </div>
    </div>
  </motion.div>
));
// Asignar displayName para resolver el error de ESLint
Dashboard.displayName = 'Dashboard';
