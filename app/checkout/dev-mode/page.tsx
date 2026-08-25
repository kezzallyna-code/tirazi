"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/utils/supabase/client';

function DevModeCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const amount = searchParams.get('amount');
  const userId = searchParams.get('userId');

  const [isProcessing, setIsProcessing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!plan || !userId) {
      router.push('/subscriptions');
    }
  }, [plan, userId, router]);

  const handleSimulatePayment = async (success: boolean) => {
    setIsProcessing(true);
    
    if (success) {
      // Simulate webhook taking action by updating DB directly
      try {
        const targetPlan = plan === 'premium-basic' || plan === 'basic' ? 'basic' : 'pro';
        
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_plan: targetPlan,
            subscription_status: 'active',
            stripe_customer_id: 'cus_devmock123',
            stripe_subscription_id: 'sub_devmock123',
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', userId);
          
        if (error) {
          console.error("Mock webhook error", error);
        }
        
        setTimeout(() => {
          router.push(`/subscriptions/success?session_id=mock_session_123&plan=${targetPlan}`);
        }, 1500);
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    } else {
      setTimeout(() => {
        router.push(`/subscriptions/cancel`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-high relative flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-surface-container p-8 rounded-[28px] shadow-2xl border-4 border-error/20 relative overflow-hidden">
        
        {/* Dev Mode Banner */}
        <div className="absolute top-0 left-0 right-0 bg-error text-on-error text-center text-xs font-bold py-1 uppercase tracking-widest">
          Development / Test Checkout
        </div>

        <div className="mt-6 text-center mb-8">
          <span className="material-symbols-outlined text-[56px] text-primary mb-2">engineering</span>
          <h1 className="font-title-lg text-2xl text-on-surface mb-2">Test Payment Gateway</h1>
          <p className="text-sm text-on-surface-variant">
            Stripe keys are not configured. This is a mock checkout environment for development testing.
          </p>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl mb-8 border border-outline-variant/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-on-surface-variant">Plan</span>
            <span className="font-bold text-sm text-on-surface uppercase">{plan}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-on-surface-variant">User ID</span>
            <span className="font-mono text-xs text-on-surface-variant truncate ml-4">{userId}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20 mt-2">
            <span className="text-sm font-bold">Amount</span>
            <span className="font-headline-sm text-primary">{amount} DA</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSimulatePayment(true)}
            disabled={isProcessing}
            className="w-full py-4 bg-success text-on-primary font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing...' : (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Simulate Successful Payment
              </>
            )}
          </button>
          
          <button
            onClick={() => handleSimulatePayment(false)}
            disabled={isProcessing}
            className="w-full py-4 bg-error text-on-primary font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">cancel</span>
            Simulate Failed / Cancelled
          </button>
        </div>
        
        <p className="text-center text-xs text-on-surface-variant/50 mt-6">
          This simulates the Stripe Checkout redirect and webhook fulfillment.
        </p>
      </div>
    </div>
  );
}

export default function DevModeCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-container-high flex items-center justify-center p-4">Loading...</div>}>
      <DevModeCheckoutContent />
    </Suspense>
  );
}
