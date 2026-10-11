import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Chip } from '../components/ui/Badge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { Bell, CheckCircle2, AlertTriangle, Layers, Info } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const alerts = [
    {
      id: 1,
      title: 'Settlement Worker Completed Batch #441',
      description: 'Resolved 18 pending predictions against newly settled 10:30 IST 5-minute candles. Hit rate within P50 band was 55.5%.',
      time: '5 minutes ago',
      type: 'success',
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: 'Volatility Outlier Detected on HDFCBANK.NS',
      description: 'Settled candle price ₹1,538.10 fell into the upper tail of the 90% confidence band (₹1,523.50 - ₹1,541.00). Logged in calibration metrics.',
      time: '32 minutes ago',
      type: 'amber',
      icon: AlertTriangle,
    },
    {
      id: 3,
      title: 'Walk-Forward Model Retraining Finished',
      description: 'Model Quant-Ensemble v1.2 updated with latest 30-day rolling partition. Baseline hurdle beaten with MAE improvement of +11.8%.',
      time: '2 hours ago',
      type: 'teal',
      icon: Layers,
    },
    {
      id: 4,
      title: 'Sample Data Mode Active',
      description: 'All prices and order flows are running on illustrative simulation data feeds. No live broker execution is connected.',
      time: 'Today, 09:15 IST',
      type: 'neutral',
      icon: Info,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Notifications & Model Alerts</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Audit logs and real-time alerts from asynchronous settlement evaluators.
          </p>
        </div>

        <RiskNotice variant="inline" />
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <Card key={alert.id} variant="raised" className="p-4 border-border/80">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2 rounded-control mt-0.5 ${
                    alert.type === 'success'
                      ? 'bg-green/15 text-green'
                      : alert.type === 'amber'
                      ? 'bg-amber/15 text-amber'
                      : alert.type === 'teal'
                      ? 'bg-teal/15 text-teal'
                      : 'bg-primary/15 text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                    <span className="text-[11px] font-mono text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
