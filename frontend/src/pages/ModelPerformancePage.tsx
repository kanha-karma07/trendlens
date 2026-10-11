import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Chip } from '../components/ui/Badge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { ChartLabel } from '../components/ui/ChartLabel';
import { Award } from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const folds = [
    { fold: 'Fold #1 (Jan 2026)', maeModel: '0.38%', maeBaseline: '0.44%', coverageP50: '51.2%', coverageP90: '89.8%', win: true },
    { fold: 'Fold #2 (Feb 2026)', maeModel: '0.41%', maeBaseline: '0.45%', coverageP50: '49.8%', coverageP90: '90.2%', win: true },
    { fold: 'Fold #3 (Mar 2026)', maeModel: '0.36%', maeBaseline: '0.42%', coverageP50: '52.1%', coverageP90: '91.0%', win: true },
    { fold: 'Fold #4 (Apr 2026)', maeModel: '0.45%', maeBaseline: '0.49%', coverageP50: '50.6%', coverageP90: '89.4%', win: true },
    { fold: 'Fold #5 (May 2026)', maeModel: '0.39%', maeBaseline: '0.43%', coverageP50: '51.9%', coverageP90: '90.5%', win: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Model Validation & Calibration</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Walk-forward rolling evaluation against mandatory naive last-price baseline.
          </p>
        </div>

        <RiskNotice variant="inline" />
      </div>

      <div className="p-4 bg-card rounded-card border border-teal/40 flex items-start gap-3">
        <Award className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block text-sm mb-0.5">Rule 5 Verification: Outperformed Baseline</strong>
          Candidate model <em>Quant-Ensemble v1.2</em> achieved lower Mean Absolute Error than the naive last-price forecast across all 5 walk-forward rolling blocks with statistically significant p &lt; 0.01.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="P50 Empirical Coverage"
          value="51.1%"
          delta={{ value: "Target: 50.0%", variant: "teal" }}
          subtext="Well-calibrated interquartile band"
        />
        <StatCard
          label="P90 Empirical Coverage"
          value="90.2%"
          delta={{ value: "Target: 90.0%", variant: "teal" }}
          subtext="Uncertainty matches true volatility"
        />
        <StatCard
          label="MAE Improvement"
          value="+11.8%"
          delta={{ value: "vs Baseline", variant: "up" }}
          subtext="Across 1,200 walk-forward iterations"
        />
        <StatCard
          label="Test Set Usage"
          value="1x Single Pass"
          delta={{ value: "Anti-Leakage", variant: "neutral" }}
          subtext="Holdout evaluated strictly once"
        />
      </div>

      <Card variant="raised" className="relative border-border/80">
        <ChartLabel position="top-right" />
        <CardHeader>
          <CardTitle>Walk-Forward Rolling Backtest Folds</CardTitle>
          <CardDescription>
            Embargo gap \(\ge 15\) minutes enforced between train and validation splits.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluation Partition</TableHead>
                <TableHead>Model MAE</TableHead>
                <TableHead>Baseline MAE</TableHead>
                <TableHead>P50 Coverage</TableHead>
                <TableHead>P90 Coverage</TableHead>
                <TableHead>Baseline Win</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folds.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold text-white">{f.fold}</TableCell>
                  <TableCell className="font-mono text-teal font-medium">{f.maeModel}</TableCell>
                  <TableCell className="font-mono text-slate-400">{f.maeBaseline}</TableCell>
                  <TableCell className="font-mono text-white">{f.coverageP50}</TableCell>
                  <TableCell className="font-mono text-white">{f.coverageP90}</TableCell>
                  <TableCell>
                    <Chip variant="up" size="sm" icon>
                      BEATS BASELINE
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
