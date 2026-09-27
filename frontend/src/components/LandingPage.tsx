import React from 'react';
import { ShieldAlert, Activity, Map, Users, ArrowRight, Sun, Thermometer } from 'lucide-react';

interface LandingPageProps {
  onExplore: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 py-16 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container mx-auto max-w-5xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sun className="w-4 h-4 animate-spin-slow" />
            Hyperlocal Early Warning & Decision Support
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
            From Heat Forecast to <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">Health Action</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Traditional weather apps ask <em className="text-slate-100 font-semibold">"What will the weather be?"</em><br />
            HEATGUARD uses AI and biometeorology to answer: <strong className="text-amber-400">"What will the weather DO to people?"</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onExplore('authority')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:scale-105 transition flex items-center gap-2"
            >
              Explore Authority Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExplore('map')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <Map className="w-4 h-4 text-amber-400" />
              View Hyperlocal Heat Map
            </button>
          </div>
        </div>
      </section>

      {/* CORE USP TRANSFORMATIONAL PIPELINE */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-100">Core Value Proposition & Differentiator</h2>
          <p className="text-slate-400 text-sm">Shifting from ambient temperature warnings to targeted health intervention</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Weather Sensors</h3>
            <p className="text-xs text-slate-400">Temp, Humidity, Wind Speed, Solar Radiation, Cloud Cover.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Thermal Indices</h3>
            <p className="text-xs text-slate-400">Heat Index, Outdoor WBGT, UTCI, Human Thermal Stress (HTSS).</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Vulnerability AI</h3>
            <p className="text-xs text-slate-400">Elderly %, Outdoor Workers, Pop Density, UHI Built-up Factor.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Hyperlocal Risk</h3>
            <p className="text-xs text-slate-400">Ward-level health surge risk, hospital surge forecast, XAI explanation.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 relative group hover:border-amber-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
              5
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Targeted Action</h3>
            <p className="text-xs text-slate-400">Cooling center optimization, safe work hours, multi-channel alerts.</p>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC THERMAL INDICES SECTION */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-400" />
                Scientifically Validated Thermal Stress Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">No arbitrary formulas — rigorous biometeorological integration</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              PROVENANCE: REAL & DERIVED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-semibold">NOAA / NWS</span>
              <h4 className="font-bold text-slate-200 text-sm">Heat Index (HI)</h4>
              <p className="text-xs text-slate-400">Rothfusz 9-parameter regression formula with extreme humidity bounds adjustments.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-orange-400 font-semibold">ISO 7243 / BOM</span>
              <h4 className="font-bold text-slate-200 text-sm">Outdoor WBGT</h4>
              <p className="text-xs text-slate-400">Liljegren wet-bulb equation (0.7 T_nw + 0.2 T_g + 0.1 T_d) for direct sun & shade.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-red-400 font-semibold">ISB BIOMET</span>
              <h4 className="font-bold text-slate-200 text-sm">UTCI Index</h4>
              <p className="text-xs text-slate-400">Universal Thermal Climate Index 6-variable operational procedure fit.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-semibold">HEATGUARD DERIVED</span>
              <h4 className="font-bold text-slate-200 text-sm">Human Thermal Stress (HTSS)</h4>
              <p className="text-xs text-slate-400">Normalized 0-100 composite risk indicator combining HI, WBGT, UTCI, and duration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ROLE DASHBOARD CARDS */}
      <section className="container mx-auto px-4 max-w-6xl space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 text-center">Multi-Role Command Portals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onExplore('authority')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-amber-500/50 cursor-pointer transition group"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit group-hover:scale-110 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Disaster Management Authority</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Command-center KPI dashboard, high-risk ward alerts, active interventions, cooling centre recommendations, and outdoor work scheduler.
            </p>
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
              Access Authority Control <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onExplore('citizen')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-emerald-500/50 cursor-pointer transition group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Citizen Health Portal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simplified public interface with location auto-tracking, danger hours, public health advisories, nearest cooling centre finder, and SMS alerts.
            </p>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              Access Citizen View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onExplore('healthcare')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-red-500/50 cursor-pointer transition group"
          >
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit group-hover:scale-110 transition">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Healthcare & Hospital Surge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hospital surge pressure forecasts, bed & ICU capacity tracking, nearby ward thermal exposure mapping, and emergency preparedness checklists.
            </p>
            <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
              Access Hospital Surge Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
