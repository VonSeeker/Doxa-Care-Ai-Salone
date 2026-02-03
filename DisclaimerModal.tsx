
import React from 'react';
import { Language } from '../types';
import BrandIcon from './BrandIcon';

interface DisclaimerModalProps {
  language: Language;
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ language, onAccept }) => {
  const isKrio = language === Language.KRIO;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center bg-green-50 border-b border-green-100">
          <BrandIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-800">
            {isKrio ? "Sefity Fɔst!" : "Safety First!"}
          </h2>
          <p className="text-green-700 text-xs font-bold uppercase tracking-widest mt-1">Important Disclaimer</p>
        </div>
        
        <div className="p-8 overflow-y-auto max-h-[50vh] space-y-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-user-md text-red-500 mt-1"></i>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isKrio 
                ? "DoxaCare AI nɔto dokta. Wi de ya fɔ giv yu information nɔmɔ. If yu sik bad bad wan, go hospital or kɔl 117."
                : "DoxaCare AI is an information tool, NOT a licensed medical professional. It does not provide medical diagnosis or treatment."}
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <i className="fas fa-shield-alt text-blue-500 mt-1"></i>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isKrio 
                ? "Evriting we wi tɔk de ya sese. Wi nɔ de aks fɔ yu nem or yu fon namba."
                : "Your privacy is protected. We do not store your identity, name, or phone number."}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center space-x-3">
            <i className="fas fa-phone-alt text-red-600 animate-bounce"></i>
            <span className="text-xs font-bold text-red-800">
              {isKrio ? "Emerjɛnsi? Kɔl 117 naw!" : "Emergency? Call 117 immediately!"}
            </span>
          </div>
        </div>

        <div className="p-8 pt-0">
          <button
            onClick={onAccept}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 text-lg"
          >
            {isKrio ? "A gri fɔ bigin" : "I understand & Agree"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
