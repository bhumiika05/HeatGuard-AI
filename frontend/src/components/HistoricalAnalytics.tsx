import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Calendar, ShieldAlert, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { apiFetch } from '../lib/api';

export const HistoricalAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiFetch('/api/analytics/historical-summary')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div className="py-20 text-center text-slate-600 font-bold text-sm">Loading Historical Heatwave Analytics...</div>;
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
      <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-amber-600" />
            Historical Heatwave Analytics (2023 – 2026)
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Multi-year trend analysis of extreme heat events, peak biometeorological indices & hospital surge impacts
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-mono font-bold shadow-xs">
          PROVENANCE: REAL + SYNTHETIC CALIBRATED
        </span>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heatwave Days & Peak WBGT */}
        <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl space-y-4 shadow-md">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Annual Heatwave Days & Peak WBGT (°C)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fcd34d', color: '#0f172a', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: 10, fontWeight: 700 }} />
                <Bar dataKey="heatwave_days" fill="#f59e0b" name="Heatwave Days" radius={[6, 6, 0, 0]} />
                <Bar dataKey="max_wbgt" fill="#ef4444" name="Peak WBGT (°C)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UTCI & Hospital Surge Trends */}
        <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl space-y-4 shadow-md">
          <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            Peak UTCI (°C) & Hospital Surge Spikes (Calibrated)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#475569" tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fcd34d', color: '#0f172a', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: 10, fontWeight: 700 }} />
                <Line type="monotone" dataKey="max_utci" stroke="#a855f7" strokeWidth={3} name="Peak UTCI (°C)" />
                <Line type="monotone" dataKey="max_temp" stroke="#f97316" strokeWidth={2.5} name="Peak Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SUMMARY TABLE */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 space-y-4 shadow-md">
        <h3 className="font-black text-slate-900 text-sm">Multi-Year Historical Heatwave Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-200 text-slate-500 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-center">Heatwave Days</th>
                <th className="py-2.5 px-3 text-center">Max Temp (°C)</th>
                <th className="py-2.5 px-3 text-center">Max WBGT (°C)</th>
                <th className="py-2.5 px-3 text-center">Max UTCI (°C)</th>
                <th className="py-2.5 px-3">Most Impacted Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.years.map((y: any, idx: number) => (
                <tr key={idx} className="hover:bg-amber-50/60 transition font-medium">
                  <td className="py-3 px-3 font-extrabold text-slate-900">{y.year}</td>
                  <td className="py-3 px-3 text-center font-extrabold text-amber-700">{y.heatwave_days} days</td>
                  <td className="py-3 px-3 text-center text-slate-800 font-bold">{y.max_temperature_c}°C</td>
                  <td className="py-3 px-3 text-center font-extrabold text-red-600">{y.max_wbgt_c}°C</td>
                  <td className="py-3 px-3 text-center font-extrabold text-purple-600">{y.max_utci_c}°C</td>
                  <td className="py-3 px-3 text-slate-700 font-bold">{y.most_affected_zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 italic pt-2 font-medium">{data.provenance_note}</p>
      </div>
    </div>
  );
};
