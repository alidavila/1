"use client";

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPiggyBank, FaChartPie, FaEdit, FaTrash, FaPlus, 
  FaHome, FaExclamationTriangle, FaRegCheckCircle, FaCog, FaWallet, FaCoins
} from 'react-icons/fa';

// Componente de tarjeta de presupuesto para optimizar renderizado
interface BudgetCardProps {
  category: {
    id: number;
    name: string;
    budget: number;
    spent: number;
    icon: string;
    color: string;
  };
  activePeriod: string;
  onDelete: (id: number) => void;
}

const BudgetCard = ({ 
  category, 
  activePeriod, 
  onDelete, 
}: BudgetCardProps) => {
  // Usar useMemo para evitar recálculos innecesarios
  const categoryProgress = useMemo(() => {
    return category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
  }, [category.budget, category.spent]);
  
  const isOverBudget = useMemo(() => category.spent > category.budget, [category.spent, category.budget]);
  const remainingAmount = useMemo(() => category.budget - category.spent, [category.budget, category.spent]);
  const progressDegrees = useMemo(() => Math.min(categoryProgress, 100) * 3.6, [categoryProgress]);
  
  // Memoizar estilos para evitar recreaciones
  const circleProgressStyle = useMemo(() => ({
    background: `conic-gradient(${isOverBudget ? '#f87171' : category.color} 0deg ${progressDegrees}deg, transparent ${progressDegrees}deg 360deg)`,
    clipPath: 'circle(50%)'
  }), [isOverBudget, category.color, progressDegrees]);
  
  const iconContainerStyle = useMemo(() => ({
    backgroundColor: `${category.color}20`
  }), [category.color]);
  
  // Manejar eventos con useCallback para evitar recreaciones
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(category.id);
  }, [category.id, onDelete]);
  
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Lógica para editar
  }, []);
  
  return (
    <div 
      className="p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[#eab308]/30 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={iconContainerStyle}
          >
            {category.icon}
          </div>
          <div>
            <h3 className="font-medium text-lg">{category.name}</h3>
            <p className="text-white/60 text-sm">
              {activePeriod === 'mensual' ? 'Mes actual' : 
               activePeriod === 'trimestral' ? 'Trimestre actual' : 'Año actual'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-1">
          <button 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={handleEdit}
          >
            <FaEdit className="text-white/70" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={handleDelete}
          >
            <FaTrash className="text-white/70" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-24 h-24">
          {/* Círculo de fondo */}
          <div className="absolute inset-0 rounded-full border-[6px] border-black/20"></div>
          
          {/* Círculo de progreso - sin animación para mejorar rendimiento */}
          <div 
            className="absolute inset-0 rounded-full"
            style={circleProgressStyle}
          ></div>
          
          {/* Círculo central */}
          <div className="absolute inset-[15%] rounded-full bg-[#050505] flex items-center justify-center flex-col">
            <span className="text-xl font-semibold">{Math.round(categoryProgress)}%</span>
            <span className="text-[9px] text-white/60">usado</span>
          </div>
        </div>
        
        <div className="flex-1 ml-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Presupuesto:</span>
              <span className="font-medium">${category.budget}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Gastado:</span>
              <span className="font-medium">${category.spent}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-1 mt-1">
              <span className="text-white/70">Restante:</span>
              <span className={`font-medium ${isOverBudget ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                ${Math.abs(remainingAmount).toFixed(2)}
                {isOverBudget && <span> 🔴</span>}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {isOverBudget && (
        <div className="flex items-center gap-1 mt-3 text-[#f87171] text-xs">
          <FaExclamationTriangle />
          <span>Te has excedido por ${(category.spent - category.budget).toFixed(2)}</span>
        </div>
      )}
      
      {!isOverBudget && category.spent > 0 && (
        <div className="flex items-center gap-1 mt-3 text-[#4ade80] text-xs">
          <FaRegCheckCircle />
          <span>Aún tienes ${(category.budget - category.spent).toFixed(2)} disponibles</span>
        </div>
      )}
    </div>
  );
};

export default function Presupuesto() {
  const [activePeriod, setActivePeriod] = useState('mensual');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Datos de presupuestos por categoría
  const [budgetCategories, setBudgetCategories] = useState([
    { id: 1, name: 'Vivienda', budget: 1200, spent: 1100, icon: '🏠', color: '#f87171' },
    { id: 2, name: 'Alimentación', budget: 800, spent: 650, icon: '🍔', color: '#fb923c' },
    { id: 3, name: 'Transporte', budget: 500, spent: 480, icon: '🚗', color: '#facc15' },
    { id: 4, name: 'Entretenimiento', budget: 300, spent: 375, icon: '🎬', color: '#a3e635' },
    { id: 5, name: 'Servicios', budget: 400, spent: 400, icon: '📱', color: '#38bdf8' },
    { id: 6, name: 'Ahorro', budget: 800, spent: 800, icon: '💰', color: '#4ade80' },
    { id: 7, name: 'Otros', budget: 200, spent: 150, icon: '📦', color: '#a78bfa' }
  ]);
  
  // Estado para el formulario de nueva categoría
  const [newCategory, setNewCategory] = useState({
    name: '',
    budget: 0,
    icon: '📦',
    color: '#a78bfa'
  });
  
  // Calcular totales - memoizar para evitar recálculos innecesarios
  const { totalBudget, totalSpent, remainingBudget, progress } = useMemo(() => {
    const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const remainingBudget = totalBudget - totalSpent;
    const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return { totalBudget, totalSpent, remainingBudget, progress };
  }, [budgetCategories]);
  
  // Función para manejar la eliminación de categorías
  const handleDeleteCategory = useCallback((id: number) => {
    setBudgetCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);
  
  // Función para añadir una nueva categoría
  const handleAddCategory = useCallback(() => {
    if (newCategory.name && newCategory.budget > 0) {
      setBudgetCategories(prev => {
        const newId = Math.max(...prev.map(cat => cat.id), 0) + 1;
        return [
          ...prev,
          {
            id: newId,
            name: newCategory.name,
            budget: newCategory.budget,
            spent: 0,
            icon: newCategory.icon,
            color: newCategory.color
          }
        ];
      });
      
      // Limpiar formulario
      setNewCategory({
        name: '',
        budget: 0,
        icon: '📦',
        color: '#a78bfa'
      });
      
      // Cerrar modal
      setShowAddCategory(false);
    }
  }, [newCategory]);
  
  // Función para renderizar el panel de progreso
  const renderProgressBars = useCallback(() => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgetCategories.map(category => (
          <BudgetCard 
            key={category.id}
            category={category}
            activePeriod={activePeriod}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>
    );
  }, [budgetCategories, activePeriod, handleDeleteCategory]);
  
  // Renderizar resumen
  const renderSummary = useCallback(() => {
    const statusColor = remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]';
    
    return (
      <motion.div 
        className="p-6 bg-black/20 border border-white/10 rounded-xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        layout
      >
        <h3 className="text-xl mb-6 text-[#eab308] font-light">Resumen de Presupuesto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#eab308]/20">
                <FaPiggyBank className="text-[#eab308]" />
              </div>
              <div className="text-3xl font-light">${totalBudget}</div>
            </div>
            <div className="text-sm text-white/70 mt-2">Total Presupuestado</div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-[#f87171]/20">
                <FaWallet className="text-[#f87171]" />
              </div>
              <div className="text-3xl font-light">${totalSpent}</div>
            </div>
            <div className="text-sm text-white/70 mt-2">Total Gastado</div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${remainingBudget >= 0 ? 'bg-[#4ade80]/20' : 'bg-[#f87171]/20'}`}>
                <FaCoins className={remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'} />
              </div>
              <div className={`text-3xl font-light ${statusColor}`}>${Math.abs(remainingBudget)}</div>
            </div>
            <div className="text-sm text-white/70 mt-2">
              {remainingBudget >= 0 ? 'Saldo Disponible' : 'Saldo Excedido'}
            </div>
          </div>
        </div>
        
        <div className="mb-2 flex justify-between text-sm">
          <span>Progreso de Gastos</span>
          <span className={`font-medium ${progress > 100 ? 'text-[#f87171]' : 'text-white/90'}`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        
        <div className="h-4 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${remainingBudget >= 0 ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {remainingBudget < 0 ? (
          <div className="flex items-center gap-2 mt-3 text-[#f87171] text-sm">
            <FaExclamationTriangle />
            <span>Has excedido tu presupuesto mensual en ${Math.abs(remainingBudget).toFixed(2)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-3 text-[#4ade80] text-sm">
            <FaRegCheckCircle />
            <span>Tu presupuesto está bajo control, aún tienes ${remainingBudget.toFixed(2)} disponibles</span>
          </div>
        )}
      </motion.div>
    );
  }, [totalBudget, totalSpent, remainingBudget, progress]);
  
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
          Presupuesto Financiero
        </motion.h2>
      </header>
      
      {/* Selector de período */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <FaChartPie className="text-[#eab308]" />
          <span className="font-medium">Periodo:</span>
        </div>
        <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden">
          {['mensual', 'trimestral', 'anual'].map(period => (
            <motion.button
              key={period}
              className={`px-5 py-2.5 text-sm capitalize ${
                activePeriod === period ? 'bg-[#eab308] text-black font-medium' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActivePeriod(period)}
              whileHover={activePeriod !== period ? { backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {period}
            </motion.button>
          ))}
        </div>
        
        <motion.button
          className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#eab308] text-black rounded-lg font-medium"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddCategory(true)}
        >
          <FaPlus /> Añadir Categoría
        </motion.button>
      </motion.div>
      
      {/* Resumen */}
      {renderSummary()}
      
      {/* Secciones de presupuesto */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h3 className="text-xl text-[#eab308] font-light flex items-center gap-2">
            <FaChartPie className="text-xl" /> Presupuesto por Categorías
          </h3>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg text-white/70 hover:text-white text-sm border border-white/10 hover:border-white/20 transition-colors">
            <FaCog /> Ajustes
          </button>
        </div>
        
        {renderProgressBars()}
      </motion.div>
      
      {/* Modal para añadir categoría */}
      <AnimatePresence>
        {showAddCategory && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddCategory(false)}
          >
            <motion.div 
              className="bg-[#121212] border border-[#eab308]/20 rounded-xl p-8 w-full max-w-md shadow-lg"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light text-[#eab308] flex items-center gap-2">
                  <FaPlus />
                  <span>Nueva Categoría de Presupuesto</span>
                </h3>
                <motion.button
                  className="p-2 rounded-full hover:bg-black/30 text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddCategory(false)}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Nombre de la Categoría</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50 transition-colors"
                    value={newCategory.name}
                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="Ej. Comidas fuera, Mascotas, Educación..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Presupuesto Mensual</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                    <input 
                      type="number" 
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 pl-8 focus:outline-none focus:border-[#eab308]/50 transition-colors"
                      value={newCategory.budget}
                      onChange={e => setNewCategory({...newCategory, budget: parseFloat(e.target.value)})}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Ícono</label>
                    <select 
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50 transition-colors"
                      value={newCategory.icon}
                      onChange={e => setNewCategory({...newCategory, icon: e.target.value})}
                    >
                      <option value="📦">📦 General</option>
                      <option value="🏠">🏠 Vivienda</option>
                      <option value="🍔">🍔 Alimentación</option>
                      <option value="🚗">🚗 Transporte</option>
                      <option value="🎬">🎬 Entretenimiento</option>
                      <option value="📱">📱 Servicios</option>
                      <option value="💰">💰 Ahorro</option>
                      <option value="💻">💻 Tecnología</option>
                      <option value="👕">👕 Ropa</option>
                      <option value="🏥">🏥 Salud</option>
                      <option value="🎓">🎓 Educación</option>
                      <option value="🏋️">🏋️ Deportes</option>
                      <option value="🐶">🐶 Mascotas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Color</label>
                    <select
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#eab308]/50 transition-colors"
                      value={newCategory.color}
                      onChange={e => setNewCategory({...newCategory, color: e.target.value})}
                    >
                      <option value="#f87171">🔴 Rojo</option>
                      <option value="#fb923c">🟠 Naranja</option>
                      <option value="#facc15">🟡 Amarillo</option>
                      <option value="#4ade80">🟢 Verde</option>
                      <option value="#38bdf8">🔵 Azul</option>
                      <option value="#a78bfa">🟣 Púrpura</option>
                      <option value="#e879f9">🌸 Rosa</option>
                      <option value="#a8a29e">⚪ Gris</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <motion.button
                    className="flex-1 px-4 py-3 border border-white/10 text-white bg-black/20 rounded-lg transition-colors hover:bg-black/30 hover:border-white/20"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    className="flex-1 px-4 py-3 bg-[#eab308] text-black font-medium rounded-lg transition-colors hover:bg-[#eab308]/90"
                    whileHover={{ scale: 1.01, boxShadow: '0 0 15px rgba(234, 179, 8, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddCategory}
                    disabled={!newCategory.name || newCategory.budget <= 0}
                  >
                    Añadir Categoría
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navegación */}
      <motion.div 
        className="w-full max-w-4xl mx-auto my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'Inicio', path: '/' },
            { name: 'Calendario', path: '/calendario' },
            { name: 'Análisis', path: '/analisis' },
            { name: 'Cuentas', path: '/cuentas' },
            { name: 'Deudas', path: '/deudas' },
            { name: 'Objetivos', path: '/objetivos' },
            { name: 'Inversiones', path: '/inversiones' }
          ].map((option) => (
            <Link
              key={option.name}
              href={option.path}
            >
              <motion.div
                className="bg-[#1c1c1c] border border-[#eab308] rounded-md py-2 px-4 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                {option.name}
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