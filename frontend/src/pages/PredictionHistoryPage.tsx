import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Chip } from '../components/ui/Badge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { History, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const PredictionHistoryPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'evaluated'>('all');

  const historyItems = [
    {
      id: 'pred-9021',
      symbol: 'RELIANCE.NS',
      time: '2026-10-11 10:30 IST',
      targetTime: '2026-10-11 10:45 IST',
      horizon: '15m',
      t0Price: '₹2,948.50',
      p50: '₹2,944.20 - ₹2,953.80',
      p90: '₹2,938.00 - ₹2,961.10',
      status: 'PENDING',
      actual: '—',
      calibration: 'Awaiting Settlement',
      model: 'Quant-Ridge v1.2',
    },
    {
      id: 'pred-9020',
      symbol: 'TCS.NS',
      time: '2026-10-11 10:15 IST',
      targetTime: '2026-10-11 10:30 IST',
      horizon: '15m',
      t0Price: '₹3,882.10',
      p50: '₹3,878.00 - ₹3,889.50',
      p90: '₹3,870.50 - ₹3,898.00',
      status: 'EVALUATED',
      actual: '₹3,886.40',
      calibration: 'Hit P50 Band (Success)',
      model: 'Quant-Ridge v1.2',
    },
    {
      id: 'pred-9019',
      symbol: 'INFY.NS',
      time: '2026-10-11 10:00 IST',
      targetTime: '2026-10-11 10:05 IST',
      horizon: '5m',
      t0Price: '₹1,492.30',
      p50: '₹1,490.00 - ₹1,495.10',
      p90: '₹1,486.20 - ₹1,498.80',
      status: 'EVALUATED',
      actual: '₹1,491.50',
      calibration: 'Hit P50 Band (Success)',
      model: 'Quant-Ridge v1.2',
    },
    {
      id: 'pred-9018',
      symbol: 'HDFCBANK.NS',
      time: '2026-10-11 09:30 IST',
      targetTime: '2026-10-11 10:00 IST',
      horizon: '30m',
      t0Price: '₹1,532.00',
      p50: '₹1,529.00 - ₹1,536.20',
      p90: '₹1,523.50 - ₹1,541.00',
      status: 'EVALUATED',
      actual: '₹1,538.10',
      calibration: 'Hit P90 Band (Tail)',
      model: 'Quant-Ridge v1.2',
    },
  ];

  const filtered = historyItems.filter((item) => {
    if (filter === 'pending') return item.status === 'PENDING';
    if (filter === 'evaluated') return item.status === 'EVALUATED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Prediction Audit Log</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Rule 6 Compliance: Immutable, append-only history resolved asynchronously by settlement worker.
          </p>
        </div>

        <RiskNotice variant="inline" />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs rounded-control font-medium transition-colors ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-card text-slate-400 hover:text-white'
          }`}
        >
          All Predictions ({historyItems.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 text-xs rounded-control font-medium transition-colors ${
            filter === 'pending' ? 'bg-amber text-black font-semibold' : 'bg-card text-slate-400 hover:text-white'
          }`}
        >
          Pending Only
        </button>
        <button
          onClick={() => setFilter('evaluated')}
          className={`px-3 py-1.5 text-xs rounded-control font-medium transition-colors ${
            filter === 'evaluated' ? 'bg-teal text-black font-semibold' : 'bg-card text-slate-400 hover:text-white'
          }`}
        >
          Evaluated
        </button>
      </div>

      <Card variant="raised" className="border-border/80">
        <CardHeader>
          <CardTitle>Historical Log Trail</CardTitle>
          <CardDescription>
            Historical records cannot be altered. Both hits and misses are permanently scored.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Forecast ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Created At (t0)</TableHead>
                <TableHead>Horizon</TableHead>
                <TableHead>Base (t0)</TableHead>
                <TableHead>50% Band</TableHead>
                <TableHead>90% Band</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Settled Actual</TableHead>
                <TableHead>Calibration Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-slate-400">{item.id}</TableCell>
                  <TableCell className="font-semibold text-white">{item.symbol}</TableCell>
                  <TableCell className="text-xs text-slate-400 font-mono">{item.time}</TableCell>
                  <TableCell className="text-xs font-mono">{item.horizon}</TableCell>
                  <TableCell className="font-mono text-white font-medium">{item.t0Price}</TableCell>
                  <TableCell className="font-mono text-teal text-xs">{item.p50}</TableCell>
                  <TableCell className="font-mono text-primary text-xs">{item.p90}</TableCell>
                  <TableCell>
                    {item.status === 'PENDING' ? (
                      <Chip variant="amber" size="sm">
                        PENDING
                      </Chip>
                    ) : (
                      <Chip variant="up" size="sm">
                        EVALUATED
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-white text-xs">{item.actual}</TableCell>
                  <TableCell className="text-xs">
                    {item.status === 'PENDING' ? (
                      <span className="text-amber flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> Awaiting target candle
                      </span>
                    ) : (
                      <span className="text-green flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> {item.calibration}
                      </span>
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
