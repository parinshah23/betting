'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

interface CountdownTimerProps {
  endDate: string | Date;
  onComplete?: () => void;
  variant?: 'default' | 'compact' | 'large';
  showLabels?: boolean;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({
  endDate,
  onComplete,
  variant = 'default',
  showLabels = true,
  className,
}: CountdownTimerProps) {
  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  }, [endDate]);

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.isExpired && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining, onComplete]);

  if (timeRemaining.isExpired) {
    return (
      <div className={cn('text-center', className)}>
        <span className="text-lg font-semibold text-gray-500">Ended</span>
      </div>
    );
  }

  const TimeUnit = ({
    value,
    label,
    size,
  }: {
    value: number;
    label: string;
    size: 'sm' | 'md' | 'lg';
  }) => {
    const sizes = {
      sm: 'text-sm px-1.5 py-0.5',
      md: 'text-base px-2 py-1',
      lg: 'text-xl px-3 py-1.5',
    };

    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'bg-gray-900 text-white font-bold rounded-lg min-w-[2.5em] text-center',
            sizes[size]
          )}
        >
          {String(value).padStart(2, '0')}
        </div>
        {showLabels && (
          <span className="text-xs text-gray-500 mt-1 uppercase">{label}</span>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {variant === 'compact' ? (
        <>
          {timeRemaining.days > 0 && (
            <TimeUnit value={timeRemaining.days} label="d" size="sm" />
          )}
          <TimeUnit value={timeRemaining.hours} label="h" size="sm" />
          <span className="text-gray-400 self-center">:</span>
          <TimeUnit value={timeRemaining.minutes} label="m" size="sm" />
          <span className="text-gray-400 self-center">:</span>
          <TimeUnit value={timeRemaining.seconds} label="s" size="sm" />
        </>
      ) : (
        <>
          <TimeUnit
            value={timeRemaining.days}
            label="Days"
            size={variant === 'large' ? 'lg' : 'md'}
          />
          <span className="text-gray-400 self-center text-xl">:</span>
          <TimeUnit
            value={timeRemaining.hours}
            label="Hours"
            size={variant === 'large' ? 'lg' : 'md'}
          />
          <span className="text-gray-400 self-center text-xl">:</span>
          <TimeUnit
            value={timeRemaining.minutes}
            label="Minutes"
            size={variant === 'large' ? 'lg' : 'md'}
          />
          <span className="text-gray-400 self-center text-xl">:</span>
          <TimeUnit
            value={timeRemaining.seconds}
            label="Seconds"
            size={variant === 'large' ? 'lg' : 'md'}
          />
        </>
      )}
    </div>
  );
}

interface InstantDrawTimerProps {
  endDate: string | Date;
  className?: string;
}

export function InstantDrawTimer({ endDate, className }: InstantDrawTimerProps) {
  return (
    <div className={cn('bg-red-50 border border-red-200 rounded-lg p-3', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-red-600 uppercase">Instant Win Ends</p>
          <CountdownTimer endDate={endDate} variant="compact" showLabels={false} />
        </div>
        <div className="flex items-center gap-2">
          <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-xs text-red-600 font-medium">Live Now</span>
        </div>
      </div>
    </div>
  );
}
