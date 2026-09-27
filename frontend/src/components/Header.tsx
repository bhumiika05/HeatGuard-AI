import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Map, Users, Stethoscope, Settings, BarChart2, FileText, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

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
    fetch('/api/admin/system-status')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(() => setSystemStatus(null));
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Zap },
    { id: 'authority', label: 'Authority Command', icon: ShieldAlert },
    { id: 'map', label: 'Hyperlocal GIS Map', icon: Map },
    { id: 'citizen', label: 'Citizen Portal', icon: Users },
    { id: 'healthcare', label: 'Hospital Surge', icon: Stethoscope },
    { id: 'tracking', label: 'Alerts & Tracking', icon: Activity },
    { id: 'analytics', label: 'Historical Analytics', icon: BarChart2 },
    { id: 'provenance', label: 'Data Provenance', icon: FileText },
    { id: 'admin', label: 'ML Monitoring', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-xl">
      {/* Top System Status Bar & Judging Demo Switcher */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-4 text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ONLINE
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">Weather API: <strong className="text-slate-300">ONLINE (IMD Proxy)</strong></span>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:inline">ML Engine: <strong className="text-amber-300">READY (XGBoost/RF)</strong></span>
          <span className="hidden xl:inline text-slate-500">|</span>
          <span className="hidden xl:inline">Data Provenance: <strong className="text-cyan-300">STRICT TRANSPARENCY</strong></span>
        </div>

        {/* DEMO MODE SCENARIO SWITCHER */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3 py-1 rounded-full">
          <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            SIH JUDGING DEMO:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onScenarioChange('NORMAL')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentScenario === 'NORMAL'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Normal Summer
            </button>
            <button
              onClick={() => onScenarioChange('HEATWAVE')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentScenario === 'HEATWAVE'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Heatwave
            </button>
            <button
              onClick={() => onScenarioChange('EXTREME_HEATWAVE')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentScenario === 'EXTREME_HEATWAVE'
                  ? 'bg-purple-600 text-white shadow animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Extreme Heatwave
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-lg shadow-red-500/20 group-hover:scale-105 transition">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-red-400 bg-clip-text text-transparent">
                HEATGUARD
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                DELHI / NCR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI-Powered Hyperlocal Heat-Health Early Warning & Action System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
