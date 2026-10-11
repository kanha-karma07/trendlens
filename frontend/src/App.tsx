import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TermsPage } from './pages/TermsPage';

import { DashboardPage } from './pages/DashboardPage';
import { PredictionPage } from './pages/PredictionPage';
import { TechnicalAnalysisPage } from './pages/TechnicalAnalysisPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { WatchlistPage } from './pages/WatchlistPage';
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AlertsPage } from './pages/AlertsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Regulatory Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          {/* Authenticated Workspace with Sidebar, Topbar & Mobile Bottom Tabs */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="prediction" element={<PredictionPage />} />
            <Route path="technical" element={<TechnicalAnalysisPage />} />
            <Route path="model-performance" element={<ModelPerformancePage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="history" element={<PredictionHistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
          </Route>

          {/* Catch-all 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
