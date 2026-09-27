import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Thermometer, Wind, Droplets, Sun, Activity, Clock, CheckCircle, AlertTriangle, FileText, Send } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface WardDetailModalProps {
  wardId: number | null;
  onClose: () => void;
}

export const WardDetailModal: React.FC<WardDetailModalProps> = ({ wardId, onClose }) => {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertSent, setAlertSent] = useState<boolean>(false);

  useEffect(() => {
    if (!wardId) return;
    setLoading(true);
    apiFetch(`/api/wards/${wardId}/detail`)
      .then(res => res.json())
      .then(data => {
        setDetail(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching ward detail:', err);
        setLoading(false);
      });
  }, [wardId]);

  if (!wardId) return null;

  const handleSendSimulatedAlert = () => {
    if (!detail) return;
    apiFetch('/api/alerts/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ward_id: wardId,
        risk_level: detail.health_prediction.health_risk_level,
        trigger_reason: `High Heat Danger Level (${detail.thermal_indices.htss}/100) in ${detail.ward.name}`,
        recipient_group: 'Public, Hospitals, Municipal Field Responders',
        message: `HEAT ADVISORY: Elevated heat risk in ${detail.ward.name}. Limit outdoor labor between 12 PM - 4 PM. Cooling shelters active.`,
        channels: ['SMS', 'WhatsApp', 'Dashboard']
      })
    })
      .then(res => res.json())
      .then(() => setAlertSent(true));
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-amber-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 text-slate-900 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition border border-amber-300 shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !detail ? (
          <div className="flex items-center justify-center py-20">
            <Activity className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-amber-200 pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase border ${
                    detail.health_prediction.color_code === 'PURPLE' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                    detail.health_prediction.color_code === 'RED' ? 'bg-red-100 text-red-900 border-red-300' :
                    detail.health_prediction.color_code === 'ORANGE' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                    'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {detail.health_prediction.health_risk_level} THREAT
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">{detail.ward.name}</h2>
                  <span className="text-xs text-slate-500 font-mono font-bold">Zone: {detail.ward.zone}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-mono font-bold">
                  DATA SOURCE: {detail.health_prediction.provenance_type}
                </span>
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-1">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase">AIR TEMPERATURE</span>
                <div className="text-2xl font-black text-amber-700">
                  {detail.current_weather.temperature_c}°C
                </div>
                <span className="text-[10px] text-slate-500 block font-medium">Local Weather Station</span>
              </div>

              <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200 space-y-1">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase">FEELS LIKE (SHADE)</span>
                <div className="text-2xl font-black text-orange-700">
                  {detail.thermal_indices.heat_index_c}°C
                </div>
                <span className="text-[10px] text-orange-700 font-bold block">Humidity Adjusted</span>
              </div>

              <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 space-y-1">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase">FEELS LIKE (SUN)</span>
                <div className="text-2xl font-black text-red-700">
                  {detail.thermal_indices.wbgt_outdoor_c}°C
                </div>
                <span className="text-[10px] text-red-700 font-bold block">Direct Sunlight Heat</span>
              </div>

              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-1">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase">HEAT DANGER SCALE</span>
                <div className="text-2xl font-black text-purple-700">
                  {detail.thermal_indices.htss} <span className="text-xs text-slate-500">/100</span>
                </div>
                <span className="text-[10px] text-purple-700 font-bold block">Overall Heat Risk</span>
              </div>
            </div>

            {/* EXPLAINABLE AI PANEL */}
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
              <h3 className="font-black text-amber-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                SMART EXPLANATION — "Why is this area classified as {detail.health_prediction.health_risk_level}?"
              </h3>

              <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs">
                "{detail.health_prediction.xai_explanation}"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                  <span className="text-slate-500 block text-[10px] font-bold">Elderly Exposed</span>
                  <strong className="text-slate-900 font-extrabold">{detail.ward.elderly_pct}%</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                  <span className="text-slate-500 block text-[10px] font-bold">Outdoor Workers</span>
                  <strong className="text-slate-900 font-extrabold">{detail.ward.outdoor_worker_pct}%</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                  <span className="text-slate-500 block text-[10px] font-bold">Built-up Density (UHI)</span>
                  <strong className="text-slate-900 font-extrabold">{detail.ward.built_up_pct}%</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                  <span className="text-slate-500 block text-[10px] font-bold">Green Cover</span>
                  <strong className="text-slate-900 font-extrabold">{detail.ward.green_cover_pct}%</strong>
                </div>
              </div>
            </div>

            {/* OUTDOOR WORK SCHEDULER & ACTION ITEMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Outdoor Work Scheduler */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Outdoor Labor Safe Work Windows
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold">
                    <span>RECOMMENDED SAFE HOURS:</span>
                    <span>{detail.safe_work_schedule.recommended_work_windows.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 text-red-900 border border-red-300 font-bold">
                    <span>MANDATORY REST / RESTRICTED:</span>
                    <span>{detail.safe_work_schedule.avoid_work_windows.join(', ')}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic font-medium">{detail.safe_work_schedule.disclaimer}</p>
              </div>

              {/* Recommended Municipal Actions */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Targeted Action Protocols
                </h4>

                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {detail.recommended_actions.map((act: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <button
                    onClick={handleSendSimulatedAlert}
                    disabled={alertSent}
                    className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      alertSent 
                        ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {alertSent ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Simulated Alert Broadcasted (SMS / WhatsApp)
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Trigger Multi-Channel Heat Advisory Alert
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
