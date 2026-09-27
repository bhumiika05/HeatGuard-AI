import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { GisMap } from './components/GisMap';
import { CitizenDashboard } from './components/CitizenDashboard';
import { HealthcareDashboard } from './components/HealthcareDashboard';
import { AlertsAndTracking } from './components/AlertsAndTracking';
import { HistoricalAnalytics } from './components/HistoricalAnalytics';
import { AdminMonitoring } from './components/AdminMonitoring';
import { DataProvenanceView } from './components/DataProvenanceView';
import { WardDetailModal } from './components/WardDetailModal';
import { apiFetch } from './lib/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white border-2 border-amber-300 rounded-3xl shadow-xl max-w-2xl mx-auto my-12 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-300">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Module View Auto-Recovered</h2>
          <p className="text-xs text-slate-600 font-medium">
            The requested module experienced a temporary rendering note: {this.state.error?.message || 'Ready for interaction'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-xs shadow hover:bg-amber-700 transition cursor-pointer flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Reload Component View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<string>('authority');
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [currentScenario, setCurrentScenario] = useState<string>('NORMAL');

  const handleScenarioChange = (scenario: string) => {
    setCurrentScenario(scenario);
    apiFetch('/api/simulation/set-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    })
      .then(res => res.json())
      .then(() => {
        const current = activeTab;
        setActiveTab('');
        setTimeout(() => setActiveTab(current), 50);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-yellow-50/80 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-900 flex flex-col justify-between">
      <div>
        {/* Top Fixed Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentScenario={currentScenario}
          onScenarioChange={handleScenarioChange}
        />

        {/* Main View Container with Error Boundary */}
        <main className="container mx-auto px-4 py-6">
          <ErrorBoundary key={activeTab}>
            {activeTab === 'landing' && (
              <LandingPage onExplore={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === 'authority' && (
              <AuthorityDashboard
                onSelectWard={(id) => setSelectedWardId(id)}
                onExploreMap={() => setActiveTab('map')}
              />
            )}

            {activeTab === 'map' && (
              <GisMap onSelectWard={(id) => setSelectedWardId(id)} />
            )}

            {activeTab === 'citizen' && (
              <CitizenDashboard />
            )}

            {activeTab === 'healthcare' && (
              <HealthcareDashboard />
            )}

            {activeTab === 'tracking' && (
              <AlertsAndTracking />
            )}

            {activeTab === 'analytics' && (
              <HistoricalAnalytics />
            )}

            {activeTab === 'provenance' && (
              <DataProvenanceView />
            )}

            {activeTab === 'admin' && (
              <AdminMonitoring />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* App Footer */}
      <footer className="bg-white/80 backdrop-blur border-t border-amber-200/80 py-4 mt-8">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>🔥 <strong>HeatGuard AI</strong> — Hyperlocal Heatwave Health Advisory</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-300">
              ⚡ Prototype v2.0
            </span>
            <span>Delhi / NCR Heat Safety System</span>
          </div>
        </div>
      </footer>

      {/* Ward Inspector Modal Drawer */}
      <WardDetailModal
        wardId={selectedWardId}
        onClose={() => setSelectedWardId(null)}
      />
    </div>
  );
}

export default App;
