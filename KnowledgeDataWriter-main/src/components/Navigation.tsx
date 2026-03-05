import React from 'react';
import type { InputMode } from '../types/index';

interface NavigationProps {
  currentMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onOpenHistory: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange, onOpenHistory }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">数据录入平台</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onModeChange('qa')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'qa'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              QA 录入
            </button>
            <button
              onClick={() => onModeChange('segment')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'segment'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              分段录入
            </button>
            <button
              onClick={onOpenHistory}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300"
            >
              📋 历史记录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;