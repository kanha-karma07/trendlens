import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  successMessage?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      success,
      successMessage,
      helperText,
      leftIcon,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={computedType}
            className={cn(
              'w-full bg-raised text-white placeholder-slate-500 text-body rounded-control border px-3.5 py-2 transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-bg',
              leftIcon ? 'pl-10' : 'pl-3.5',
              isPassword || success || error ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-red focus:border-red focus:ring-red/30'
                : success
                ? 'border-green focus:border-green focus:ring-green/30'
                : 'border-border focus:border-primary focus:ring-primary/30',
              className
            )}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : error ? (
            <AlertCircle className="w-4 h-4 text-red absolute right-3 pointer-events-none" />
          ) : success ? (
            <CheckCircle2 className="w-4 h-4 text-green absolute right-3 pointer-events-none" />
          ) : null}
        </div>

        {error && <p className="text-xs text-red mt-1">{error}</p>}
        {!error && success && successMessage && (
          <p className="text-xs text-green mt-1">{successMessage}</p>
        )}
        {!error && !success && helperText && (
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
