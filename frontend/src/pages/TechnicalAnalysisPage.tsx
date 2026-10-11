import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { ChartLabel } from '../components/ui/ChartLabel';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { Button } from '../components/ui/Button';
import { Activity, Sliders, BarChart3 } from 'lucide-react';

export const TechnicalAnalysisPage: React.FC = () => {
  const [indicator, setIndicator] = useState<'rsi' | 'macd' | 'bb' | 'atr'>('rsi');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Technical Indicators & Features</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Deterministic feature inputs computed strictly from candles \(\le t_0\).
          </p>
        </div>

        <RiskNotice variant="inline" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="RSI (14-period, 5m)"
          value="58.4"
          delta={{ value: "Neutral", variant: "neutral" }}
          subtext="No overbought/oversold extreme"
        />
        <StatCard
          label="MACD Histogram"
          value="+1.85"
          delta={{ value: "Bullish Divergence", variant: "up" }}
          subtext="Signal line crossover at 10:15"
        />
        <StatCard
          label="Average True Range (14)"
          value="₹8.40"
          delta={{ value: "Low Volatility", variant: "teal" }}
          subtext="Spread: 0.28% of last price"
        />
        <StatCard
          label="Bollinger Band Width"
          value="1.24%"
          delta={{ value: "Compression Phase", variant: "amber" }}
          subtext="Potential breakout volatility"
        />
      </div>

      <Card variant="raised" className="relative border-border/80">
        <ChartLabel position="top-right" />
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>RELIANCE.NS Technical Structure</CardTitle>
              <CardDescription>
                Features used by the estimator model at reference timestamp \(t_0 = 10:30\).
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-card p-1 rounded-control border border-border">
              {(['rsi', 'macd', 'bb', 'atr'] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setIndicator(id)}
                  className={`px-3 py-1 text-xs uppercase font-mono rounded-[6px] font-medium transition-colors ${
                    indicator === id ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 bg-card/60 rounded-card border border-border/40 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <Activity className="w-8 h-8 text-teal animate-pulse" />
            <h4 className="text-sm font-semibold text-white">
              {indicator.toUpperCase()} Multi-Timeframe Decomposition
            </h4>
            <p className="text-xs text-slate-400 max-w-md">
              Features strictly adhere to anti-leakage embargo rules. Values are normalized using rolling z-scores calculated without lookahead bias.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
