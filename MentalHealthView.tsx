
import React, { useState } from 'react';
import { Language } from '../types';
import { KUSH_TOPICS } from '../constants';

interface MentalHealthViewProps {
  language: Language;
  onSearch: (text: string) => void;
}

const MENTAL_HEALTH_CONCERNS = [
  { id: 'm1', label: 'Anxiety', krioLabel: 'Wori tumɔch' },
  { id: 'm2', label: 'Depression', krioLabel: 'Sɔri tumɔch' },
  { id: 'm3', label: 'Stress', krioLabel: 'Stress' },
  { id: 'm4', label: 'Sleep Issues', krioLabel: 'Slep biznɛs' },
  { id: 'm5', label: 'Grief', krioLabel: 'Kray fɔ dɛd' },
];

const MentalHealthView: React.FC<MentalHealthViewProps> = ({ language, onSearch }) => {
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
        <div className="text-blue-600 text-2xl">
          <i className="fas fa-hand-holding-heart"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {isKrio ? "Mɛntal Ɛlt ɛn Drɔgs Ɛp" : "Mental Health & Drug Abuse"}
        </h2>
      </div>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        {isKrio 
          ? "Wi de ya fɔ ɛp yu wit Kush addiction ɛn mental ɛlt biznɛs. Evriting sese ɛn fri." 
          : "We are here to support you with drug addiction and mental health concerns. Everything is confidential and free."}
      </p>

      {/* Search Input */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
          {isKrio ? "Wetin de du yu or yu padi?" : "What's on your mind?"}
        </label>
        <form onSubmit={handleSubmit} className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isKrio ? "e.g. wetin na kush, anxiety..." : "e.g. what is kush, anxiety, help for a friend"}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 text-sm"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 transition-colors"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Kush Support Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <i className="fas fa-shield-virus text-blue-600"></i>
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide">
            {isKrio ? "Kush Addiction Ɛp" : "Kush Addiction Support"}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {KUSH_TOPICS.map((item) => (
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

      {/* Mental Wellness Section */}
      <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <i className="fas fa-brain text-purple-600"></i>
          <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wide">
            {isKrio ? "Mental Wellness" : "Mental Wellness"}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {MENTAL_HEALTH_CONCERNS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearch(item.label)}
              className="bg-white border border-purple-200 hover:border-purple-400 text-purple-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              {isKrio ? item.krioLabel : item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Encouragement Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-md">
        <h4 className="font-bold mb-2 flex items-center">
          <i className="fas fa-heart mr-2"></i>
          {isKrio ? "Yu nɔ de yu wan" : "You are not alone"}
        </h4>
        <p className="text-xs text-blue-50 opacity-90 leading-relaxed">
          {isKrio 
            ? "Mɛntal ɛlt ɛn Kush addiction na biznɛs we wi kin ɛp yu wit. Nɔ fred fɔ ask fɔ ɛp tide. Evriting we wi tɔk de ya sese."
            : "Mental health and drug addiction are concerns we can help with. Don't be afraid to ask for help today. Everything we discuss here is private."}
        </p>
      </div>
    </div>
  );
};

export default MentalHealthView;
