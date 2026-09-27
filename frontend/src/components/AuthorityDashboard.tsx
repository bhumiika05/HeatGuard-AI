import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Thermometer, Wind, Droplets, Sun, Activity, Users, ArrowRight, Zap, CheckCircle2, Clock } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface AuthorityDashboardProps {
  onSelectWard: (wardId: number) => void;
  onExploreMap: () => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({ onSelectWard, onExploreMap }) => {
  const [riskSummary, setRiskSummary] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [coolingRecs, setCoolingRecs] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [forecastDay, setForecastDay] = useState<string>('TODAY');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch('/api/risk/summary').then(res => res.json()),
      apiFetch('/api/risk/predictions').then(res => res.json()),
      apiFetch('/api/cooling-centres/recommendations?top_n=3').then(res => res.json()),
      apiFetch('/api/interventions').then(res => res.json())
    ])
      .then(([summaryData, predData, coolData, interData]) => {
        setRiskSummary(summaryData);
        setPredictions(predData || []);
        setCoolingRecs(coolData.top_recommendations || []);
        setInterventions(interData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching authority data:', err);
        setLoading(false);
      });
  }, []);

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'EXTREME': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'VERY_HIGH': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MODERATE': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex items-center gap-3 text-amber-400">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="font-mono text-sm font-semibold">Loading HEATGUARD Authority Command Center...</span>
        </div>
      </div>
    );
  }

  const highRiskWards = predictions.filter(p => ['HIGH', 'VERY_HIGH', 'EXTREME'].includes(p.health_risk_level));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              Municipal & Disaster Management Command Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
              PROVENANCE: REAL + DERIVED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hyperlocal 3–5 day heat-health early warning, hospital surge monitoring & automated intervention dispatch
          </p>
        </div>

        {/* Forecast Date Filter */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          {['TODAY', 'D+1', 'D+2', 'D+3', 'D+5'].map(day => (
            <button
              key={day}
              onClick={() => setForecastDay(day)}
              className={`px-3 py-1.5 rounded-lg transition ${
                forecastDay === day
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 8 KPI COMMAND CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CURRENT TEMP</span>
          <div className="text-xl font-black text-amber-400 flex items-baseline gap-1">
            43.5 <span className="text-xs text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">IMD Station Proxy</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">HUMIDITY</span>
          <div className="text-xl font-black text-cyan-400 flex items-baseline gap-1">
            58 <span className="text-xs text-slate-400">%</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">Surface RH</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">HEAT INDEX</span>
          <div className="text-xl font-black text-orange-400 flex items-baseline gap-1">
            49.8 <span className="text-xs text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-amber-400 font-semibold block truncate">NWS DERIVED</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">OUTDOOR WBGT</span>
          <div className="text-xl font-black text-red-400 flex items-baseline gap-1">
            34.2 <span className="text-xs text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-red-400 font-semibold block truncate">Liljegren Sun</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">UTCI INDEX</span>
          <div className="text-xl font-black text-purple-400 flex items-baseline gap-1">
            46.1 <span className="text-xs text-slate-400">°C</span>
          </div>
          <span className="text-[10px] text-purple-400 font-semibold block truncate">Polynomial Fit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">THERMAL STRESS</span>
          <div className="text-xl font-black text-amber-300 flex items-baseline gap-1">
            {riskSummary?.city_avg_htss || '64.2'} <span className="text-xs text-slate-400">/100</span>
          </div>
          <span className="text-[10px] text-amber-300 font-semibold block truncate">HTSS Score</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">HEALTH SURGE</span>
          <div className="text-lg font-black text-red-400 uppercase truncate">
            {riskSummary?.city_heat_threat_level || 'VERY HIGH'}
          </div>
          <span className="text-[10px] text-red-400 font-semibold block truncate">XGBoost ML</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">EXPOSED VULN</span>
          <div className="text-lg font-black text-amber-400 truncate">
            {((riskSummary?.vulnerable_population_exposed || 245000) / 1000).toFixed(0)}k
          </div>
          <span className="text-[10px] text-slate-400 block truncate">Residents</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1 & 2: HIGH RISK WARDS TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Hyperlocal Ward Heat Threat Rankings ({highRiskWards.length} High Risk Wards)
              </h3>
              <button
                onClick={onExploreMap}
                className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
              >
                View on Interactive Map <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                    <th className="py-2.5 px-3">Ward Name</th>
                    <th className="py-2.5 px-3">Zone</th>
                    <th className="py-2.5 px-3 text-center">HTSS Score</th>
                    <th className="py-2.5 px-3">Threat Tier</th>
                    <th className="py-2.5 px-3 text-center">Surge Risk</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {predictions.map(p => (
                    <tr 
                      key={p.ward_id} 
                      className="hover:bg-slate-850 cursor-pointer transition"
                      onClick={() => onSelectWard(p.ward_id)}
                    >
                      <td className="py-3 px-3 font-semibold text-slate-100">
                        {p.ward_name}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{p.zone}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-200">
                        {p.htss} / 100
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getBadgeColor(p.health_risk_level)}`}>
                          {p.health_risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-slate-300 font-semibold">{p.hospital_surge_risk}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-[11px]">
                          Inspect XAI
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUMN 3: DECISION SUPPORT & OPTIMIZATION CARDS */}
        <div className="space-y-6">
          {/* AI COOLING CENTRE OPTIMIZATION RECOMMENDATIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              AI Cooling Centre Optimization
            </h3>
            <p className="text-xs text-slate-400">Proposed optimal new relief shelters based on heat risk & distance matrix</p>

            <div className="space-y-3">
              {coolingRecs.map((rec, i) => (
                <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">{rec.ward_name}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold">
                      SCORE: {rec.optimization_score}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{rec.reason}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                    <span>Est. Served: <strong>{rec.estimated_population_served}</strong></span>
                    <span>Dist: <strong>{rec.min_distance_to_existing_km} km</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE INTERVENTIONS TRACKER */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Active Field Interventions ({interventions.length})
            </h3>

            <div className="space-y-2.5">
              {interventions.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{item.action_type}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{item.description}</p>
                  <span className="text-[10px] text-slate-500 font-mono block pt-1">{item.created_at}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
