import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { SampleDataBadge } from '../ui/SampleDataBadge';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-slate-100 font-sans selection:bg-primary selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/80 h-16 flex items-center px-4 sm:px-8 justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-control bg-primary/20 border border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg text-white flex items-center gap-1.5">
                Trend<span className="text-teal">Lens</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-1">
                NSE · BSE Research
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
            <Link to="/#methodology" className="hover:text-white transition-colors">
              Methodology
            </Link>
            <Link to="/#honesty" className="hover:text-white transition-colors">
              Honesty Policy
            </Link>
            <Link to="/app/prediction" className="hover:text-teal transition-colors flex items-center gap-1">
              Live Demo
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SampleDataBadge compact />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Comprehensive Risk & Regulatory Disclaimer Footer */}
      <footer className="bg-card border-t border-border mt-auto pt-10 pb-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal/20 border border-teal/40 flex items-center justify-center text-teal">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide">
                TrendLens Statistical Estimation Engine
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Risk Disclosure</Link>
              <Link to="/terms" className="hover:text-white transition-colors">SEBI Compliance Notes</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Walk-Forward Architecture</Link>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <p className="font-semibold text-amber/90">
              MANDATORY STATISTICAL & FINANCIAL DISCLAIMER:
            </p>
            <p>
              TrendLens is an algorithmic research and computational price modeling sandbox tailored for Indian equities (NSE & BSE). All projections are probability distributions (50% and 90% confidence bands) generated using mathematical models strictly bounded by data preceding time \(t_0\).
            </p>
            <p>
              Estimates may be wrong and are NOT investment, legal, taxation, or trading advice. TrendLens is NOT a SEBI-registered Research Analyst or Portfolio Manager. We do NOT guarantee accuracy, profit, or loss mitigation. Sample and simulation modes run on illustrative recorded data. Real capital is exposed to complete loss in derivatives and intraday equity trading.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 border-t border-border/30">
            <p>© {new Date().getFullYear()} TrendLens. All rights reserved. Indian Equities Quantitative Research.</p>
            <p className="font-mono text-[11px] mt-2 sm:mt-0 text-slate-400">v0.1.0-alpha · Dark Navy Fintech System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
