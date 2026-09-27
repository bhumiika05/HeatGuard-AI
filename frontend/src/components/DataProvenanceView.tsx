import React, { useState, useEffect } from 'react';
import { FileText, Database, ShieldCheck, Info } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const DataProvenanceView: React.FC = () => {
  const [matrix, setMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiFetch('/api/admin/data-provenance')
      .then(res => res.json())
      .then(data => {
        setMatrix(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Loading Data Provenance Matrix...</div>;
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'REAL': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'DERIVED': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'ESTIMATED': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Data Provenance & Scientific Methodology Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete transparency on dataset sources, scientific formulas, date ranges, and provenance classifications
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          POLICY: STRICT TRANSPARENCY
        </span>
      </div>

      {/* PROVENANCE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          HEATGUARD Data Provenance Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Metric Name</th>
                <th className="py-2.5 px-3">Data Source / Provider</th>
                <th className="py-2.5 px-3">Date Range</th>
                <th className="py-2.5 px-3">Provenance Level</th>
                <th className="py-2.5 px-3">Scientific Formula / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-3 font-bold text-slate-100">{row.metric}</td>
                  <td className="py-3 px-3 text-slate-300">{row.source}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{row.date_range}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getTagColor(row.provenance)}`}>
                      {row.provenance}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
