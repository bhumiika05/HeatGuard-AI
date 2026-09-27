import React, { useState, useEffect } from 'react';
import { Settings, Cpu, RefreshCw, CheckCircle, Database, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const AdminMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [retraining, setRetraining] = useState<boolean>(false);
  const [retrainResult, setRetrainResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = () => {
    setLoading(true);
    fetch('/api/admin/model-metrics')
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
    fetch('/api/admin/retrain-models', { method: 'POST' })
      .then(res => res.json())
      .then(resData => {
        setRetrainResult(resData);
        setRetraining(false);
        fetchMetrics();
      })
      .catch(() => setRetraining(false));
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading ML Model Monitoring...</div>;
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
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            System Administration & ML Model Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate model accuracy, precision, recall, F1, ROC-AUC, feature importances & trigger retrain jobs
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          {retraining ? 'Retraining Models...' : 'Retrain ML Models'}
        </button>
      </div>

      {retrainResult && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 font-mono">
          ✓ Retraining Completed! Best Model: <strong>{retrainResult.best_model}</strong> (F1 Score: {retrainResult.best_f1_score})
        </div>
      )}

      {/* METRICS COMPARISON CHART */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          Classifier Performance Metrics Comparison (%)
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="model" stroke="#94a3b8" />
              <YAxis domain={[80, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy %" />
              <Bar dataKey="precision" fill="#10b981" name="Precision %" />
              <Bar dataKey="recall" fill="#f59e0b" name="Recall %" />
              <Bar dataKey="f1_score" fill="#ef4444" name="F1 Score %" />
              <Bar dataKey="roc_auc" fill="#a855f7" name="ROC-AUC %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODEL CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                {m.model_name}
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Target: {m.target_name}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">ACCURACY</span>
                <strong className="text-emerald-400">{(m.accuracy * 100).toFixed(1)}%</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">F1 SCORE</span>
                <strong className="text-amber-400">{(m.f1_score * 100).toFixed(1)}%</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">ROC-AUC</span>
                <strong className="text-purple-400">{(m.roc_auc * 100).toFixed(1)}%</strong>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 block pt-2">Last Trained: {m.trained_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
