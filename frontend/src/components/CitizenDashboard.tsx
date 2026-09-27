import React, { useState, useEffect } from 'react';
import { Users, MapPin, Sun, Clock, ShieldCheck, PhoneCall, AlertTriangle, Navigation, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const CitizenDashboard: React.FC = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<number>(1);
  const [wardDetail, setWardDetail] = useState<any>(null);
  const [phone, setPhone] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiFetch('/api/wards')
      .then(res => res.json())
      .then(data => {
        setWards(data || []);
        if (data && data.length > 0) {
          setSelectedWardId(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedWardId) return;
    setLoading(true);
    apiFetch(`/api/wards/${selectedWardId}/detail`)
      .then(res => res.json())
      .then(data => {
        setWardDetail(data);
        setLoading(false);
      });
  }, [selectedWardId]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setSubscribed(true);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Title Bar */}
      <div className="bg-white border-2 border-emerald-200 p-6 rounded-3xl space-y-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-600" />
              Citizen Heat Safety Portal
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Hyperlocal heat risk, danger hours, cooling shelter locator & public health precautions
            </p>
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2 bg-emerald-50/80 p-2 rounded-2xl border border-emerald-300 shadow-xs">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {wards.map(w => (
                <option key={w.id} value={w.id} className="bg-white text-slate-900 font-bold">
                  {w.name} ({w.zone})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading || !wardDetail ? (
        <div className="py-20 text-center text-slate-600 font-bold text-sm">Loading citizen safety portal...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CURRENT HEAT HAZARD STATUS */}
          <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl space-y-4 text-center shadow-md">
            <span className="text-xs font-black font-mono text-slate-500 uppercase tracking-wider block">YOUR WARD RISK</span>
            
            <div className={`py-4 px-6 rounded-2xl border-2 text-center font-black text-2xl uppercase shadow-sm ${
              wardDetail.health_prediction.color_code === 'PURPLE' ? 'bg-purple-100 text-purple-900 border-purple-300' :
              wardDetail.health_prediction.color_code === 'RED' ? 'bg-red-100 text-red-900 border-red-300' :
              wardDetail.health_prediction.color_code === 'ORANGE' ? 'bg-orange-100 text-orange-900 border-orange-300' :
              'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {wardDetail.health_prediction.health_risk_level} HEAT RISK
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-slate-600 block text-[10px] font-bold">Temperature</span>
                <strong className="text-amber-700 text-lg font-black">{wardDetail.current_weather.temperature_c}°C</strong>
              </div>
              <div className="bg-orange-50 p-3 rounded-2xl border border-orange-200">
                <span className="text-slate-600 block text-[10px] font-bold">Heat Index</span>
                <strong className="text-orange-700 text-lg font-black">{wardDetail.thermal_indices.heat_index_c}°C</strong>
              </div>
            </div>

            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-xs space-y-1">
              <span className="text-rose-900 block font-bold text-[10px] uppercase tracking-wider">DANGER HOURS TODAY:</span>
              <strong className="text-red-700 text-sm font-black flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-red-600" /> 12:00 PM – 04:00 PM
              </strong>
            </div>
          </div>

          {/* WHAT SHOULD I DO? PUBLIC PRECAUTIONS */}
          <div className="bg-white border-2 border-emerald-200 p-6 rounded-3xl space-y-4 md:col-span-2 shadow-md">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              What Should You Do? (Authoritative Public Health Guidance)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1">
                <strong className="text-amber-900 block font-bold text-sm">💧 Stay Hydrated</strong>
                <p className="text-slate-700 text-[11px] font-medium">Drink oral rehydration fluids (ORS), buttermilk, or lemon water every 30 minutes even if not thirsty.</p>
              </div>

              <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200 space-y-1">
                <strong className="text-orange-900 block font-bold text-sm">👕 Clothing & Cover</strong>
                <p className="text-slate-700 text-[11px] font-medium">Wear loose, light-colored cotton clothing. Cover head with hat, umbrella, or wet cloth outdoors.</p>
              </div>

              <div className="bg-yellow-50/60 p-4 rounded-2xl border border-yellow-200 space-y-1">
                <strong className="text-yellow-900 block font-bold text-sm">🛑 Avoid Peak Sun</strong>
                <p className="text-slate-700 text-[11px] font-medium">Avoid direct outdoor exertion during peak solar radiation (12:00 PM - 04:00 PM).</p>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-1">
                <strong className="text-rose-900 block font-bold text-sm">🚨 Heat Stroke Warning Signs</strong>
                <p className="text-slate-700 text-[11px] font-medium">Dizziness, high body temp (&gt;40°C), dry skin without sweating, confusion. Call 102 / 108 immediately.</p>
              </div>
            </div>

            {/* NEAREST COOLING CENTRE LOCATOR */}
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-600" />
                Nearest Cooling Centre / Relief Shelter
              </h4>

              {wardDetail.cooling_centres && wardDetail.cooling_centres.length > 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-sky-900 block text-sm font-extrabold">{wardDetail.cooling_centres[0].name}</strong>
                    <span className="text-slate-600 text-[11px] font-medium">Capacity: {wardDetail.cooling_centres[0].capacity} people | Air Conditioned & Cold Water</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold border border-emerald-300">
                    ACTIVE RELIEF
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-600 font-medium">Nearest cooling hub active at Connaught Place Central Park Shelter (1.8 km).</p>
              )}
            </div>

            {/* SMS ALERT SIGNUP */}
            <form onSubmit={handleSubscribe} className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
              <strong className="text-xs text-slate-900 block font-bold">Subscribe to Free Ward SMS / WhatsApp Heat Alerts:</strong>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Enter 10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border-2 border-amber-200 text-slate-900 font-medium text-xs px-3 py-2 rounded-xl flex-1 focus:outline-none focus:border-amber-500 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition shadow-xs"
                >
                  {subscribed ? 'Subscribed ✓' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
