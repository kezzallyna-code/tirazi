import React from 'react';

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

interface AvailabilityIndicatorProps {
  status?: AvailabilityStatus | string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const AVAILABILITY_CONFIG: Record<AvailabilityStatus, { label: string; dotClass: string; textClass: string }> = {
  available: {
    label: 'Available',
    dotClass: 'bg-emerald-500 ring-white',
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  busy: {
    label: 'Busy',
    dotClass: 'bg-amber-500 ring-white',
    textClass: 'text-amber-700 dark:text-amber-400',
  },
  unavailable: {
    label: 'Unavailable',
    dotClass: 'bg-gray-400 ring-white',
    textClass: 'text-gray-500 dark:text-gray-400',
  },
};

export function getAvailabilityConfig(status?: string | null) {
  const normalized = (status?.toLowerCase() || 'unavailable') as AvailabilityStatus;
  return AVAILABILITY_CONFIG[normalized] || AVAILABILITY_CONFIG.unavailable;
}

export function AvailabilityIndicator({
  status = 'unavailable',
  size = 'md',
  className = '',
  showLabel = false,
}: AvailabilityIndicatorProps) {
  const config = getAvailabilityConfig(status);

  const sizeClasses = {
    sm: 'w-2.5 h-2.5 ring-1.5',
    md: 'w-3.5 h-3.5 ring-2',
    lg: 'w-5 h-5 ring-4',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={`Availability: ${config.label}`}
      aria-label={`Availability: ${config.label}`}
    >
      <span
        className={`rounded-full shrink-0 shadow-sm ${sizeClasses[size]} ${config.dotClass}`}
      />
      {showLabel && (
        <span className={`text-xs font-semibold ${config.textClass}`}>
          {config.label}
        </span>
      )}
    </span>
  );
}

export default AvailabilityIndicator;
