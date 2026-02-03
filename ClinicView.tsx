
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CLINICS } from '../data';
import { Language, Clinic } from '../types';

interface ClinicViewProps {
  language: Language;
}

const ClinicView: React.FC<ClinicViewProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const isKrio = language === Language.KRIO;

  // Extract unique districts for the filter
  const districts = useMemo(() => {
    const dists = Array.from(new Set(CLINICS.map(c => c.district))).sort();
    return dists;
  }, []);

  // Extract unique clinic types for the filter
  const clinicTypes = useMemo(() => {
    const types = Array.from(new Set(CLINICS.map(c => c.type))).sort();
    return types;
  }, []);

  const translateType = (type: string) => {
    if (!isKrio) return type;
    const mapping: { [key: string]: string } = {
      'Government Referral Hospital': 'Big Gɔvnmɛnt Osptul',
      'Maternity Hospital': 'Mama ɛn Pikin Osptul',
      'Children’s Hospital': 'Pikin Osptul',
      'Government Regional Hospital': 'Gɔvnmɛnt Osptul na di Provins',
      'Addiction & Mental Health Centre': 'Ples fɔ Kush ɛp',
      'Mental Health Facility': 'Ples fɔ Krase biznɛs',
      'Military Hospital': 'Sɔja Osptul',
      'Government District Hospital': 'Gɔvnmɛnt Distrikt Osptul',
      'Pharmacy': 'Famasi',
      'Mission Hospital': 'Mishɔn Osptul',
      'Referral Hospital': 'Rɛfral Osptul',
      'Government Health Facility': 'Gɔvnmɛnt Ɛlt Ples'
    };
    return mapping[type] || type;
  };

  const filteredClinics = useMemo(() => {
    const q = query.toLowerCase();
    return CLINICS.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));
      
      const matchesDistrict = selectedDistrict === 'all' || c.district === selectedDistrict;
      const matchesType = selectedType === 'all' || c.type === selectedType;
      
      return matchesSearch && matchesDistrict && matchesType;
    });
  }, [query, selectedDistrict, selectedType]);

  const handlePrint = () => {
    window.print();
  };

  // Map initialization
  useEffect(() => {
    if (viewMode === 'map' && mapContainerRef.current && !mapRef.current) {
      // @ts-ignore
      const L = window.L;
      const map = L.map(mapContainerRef.current).setView([8.484, -13.234], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      mapRef.current = map;
    }

    if (viewMode === 'map' && mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  // Markers update and focusing
  useEffect(() => {
    if (mapRef.current) {
      // @ts-ignore
      const L = window.L;
      
      // Clear old markers
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};

      if (filteredClinics.length > 0) {
        const bounds: any[] = [];
        filteredClinics.forEach(clinic => {
          const marker = L.marker([clinic.lat, clinic.lng])
            .addTo(mapRef.current)
            .bindPopup(`
              <div class="p-1 min-w-[150px]">
                <h4 class="font-bold text-gray-800">${clinic.name}</h4>
                <p class="text-xs text-blue-600 font-semibold mb-1">${translateType(clinic.type)}</p>
                <p class="text-xs text-gray-600 mb-2">${clinic.location}</p>
                <a href="tel:${clinic.phone.replace(/\s/g, '')}" class="text-xs font-bold text-blue-600 underline">
                  <i class="fas fa-phone-alt"></i> ${isKrio ? 'Kɔl na fon' : 'Call'} ${clinic.phone}
                </a>
              </div>
            `);
          markersRef.current[clinic.id] = marker;
          bounds.push([clinic.lat, clinic.lng]);
        });

        // If we have a selected clinic, focus on it
        if (selectedClinicId && markersRef.current[selectedClinicId]) {
          const target = filteredClinics.find(c => c.id === selectedClinicId);
          if (target) {
            mapRef.current.setView([target.lat, target.lng], 16);
            markersRef.current[selectedClinicId].openPopup();
          }
        } else if (bounds.length > 0) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      }
    }
  }, [filteredClinics, viewMode, selectedClinicId, isKrio]);

  const handleViewOnMap = (id: string) => {
    setSelectedClinicId(id);
    setViewMode('map');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden printable-clinics">
      {/* Printable Header - Only visible during print */}
      <div className="print-only hidden mb-8 text-center border-b-2 border-blue-600 pb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
            <i className="fas fa-plus-square"></i>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">DoxaCare AI Clinic Directory</h1>
        <p className="text-sm text-blue-700 font-bold uppercase tracking-widest mt-1">Sierra Leone Healthcare Access List</p>
        <div className="flex justify-between mt-4 text-[10px] text-gray-500 uppercase font-semibold">
          <span>Date: {new Date().toLocaleDateString()}</span>
          <span>{filteredClinics.length} Facilities Listed</span>
        </div>
      </div>

      <div className="p-4 md:p-6 pb-2 shrink-0 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-blue-600 text-2xl">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isKrio ? "Find Osptul/Famasi" : "Find Clinics"}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm shrink-0">
              <button 
                onClick={() => { setViewMode('list'); setSelectedClinicId(null); }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <i className="fas fa-list mr-1"></i> {isKrio ? "Lis" : "List"}
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <i className="fas fa-map mr-1"></i> {isKrio ? "Map" : "Map"}
              </button>
            </div>
            
            <button
              onClick={handlePrint}
              disabled={filteredClinics.length === 0}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm flex items-center shrink-0 disabled:opacity-50"
            >
              <i className="fas fa-file-pdf text-red-500 mr-2"></i>
              {isKrio ? "Sɛv/Print" : "Save/Print"}
            </button>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          {isKrio 
            ? "Luk fɔ osptul, dokta os, or famasi na di ples we yu de. Yu kin tayp di nem or wetin yu de luk fɔ." 
            : "Search for clinics, hospitals, or pharmacies. You can search by name, type, or service."}
        </p>

        {/* Search and Filters Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-2 flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <div className="pl-4 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedClinicId(null); }}
              placeholder={isKrio ? "Tayp nem or sɔvis (e.g. malaria, bɛlɛ)..." : "Type name or service (e.g. malaria, surgical)..."}
              className="flex-1 bg-transparent px-4 py-4 outline-none text-gray-700 text-sm"
            />
          </div>

          {/* District Selector */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 md:py-0 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">{isKrio ? "All Distrikt" : "All Districts"}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>

          {/* Type Selector */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 md:py-0 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">{isKrio ? "All Ples" : "All Facility Types"}</option>
              {clinicTypes.map(t => (
                <option key={t} value={t}>{translateType(t)}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {viewMode === 'list' ? (
          <div className="absolute inset-0 overflow-y-auto px-4 md:px-6 pb-20 space-y-4 printable-list">
            {filteredClinics.length > 0 ? (
              filteredClinics.map((clinic) => (
                <div key={clinic.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group break-inside-avoid print:shadow-none print:border-gray-300 print:mb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg print:text-xl">{clinic.name}</h3>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full print:bg-transparent print:border print:border-blue-200 print:text-blue-800">
                        {translateType(clinic.type)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end space-y-1 no-print">
                      {clinic.is24Hour && (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center">
                          <i className="fas fa-clock mr-1"></i> {isKrio ? "OL DE & NET" : "24-HOUR"}
                        </span>
                      )}
                      {clinic.isAddictionSupport && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center shadow-sm">
                          <i className="fas fa-life-ring mr-1"></i> {isKrio ? "KUSH ƐP" : "ADDICTION SUPPORT"}
                        </span>
                      )}
                    </div>
                  </div>

                  {clinic.description && (
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                      {clinic.description}
                    </p>
                  )}

                  <div className="space-y-3 mt-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-400 no-print"></i>
                      <div className="flex-1">
                        <p className="font-medium print:text-base">{clinic.location}</p>
                        <p className="text-xs opacity-75 print:text-sm">{clinic.district} {isKrio ? "Distrikt" : "District"}</p>
                      </div>
                      <button 
                        onClick={() => handleViewOnMap(clinic.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider flex items-center space-x-1 ml-2 no-print"
                      >
                        <i className="fas fa-location-arrow"></i>
                        <span>{isKrio ? "Luk am na map" : "View on Map"}</span>
                      </button>
                    </div>

                    <div className="flex items-center text-sm text-blue-600 font-bold bg-blue-50/50 p-3 rounded-2xl border border-blue-100 print:bg-transparent print:border-gray-200 print:text-gray-900">
                      <i className="fas fa-phone-alt mr-3 no-print"></i>
                      <span className="print:font-bold">{isKrio ? 'Kɔl: ' : 'Call: '}</span>
                      <span className="ml-1 print:text-lg">{clinic.phone}</span>
                      {clinic.is24Hour && <span className="print-only hidden ml-auto text-[10px] uppercase font-bold text-green-700 border border-green-200 px-2 py-1 rounded">24/7 Available</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 no-print">
                <div className="text-gray-300 text-5xl mb-4">
                  <i className="fas fa-hospital-alt"></i>
                </div>
                <p className="text-gray-500 font-medium">
                  {isKrio ? "Wi nɔ find di ples we yu de luk fɔ. Tray luk fɔ anɔda wan." : "No matching clinics found. Try another search."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full z-0 no-print" style={{ minHeight: '300px' }} />
        )}
      </div>

      {/* Footer for Print Only */}
      <div className="print-only hidden mt-12 pt-6 border-t border-gray-200 text-center">
        <p className="text-[10px] text-gray-500 leading-relaxed max-w-lg mx-auto">
          <strong>Important Notice:</strong> This list of health facilities was generated by DoxaCare AI. Information such as hours of operation and phone numbers may change. In the event of a critical emergency, please proceed directly to the nearest hospital or <strong>Call 117</strong>.
          <br /><br />
          &copy; {new Date().getFullYear()} DoxaCare AI - Sierra Leone Health Assistant
        </p>
      </div>

      <style>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-tip {
          background: white;
        }

        @media print {
          /* Force exact colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Reset layout */
          body > * {
            display: none !important;
          }

          .printable-clinics, .printable-clinics * {
            display: block !important;
          }

          .printable-clinics {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 10mm !important;
            background: white !important;
            overflow: visible !important;
          }

          .printable-list {
            position: relative !important;
            display: block !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          .no-print {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Clear button and interactive styling for print */
          button, input, select, .leaflet-container {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default ClinicView;
