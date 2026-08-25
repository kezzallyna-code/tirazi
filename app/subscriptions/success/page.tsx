"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/utils/supabase/client';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function verifySubscription() {
      if (!sessionId) {
        router.push('/subscriptions');
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      // Fetch the updated profile to confirm subscription status
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, subscription_end_date')
        .eq('id', session.user.id)
        .single();
        
      if (error || !data) {
        // Fallback or retry logic could go here
      } else {
        setSubscription(data);
      }
      
      setIsLoading(false);
    }
    
    verifySubscription();
  }, [sessionId, router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-success border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPro = subscription?.subscription_plan === 'pro' || subscription?.subscription_plan === 'premium-pro';
  const planName = isPro ? 'Premium Pro' : 'Premium Basic';
  const price = isPro ? '4,500 DA' : '2,000 DA';

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="max-w-lg w-full bg-white dark:bg-surface-container-low p-10 rounded-[32px] shadow-xl border border-outline-variant/20 text-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[48px]">check_circle</span>
        </div>
        
        <h1 className="font-display-sm text-3xl text-on-surface mb-2">Payment successful</h1>
        <p className="text-on-surface-variant mb-8">
          Your TIRAZY subscription is now active. Welcome to {planName}.
        </p>
        
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <span className="text-sm text-on-surface-variant">Plan</span>
            <span className="font-bold text-primary">{planName}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <span className="text-sm text-on-surface-variant">Amount Paid</span>
            <span className="font-bold text-on-surface">{price}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <span className="text-sm text-on-surface-variant">Status</span>
            <span className="text-xs font-bold px-2 py-1 bg-success/10 text-success rounded-full uppercase tracking-wider">
              {subscription?.subscription_status || 'Active'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">Renewal Date</span>
            <span className="text-sm font-medium text-on-surface">
              {subscription?.subscription_end_date 
                ? new Date(subscription.subscription_end_date).toLocaleDateString() 
                : 'Monthly'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/user"
            className="flex-1 py-4 bg-primary text-on-primary hover:bg-primary-dark font-label-lg rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
          >
            View Dashboard
          </Link>
          <Link 
            href="/settings"
            className="flex-1 py-4 bg-transparent border border-outline text-on-surface hover:bg-surface-container font-label-lg rounded-full transition-all active:scale-95 text-center"
          >
            View Profile
          </Link>
        </div>
        
      </div>
    </div>
  );
}
