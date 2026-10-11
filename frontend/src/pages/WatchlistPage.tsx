import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Chip } from '../components/ui/Badge';
import { RiskNotice } from '../components/ui/RiskNotice';
import { FreshnessBadge } from '../components/ui/FreshnessBadge';
import { Star, Plus, ArrowUpRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WatchlistPage: React.FC = () => {
  const [newSymbol, setNewSymbol] = useState('');
  const [watchlist, setWatchlist] = useState([
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: '₹2,948.50', change: '+0.85%', estRange: '₹2,944 - ₹2,954', horizon: '15m' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: '₹3,882.10', change: '+0.42%', estRange: '₹3,878 - ₹3,890', horizon: '15m' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', price: '₹1,532.00', change: '-0.30%', estRange: '₹1,529 - ₹1,536', horizon: '30m' },
    { symbol: 'INFY.NS', name: 'Infosys Limited', price: '₹1,492.30', change: '+1.15%', estRange: '₹1,490 - ₹1,495', horizon: '5m' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', price: '₹1,120.40', change: '+0.25%', estRange: '₹1,118 - ₹1,124', horizon: '15m' },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    const sym = newSymbol.toUpperCase().trim() + (newSymbol.includes('.') ? '' : '.NS');
    setWatchlist([
      ...watchlist,
      {
        symbol: sym,
        name: `${sym.replace('.NS', '')} Equity`,
        price: '₹1,250.00',
        change: '+0.00%',
        estRange: '₹1,245 - ₹1,255',
        horizon: '15m',
      },
    ]);
    setNewSymbol('');
  };

  const handleRemove = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page font-bold tracking-tight text-white flex items-center gap-2">
            <span>Portfolio Watchlist</span>
            <FreshnessBadge status="demo" />
          </h1>
          <p className="text-body text-slate-400 mt-0.5">
            Active tracking list with real-time short-horizon estimation bands.
          </p>
        </div>

        <RiskNotice variant="inline" />
      </div>

      <Card variant="raised" className="p-4 border-border/80">
        <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px]">
            <Input
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Add symbol e.g. TATAMOTORS, SBIN, WIPRO..."
            />
          </div>
          <Button type="submit" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Add to Watchlist
          </Button>
        </form>
      </Card>

      <Card variant="default">
        <CardHeader>
          <CardTitle>Tracked Equities ({watchlist.length})</CardTitle>
          <CardDescription>
            Click "Forecast" on any security to open the probabilistic uncertainty cone.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Last Price</TableHead>
                <TableHead>Session Change</TableHead>
                <TableHead>P50 Estimated Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map((item) => (
                <TableRow key={item.symbol}>
                  <TableCell className="font-semibold text-white">{item.symbol}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{item.name}</TableCell>
                  <TableCell className="font-mono text-white font-medium">{item.price}</TableCell>
                  <TableCell>
                    <Chip variant={item.change.startsWith('+') ? 'up' : 'down'} size="sm" icon>
                      {item.change}
                    </Chip>
                  </TableCell>
                  <TableCell className="font-mono text-teal text-xs">
                    {item.estRange} ({item.horizon})
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/app/prediction">
                        <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                          Forecast
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleRemove(item.symbol)}
                        className="p-1.5 text-slate-500 hover:text-red transition-colors rounded"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
