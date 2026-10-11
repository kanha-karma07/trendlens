import React from 'react';
import { Card } from '../components/ui/Card';
import { RiskNotice } from '../components/ui/RiskNotice';
import { ShieldCheck, Scale, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-raised border border-border text-xs text-teal font-mono">
          <Scale className="w-3.5 h-3.5" />
          <span>REGULATORY DISCLOSURES & TERMS</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Terms of Use & Data Honesty Charter</h1>
        <p className="text-sm text-slate-400">
          Last revised: October 2026 · Governing Indian Equities Estimation Services
        </p>
      </div>

      <RiskNotice variant="banner" />

      <Card variant="raised" className="border-border/80 space-y-6 p-6">
        <section className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            1. Nature of the Service
          </h2>
          <p>
            TrendLens provides mathematical algorithms and machine learning probability distributions estimating short-horizon price intervals (5m, 15m, 30m) for securities listed on the National Stock Exchange of India (NSE) and Bombay Stock Exchange (BSE).
          </p>
          <p>
            TrendLens does NOT provide investment advice, buy/sell recommendations, stock tips, portfolio management, or financial planning. It is NOT registered as a Research Analyst with the Securities and Exchange Board of India (SEBI).
          </p>
        </section>

        <section className="space-y-2 text-xs text-slate-300 leading-relaxed border-t border-border/40 pt-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal" />
            2. Probabilistic Ranges vs. Guarantees
          </h2>
          <p>
            Under Rule 2 of the TrendLens Charter, all outputs are rendered as confidence intervals (50% and 90% bands). No deterministic price point is guaranteed. By using this service, you understand that equity markets are subject to sudden systemic shocks and liquidity voids.
          </p>
        </section>

        <section className="space-y-2 text-xs text-slate-300 leading-relaxed border-t border-border/40 pt-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber" />
            3. Sample Data Mode
          </h2>
          <p>
            When operating in Demo / Sample Data Mode, all market prices and statistical projections are synthetic illustrative playback values and do not represent live execution prices from any Indian stock exchange.
          </p>
        </section>
      </Card>
    </div>
  );
};
