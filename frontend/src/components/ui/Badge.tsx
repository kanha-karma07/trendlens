import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'up' | 'down' | 'neutral' | 'amber' | 'teal' | 'primary';
  size?: 'sm' | 'md';
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  icon = false,
  children,
  ...props
}) => {
  const variants = {
    up: 'bg-green/15 text-green border border-green/30',
    down: 'bg-red/15 text-red border border-red/30',
    neutral: 'bg-slate-700/40 text-slate-300 border border-slate-600/40',
    amber: 'bg-amber/15 text-amber border border-amber/30',
    teal: 'bg-teal/15 text-teal border border-teal/30',
    primary: 'bg-primary/15 text-primary border border-primary/30',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  const getIcon = () => {
    if (!icon) return null;
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
    switch (variant) {
      case 'up':
        return <TrendingUp className={iconSize} />;
      case 'down':
        return <TrendingDown className={iconSize} />;
      case 'amber':
        return <AlertTriangle className={iconSize} />;
      default:
        return <Minus className={iconSize} />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono tabular-nums leading-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {getIcon()}
      <span>{children}</span>
    </span>
  );
};

export const Chip = Badge;
