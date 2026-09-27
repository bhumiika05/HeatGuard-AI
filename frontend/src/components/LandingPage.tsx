import React from 'react';
import { ShieldAlert, Activity, Map, Users, ArrowRight, Sun, Thermometer } from 'lucide-react';

interface LandingPageProps {
  onExplore: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border border-amber-200/80 rounded-3xl py-12 px-6 shadow-xl shadow-amber-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-300/30 via-orange-300/20 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-300/30 via-amber-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto max-w-5xl text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sun className="w-4 h-4 text-amber-600 animate-spin-slow" />
            ⚡ REAL-TIME HEAT & HEALTH PROTECTION SYSTEM
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            From Weather Forecast to <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Health Action</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Standard weather apps only tell you <em className="text-slate-900 font-bold bg-amber-100 px-2 py-0.5 rounded">"How hot will it be?"</em><br />
            HEATGUARD tells you: <strong className="text-orange-600 font-extrabold">"How will this heat affect your health & what should you do?"</strong>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onExplore('authority')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:scale-105 transition flex items-center gap-2 cursor-pointer"
            >
              Open City Official Portal
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExplore('map')}
              className="px-6 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm border border-amber-300 transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Map className="w-4 h-4 text-orange-600" />
              View Area Heat Map
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            💡 Simple 5-Step Heat Safety Flow
          </span>
          <h2 className="text-2xl font-black text-slate-900">How HeatGuard Protects You & Your Community</h2>
          <p className="text-slate-600 text-sm font-medium">Turning heat data into clear, simple action for citizens and city officials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border-2 border-amber-200 p-5 rounded-2xl space-y-3 shadow-md hover:border-amber-400 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Weather Sensors</h3>
            <p className="text-xs text-slate-600 font-medium">Tracks temperature, humidity, sunlight & wind speed in real time.</p>
          </div>

          <div className="bg-white border-2 border-orange-200 p-5 rounded-2xl space-y-3 shadow-md hover:border-orange-400 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Feel Heat</h3>
            <p className="text-xs text-slate-600 font-medium">Calculates how hot it actually feels in direct sunlight vs shade.</p>
          </div>

          <div className="bg-white border-2 border-red-200 p-5 rounded-2xl space-y-3 shadow-md hover:border-red-400 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Neighborhood Risk</h3>
            <p className="text-xs text-slate-600 font-medium">Identifies areas with many elderly people, outdoor workers & concrete buildings.</p>
          </div>

          <div className="bg-white border-2 border-purple-200 p-5 rounded-2xl space-y-3 shadow-md hover:border-purple-400 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Health Warnings</h3>
            <p className="text-xs text-slate-600 font-medium">Predicts hospital visits and gives simple explanations for high risk areas.</p>
          </div>

          <div className="bg-white border-2 border-emerald-200 p-5 rounded-2xl space-y-3 shadow-md hover:border-emerald-400 hover:shadow-lg transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              5
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Immediate Actions</h3>
            <p className="text-xs text-slate-600 font-medium">Opens water stations, sets safe work hours, and sends SMS alerts.</p>
          </div>
        </div>
      </section>

      {/* EASY UNDERSTANDING OF HEAT LEVEL METRICS */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 space-y-6 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Thermometer className="w-6 h-6 text-yellow-200" />
                Understanding How Heat Affects Your Body
              </h2>
              <p className="text-xs text-amber-100 mt-1 font-medium">Simple measures used by HeatGuard to keep you safe</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-mono font-bold">
              VERIFIED WEATHER DATA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 space-y-2">
              <span className="text-xs font-mono text-yellow-200 font-bold">SHADE TEMPERATURE</span>
              <h4 className="font-bold text-white text-sm">Heat Index</h4>
              <p className="text-xs text-amber-50 font-medium">How hot it feels in the shade when air humidity is high.</p>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 space-y-2">
              <span className="text-xs font-mono text-yellow-200 font-bold">SUN TEMPERATURE</span>
              <h4 className="font-bold text-white text-sm">Real-Feel in Sun</h4>
              <p className="text-xs text-amber-50 font-medium">Combined effect of hot sun, humidity, and breeze on your skin.</p>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 space-y-2">
              <span className="text-xs font-mono text-yellow-200 font-bold">OUTDOOR COMFORT</span>
              <h4 className="font-bold text-white text-sm">Comfort Level</h4>
              <p className="text-xs text-amber-50 font-medium">Shows if the air feels pleasant, warm, uncomfortable, or dangerous.</p>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 space-y-2">
              <span className="text-xs font-mono text-yellow-200 font-bold">OVERALL HEAT RISK</span>
              <h4 className="font-bold text-white text-sm">Heat Danger Scale</h4>
              <p className="text-xs text-amber-50 font-medium">Combined score (0 to 100) showing total heat stress risk for your area.</p>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ROLE DASHBOARD CARDS */}
      <section className="container mx-auto px-4 max-w-6xl space-y-6">
        <h2 className="text-2xl font-black text-slate-900 text-center">Portals for Everyone</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onExplore('authority')}
            className="bg-white border-2 border-amber-200 p-6 rounded-2xl space-y-4 hover:border-amber-500 hover:shadow-xl cursor-pointer transition group shadow-md"
          >
            <div className="p-3 rounded-xl bg-amber-500 text-white w-fit group-hover:scale-110 transition shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">City Officials Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              City overview, high heat warning areas, emergency actions, cooling center locations, and safe work time recommendations.
            </p>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition">
              Open Official Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onExplore('citizen')}
            className="bg-white border-2 border-emerald-200 p-6 rounded-2xl space-y-4 hover:border-emerald-500 hover:shadow-xl cursor-pointer transition group shadow-md"
          >
            <div className="p-3 rounded-xl bg-emerald-500 text-white w-fit group-hover:scale-110 transition shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Public Safety Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Easy view for common citizens: check your neighborhood heat level, afternoon danger hours, nearest cooling shelter, and subscribe to free SMS alerts.
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition">
              Open Citizen View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onExplore('healthcare')}
            className="bg-white border-2 border-red-200 p-6 rounded-2xl space-y-4 hover:border-red-500 hover:shadow-xl cursor-pointer transition group shadow-md"
          >
            <div className="p-3 rounded-xl bg-red-500 text-white w-fit group-hover:scale-110 transition shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Hospitals & Emergency Beds</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Hospital bed availability, heat-stroke ICU ward capacity, emergency preparedness, and hospital surge warnings.
            </p>
            <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-1 transition">
              Open Hospital Portal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
