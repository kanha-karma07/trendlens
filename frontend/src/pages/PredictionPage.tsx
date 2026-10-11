import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { HorizonSelector } from '../components/ui/SegmentedControl';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { Chip } from '../components/ui/Badge';
import { ChartLabel } from '../components/ui/ChartLabel';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface SymbolData {
  symbol: string;
  name: string;
  exchange: string;
  lastPrice: number;
}

const symbols: SymbolData[] = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', exchange: 'NSE', lastPrice: 2948.5 },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', exchange: 'NSE', lastPrice: 3882.1 },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', exchange: 'NSE', lastPrice: 1532.0 },
  { symbol: 'INFY.NS', name: 'Infosys Ltd', exchange: 'NSE', lastPrice: 1492.3 },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', exchange: 'NSE', lastPrice: 1120.4 },
];

export const PredictionPage: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData>(symbols[0]);
  const [horizon, setHorizon] = useState<'5m' | '15m' | '30m'>('15m');
  const [candleInterval, setCandleInterval] = useState<'5m' | '1m'>('5m');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample historical and fan chart data
  const base = selectedSymbol.lastPrice;
  const mockChartData = [
    { time: '10:00', price: base - 12, p50Low: null, p50High: null, p90Low: null, p90High: null },
    { time: '10:05', price: base - 8, p50Low: null, p50High: null, p90Low: null, p90High: null },
    { time: '10:10', price: base - 5, p50Low: null, p50High: null, p90Low: null, p90High: null },
    { time: '10:15', price: base - 2, p50Low: null, p50High: null, p90Low: null, p90High: null },
    { time: '10:20', price: base - 3, p50Low: null, p50High: null, p90Low: null, p90High: null },
    { time: '10:25', price: base + 1, p50Low: null, p50High: null, p90Low: null, p90High: null },
    {
      time: '10:30 (t0)',
      price: base,
      p50Low: base,
      p50High: base,
      p90Low: base,
      p90High: base,
    },
    // Projection range fan
    {
      time: `10:35`,
      price: null,
      p50Low: base - 2.5,
      p50High: base + 3.2,
      p90Low: base - 6.0,
      p90High: base + 7.5,
    },
    {
      time: `10:40`,
      price: null,
      p50Low: base - 4.1,
      p50High: base + 5.3,
      p90Low: base - 9.8,
      p90High: base + 11.2,
    },
    {
      time: `10:45 (+${horizon})`,
      price: null,
      p50Low: base - 5.8,
      p50High: base + 7.1,
      p90Low: base - 13.5,
      p90High: base + 15.2,
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Stock Price Estimation</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Non-leaking probability fan distributions with naive baseline comparison.
          </p>
        </div>

        {/* Global Mandatory Risk Notice */}
        <div className="w-full sm:w-auto max-w-md">
          <RiskNotice variant="inline" />
        </div>
      </div>

      {/* Control Configuration Bar */}
      <Card variant="raised" className="p-4 border-border/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Symbol Select */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Asset:
            </span>
            <div className="relative">
              <select
                value={selectedSymbol.symbol}
                onChange={(e) => {
                  const found = symbols.find((s) => s.symbol === e.target.value);
                  if (found) setSelectedSymbol(found);
                }}
                className="bg-card text-white text-body font-mono font-semibold rounded-control border border-border px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-primary"
              >
                {symbols.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Candle Interval */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Input Candles:</span>
            <div className="inline-flex p-0.5 bg-card border border-border rounded-control">
              <button
                type="button"
                onClick={() => setCandleInterval('5m')}
                className={`px-2.5 py-1 text-xs rounded-[7px] font-medium transition-colors ${
                  candleInterval === '5m' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                5-min (Default)
              </button>
              <button
                type="button"
                onClick={() => setCandleInterval('1m')}
                className={`px-2.5 py-1 text-xs rounded-[7px] font-medium transition-colors ${
                  candleInterval === '1m' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                1-min (Optional)
              </button>
            </div>
          </div>

          {/* Horizon Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Horizon:</span>
            <HorizonSelector value={horizon} onChange={setHorizon} />
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Refresh Range
          </Button>
        </div>
      </Card>

      {/* Primary Forecast Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Uncertainty Summary Card */}
        <div className="space-y-4">
          <Card variant="raised" className="border-border/80">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{selectedSymbol.symbol}</span>
                    <span className="text-xs font-mono font-normal text-slate-400">
                      {selectedSymbol.exchange}
                    </span>
                  </CardTitle>
                  <CardDescription>{selectedSymbol.name}</CardDescription>
                </div>
                <Chip variant="teal" size="sm">
                  +{horizon} Horizon
                </Chip>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Baseline Price */}
              <div className="p-3 bg-card rounded-control border border-border/50">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Settled Price at \(t_0\) (10:30 IST)</span>
                  <span className="font-mono text-slate-500">Naive Baseline</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  ₹{selectedSymbol.lastPrice.toFixed(2)}
                </div>
              </div>

              {/* 50% Band */}
              <div className="p-3.5 bg-teal/10 rounded-control border border-teal/30">
                <div className="flex justify-between items-center text-xs text-teal font-medium mb-1">
                  <span>50% Interquartile Range</span>
                  <span>50% Prob.</span>
                </div>
                <div className="text-xl font-bold font-mono text-teal tabular-nums">
                  ₹{(base - 5.8).toFixed(2)} — ₹{(base + 7.1).toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Uncertainty Spread: ₹12.90 (±0.44%)
                </div>
              </div>

              {/* 90% Band */}
              <div className="p-3.5 bg-primary/10 rounded-control border border-primary/30">
                <div className="flex justify-between items-center text-xs text-primary font-medium mb-1">
                  <span>90% Confidence Interval</span>
                  <span>90% Range</span>
                </div>
                <div className="text-xl font-bold font-mono text-primary tabular-nums">
                  ₹{(base - 13.5).toFixed(2)} — ₹{(base + 15.2).toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Uncertainty Spread: ₹28.70 (±0.97%)
                </div>
              </div>

              {/* Model Metadata */}
              <div className="pt-2 border-t border-border/50 text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Model Engine:</span>
                  <span className="text-white">TrendLens-Quant v1.2</span>
                </div>
                <div className="flex justify-between">
                  <span>Generated At:</span>
                  <span className="text-white">10:30:00 IST (UTC+5:30)</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Time:</span>
                  <span className="text-white">10:45:00 IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Embargo Buffer:</span>
                  <span className="text-teal font-semibold">15 min enforced</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <RiskNotice variant="card" />
        </div>

        {/* Right Column: Visual Fan Chart */}
        <div className="lg:col-span-2">
          <Card variant="raised" className="relative h-full flex flex-col border-border/80">
            <ChartLabel position="top-right" />
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span>Probability Cone & Settled History</span>
              </CardTitle>
              <CardDescription>
                Solid line shows settled candles (\(\le t_0\)). Shaded bands project future uncertainty.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 min-h-[360px] p-2 sm:p-5">
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={mockChartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <defs>
                    <linearGradient id="p90Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14D9C0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#14D9C0" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#223059" opacity={0.6} />
                  <XAxis
                    dataKey="time"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    fontFamily="monospace"
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    fontFamily="monospace"
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101A36',
                      borderColor: '#223059',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />

                  {/* 90% Band Area */}
                  <Area
                    type="monotone"
                    dataKey="p90High"
                    stroke="#3B82F6"
                    strokeDasharray="4 4"
                    fill="url(#p90Gradient)"
                    name="90% Upper Band"
                  />
                  <Area
                    type="monotone"
                    dataKey="p90Low"
                    stroke="#3B82F6"
                    strokeDasharray="4 4"
                    fill="#101A36"
                    name="90% Lower Band"
                  />

                  {/* 50% Band Area */}
                  <Area
                    type="monotone"
                    dataKey="p50High"
                    stroke="#14D9C0"
                    fill="url(#p50Gradient)"
                    name="50% Upper (Q3)"
                  />
                  <Area
                    type="monotone"
                    dataKey="p50Low"
                    stroke="#14D9C0"
                    fill="#101A36"
                    name="50% Lower (Q1)"
                  />

                  {/* Settled Candle Price Line */}
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#F8FAFC"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#3B82F6' }}
                    name="Settled Price (≤ t0)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
