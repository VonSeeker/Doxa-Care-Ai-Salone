
import React from 'react';
import { NavMenuOption, Language } from '../types';
import { DOXA_AI_NAV_MENU } from '../constants';
import BrandIcon from './BrandIcon';

interface HomePageProps {
  onSelectOption: (option: NavMenuOption) => void;
  language: Language;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectOption, language }) => {
  const isKrio = language === Language.KRIO;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-600 to-green-700 text-white px-6 py-10 rounded-b-[40px] shadow-lg mb-8 relative overflow-hidden">
        {/* Decorative Background Icon */}
        <div className="absolute -right-8 -top-8 opacity-10 rotate-12">
          <BrandIcon size={200} color="white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl">
              <BrandIcon className="w-12 h-12" color="white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold leading-tight">
                {isKrio ? "Kushɛ! Aw yu du tide?" : "Welcome to DoxaCare AI"}
              </h2>
              <p className="text-green-100 text-xs font-bold uppercase tracking-widest">Sierra Leone Health Companion</p>
            </div>
          </div>
          
          <p className="text-green-50 opacity-90 text-sm md:text-base mb-8 max-w-sm">
            {isKrio 
              ? "Wi de ya fɔ ɛp yu wit yu ɛlt business na Sa lone. Evriting na fɔ fri ɛn na fɔ yu sese." 
              : "Your trusted health assistant for Sierra Leone. Free, confidential, and available 24/7."}
          </p>
          
          <button 
            onClick={() => onSelectOption({ id: '0', label: 'Start Chat', krioLabel: 'Bigan tɔk', icon: 'fa-comments' })}
            className="bg-white text-green-700 px-8 py-4 rounded-full font-bold shadow-xl flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95"
          >
            <i className="fas fa-comment-dots"></i>
            <span>{isKrio ? "Tɔk to Doxa AI" : "Chat with Doxa AI"}</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-6 pb-10">
        <h3 className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-4">
          {isKrio ? "Wetin wi kin du?" : "Our Core Services"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {DOXA_AI_NAV_MENU.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option)}
              className={`flex flex-col items-center justify-center p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 text-center ${
                option.id === '6' ? 'bg-red-50 border-red-100' : 'bg-white'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                option.id === '6' ? 'bg-red-500 text-white' : 'bg-green-100 text-green-600'
              }`}>
                <i className={`fas ${option.icon} text-xl`}></i>
              </div>
              <span className={`text-xs font-bold leading-tight ${option.id === '6' ? 'text-red-700' : 'text-gray-700'}`}>
                {isKrio ? option.krioLabel : option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-5 flex items-start space-x-4">
          <div className="text-blue-500 mt-1 text-xl">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">
              {isKrio ? "Sese ɛn Fri" : "Private & Secure"}
            </h4>
            <p className="text-xs text-blue-800 opacity-80 leading-relaxed">
              {isKrio 
                ? "Yu nɔ nid fɔ register. Wi nɔ de ask fɔ yu nem or yu fon namba. Evriting sese."
                : "No registration required. We don't ask for your name or phone number. Your health data stays private."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
