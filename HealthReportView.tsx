
import React, { useEffect, useState, useMemo } from 'react';
import { Language } from '../types';
import { fetchHealthReportData } from '../services/geminiService';
import { CLINICS } from '../data';

interface HealthMetric {
  disease: string;
  value: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  status: 'Normal' | 'Warning' | 'Critical';
}

interface HealthReportData {
  summary: string;
  highlights: string[];
  metrics: HealthMetric[];
  sources: any[];
}

interface HealthReportViewProps {
  language: Language;
}

const HealthReportView: React.FC<HealthReportViewProps> = ({ language }) => {
  const [data, setData] = useState<HealthReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  
  const isKrio = language === Language.KRIO;

  // Extract unique districts from clinical data
  const districts = useMemo(() => {
    const dists = Array.from(new Set(CLINICS.map(c => c.district))).sort();
    return dists;
  }, []);

  useEffect(() => {
    const getReport = async () => {
      setLoading(true);
      setError(false);
      try {
        const result = await fetchHealthReportData(
          isKrio ? "Krio" : "English",
          selectedDistrict
        );
        setData(result);
      } catch (err) {
        console.error(err);
        setError(true);
      }
      setLoading(false);
    };
    getReport();
  }, [language, selectedDistrict]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-500';
      case 'Warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <i className="fas fa-arrow-trend-up text-red-500"></i>;
      case 'down': return <i className="fas fa-arrow-trend-down text-green-500"></i>;
      default: return <i className="fas fa-minus text-gray-400"></i>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {isKrio ? "Doxa de gɛt di ripɔt..." : "Fetching latest reports..."}
        </h3>
        <p className="text-gray-500 text-sm text-center">
          {selectedDistrict !== 'all' 
            ? (isKrio ? `Wi de luk fɔ data na ${selectedDistrict}...` : `Gathering specific data for ${selectedDistrict} district...`)
            : (isKrio ? "Wi de luk fɔ di latest data frɔm NPHA ɛn WHO." : "Gathering real-time data from NPHA and WHO databases.")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white text-center">
        <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
        <h3 className="text-xl font-bold text-gray-800">Connection Error</h3>
        <p className="text-gray-500 text-sm mb-6">Could not reach official report servers.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-6 py-2 rounded-full font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const maxMetricValue = Math.max(...(data?.metrics.map(m => m.value) || [100]), 100);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isKrio ? "Ɛlt Ripɔt" : "Health Report"}
              </h2>
              <div className="flex items-center text-[10px] text-green-600 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                {selectedDistrict === 'all' ? (isKrio ? 'National data' : 'National Overview') : `${selectedDistrict} District`}
              </div>
            </div>
          </div>
          <a 
            href="https://npha.gov.sl/index.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex text-xs bg-white border border-gray-200 px-3 py-2 rounded-xl items-center shadow-sm hover:bg-gray-50 transition-all"
          >
            <img src="https://npha.gov.sl/Images/nphalo.png" className="h-4 mr-2" alt="NPHA" onError={(e) => (e.currentTarget.style.display='none')} />
            NPHA
          </a>
        </div>

        {/* District Selector Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
            {isKrio ? "Filta bay distrikt:" : "Filter by district:"}
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 text-sm text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            >
              <option value="all">{isKrio ? "Sierra Leone (All)" : "Sierra Leone (National)"}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Highlights Section */}
      {data?.highlights && data.highlights.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border-l-4 border-l-red-500 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center">
            <i className="fas fa-bullhorn text-red-500 mr-2"></i>
            {isKrio ? "Wetin wi find out tide" : "Today's Key Highlights"}
          </h3>
          <ul className="space-y-3">
            {data.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700 leading-relaxed">
                <span className="text-red-500 mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-500"></span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Metrics Visualization Section */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
          {isKrio ? "Di namba dɛn tide" : "Current Indicators"}
        </h3>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {data?.metrics && data.metrics.length > 0 ? (
              data.metrics.map((metric, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-bold text-gray-800">{metric.disease}</span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)}`}></span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{metric.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {getTrendIcon(metric.trend)}
                        <span className="text-lg font-black text-gray-900">{metric.value.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">{metric.unit || 'Cases'}</span>
                    </div>
                  </div>
                  {/* Custom SVG Bar Chart */}
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${getStatusColor(metric.status)} opacity-80`}
                      style={{ width: `${Math.min((metric.value / maxMetricValue) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 italic">No specific metric breakdown available for this selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narrative Summary Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <i className="fas fa-microscope text-7xl"></i>
        </div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          {isKrio ? "Ripɔt Summary" : "Report Summary"}
        </h3>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {data?.summary || (isKrio ? "No data found." : "No summary available.")}
        </div>
      </div>

      {/* Grounding Sources */}
      {data?.sources && data.sources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-2">
            {isKrio ? "Original Source dɛn" : "Official Data Sources"}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {data.sources.map((source, idx) => {
              const uri = source.web?.uri || source.maps?.uri;
              const title = source.web?.title || source.maps?.title || "Health Bulletin";
              if (!uri) return null;

              return (
                <a 
                  key={idx}
                  href={uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-green-300 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{title}</p>
                      <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{new URL(uri).hostname}</p>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-gray-300 group-hover:text-green-500 transition-colors"></i>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Alert Banner */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg flex items-center space-x-4">
        <div className="text-3xl">
          <i className="fas fa-bell"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-bold mb-1">Stay Informed</h4>
          <p className="text-xs text-blue-100 opacity-90">
            {isKrio 
              ? "Ɛlt data kin chenj evri wik. Check bak ya fɔ no wetin de apin na yu distrikt." 
              : "Public health data changes weekly. Check this report regularly to stay ahead of outbreaks in your district."}
          </p>
        </div>
      </div>
      
      <div className="pb-10 text-center text-[10px] text-gray-400 italic">
        Report visualized via NPHA, WHO, and Gemini AI. Data accuracy depends on the latest published official records.
      </div>
    </div>
  );
};

export default HealthReportView;
