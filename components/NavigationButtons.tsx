'use client';

const NavigationButtons = () => {
  const navigationOptions = [
    { id: 'calendario', label: 'Calendario económico' },
    { id: 'presupuesto', label: 'Presupuesto' },
    { id: 'analisis', label: 'Análisis financiero' },
    { id: 'cuentas', label: 'Cuentas' },
    { id: 'deudas', label: 'Deudas' },
    { id: 'objetivos', label: 'Objetivos' },
    { id: 'inversiones', label: 'Inversiones' },
  ];

  const handleNavigation = (id: string) => {
    // Por ahora solo mostramos un mensaje en consola
    // En el futuro, esto manejará la navegación real
    console.log(`Navegando a: ${id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <div className="flex flex-wrap justify-center gap-3">
        {navigationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleNavigation(option.id)}
            className="nav-button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationButtons; 