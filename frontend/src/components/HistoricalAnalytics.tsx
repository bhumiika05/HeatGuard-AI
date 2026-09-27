import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Calendar, ShieldAlert, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const HistoricalAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/analytics/historical-summary')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading Historical Heatwave Analytics...</div>;
  }

  const chartData = data.years.map((y: any) => ({
    year: y.year,
    heatwave_days: y.heatwave_days,
    max_wbgt: y.max_wbgt_c,
    max_utci: y.max_utci_c,
    max_temp: y.max_temperature_c,
    hospitalizations: y.heat_related_hospitalizations_synth
  }));

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-amber-400" />
            Historical Heatwave Analytics (2023 – 2026)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-year trend analysis of extreme heat events, peak biometeorological indices & hospital surge impacts
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          PROVENANCE: REAL + SYNTHETIC CALIBRATED
        </span>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heatwave Days & Peak WBGT */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Annual Heatwave Days & Peak WBGT (°C)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="heatwave_days" fill="#f59e0b" name="Heatwave Days" />
                <Bar dataKey="max_wbgt" fill="#ef4444" name="Peak WBGT (°C)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UTCI & Hospital Surge Trends */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-400" />
            Peak UTCI (°C) & Hospital Surge Spikes (Calibrated)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
                <Line type="monotone" dataKey="max_utci" stroke="#a855f7" strokeWidth={3} name="Peak UTCI (°C)" />
                <Line type="monotone" dataKey="max_temp" stroke="#f97316" strokeWidth={2} name="Peak Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm">Multi-Year Historical Heatwave Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-center">Heatwave Days</th>
                <th className="py-2.5 px-3 text-center">Max Temp (°C)</th>
                <th className="py-2.5 px-3 text-center">Max WBGT (°C)</th>
                <th className="py-2.5 px-3 text-center">Max UTCI (°C)</th>
                <th className="py-2.5 px-3">Most Impacted Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.years.map((y: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-3 font-bold text-slate-100">{y.year}</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-400">{y.heatwave_days} days</td>
                  <td className="py-3 px-3 text-center text-slate-200">{y.max_temperature_c}°C</td>
                  <td className="py-3 px-3 text-center font-bold text-red-400">{y.max_wbgt_c}°C</td>
                  <td className="py-3 px-3 text-center font-bold text-purple-400">{y.max_utci_c}°C</td>
                  <td className="py-3 px-3 text-slate-300">{y.most_affected_zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 italic pt-2">{data.provenance_note}</p>
      </div>
    </div>
  );
};
