"use client";

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="max-w-lg w-full bg-white dark:bg-surface-container-low p-10 rounded-[32px] shadow-xl border border-outline-variant/20 text-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[48px]">cancel</span>
        </div>
        
        <h1 className="font-display-sm text-3xl text-on-surface mb-2">Payment cancelled</h1>
        <p className="text-on-surface-variant mb-8">
          The payment process was cancelled or interrupted. You have not been charged, and your subscription has not been upgraded.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/subscriptions"
            className="flex-1 py-4 bg-primary text-on-primary hover:bg-primary-dark font-label-lg rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
          >
            Back to Plans
          </Link>
          <Link 
            href="/user"
            className="flex-1 py-4 bg-transparent border border-outline text-on-surface hover:bg-surface-container font-label-lg rounded-full transition-all active:scale-95 text-center"
          >
            Return to Dashboard
          </Link>
        </div>
        
      </div>
    </div>
  );
}
