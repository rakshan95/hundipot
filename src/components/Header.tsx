import React from 'react';
import { Heart, Menu } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#FE4066] to-pink-500 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                GoGo
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Expense Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{currentSection}</p>
              <p className="text-xs text-gray-500">Welcome back!</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-[#FE4066] to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">G</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;