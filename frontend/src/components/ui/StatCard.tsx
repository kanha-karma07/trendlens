import React from 'react';
import { Card, CardContent } from './Card';
import { Chip } from './Badge';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    variant: 'up' | 'down' | 'neutral' | 'amber';
  };
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  subtext,
  icon,
  className,
}) => {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </span>
          {icon && <div className="text-slate-400">{icon}</div>}
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {value}
          </div>
          {delta && (
            <Chip variant={delta.variant} size="sm" icon>
              {delta.value}
            </Chip>
          )}
        </div>

        {subtext && (
          <p className="mt-2 text-xs text-slate-400 font-normal">
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
