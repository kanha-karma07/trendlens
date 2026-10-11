import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Toggle';
import { RiskNotice } from '../components/ui/RiskNotice';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { Save, Shield, Database, Bell } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [dataModeDemo, setDataModeDemo] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [soundNotifications, setSoundNotifications] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Platform Settings</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Configure data ingestion preferences, calculation parameters, and notifications.
          </p>
        </div>

        <RiskNotice variant="inline" />
      </div>

      {/* Market Data Mode */}
      <Card variant="raised" className="border-border/80">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-teal" />
            <div>
              <CardTitle>Market Ingestion & Provider Settings</CardTitle>
              <CardDescription>Rules 1 & 7: User views read from cached DB; scheduler fetches provider.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Toggle
            label="Sample Data Mode (Demo Playback)"
            description="When enabled, runs illustrative offline sample data with mandatory watermarks. Live provider disabled."
            checked={dataModeDemo}
            onChange={setDataModeDemo}
          />

          <Toggle
            label="Automatic Cache Invalidation"
            description="Periodically sync local DB state with background settlement worker when target candle closes."
            checked={autoRefresh}
            onChange={setAutoRefresh}
          />

          <div className="pt-2 border-t border-border/50">
            <Input
              label="Market Data Adapter API Key"
              type="password"
              placeholder="••••••••••••••••••••••••"
              disabled
              helperText="Rule 9: Provider keys are strictly loaded from .env on the backend server, never client-side."
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Uncertainty Alert Subscriptions</CardTitle>
              <CardDescription>Receive notifications when prices breach estimated 90% confidence bands.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Toggle
            label="Tail Volatility Alert (90% Band Breakout)"
            description="Notify when a settled candle closes outside the 90% confidence interval."
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />

          <Toggle
            label="Sound Effects for Prediction Settlement"
            description="Play subtle audio tone when pending predictions are resolved by worker."
            checked={soundNotifications}
            onChange={setSoundNotifications}
          />
        </CardContent>
      </Card>

      {/* Compliance & Honesty */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber" />
            <div>
              <CardTitle>Data Honesty Enforcement</CardTitle>
              <CardDescription>Immutable platform invariants according to the 10 Non-Negotiable Rules.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-raised rounded-control border border-border/60">
            <strong>Rule 4: Zero Data Leakage</strong>
            <p className="text-slate-400 mt-0.5">Features are locked strictly to candles \(\le t_0\). Temporal splits with 15m embargo gap are active.</p>
          </div>
          <div className="p-3 bg-raised rounded-control border border-border/60">
            <strong>Rule 5: Naive Baseline Comparison</strong>
            <p className="text-slate-400 mt-0.5">All models must continuously beat the naive persistent last-price baseline across walk-forward folds.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
