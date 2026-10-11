import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RiskNoticeProps {
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const RiskNotice: React.FC<RiskNoticeProps> = ({
  variant = 'banner',
  className,
}) => {
  const noticeText =
    'Estimates may be wrong and are not investment advice. The range shows uncertainty, not a guarantee.';

  if (variant === 'inline') {
    return (
      <p className={cn('text-xs text-amber/90 flex items-center gap-1.5', className)}>
        <Info className="w-3.5 h-3.5 shrink-0 text-amber" />
        <span>{noticeText}</span>
      </p>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        'rounded-card border p-4 flex items-start gap-3 select-none',
        variant === 'card'
          ? 'bg-card border-amber/30 text-amber-100 shadow-md'
          : 'bg-amber/10 border-amber/30 text-amber-200',
        className
      )}
    >
      <ShieldAlert className="w-5 h-5 text-amber shrink-0 mt-0.5" />
      <div className="flex-1 text-xs leading-relaxed">
        <span className="font-semibold text-amber uppercase tracking-wider block text-[11px] mb-0.5">
          Mandatory Risk Disclosure
        </span>
        <p className="text-slate-200">
          {noticeText} Short-horizon market volatility is driven by unpredictable order flows and news catalysts.
        </p>
      </div>
    </div>
  );
};
