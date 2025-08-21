import React from 'react';

interface HeaderProps {
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl" role="img" aria-label="Salad emoji logo">🥗</span>
          <h1 className="text-2xl font-bold text-gray-800">QaloriAI</h1>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Reset Profile
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;