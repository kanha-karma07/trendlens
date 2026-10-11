import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  LayoutDashboard,
  LineChart,
  Activity,
  History,
  Star,
  Settings,
  Bell,
  Search,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { SampleDataBadge } from '../ui/SampleDataBadge';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Stock Prediction', to: '/app/prediction', icon: TrendingUp },
  { name: 'Technical Analysis', to: '/app/technical', icon: Activity },
  { name: 'Model Performance', to: '/app/model-performance', icon: SlidersHorizontal },
  { name: 'Watchlist', to: '/app/watchlist', icon: Star },
  { name: 'Prediction History', to: '/app/history', icon: History },
  { name: 'Settings', to: '/app/settings', icon: Settings },
];

const mobileTabs: NavItem[] = [
  { name: 'Home', to: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Predict', to: '/app/prediction', icon: TrendingUp },
  { name: 'Charts', to: '/app/technical', icon: Activity },
  { name: 'Watchlist', to: '/app/watchlist', icon: Star },
  { name: 'More', to: '/app/settings', icon: Settings },
];

export const AppLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg text-slate-100 flex flex-col antialiased">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-card border-r border-border">
          {/* Brand header */}
          <div className="h-16 px-6 flex items-center border-b border-border/80">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-control bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg text-white">
                  Trend<span className="text-teal">Lens</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-1">
                  NSE / BSE Quant
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-control text-body font-medium transition-colors group',
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-raised'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Sidebar Status */}
          <div className="p-4 border-t border-border/80 bg-raised/40 m-3 rounded-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400">DATA FEED</span>
              <span className="text-[11px] font-mono text-amber font-semibold">OFFLINE DEMO</span>
            </div>
            <p className="text-[12px] text-slate-300 leading-snug">
              Simulated playback mode with historical market distributions.
            </p>
          </div>
        </aside>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 h-16 bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Symbol Search */}
            <div className="flex-1 max-w-md relative">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NSE/BSE symbol (e.g. RELIANCE, TCS)..."
                  className="w-full bg-raised text-white text-body rounded-control border border-border pl-9 pr-12 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-500 font-sans"
                />
                <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono bg-card text-slate-400 rounded border border-border">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-3">
              {/* Mandatory Sample Data Badge */}
              <SampleDataBadge />

              {/* Notification Bell */}
              <Link
                to="/app/alerts"
                className="relative p-2 text-slate-300 hover:text-white rounded-control hover:bg-raised transition-colors"
                title="Alerts & Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal" />
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-border/80">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary font-mono">
                  TL
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-medium text-white leading-tight">Analyst Trader</span>
                  <span className="text-[10px] font-mono text-slate-400">NSE Intraday</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-control text-[11px] font-medium transition-colors',
                isActive ? 'text-primary font-semibold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-0.5', isActive && 'stroke-[2.5]')} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
