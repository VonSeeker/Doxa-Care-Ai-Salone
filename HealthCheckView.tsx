
import React, { useState } from 'react';
import { Language } from '../types';
import { KUSH_TOPICS, COMMON_HEALTH_TOPICS, COMMON_SYMPTOMS } from '../constants';

interface HealthCheckViewProps {
  language: Language;
  onSearch: (text: string) => void;
}

const HealthCheckView: React.FC<HealthCheckViewProps> = ({ language, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const isKrio = language === Language.KRIO;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const renderSection = (title: string, krioTitle: string, items: any[], bgColor: string, borderColor: string, textColor: string) => (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-5 mb-6 shadow-sm`}>
      <h3 className={`text-sm font-bold ${textColor} mb-4 uppercase tracking-wide`}>
        {isKrio ? krioTitle : title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSearch(item.label)}
            className="bg-white border border-blue-200 hover:border-blue-400 text-blue-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            {isKrio ? item.krioLabel : item.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-green-600 text-2xl">
          <i className="fas fa-file-medical"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {isKrio ? "Check yu ɛlt" : "Health Check"}
        </h2>
      </div>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        {isKrio 
          ? "Ask bɔt symptoms, ɛlt bizness, or kush fɔ gɛt AI ɛp tide." 
          : "Ask about symptoms, health topics, or concerns to get AI-powered information."}
      </p>

      {/* Search Input */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
          {isKrio ? "Ask bɔt ɛni ɛlt bizness:" : "Ask about any health topic:"}
        </label>
        <form onSubmit={handleSubmit} className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isKrio ? "e.g. fiva, kush, wetin fɔ it..." : "e.g. fever, kush withdrawal, nutrition advice"}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 text-sm"
          />
          <button 
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 transition-colors"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Mental Health & Drug Abuse Section */}
      {renderSection(
        "Mental Health & Drug Abuse", 
        "Mɛntal Ɛlt ɛn Drɔgs Ɛp", 
        KUSH_TOPICS, 
        "bg-blue-50", 
        "border-blue-100", 
        "text-blue-800"
      )}

      {/* Common Health Topics Section */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
          {isKrio ? "Common ɛlt bizness" : "Common Health Topics"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_HEALTH_TOPICS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearch(item.label)}
              className="bg-white border border-green-200 hover:border-green-400 text-green-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              {isKrio ? item.krioLabel : item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Common Symptoms Section */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
          {isKrio ? "Common symptoms" : "Common Symptoms"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearch(item.label)}
              className="bg-white border border-green-100 hover:border-green-300 text-green-600 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              {isKrio ? item.krioLabel : item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthCheckView;
