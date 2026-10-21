import React from 'react';
import AvailabilityIndicator from '@/components/ui/AvailabilityIndicator';

interface Artisan {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  wilaya: string;
  verified: boolean;
  availability?: string;
}

export function GuestArtisanPreview({ artisan }: { artisan: Artisan }) {
  return (
    <div className="bg-white dark:bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm">
            <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
          </div>
          <AvailabilityIndicator 
            status={artisan.availability || 'available'} 
            size="sm" 
            className="absolute -bottom-0.5 -right-0.5" 
          />
        </div>
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-1.5">
            <span className="font-label-lg text-[16px] text-on-surface truncate block font-bold leading-tight">
              {artisan.name}
            </span>
            {artisan.verified && (
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 animate-pulse" title="Verified Artisan">
                verified
              </span>
            )}
          </div>
          <span className="text-[13px] text-on-surface-variant truncate block mt-0.5">{artisan.specialization}</span>
          <span className="text-[12px] text-on-surface-variant/70 truncate block mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {artisan.wilaya}
          </span>
        </div>
      </div>
    </div>
  );
}
