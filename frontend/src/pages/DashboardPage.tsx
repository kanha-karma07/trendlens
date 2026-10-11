import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Chip } from '../components/ui/Badge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { Button } from '../components/ui/Button';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';

export const DashboardPage: React.FC = () => {
  const recentPredictions = [
    {
      id: 'p-1049',
      symbol: 'RELIANCE.NS',
      time: '10:30 IST',
      horizon: '15 min',
      t0Price: '₹2,948.50',
      p50Band: '₹2,944.20 - ₹2,953.80',
      p90Band: '₹2,938.00 - ₹2,961.10',
      status: 'PENDING',
    },
    {
      id: 'p-1048',
      symbol: 'TCS.NS',
      time: '10:15 IST',
      horizon: '15 min',
      t0Price: '₹3,882.10',
      p50Band: '₹3,878.00 - ₹3,889.50',
      p90Band: '₹3,870.50 - ₹3,898.00',
      status: 'EVALUATED',
      actual: '₹3,886.40',
      hitP50: true,
    },
    {
      id: 'p-1047',
      symbol: 'HDFCBANK.NS',
      time: '10:00 IST',
      horizon: '30 min',
      t0Price: '₹1,532.00',
      p50Band: '₹1,529.00 - ₹1,536.20',
      p90Band: '₹1,523.50 - ₹1,541.00',
      status: 'EVALUATED',
      actual: '₹1,534.80',
      hitP50: true,
    },
    {
      id: 'p-1046',
      symbol: 'INFY.NS',
      time: '09:45 IST',
      horizon: '5 min',
      t0Price: '₹1,492.30',
      p50Band: '₹1,490.00 - ₹1,495.10',
      p90Band: '₹1,486.20 - ₹1,498.80',
      status: 'EVALUATED',
      actual: '₹1,491.50',
      hitP50: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Market Estimation Dashboard</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-1">
            Short-horizon statistical uncertainty bands for active Indian equities (NSE & BSE).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/prediction">
            <Button size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
              Generate Forecast
            </Button>
          </Link>
        </div>
      </div>

      {/* Mandatory Risk Notice */}
      <RiskNotice variant="banner" />

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="NIFTY 50 (NSE)"
          value="24,835.40"
          delta={{ value: "+0.45%", variant: "up" }}
          subtext="Session baseline: 24,724.10"
        />
        <StatCard
          label="BSE SENSEX"
          value="81,420.15"
          delta={{ value: "+0.38%", variant: "up" }}
          subtext="Session baseline: 81,112.50"
        />
        <StatCard
          label="Rolling P50 Calibration"
          value="52.4%"
          delta={{ value: "Target: 50.0%", variant: "teal" }}
          subtext="1,240 resolved walk-forward folds"
        />
        <StatCard
          label="Baseline Outperformance"
          value="+14.2%"
          delta={{ value: "vs Naive Last Price", variant: "up" }}
          subtext="Diebold-Mariano p-value < 0.01"
        />
      </div>

      {/* Recent Estimations & Append-only History Overview */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Predictions Stream</CardTitle>
            <CardDescription>
              Append-only audit trail. Rows start as PENDING and settle against real target candles.
            </CardDescription>
          </div>
          <Link to="/app/history">
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              View Full History
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Generated At</TableHead>
                <TableHead>Horizon</TableHead>
                <TableHead>Price at \(t_0\)</TableHead>
                <TableHead>50% Uncertainty Band</TableHead>
                <TableHead>90% Uncertainty Band</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Settled Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPredictions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-semibold text-white flex items-center gap-1.5">
                    <span>{row.symbol}</span>
                  </TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs">{row.time}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-raised border border-border">
                      {row.horizon}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-white font-medium">{row.t0Price}</TableCell>
                  <TableCell className="font-mono text-teal text-xs font-medium">
                    {row.p50Band}
                  </TableCell>
                  <TableCell className="font-mono text-primary text-xs font-medium">
                    {row.p90Band}
                  </TableCell>
                  <TableCell>
                    {row.status === 'PENDING' ? (
                      <Chip variant="amber" size="sm">
                        PENDING
                      </Chip>
                    ) : (
                      <Chip variant="up" size="sm">
                        EVALUATED
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.actual ? (
                      <span className="text-slate-200">{row.actual}</span>
                    ) : (
                      <span className="text-slate-500 italic">Awaiting target candle</span>
                    )}
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
