import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Map, Users, Stethoscope, Settings, BarChart2, FileText, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentScenario: string;
  onScenarioChange: (scenario: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentScenario,
  onScenarioChange
}) => {
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    apiFetch('/api/admin/system-status')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(() => setSystemStatus(null));
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Zap },
    { id: 'authority', label: 'City Officials', icon: ShieldAlert },
    { id: 'map', label: 'Area Heat Map', icon: Map },
    { id: 'citizen', label: 'Public Safety', icon: Users },
    { id: 'healthcare', label: 'Hospital Beds', icon: Stethoscope },
    { id: 'tracking', label: 'Warnings & History', icon: Activity },
    { id: 'analytics', label: 'Past Heat Data', icon: BarChart2 },
    { id: 'provenance', label: 'Data Sources', icon: FileText },
    { id: 'admin', label: 'AI Predictor Health', icon: Settings },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-amber-200 text-slate-800 sticky top-0 z-50 shadow-sm">
      {/* Top System Status Bar & Scenario Simulator */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-1.5 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-4 font-mono">
          <span className="flex items-center gap-1.5 font-bold text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE MONITORING ONLINE
          </span>
          <span className="hidden md:inline text-amber-200/60">|</span>
          <span className="hidden md:inline">Weather Station: <strong className="text-white">CONNECTED</strong></span>
          <span className="hidden lg:inline text-amber-200/60">|</span>
          <span className="hidden lg:inline">AI Prediction Engine: <strong className="text-amber-100">ACTIVE</strong></span>
        </div>

        {/* HEAT LEVEL SIMULATOR */}
        <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-300/40 px-3 py-1 rounded-full">
          <span className="text-amber-100 font-bold flex items-center gap-1 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
            TEST HEAT SCENARIOS:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onScenarioChange('NORMAL')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                currentScenario === 'NORMAL'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-800'
              }`}
            >
              Normal Weather
            </button>
            <button
              onClick={() => onScenarioChange('HEATWAVE')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                currentScenario === 'HEATWAVE'
                  ? 'bg-amber-400 text-amber-950 shadow'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-800'
              }`}
            >
              High Heatwave
            </button>
            <button
              onClick={() => onScenarioChange('EXTREME_HEATWAVE')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                currentScenario === 'EXTREME_HEATWAVE'
                  ? 'bg-red-500 text-white shadow animate-pulse'
                  : 'bg-amber-900/60 text-amber-100 hover:bg-amber-800'
              }`}
            >
              Severe Heatwave
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                HEATGUARD
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 shadow-xs">
                DELHI / NCR
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">
              Smart Heatwave Early Warning & Public Protection Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 scale-102'
                    : 'text-slate-700 bg-slate-100/80 hover:bg-amber-100 hover:text-amber-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
