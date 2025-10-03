import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <ellipse cx="50" cy="65" rx="38" ry="28" fill="#2563eb" />
                <path d="M 12 65 Q 12 42 50 38 Q 88 42 88 65" fill="#3b82f6" />
                <circle cx="45" cy="35" r="8" fill="#fbbf24" />
                <circle cx="55" cy="32" r="8" fill="#fbbf24" />
                <circle cx="50" cy="40" r="7" fill="#fbbf24" />
                <circle cx="38" cy="38" r="6" fill="#fbbf24" />
                <circle cx="62" cy="37" r="6" fill="#fbbf24" />
                <text x="50" y="58" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">₹</text>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                HundiPot
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Expense Tracker</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{currentSection}</p>
              <p className="text-xs text-gray-500">Welcome back!</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;