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
        trigger_reason: `High Thermal Stress (HTSS: ${detail.thermal_indices.htss}) in ${detail.ward.name}`,
        recipient_group: 'Public, Hospitals, Municipal Field Responders',
        message: `HEAT ADVISORY: Elevated heat risk in ${detail.ward.name}. Limit outdoor labor between 12 PM - 4 PM. Cooling shelters active.`,
        channels: ['SMS', 'WhatsApp', 'Dashboard']
      })
    })
      .then(res => res.json())
      .then(() => setAlertSent(true));
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !detail ? (
          <div className="flex items-center justify-center py-20">
            <Activity className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    detail.health_prediction.color_code === 'PURPLE' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                    detail.health_prediction.color_code === 'RED' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                    detail.health_prediction.color_code === 'ORANGE' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {detail.health_prediction.health_risk_level} THREAT
                  </span>
                  <h2 className="text-2xl font-bold text-slate-100">{detail.ward.name}</h2>
                  <span className="text-xs text-slate-400 font-mono">Zone: {detail.ward.zone}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  PROVENANCE: {detail.health_prediction.provenance_type}
                </span>
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400">TEMPERATURE</span>
                <div className="text-2xl font-black text-amber-400">
                  {detail.current_weather.temperature_c}°C
                </div>
                <span className="text-[10px] text-slate-500 block">IMD Micro Observation</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400">HEAT INDEX (HI)</span>
                <div className="text-2xl font-black text-orange-400">
                  {detail.thermal_indices.heat_index_c}°C
                </div>
                <span className="text-[10px] text-amber-400 font-semibold block">NWS CALCULATED</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400">OUTDOOR WBGT</span>
                <div className="text-2xl font-black text-red-400">
                  {detail.thermal_indices.wbgt_outdoor_c}°C
                </div>
                <span className="text-[10px] text-red-400 font-semibold block">Liljegren Sun</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-slate-400">HTSS SCORE</span>
                <div className="text-2xl font-black text-purple-400">
                  {detail.thermal_indices.htss} <span className="text-xs text-slate-400">/100</span>
                </div>
                <span className="text-[10px] text-purple-400 font-semibold block">Derived Composite</span>
              </div>
            </div>

            {/* FEATURE 11: EXPLAINABLE AI "WHY IS THIS AREA RED?" PANEL */}
            <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                EXPLAINABLE AI (XAI) — "Why is this area classified as {detail.health_prediction.health_risk_level}?"
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                "{detail.health_prediction.xai_explanation}"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Elderly Exposed</span>
                  <strong className="text-slate-200">{detail.ward.elderly_pct}%</strong>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Outdoor Workers</span>
                  <strong className="text-slate-200">{detail.ward.outdoor_worker_pct}%</strong>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Built-up Density (UHI)</span>
                  <strong className="text-slate-200">{detail.ward.built_up_pct}%</strong>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Green Cover</span>
                  <strong className="text-slate-200">{detail.ward.green_cover_pct}%</strong>
                </div>
              </div>
            </div>

            {/* OUTDOOR WORK SCHEDULER & ACTION ITEMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Outdoor Work Scheduler */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-slate-100 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Outdoor Labor Safe Work Windows
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                    <span>RECOMMENDED SAFE HOURS:</span>
                    <span>{detail.safe_work_schedule.recommended_work_windows.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-red-500/10 text-red-300 border border-red-500/30 font-semibold">
                    <span>MANDATORY REST / RESTRICTED:</span>
                    <span>{detail.safe_work_schedule.avoid_work_windows.join(', ')}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">{detail.safe_work_schedule.disclaimer}</p>
              </div>

              {/* Recommended Municipal Actions */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-slate-100 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Targeted Action Protocols
                </h4>

                <ul className="space-y-2 text-xs text-slate-300">
                  {detail.recommended_actions.map((act: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <button
                    onClick={handleSendSimulatedAlert}
                    disabled={alertSent}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                      alertSent 
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
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
