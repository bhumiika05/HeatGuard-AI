import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, AlertTriangle, CheckCircle, ShieldCheck, PhoneCall, Building2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const HealthcareDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiFetch('/api/hospitals')
      .then(res => res.json())
      .then(data => {
        setHospitals(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-600 font-bold text-sm">Loading Healthcare Preparedness Portal...</div>;
  }

  const highSurgeHospitals = hospitals.filter(h => h.current_surge_risk === 'HIGH');

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-white border-2 border-red-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-red-600" />
            Healthcare Preparedness & Hospital Surge Command
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Real-time heatwave healthcare pressure forecasting, emergency bed capacity & ambulance dispatch triage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-900 font-extrabold text-xs shadow-xs">
            SURGE PRESSURE: {highSurgeHospitals.length > 0 ? 'HIGH SURGE EXPECTED' : 'MODERATE'}
          </span>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-amber-200 p-4 rounded-2xl space-y-1 shadow-sm hover:border-amber-400 transition">
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">MONITORED HOSPITALS</span>
          <div className="text-2xl font-black text-slate-900">{hospitals.length}</div>
          <span className="text-[10px] text-slate-500 font-medium">Apex & District Facilities</span>
        </div>

        <div className="bg-white border-2 border-orange-200 p-4 rounded-2xl space-y-1 shadow-sm hover:border-orange-400 transition">
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">TOTAL MONITORED BEDS</span>
          <div className="text-2xl font-black text-orange-600">13,488</div>
          <span className="text-[10px] text-slate-500 font-medium">Includes 1,570 ICU Beds</span>
        </div>

        <div className="bg-white border-2 border-red-200 p-4 rounded-2xl space-y-1 shadow-sm hover:border-red-400 transition">
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">EXPECTED SURGE WINDOW</span>
          <div className="text-lg font-black text-red-600">NEXT 48 HOURS</div>
          <span className="text-[10px] text-red-600 font-extrabold">Peak 14:00 - 18:00</span>
        </div>

        <div className="bg-white border-2 border-emerald-200 p-4 rounded-2xl space-y-1 shadow-sm hover:border-emerald-400 transition">
          <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">HEAT STROKE TRIAGE</span>
          <div className="text-lg font-black text-emerald-700">ACTIVE</div>
          <span className="text-[10px] text-emerald-700 font-extrabold">Rehydration Hubs Ready</span>
        </div>
      </div>

      {/* HOSPITALS TABLE */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 space-y-4 shadow-md">
        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-600" />
          Regional Referral Hospitals Surge & Preparedness Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-200 text-slate-500 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Hospital Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-center">General Beds</th>
                <th className="py-2.5 px-3 text-center">ICU Beds</th>
                <th className="py-2.5 px-3">Surge Threat</th>
                <th className="py-2.5 px-3">Preparedness Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospitals.map(h => (
                <tr key={h.id} className="hover:bg-amber-50/60 transition font-medium">
                  <td className="py-3 px-3 font-bold text-slate-900">{h.name}</td>
                  <td className="py-3 px-3 text-slate-600">{h.type}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">{h.beds}</td>
                  <td className="py-3 px-3 text-center font-extrabold text-orange-600">{h.icu_beds}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      h.current_surge_risk === 'HIGH' ? 'bg-red-100 text-red-900 border-red-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {h.current_surge_risk} SURGE
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{h.preparedness_status}</span>
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
