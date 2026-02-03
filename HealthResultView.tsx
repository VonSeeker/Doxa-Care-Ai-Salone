
import React, { useState } from 'react';
import { HealthAnalysis, CarePlan, Language } from '../types';
import { generateCarePlan, generateSpeech } from '../services/geminiService';

interface HealthResultViewProps {
  analysis: HealthAnalysis;
  language: Language;
}

const HealthResultView: React.FC<HealthResultViewProps> = ({ analysis, language }) => {
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loadingCarePlan, setLoadingCarePlan] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isKrio = language === Language.KRIO;

  const handleGenerateCarePlan = async () => {
    setLoadingCarePlan(true);
    try {
      const plan = await generateCarePlan(analysis.conditions[0]?.name || "General health concern", isKrio ? "Krio" : "English");
      setCarePlan(plan);
    } catch (e) {
      console.error(e);
    }
    setLoadingCarePlan(false);
  };

  const handleSpeak = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    const audioData = await generateSpeech(text);
    if (audioData) {
      const audio = new Audio(`data:audio/pcm;base64,${audioData}`);
      // Note: In real implementation, raw PCM requires a specific decoder as per guidelines.
      // Here we assume standard base64 audio handling for simplicity in the UI context.
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const binaryString = atob(audioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlayingAudio(false);
      source.start();
    } else {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 space-y-6 pb-24 printable-content">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center space-x-2 text-green-700">
          <i className="fas fa-clipboard-check text-xl"></i>
          <h2 className="text-xl font-bold uppercase tracking-wide">
            {isKrio ? "Wetin wi find out" : "Results"}
          </h2>
        </div>
        <button 
          onClick={() => handleSpeak(analysis.generalAdvice)}
          disabled={isPlayingAudio}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border border-green-200 text-xs font-bold transition-all ${isPlayingAudio ? 'bg-green-100 text-green-800' : 'bg-white text-green-600 hover:bg-green-50'}`}
        >
          <i className={`fas ${isPlayingAudio ? 'fa-spinner fa-spin' : 'fa-volume-up'}`}></i>
          <span>{isKrio ? "Listen" : "Listen"}</span>
        </button>
      </div>

      {analysis.conditions.map((condition, idx) => (
        <div key={idx} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden break-inside-avoid print:shadow-none print:border-gray-300 print:mb-8">
          <div className="p-6 border-b border-gray-50 bg-green-50/30 print:bg-gray-50">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-black text-gray-800 mb-2">{condition.name}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{condition.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <Section title={isKrio ? "Symptoms" : "Symptoms"} items={condition.symptoms} icon="fa-list-ul" />
            <Section title={isKrio ? "Treatment" : "Treatment"} text={condition.treatment} icon="fa-pills" />
            <Section title={isKrio ? "Prevention" : "Prevention"} text={condition.prevention} icon="fa-shield-alt" />
            <Section title={isKrio ? "Emergency" : "Emergency"} items={condition.emergencySigns} icon="fa-exclamation-triangle" variant="red" />
          </div>
        </div>
      ))}

      <div className="bg-yellow-50 border border-yellow-200 rounded-[24px] p-6 flex items-start space-x-4 print:bg-white print:border-gray-300">
        <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600 no-print">
          <i className="fas fa-user-md text-xl"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-yellow-900 mb-1">{isKrio ? "Wetin wi tɛl yu" : "Health Tip"}</h4>
          <p className="text-sm text-yellow-800 leading-relaxed italic">{analysis.generalAdvice}</p>
        </div>
      </div>

      {!carePlan ? (
        <button
          onClick={handleGenerateCarePlan}
          disabled={loadingCarePlan}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[24px] font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70 no-print"
        >
          {loadingCarePlan ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-notes-medical"></i>}
          <span>{isKrio ? "Gɛt yu yon Care Plan" : "Generate Custom Care Plan"}</span>
        </button>
      ) : (
        <div className="bg-green-600 rounded-[32px] p-8 text-white shadow-2xl animate-in slide-in-from-bottom-4">
           <h3 className="text-2xl font-black mb-6">Care Plan</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ListSection title="Lifestyle" items={carePlan.lifestyle} />
              <ListSection title="Monitoring" items={carePlan.homeMonitoring} />
           </div>
           <div className="mt-8 pt-8 border-t border-white/10 bg-black/10 -mx-8 -mb-8 p-8 rounded-b-[32px]">
              <p className="text-xs font-bold uppercase tracking-widest text-green-200 mb-2">When to see Dr.</p>
              <p className="text-sm font-medium">{carePlan.whenToSeeDoctor}</p>
           </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, items, text, icon, variant = 'green' }: any) => (
  <div className={`bg-gray-50 rounded-2xl p-5 border border-gray-100 print:bg-white`}>
    <h4 className={`text-[10px] font-black uppercase mb-3 flex items-center tracking-widest ${variant === 'red' ? 'text-red-700' : 'text-gray-400'}`}>
      <i className={`fas ${icon} mr-2 no-print`}></i> {title}
    </h4>
    {items ? (
      <ul className="text-sm text-gray-700 space-y-2">
        {items.map((s: string, i: number) => <li key={i} className="flex items-start"><span className="mr-2 text-green-600 font-bold">•</span>{s}</li>)}
      </ul>
    ) : (
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    )}
  </div>
);

const ListSection = ({ title, items }: any) => (
  <div>
    <h4 className="text-[10px] font-black text-green-200 uppercase tracking-widest mb-4">{title}</h4>
    <ul className="space-y-3 text-sm">
      {items.map((l: string, i: number) => <li key={i} className="flex items-start"><i className="fas fa-check-circle mr-3 mt-1 opacity-50"></i>{l}</li>)}
    </ul>
  </div>
);

export default HealthResultView;
