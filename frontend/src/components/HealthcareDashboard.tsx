import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, AlertTriangle, CheckCircle, ShieldCheck, PhoneCall, Building2 } from 'lucide-react';

export const HealthcareDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/hospitals')
      .then(res => res.json())
      .then(data => {
        setHospitals(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading Healthcare Preparedness Portal...</div>;
  }

  const highSurgeHospitals = hospitals.filter(h => h.current_surge_risk === 'HIGH');

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-red-400" />
            Healthcare Preparedness & Hospital Surge Command
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heatwave healthcare pressure forecasting, emergency bed capacity & ambulance dispatch triage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs">
            SURGE PRESSURE: {highSurgeHospitals.length > 0 ? 'HIGH SURGE EXPECTED' : 'MODERATE'}
          </span>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">MONITORED HOSPITALS</span>
          <div className="text-2xl font-black text-slate-100">{hospitals.length}</div>
          <span className="text-[10px] text-slate-500">Apex & District Facilities</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">TOTAL MONITORED BEDS</span>
          <div className="text-2xl font-black text-amber-400">13,488</div>
          <span className="text-[10px] text-slate-500">Includes 1,570 ICU Beds</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">EXPECTED SURGE WINDOW</span>
          <div className="text-lg font-black text-red-400">NEXT 48 HOURS</div>
          <span className="text-[10px] text-red-400 font-semibold">Peak 14:00 - 18:00</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">HEAT STROKE TRIAGE</span>
          <div className="text-lg font-black text-emerald-400">ACTIVE</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Rehydration Hubs Ready</span>
        </div>
      </div>

      {/* HOSPITALS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          Regional Referral Hospitals Surge & Preparedness Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Hospital Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-center">General Beds</th>
                <th className="py-2.5 px-3 text-center">ICU Beds</th>
                <th className="py-2.5 px-3">Surge Threat</th>
                <th className="py-2.5 px-3">Preparedness Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {hospitals.map(h => (
                <tr key={h.id} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-3 font-semibold text-slate-100">{h.name}</td>
                  <td className="py-3 px-3 text-slate-400">{h.type}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-200">{h.beds}</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-400">{h.icu_beds}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      h.current_surge_risk === 'HIGH' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {h.current_surge_risk} SURGE
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-200">{h.preparedness_status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
