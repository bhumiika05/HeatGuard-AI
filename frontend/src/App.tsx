import React, { useState } from 'react';
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
        // Force refresh tab
        const current = activeTab;
        setActiveTab('');
        setTimeout(() => setActiveTab(current), 50);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScenario={currentScenario}
        onScenarioChange={handleScenarioChange}
      />

      {/* Main View Container */}
      <main className="container mx-auto px-4 py-6">
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
      </main>

      {/* Ward Inspector Modal Drawer */}
      <WardDetailModal
        wardId={selectedWardId}
        onClose={() => setSelectedWardId(null)}
      />
    </div>
  );
}

export default App;
