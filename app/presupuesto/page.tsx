"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPiggyBank, FaChartPie, FaEdit, FaTrash, FaPlus, 
  FaHome, FaExclamationTriangle, FaRegCheckCircle, FaCog
} from 'react-icons/fa';

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
  
  // Calcular totales
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Función para manejar la eliminación de categorías
  const handleDeleteCategory = (id: number) => {
    setBudgetCategories(budgetCategories.filter(cat => cat.id !== id));
  };
  
  // Función para añadir una nueva categoría
  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budget > 0) {
      const newId = Math.max(...budgetCategories.map(cat => cat.id), 0) + 1;
      setBudgetCategories([
        ...budgetCategories,
        {
          id: newId,
          name: newCategory.name,
          budget: newCategory.budget,
          spent: 0,
          icon: newCategory.icon,
          color: newCategory.color
        }
      ]);
      
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
  };
  
  // Función para renderizar el panel de progreso
  const renderProgressBars = () => {
    return (
      <div className="space-y-4">
        {budgetCategories.map(category => {
          const categoryProgress = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
          const isOverBudget = category.spent > category.budget;
          
          return (
            <motion.div 
              key={category.id}
              className="p-4 bg-black/20 border border-white/10 rounded-lg hover:border-[#eab308]/30 transition-colors"
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedCategory(category.id.toString())}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1.5 rounded-full hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Lógica para editar
                    }}
                  >
                    <FaEdit className="text-white/70" />
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                  >
                    <FaTrash className="text-white/70" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-1">
                <span>Gastado: ${category.spent}</span>
                <span>Presupuesto: ${category.budget}</span>
              </div>
              
              <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${isOverBudget ? 'bg-[#f87171]' : 'bg-[#4ade80]'}`}
                  style={{ width: `${Math.min(categoryProgress, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(categoryProgress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {isOverBudget && (
                <div className="flex items-center gap-1 mt-1 text-[#f87171] text-xs">
                  <FaExclamationTriangle />
                  <span>Te has pasado del presupuesto por ${(category.spent - category.budget).toFixed(2)}</span>
                </div>
              )}
              
              {!isOverBudget && category.spent > 0 && (
                <div className="flex items-center gap-1 mt-1 text-[#4ade80] text-xs">
                  <FaRegCheckCircle />
                  <span>Te quedan ${(category.budget - category.spent).toFixed(2)} disponibles</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };
  
  // Renderizar resumen
  const renderSummary = () => {
    const statusColor = remainingBudget >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]';
    
    return (
      <motion.div 
        className="p-4 bg-black/20 border border-white/10 rounded-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg mb-4 text-[#eab308]">Resumen de Presupuesto</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-white/70">Total Presupuestado</div>
            <div className="text-xl font-medium">${totalBudget}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/70">Total Gastado</div>
            <div className="text-xl font-medium">${totalSpent}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/70">Restante</div>
            <div className={`text-xl font-medium ${statusColor}`}>
              ${remainingBudget}
            </div>
          </div>
        </div>
        
        <div className="mb-2 flex justify-between text-sm">
          <span>Progreso</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        
        <div className="h-3 bg-black/30 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${remainingBudget >= 0 ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>
        
        {remainingBudget < 0 ? (
          <div className="flex items-center gap-1 mt-2 text-[#f87171] text-sm">
            <FaExclamationTriangle />
            <span>Te has excedido del presupuesto total</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-2 text-[#4ade80] text-sm">
            <FaRegCheckCircle />
            <span>Tu presupuesto está bajo control</span>
          </div>
        )}
      </motion.div>
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
          Presupuesto Financiero
        </motion.h2>
      </header>
      
      {/* Selector de período */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span>Periodo:</span>
        <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden">
          {['mensual', 'trimestral', 'anual'].map(period => (
            <motion.button
              key={period}
              className={`px-4 py-2 text-sm capitalize ${
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
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#eab308] text-black rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddCategory(true)}
        >
          <FaPlus /> Nueva Categoría
        </motion.button>
      </motion.div>
      
      {/* Resumen */}
      {renderSummary()}
      
      {/* Secciones de presupuesto */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[#eab308] flex items-center gap-2">
            <FaChartPie /> Presupuesto por Categorías
          </h3>
          <button className="flex items-center gap-1 text-white/70 hover:text-white">
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
              className="bg-[#121212] border border-white/10 rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-medium mb-4 text-[#eab308]">Añadir Nueva Categoría</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nombre</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#eab308]"
                    value={newCategory.name}
                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Presupuesto Mensual</label>
                  <input 
                    type="number" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#eab308]"
                    value={newCategory.budget}
                    onChange={e => setNewCategory({...newCategory, budget: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Ícono</label>
                  <select 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#eab308]"
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
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Color</label>
                  <select
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#eab308]"
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
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    className="flex-1 px-4 py-2 border border-white/20 text-white bg-black/20 rounded-lg hover:bg-black/40"
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-[#eab308] text-black font-medium rounded-lg hover:bg-[#eab308]/90"
                    onClick={handleAddCategory}
                  >
                    Añadir
                  </button>
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