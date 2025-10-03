import React from 'react';
import { BarChart3, Plus, Settings, FileText, Bell, Banknote, PlusCircle } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'create', name: 'Add Expense', icon: Plus },
    { id: 'create-funding', name: 'Add Funding', icon: PlusCircle },
    { id: 'manage', name: 'Manage Expense', icon: Settings },
    { id: 'funding', name: 'Manage Funding', icon: Banknote },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'reminders', name: 'Reminders', icon: Bell },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Navigation sidebar */}
      <nav className={`
        bg-white shadow-sm border-r border-pink-100 min-h-screen w-64 
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-4">
        {/* Mobile close button */}
        <div className="flex justify-end lg:hidden mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Close menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FE4066] to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-[#FE4066]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      </nav>
    </>
  );
};

export default Navigation;