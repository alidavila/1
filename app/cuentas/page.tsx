"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaHome, FaWallet, FaSync, FaSyncAlt, FaChartPie, 
  FaInfoCircle, FaRegClock, FaPlus, FaRegEye,
  FaFilter, FaSearch, FaDownload, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { Cuenta, TipoCuenta, Transaccion } from '../../types';

export default function Cuentas() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarGrafico, setMostrarGrafico] = useState(true);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<Cuenta | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaCuenta, setNuevaCuenta] = useState<Partial<Cuenta>>({
    nombre: '',
    tipo: 'corriente',
    saldo: 0
  });
  
  // Datos simulados para las transacciones
  const transactions: Transaccion[] = [
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

  useEffect(() => {
    // En un entorno real, aquí cargaríamos los datos desde la API de n8n
    // Para el ejemplo, usamos datos de prueba estáticos
    const cuentasEjemplo: Cuenta[] = [
      {
        id: "1",
        nombre: "Cuenta Nómina BBVA",
        tipo: "corriente",
        saldo: 3850.75,
        ultimaActualizacion: "2025-04-02T10:35:21"
      },
      {
        id: "2",
        nombre: "Ahorros Santander",
        tipo: "ahorro",
        saldo: 15200.50,
        ultimaActualizacion: "2025-04-01T22:15:10"
      },
      {
        id: "3",
        nombre: "Hey Banco",
        tipo: "digital",
        saldo: 4250.33,
        ultimaActualizacion: "2025-04-03T08:10:05"
      },
      {
        id: "4",
        nombre: "Mercado Pago",
        tipo: "ewallet",
        saldo: 875.20,
        ultimaActualizacion: "2025-04-02T15:45:30"
      },
      {
        id: "5",
        nombre: "Naranja X",
        tipo: "digital",
        saldo: 620.15,
        ultimaActualizacion: "2025-04-01T12:30:45"
      }
    ];
    
    setTimeout(() => {
      setCuentas(cuentasEjemplo);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Calcular el saldo total de todas las cuentas
  const saldoTotal = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
  
  // Formatear montos a formato de dinero
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Obtener el tiempo transcurrido desde la última actualización
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const updateDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60));
      return `hace ${diffInMinutes} minutos`;
    } else if (diffInHours < 24) {
      return `hace ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `hace ${diffInDays} días`;
    }
  };
  
  // Obtener un color asociado al tipo de cuenta
  const getTipoCuentaColor = (tipo: TipoCuenta) => {
    switch (tipo) {
      case 'corriente':
        return '#3b82f6'; // Azul
      case 'ahorro':
        return '#10b981'; // Verde
      case 'digital':
        return '#8b5cf6'; // Púrpura
      case 'ewallet':
        return '#f59e0b'; // Ámbar
      default:
        return '#64748b'; // Gris 
    }
  };
  
  // Traducir el tipo de cuenta
  const traducirTipoCuenta = (tipo: TipoCuenta) => {
    switch (tipo) {
      case 'corriente':
        return 'Cuenta Corriente';
      case 'ahorro':
        return 'Cuenta de Ahorro';
      case 'digital':
        return 'Banco Digital';
      case 'ewallet':
        return 'Billetera Electrónica';
      default:
        return tipo;
    }
  };
  
  // Manejar clic en el botón de ver detalles
  const handleVerDetalles = (cuenta: Cuenta) => {
    setCuentaSeleccionada(cuenta);
    setMostrarFormulario(false); // Cerrar el formulario si estaba abierto
  };
  
  // Manejar clic en el botón de agregar cuenta
  const handleAgregarCuenta = () => {
    setMostrarFormulario(true);
    setCuentaSeleccionada(null); // Cerrar los detalles si estaban abiertos
    setNuevaCuenta({
      nombre: '',
      tipo: 'corriente',
      saldo: 0
    });
  };
  
  // Manejar cambios en el formulario de nueva cuenta
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaCuenta({
      ...nuevaCuenta,
      [name]: name === 'saldo' ? parseFloat(value) || 0 : value
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar datos
    if (!nuevaCuenta.nombre || !nuevaCuenta.tipo) {
      return; // Implementar validación visual
    }
    
    // Crear nueva cuenta
    const nuevaCuentaCompleta: Cuenta = {
      id: `${cuentas.length + 1}`,
      nombre: nuevaCuenta.nombre || '',
      tipo: nuevaCuenta.tipo as TipoCuenta || 'corriente',
      saldo: nuevaCuenta.saldo || 0,
      ultimaActualizacion: new Date().toISOString()
    };
    
    // Actualizar lista de cuentas
    setCuentas([...cuentas, nuevaCuentaCompleta]);
    
    // Cerrar formulario
    setMostrarFormulario(false);
  };
  
  // Filtrar transacciones por cuenta seleccionada (simulado)
  const filtrarTransaccionesPorCuenta = (cuentaId: string) => {
    // En un entorno real, aquí filtraríamos las transacciones por ID de cuenta
    // Para simplificar, solo mostramos las primeras 4 transacciones
    return transactions.slice(0, 4);
  };
  
  // Renderizar gráfico de pastel para las cuentas
  const renderPieChart = () => {
    return (
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Gráfico circular */}
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full border border-white/10"></div>
          
          {cuentas.map((cuenta, idx) => {
            const porcentaje = (cuenta.saldo / saldoTotal) * 100;
            const color = getTipoCuentaColor(cuenta.tipo);
            const gradoInicio = idx === 0 ? 0 : cuentas.slice(0, idx).reduce((sum, c) => sum + ((c.saldo / saldoTotal) * 360), 0);
            const gradoFin = gradoInicio + ((cuenta.saldo / saldoTotal) * 360);
            
            return (
              <motion.div
                key={cuenta.id}
                className="absolute w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  background: `conic-gradient(transparent ${gradoInicio}deg, ${color} ${gradoInicio}deg, ${color} ${gradoFin}deg, transparent ${gradoFin}deg)`,
                  borderRadius: '50%',
                }}
              ></motion.div>
            );
          })}
          
          <div className="absolute inset-[25%] bg-[#050505] rounded-full flex items-center justify-center text-center">
            <div>
              <div className="text-xs text-white/70">Saldo Total</div>
              <div className="font-medium text-[#eab308]">{formatCurrency(saldoTotal)}</div>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cuentas.map((cuenta) => {
            const porcentaje = ((cuenta.saldo / saldoTotal) * 100).toFixed(1);
            
            return (
              <motion.div 
                key={cuenta.id}
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getTipoCuentaColor(cuenta.tipo) }}
                ></div>
                <div>
                  <div className="text-sm">{cuenta.nombre}</div>
                  <div className="text-xs text-white/70">{formatCurrency(cuenta.saldo)} ({porcentaje}%)</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Renderizar lista de transacciones
  const renderTransactions = () => {
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-[#eab308]">Movimientos Recientes</h3>
          <div className="flex items-center gap-2">
            <motion.button 
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilter className="text-white/70" />
            </motion.button>
            <motion.button 
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSearch className="text-white/70" />
            </motion.button>
            <motion.button 
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload className="text-white/70" />
            </motion.button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {transactions.map(transaction => (
            <motion.div
              key={transaction.id}
              className="p-3 bg-black/20 border border-white/10 rounded-lg flex items-center justify-between hover:border-[#eab308]/30 transition-colors"
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'ingreso' ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-[#f87171]/20 text-[#f87171]'
                  }`}
                >
                  {transaction.type === 'ingreso' ? <FaArrowUp /> : <FaArrowDown />}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-white/70">{transaction.category} · {transaction.date}</div>
                </div>
              </div>
              <div className={`font-medium ${transaction.type === 'ingreso' ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                {transaction.type === 'ingreso' ? '+' : '-'}${transaction.amount}
              </div>
            </motion.div>
          ))}
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
          Gestión de Cuentas
        </motion.h2>
      </header>
      
      {/* Resumen de cuentas */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaWallet className="text-[#eab308]" />
            <h3 className="text-lg">Resumen de Cuentas</h3>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              className={`p-2 rounded-lg ${mostrarGrafico ? 'bg-[#eab308]/20 text-[#eab308]' : 'bg-black/30 text-white/70'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMostrarGrafico(!mostrarGrafico)}
            >
              <FaChartPie />
            </motion.button>
            {isLoading ? (
              <motion.div
                className="p-2 rounded-lg bg-black/30"
                animate={{
                  rotate: 360
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear"
                }}
              >
                <FaSyncAlt className="text-white/70" />
              </motion.div>
            ) : (
              <motion.button
                className="p-2 rounded-lg bg-black/30 text-white/70"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSync />
              </motion.button>
            )}
            <motion.button
              className="p-2 rounded-lg bg-[#eab308] text-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAgregarCuenta}
            >
              <FaPlus />
            </motion.button>
          </div>
        </div>
        
        {/* Tarjeta de saldo total */}
        <motion.div
          className="bg-black/20 border border-white/10 rounded-lg p-6 mb-6 text-center"
          whileHover={{ borderColor: 'rgba(234, 179, 8, 0.3)' }}
        >
          <div className="text-sm text-white/70 mb-1">SALDO TOTAL DISPONIBLE</div>
          <div className="text-4xl font-light text-[#eab308]">
            {isLoading ? (
              <motion.div 
                className="h-10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            ) : (
              formatCurrency(saldoTotal)
            )}
          </div>
          <div className="text-xs text-white/50 mt-2">Total consolidado en {cuentas.length} cuentas activas</div>
        </motion.div>
        
        {/* Gráfico de distribución (opcional) */}
        {mostrarGrafico && !isLoading && (
          <motion.div
            className="bg-black/20 border border-white/10 rounded-lg p-6 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FaChartPie className="text-[#eab308]" />
              <h3 className="font-medium">Distribución por Cuenta</h3>
            </div>
            {renderPieChart()}
          </motion.div>
        )}
      </motion.div>
      
      {/* Tabla de cuentas */}
      <motion.div
        className="bg-black/20 border border-white/10 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg text-[#eab308] mb-4">Detalle de Cuentas</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                className="h-16 bg-white/5 rounded-lg"
                animate={{ opacity: [0.1, 0.15, 0.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead className="bg-black/30">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre de la Cuenta</th>
                  <th className="px-4 py-3 text-left">Tipo de Cuenta</th>
                  <th className="px-4 py-3 text-right">Saldo Actual</th>
                  <th className="px-4 py-3 text-center">Última Actualización</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map(cuenta => (
                  <motion.tr 
                    key={cuenta.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{cuenta.nombre}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: getTipoCuentaColor(cuenta.tipo) }}
                        ></div>
                        <div className="text-sm">{traducirTipoCuenta(cuenta.tipo)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className={`font-medium ${cuenta.saldo > 0 ? 'text-[#4ade80]' : cuenta.saldo === 0 ? 'text-white/50' : 'text-[#f87171]'}`}>
                        {formatCurrency(cuenta.saldo)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-white/70">
                        <FaRegClock className="text-xs" />
                        <span className="text-xs">{getTimeAgo(cuenta.ultimaActualizacion)}</span>
                      </div>
                      <div className="text-xs text-white/50 mt-1">{formatDateTime(cuenta.ultimaActualizacion)}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <motion.button
                        className="p-2 rounded-lg bg-black/30 text-white/70 hover:text-white"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerDetalles(cuenta)}
                      >
                        <FaRegEye />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {/* Detalles de la cuenta seleccionada */}
      {cuentaSeleccionada && (
        <motion.div
          className="bg-black/20 border border-[#eab308]/30 rounded-lg p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaWallet className="text-[#eab308]" />
              <h3 className="text-lg">Detalles de la Cuenta</h3>
            </div>
            <motion.button
              className="p-2 rounded-full bg-black/30 text-white/70 hover:text-white"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCuentaSeleccionada(null)}
            >
              ✕
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-white/70 mb-1">Nombre de la Cuenta</h4>
                <div className="text-xl font-medium">{cuentaSeleccionada.nombre}</div>
              </div>
              
              <div>
                <h4 className="text-sm text-white/70 mb-1">Tipo de Cuenta</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getTipoCuentaColor(cuentaSeleccionada.tipo) }}
                  ></div>
                  <div>{traducirTipoCuenta(cuentaSeleccionada.tipo)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-white/70 mb-1">Saldo Actual</h4>
                <div className={`text-2xl font-medium ${cuentaSeleccionada.saldo >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {formatCurrency(cuentaSeleccionada.saldo)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-white/70 mb-1">Última Actualización</h4>
                <div>{formatDateTime(cuentaSeleccionada.ultimaActualizacion)}</div>
                <div className="text-xs text-white/50 mt-1">{getTimeAgo(cuentaSeleccionada.ultimaActualizacion)}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium mb-3">Movimientos Recientes</h4>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {filtrarTransaccionesPorCuenta(cuentaSeleccionada.id).map(transaction => (
                  <motion.div
                    key={transaction.id}
                    className="p-3 bg-black/30 border border-white/10 rounded-lg flex items-center justify-between"
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'ingreso' ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-[#f87171]/20 text-[#f87171]'
                        }`}
                      >
                        {transaction.type === 'ingreso' ? <FaArrowUp /> : <FaArrowDown />}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-xs text-white/70">{transaction.category} · {transaction.date}</div>
                      </div>
                    </div>
                    <div className={`font-medium ${transaction.type === 'ingreso' ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                      {transaction.type === 'ingreso' ? '+' : '-'}${transaction.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <motion.button
                  className="px-4 py-2 bg-[#eab308]/20 text-[#eab308] rounded-lg font-medium text-sm hover:bg-[#eab308]/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ver Todos los Movimientos
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Formulario para añadir nueva cuenta */}
      {mostrarFormulario && (
        <motion.div
          className="bg-black/20 border border-[#eab308]/30 rounded-lg p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FaPlus className="text-[#eab308]" />
              <h3 className="text-lg">Añadir Nueva Cuenta</h3>
            </div>
            <motion.button
              className="p-2 rounded-full bg-black/30 text-white/70 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMostrarFormulario(false)}
            >
              ✕
            </motion.button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm text-white/70 mb-2">Nombre de la Cuenta</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
                  value={nuevaCuenta.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej. Cuenta Nómina BBVA"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="tipo" className="block text-sm text-white/70 mb-2">Tipo de Cuenta</label>
                <select
                  id="tipo"
                  name="tipo"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
                  value={nuevaCuenta.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="corriente">Cuenta Corriente</option>
                  <option value="ahorro">Cuenta de Ahorro</option>
                  <option value="digital">Banco Digital</option>
                  <option value="ewallet">Billetera Electrónica</option>
                  <option value="efectivo">Efectivo</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="saldo" className="block text-sm text-white/70 mb-2">Saldo Inicial</label>
              <input
                type="number"
                id="saldo"
                name="saldo"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50"
                value={nuevaCuenta.saldo}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <motion.button
                type="button"
                className="px-4 py-2 bg-black/30 text-white/70 rounded-lg"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </motion.button>
              
              <motion.button
                type="submit"
                className="px-4 py-2 bg-[#eab308] text-black rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Guardar Cuenta
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Movimientos recientes */}
      <motion.div
        className="bg-black/20 border border-white/10 rounded-lg p-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {renderTransactions()}
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
            { name: 'Calendario', path: '/calendario', icon: <FaRegClock /> },
            { name: 'Presupuesto', path: '/presupuesto', icon: <FaWallet /> },
            { name: 'Análisis', path: '/analisis', icon: <FaChartPie /> },
            { name: 'Deudas', path: '/deudas', icon: <FaInfoCircle /> }
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