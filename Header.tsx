
import React from 'react';
import { Language } from '../types';
import BrandIcon from './BrandIcon';

interface HeaderProps {
  view: 'home' | 'chat' | 'health-check';
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ view, onBack, language, setLanguage }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between no-print">
      <div className="flex items-center space-x-2">
        {view !== 'home' && (
          <button 
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-90 transition-all"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <div className="flex items-center">
          <BrandIcon className="w-10 h-10 text-green-600 mr-2" />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-800 leading-none">DoxaCare</h1>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Health Assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Language Switcher Toggle */}
        <div className="flex bg-gray-100 p-0.5 rounded-full border border-gray-200 shadow-inner">
          <button
            onClick={() => setLanguage(Language.ENGLISH)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              language === Language.ENGLISH 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage(Language.KRIO)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
              language === Language.KRIO 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KR
          </button>
        </div>

        <a 
          href="tel:117" 
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center shadow-lg transition-transform active:scale-95"
          title="Emergency 117"
        >
          <i className="fas fa-phone-alt animate-pulse"></i>
          <span className="ml-2 hidden sm:inline">117</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
