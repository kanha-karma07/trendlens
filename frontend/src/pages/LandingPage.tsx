import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Scale,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { RiskNotice } from '../components/ui/RiskNotice';
import { HorizonSelector } from '../components/ui/SegmentedControl';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { Chip } from '../components/ui/Badge';
import { ChartLabel } from '../components/ui/ChartLabel';

export const LandingPage: React.FC = () => {
  const [horizon, setHorizon] = useState<'5m' | '15m' | '30m'>('15m');

  return (
    <div className="space-y-16 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-12 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-raised border border-border text-xs text-teal font-mono">
          <Zap className="w-3.5 h-3.5" />
          <span>ZERO DATA LEAKAGE · EMBARGO GAP TIME-SERIES SPLITS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Short-Horizon Stock Price{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal to-green">
            Estimation
          </span>{' '}
          for Indian Equities
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Quantitative probability distributions (50% and 90% uncertainty bands) for NSE & BSE stocks.
          No guaranteed returns. No black boxes. Benchmarked against naive last-price baselines.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/app/prediction">
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Price Forecasts
            </Button>
          </Link>
          <Link to="/app/model-performance">
            <Button variant="secondary" size="lg" leftIcon={<BarChart3 className="w-4 h-4" />}>
              Inspect Model Validation
            </Button>
          </Link>
        </div>

        {/* Global Mandatory Risk Warning */}
        <div className="max-w-2xl mx-auto pt-2">
          <RiskNotice variant="banner" />
        </div>
      </section>

      {/* Interactive Range Demo Card */}
      <section className="max-w-4xl mx-auto">
        <Card variant="raised" className="relative overflow-hidden border-border/80">
          <ChartLabel position="top-right" />
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>RELIANCE.NS</span>
                  <span className="text-xs text-slate-400 font-mono font-normal">
                    Reliance Industries Ltd · NSE
                  </span>
                </CardTitle>
                <CardDescription className="mt-1">
                  Generated at 10:30:00 IST · Model: TrendLens-Quant v1.2 (Ensemble)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <FreshnessBadge status="demo" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/40">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  Baseline Price at \(t_0\)
                </span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  ₹2,948.50
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5">Estimation Horizon</span>
                <HorizonSelector value={horizon} onChange={setHorizon} />
              </div>
            </div>

            {/* Range visualization display */}
            <div className="space-y-4 bg-card/60 p-5 rounded-card border border-border/50">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="font-semibold text-white">Estimated Uncertainty Bands (+{horizon})</span>
                <span className="font-mono text-teal">Target Time: 10:{horizon === '5m' ? '35' : horizon === '15m' ? '45' : '60'}:00 IST</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-raised p-4 rounded-control border border-border/60">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>50% Interquartile Range</span>
                    <Chip variant="teal" size="sm">50% Probability</Chip>
                  </div>
                  <div className="text-lg font-bold font-mono text-teal tabular-nums">
                    ₹2,944.20 — ₹2,953.80
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Spread: ₹9.60 (±0.32%)
                  </p>
                </div>

                <div className="bg-raised p-4 rounded-control border border-border/60">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>90% Confidence Band</span>
                    <Chip variant="primary" size="sm">90% Range</Chip>
                  </div>
                  <div className="text-lg font-bold font-mono text-primary tabular-nums">
                    ₹2,938.00 — ₹2,961.10
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Spread: ₹23.10 (±0.78%)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* The 3 Core Pillars */}
      <section id="honesty" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="p-6 space-y-3 bg-card border-border">
          <div className="w-10 h-10 rounded-control bg-teal/20 text-teal flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Mandatory Naive Baseline</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every candidate model is required to beat the naive last-price baseline across walk-forward rolling folds. No marketing spin on trivial correlations.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-card border-border">
          <div className="w-10 h-10 rounded-control bg-primary/20 text-primary flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Time Embargo & Anti-Leakage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Features only compute from candles prior to \(t_0\). Strict temporal splits with embargo gaps prevent serial leakage between training and validation blocks.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-card border-border">
          <div className="w-10 h-10 rounded-control bg-amber/20 text-amber flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Immutable Append-Only Log</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every generated forecast is permanently recorded in a pending state and automatically evaluated against real closing candles once settled.
          </p>
        </Card>
      </section>
    </div>
  );
};
