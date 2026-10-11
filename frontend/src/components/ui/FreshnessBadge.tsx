import React from 'react';
import { cn } from '../../lib/utils';
import { Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export type FreshnessStatus = 'fresh' | 'delayed' | 'stale' | 'demo';

export interface FreshnessBadgeProps {
  status: FreshnessStatus;
  updatedAt?: string | Date;
  className?: string;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  status,
  updatedAt,
  className,
}) => {
  const configs: Record<
    FreshnessStatus,
    { label: string; style: string; dot: string; icon: React.ReactNode }
  > = {
    fresh: {
      label: 'Fresh (< 1m)',
      style: 'bg-green/15 text-green border-green/30',
      dot: 'bg-green',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    delayed: {
      label: 'Delayed (15m)',
      style: 'bg-primary/15 text-primary border-primary/30',
      dot: 'bg-primary',
      icon: <Clock className="w-3 h-3" />,
    },
    stale: {
      label: 'Stale (> 30m)',
      style: 'bg-red/15 text-red border-red/30',
      dot: 'bg-red',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    demo: {
      label: 'Demo Data',
      style: 'bg-amber/15 text-amber border-amber/30',
      dot: 'bg-amber',
      icon: <ShieldAlert className="w-3 h-3" />,
    },
  };

  const config = configs[status] || configs.demo;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono select-none',
        config.style,
        className
      )}
      title={
        updatedAt
          ? `Last refreshed: ${typeof updatedAt === 'string' ? updatedAt : updatedAt.toLocaleTimeString()}`
          : undefined
      }
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', config.dot)} />
      <span>{config.label}</span>
    </div>
  );
};
