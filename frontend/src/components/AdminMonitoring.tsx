import React, { useState, useEffect } from 'react';
import { Settings, Cpu, RefreshCw, CheckCircle, Database, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { apiFetch } from '../lib/api';

export const AdminMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [retraining, setRetraining] = useState<boolean>(false);
  const [retrainResult, setRetrainResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = () => {
    setLoading(true);
    apiFetch('/api/admin/model-metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRetrain = () => {
    setRetraining(true);
    apiFetch('/api/admin/retrain-models', { method: 'POST' })
      .then(res => res.json())
      .then(resData => {
        setRetrainResult(resData);
        setRetraining(false);
        fetchMetrics();
      })
      .catch(() => setRetraining(false));
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-600 font-bold text-sm">Loading ML Model Monitoring...</div>;
  }

  const chartData = metrics.map(m => ({
    model: m.model_name,
    accuracy: roundTwo(m.accuracy * 100),
    precision: roundTwo(m.precision * 100),
    recall: roundTwo(m.recall * 100),
    f1_score: roundTwo(m.f1_score * 100),
    roc_auc: roundTwo(m.roc_auc * 100)
  }));

  function roundTwo(val: number) {
    return Math.round(val * 100) / 100;
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-amber-600" />
            System Administration & ML Model Monitoring
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Evaluate model accuracy, precision, recall, F1, ROC-AUC, feature importances & trigger retrain jobs
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          {retraining ? 'Retraining Models...' : 'Retrain ML Models'}
        </button>
      </div>

      {retrainResult && (
        <div className="bg-emerald-100 border border-emerald-300 p-4 rounded-2xl text-xs text-emerald-900 font-mono font-bold shadow-xs">
          ✓ Retraining Completed! Best Model: <strong>{retrainResult.best_model}</strong> (F1 Score: {retrainResult.best_f1_score})
        </div>
      )}

      {/* METRICS COMPARISON CHART */}
      <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl space-y-4 shadow-md">
        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-600" />
          Classifier Performance Metrics Comparison (%)
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="model" stroke="#475569" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis domain={[80, 100]} stroke="#475569" tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fcd34d', color: '#0f172a', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: 10, fontWeight: 700 }} />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="precision" fill="#10b981" name="Precision %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recall" fill="#f59e0b" name="Recall %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="f1_score" fill="#ef4444" name="F1 Score %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roc_auc" fill="#a855f7" name="ROC-AUC %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODEL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white border-2 border-amber-200 p-6 rounded-3xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-600" />
                {m.model_name}
              </h4>
              <span className="text-[10px] text-slate-500 font-mono font-bold">Target: {m.target_name}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-slate-600 text-[10px] block font-bold">ACCURACY</span>
                <strong className="text-emerald-700 font-extrabold">{(m.accuracy * 100).toFixed(1)}%</strong>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
                <span className="text-slate-600 text-[10px] block font-bold">F1 SCORE</span>
                <strong className="text-amber-700 font-extrabold">{(m.f1_score * 100).toFixed(1)}%</strong>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-center">
                <span className="text-slate-600 text-[10px] block font-bold">ROC-AUC</span>
                <strong className="text-purple-700 font-extrabold">{(m.roc_auc * 100).toFixed(1)}%</strong>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 block pt-2 font-medium">Last Trained: {m.trained_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
