import React from 'react';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-white/70 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-white placeholder-white/30',
              'focus:outline-none focus:ring-2 focus:ring-[#0D85D8]/50 focus:border-[#0D85D8]/50',
              'disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white/30">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-white/40">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-white/70 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border border-white/10 bg-black/60 px-4 py-2.5 text-white placeholder-white/30',
            'focus:outline-none focus:ring-2 focus:ring-[#0D85D8]/50 focus:border-[#0D85D8]/50',
            'disabled:bg-white/5 disabled:text-white/30 disabled:cursor-not-allowed',
            'transition-colors duration-200 resize-none',
            error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-white/40">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
