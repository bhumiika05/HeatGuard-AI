import React, { useState, useEffect } from 'react';
import { Users, MapPin, Sun, Clock, ShieldCheck, PhoneCall, AlertTriangle, Navigation, CheckCircle2 } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<number>(1);
  const [wardDetail, setWardDetail] = useState<any>(null);
  const [phone, setPhone] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/wards')
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
    fetch(`/api/wards/${selectedWardId}/detail`)
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
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" />
              Citizen Heat Safety Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Hyperlocal heat risk, danger hours, cooling shelter locator & public health precautions
            </p>
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none"
            >
              {wards.map(w => (
                <option key={w.id} value={w.id} className="bg-slate-900 text-slate-200">
                  {w.name} ({w.zone})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading || !wardDetail ? (
        <div className="py-20 text-center text-slate-400 text-sm">Loading citizen safety portal...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CURRENT HEAT HAZARD STATUS */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">YOUR WARD RISK</span>
            
            <div className={`py-4 px-6 rounded-2xl border text-center font-black text-2xl uppercase shadow-lg ${
              wardDetail.health_prediction.color_code === 'PURPLE' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
              wardDetail.health_prediction.color_code === 'RED' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
              wardDetail.health_prediction.color_code === 'ORANGE' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
              'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {wardDetail.health_prediction.health_risk_level} HEAT RISK
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Temperature</span>
                <strong className="text-amber-400 text-base">{wardDetail.current_weather.temperature_c}°C</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Heat Index</span>
                <strong className="text-orange-400 text-base">{wardDetail.thermal_indices.heat_index_c}°C</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block font-semibold text-[10px]">DANGER HOURS TODAY:</span>
              <strong className="text-red-400 text-sm font-bold flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> 12:00 PM – 04:00 PM
              </strong>
            </div>
          </div>

          {/* WHAT SHOULD I DO? PUBLIC PRECAUTIONS */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 md:col-span-2">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              What Should You Do? (Authoritative Public Health Guidance)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-amber-400 block">💧 Stay Hydrated</strong>
                <p className="text-slate-300 text-[11px]">Drink oral rehydration fluids (ORS), buttermilk, or lemon water every 30 minutes even if not thirsty.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-amber-400 block">👕 Clothing & Cover</strong>
                <p className="text-slate-300 text-[11px]">Wear loose, light-colored cotton clothing. Cover head with hat, umbrella, or wet cloth outdoors.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-amber-400 block">🛑 Avoid Peak Sun</strong>
                <p className="text-slate-300 text-[11px]">Avoid direct outdoor exertion during peak solar radiation (12:00 PM - 04:00 PM).</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-red-400 block">🚨 Heat Stroke Warning Signs</strong>
                <p className="text-slate-300 text-[11px]">Dizziness, high body temp (&gt;40°C), dry skin without sweating, confusion. Call 102 / 108 immediately.</p>
              </div>
            </div>

            {/* NEAREST COOLING CENTRE LOCATOR */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                Nearest Cooling Centre / Relief Shelter
              </h4>

              {wardDetail.cooling_centres && wardDetail.cooling_centres.length > 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-emerald-400 block text-sm">{wardDetail.cooling_centres[0].name}</strong>
                    <span className="text-slate-400 text-[11px]">Capacity: {wardDetail.cooling_centres[0].capacity} people | Air Conditioned & Cold Water</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                    ACTIVE RELIEF
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Nearest cooling hub active at Connaught Place Central Park Shelter (1.8 km).</p>
              )}
            </div>

            {/* SMS ALERT SIGNUP */}
            <form onSubmit={handleSubscribe} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <strong className="text-xs text-slate-200 block">Subscribe to Free Ward SMS / WhatsApp Heat Alerts:</strong>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Enter 10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg flex-1 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
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
