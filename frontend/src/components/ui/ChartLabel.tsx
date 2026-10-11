import React from 'react';
import { cn } from '../../lib/utils';
import { EyeOff } from 'lucide-react';

export interface ChartLabelProps {
  className?: string;
  position?: 'top-right' | 'bottom-left' | 'inline';
}

export const ChartLabel: React.FC<ChartLabelProps> = ({
  className,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'absolute top-3 right-3 z-10',
    'bottom-left': 'absolute bottom-3 left-3 z-10',
    inline: 'relative',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control text-[11px] font-mono',
        'bg-card/90 backdrop-blur-sm text-slate-400 border border-border/80 shadow-sm pointer-events-none select-none',
        positionClasses[position],
        className
      )}
    >
      <EyeOff className="w-3 h-3 text-amber shrink-0" />
      <span>Illustrative sample data — not live market data.</span>
    </div>
  );
};
