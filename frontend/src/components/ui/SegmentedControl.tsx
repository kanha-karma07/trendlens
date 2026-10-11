import React from 'react';
import { cn } from '../../lib/utils';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  badge?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex p-1 bg-raised/90 border border-border rounded-control select-none',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option.value)}
            className={cn(
              'relative flex items-center justify-center font-medium transition-all duration-150 rounded-[8px] focus:outline-none',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-body',
              isSelected
                ? 'bg-primary text-white shadow-sm font-semibold'
                : option.disabled
                ? 'text-slate-500 cursor-not-allowed opacity-60'
                : 'text-slate-300 hover:text-white hover:bg-card/40'
            )}
          >
            <span>{option.label}</span>
            {option.badge && (
              <span
                className={cn(
                  'ml-1.5 text-[10px] uppercase font-mono px-1 py-0.2 rounded',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Pre-configured horizon selector for 5m, 15m, 30m, and disabled 60m
export const HorizonSelector: React.FC<{
  value: '5m' | '15m' | '30m';
  onChange: (value: '5m' | '15m' | '30m') => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const options: SegmentOption<'5m' | '15m' | '30m' | '60m'>[] = [
    { value: '5m', label: '5 min' },
    { value: '15m', label: '15 min' },
    { value: '30m', label: '30 min' },
    { value: '60m', label: '60 min', disabled: true, badge: 'later' },
  ];

  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={(v) => {
        if (v !== '60m') onChange(v);
      }}
      className={className}
    />
  );
};
