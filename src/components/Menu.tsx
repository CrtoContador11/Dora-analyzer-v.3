import React from 'react';
import { PlusCircle, BarChart, List, FileText, Home } from 'lucide-react';

interface MenuProps {
  currentView: 'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter';
  setCurrentView: (view: 'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter') => void;
  language: 'es' | 'pt';
}

const Menu: React.FC<MenuProps> = ({ currentView, setCurrentView, language }) => {
  const menuItems = [
    { view: 'home', icon: Home, label: { es: 'Inicio', pt: 'Início' } },
    { view: 'questionnaireStarter', icon: PlusCircle, label: { es: 'Nuevo', pt: 'Novo' } },
    { view: 'report', icon: BarChart, label: { es: 'Informe', pt: 'Relatório' } },
    { view: 'savedForms', icon: List, label: { es: 'Guardados', pt: 'Salvos' } },
    { view: 'drafts', icon: FileText, label: { es: 'Borradores', pt: 'Rascunhos' } },
  ];

  return (
    <nav className="bg-white shadow-md overflow-x-auto">
      <div className="container mx-auto px-2 sm:px-4">
        <ul className="flex justify-between sm:justify-start space-x-1 sm:space-x-2 py-2">
          {menuItems.map((item) => (
            <li key={item.view} className="flex-1 sm:flex-none">
              <button
                className={`flex flex-col sm:flex-row items-center justify-center px-2 sm:px-3 py-2 rounded-md transition-colors duration-200 w-full ${
                  currentView === item.view 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                }`}
                onClick={() => setCurrentView(item.view as 'home' | 'form' | 'report' | 'savedForms' | 'drafts' | 'questionnaireStarter')}
              >
                <item.icon className="w-5 h-5 mb-1 sm:mb-0 sm:mr-2" />
                <span className="text-xs sm:text-sm font-medium">{item.label[language]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;