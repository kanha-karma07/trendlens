import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SampleDataBadgeProps {
  className?: string;
  compact?: boolean;
}

export const SampleDataBadge: React.FC<SampleDataBadgeProps> = ({
  className,
  compact = false,
}) => {
  return (
    <div
      title="Demo Mode: All market prices and statistical projections are illustrative sample data and not live market feeds."
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-amber/15 text-amber border border-amber/40 shadow-sm select-none',
        className
      )}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber" />
      <span>{compact ? 'Sample data' : 'Sample data mode'}</span>
    </div>
  );
};
