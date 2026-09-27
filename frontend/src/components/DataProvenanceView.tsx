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
    return <div className="py-20 text-center text-slate-600 font-bold text-sm">Loading Data Provenance Matrix...</div>;
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'REAL': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'DERIVED': return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'ESTIMATED': return 'bg-amber-100 text-amber-900 border-amber-300';
      default: return 'bg-purple-100 text-purple-900 border-purple-300';
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-white border-2 border-amber-200 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-cyan-600" />
            Data Provenance & Scientific Methodology Matrix
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Complete transparency on dataset sources, scientific formulas, date ranges, and provenance classifications
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-mono font-bold shadow-xs">
          POLICY: STRICT TRANSPARENCY
        </span>
      </div>

      {/* PROVENANCE TABLE */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 space-y-4 shadow-md">
        <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-600" />
          HEATGUARD Data Provenance Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-200 text-slate-500 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Metric Name</th>
                <th className="py-2.5 px-3">Data Source / Provider</th>
                <th className="py-2.5 px-3">Date Range</th>
                <th className="py-2.5 px-3">Provenance Level</th>
                <th className="py-2.5 px-3">Scientific Formula / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/60 transition font-medium">
                  <td className="py-3 px-3 font-extrabold text-slate-900">{row.metric}</td>
                  <td className="py-3 px-3 text-slate-700 font-bold">{row.source}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 font-bold">{row.date_range}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getTagColor(row.provenance)}`}>
                      {row.provenance}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
