
import React, { useState } from 'react';
import { Language } from '../types';
import { MATERNAL_CARE_TOPICS, MATERNAL_SYMPTOMS } from '../constants';

interface MaternalCareViewProps {
  language: Language;
  onSearch: (text: string) => void;
}

const MaternalCareView: React.FC<MaternalCareViewProps> = ({ language, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const isKrio = language === Language.KRIO;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-pink-600 text-2xl">
          <i className="fas fa-baby-carriage"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {isKrio ? "Bɛlɛ ɛn Pikin Care" : "Maternal & Child Care"}
        </h2>
      </div>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        {isKrio 
          ? "Ask bɔt bɛlɛ bizness, aw fɔ minded pikin, or fɔ gɛt ɛp fɔ yu mami-body." 
          : "Get trusted guidance on pregnancy, child health, vaccinations, and postnatal recovery."}
      </p>

      {/* Search Input */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
          {isKrio ? "Ask bɔt bɛlɛ or pikin ɛlt:" : "Search pregnancy or child health:"}
        </label>
        <form onSubmit={handleSubmit} className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500 transition-all shadow-sm">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isKrio ? "e.g. bɛlɛ it, pikin fiva, vaccination..." : "e.g. pregnancy diet, baby fever, child vaccines"}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 text-sm"
          />
          <button 
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 transition-colors"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Common Maternal Topics */}
      <div className="bg-pink-50 border border-pink-100 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <i className="fas fa-heartbeat text-pink-600"></i>
          <h3 className="text-sm font-bold text-pink-800 uppercase tracking-wide">
            {isKrio ? "Bɛlɛ Bizness Topics" : "Pregnancy & Motherhood"}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {MATERNAL_CARE_TOPICS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearch(item.label)}
              className="bg-white border border-pink-200 hover:border-pink-400 text-pink-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              {isKrio ? item.krioLabel : item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pregnancy Symptoms */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <i className="fas fa-stethoscope text-orange-600"></i>
          <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide">
            {isKrio ? "Bɛlɛ Symptoms" : "Pregnancy Symptoms"}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {MATERNAL_SYMPTOMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearch(item.label)}
              className="bg-white border border-orange-200 hover:border-orange-400 text-orange-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              {isKrio ? item.krioLabel : item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helpful Tip */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
        <h4 className="font-bold mb-2 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          {isKrio ? "Check yu mami-book" : "Antenatal Record"}
        </h4>
        <p className="text-xs text-pink-50 opacity-90 leading-relaxed">
          {isKrio 
            ? "Mami-book na di mɔst impotant tin wen yu gɛt bɛlɛ. Mek yu go hospital evri tɛm fɔ check yu ɛn yu pikin."
            : "Your Antenatal record is your most important tool during pregnancy. Ensure you visit the clinic regularly for check-ups for you and your baby."}
        </p>
      </div>
    </div>
  );
};

export default MaternalCareView;
