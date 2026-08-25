"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Logo from '@/components/Logo';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get('plan');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  let planName = '';
  let price = '';
  let features: string[] = [];

  if (rawPlan === 'premium-basic' || rawPlan === 'basic') {
    planName = 'Premium Basic';
    price = '2,000 DA';
    features = [
      'Professional profile & multiple roles',
      'Up to 30 portfolio images',
      'Up to 10 portfolio videos',
      'Advanced search filters',
      'Enhanced profile visibility',
      'Limited profile visitors',
      'Basic analytics'
    ];
  } else if (rawPlan === 'premium-pro' || rawPlan === 'pro') {
    planName = 'Premium Pro';
    price = '4,500 DA';
    features = [
      'Professional profile & multiple roles',
      'Unlimited portfolio images & videos',
      'Priority search placement',
      'Verified professional badge',
      'Advanced analytics',
      'Full profile visitor access',
      'Priority customer support'
    ];
  }

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?redirect=/checkout?plan=${rawPlan}`);
        return;
      }
      
      if (!rawPlan || (rawPlan !== 'premium-basic' && rawPlan !== 'premium-pro' && rawPlan !== 'basic' && rawPlan !== 'pro')) {
        router.push('/subscriptions');
        return;
      }
      
      setIsLoading(false);
    }
    
    checkAuth();
  }, [rawPlan, router, supabase]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: rawPlan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Logo className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-24 flex flex-col justify-center animate-in fade-in duration-500">
        <h1 className="font-display-lg text-4xl text-primary font-serif text-center mb-10">Complete your order</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Order Summary */}
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[28px] border border-outline-variant/20 shadow-sm">
            <h2 className="font-title-lg text-xl text-primary mb-6 border-b border-outline-variant/20 pb-4">Order Summary</h2>
            
            <div className="mb-6">
              <p className="text-sm text-on-surface-variant mb-1">Subscription Plan</p>
              <h3 className="font-headline-sm text-2xl text-on-surface">{planName}</h3>
              <p className="font-title-md text-lg text-primary mt-1">{price} / month</p>
            </div>
            
            <div className="space-y-3 mb-8">
              <p className="text-sm font-bold text-on-surface">Includes:</p>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-outline-variant/20 pt-6 flex justify-between items-end">
              <p className="font-bold text-on-surface text-lg">Total due today</p>
              <p className="font-headline-sm text-2xl text-primary font-bold">{price}</p>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="bg-white dark:bg-surface-container-low p-8 rounded-[28px] border border-outline-variant/20 shadow-sm flex flex-col h-full">
            <h2 className="font-title-lg text-xl text-primary mb-6 border-b border-outline-variant/20 pb-4">Payment Method</h2>
            
            <div className="flex-1 flex flex-col justify-center text-center p-6 border-2 border-dashed border-outline-variant/30 rounded-2xl mb-8 bg-surface/50">
              <span className="material-symbols-outlined text-[48px] text-primary/40 mb-4">credit_card</span>
              <p className="text-on-surface-variant text-sm mb-2">You will be securely redirected to our payment provider to complete your purchase.</p>
              <p className="text-[11px] text-on-surface-variant/60 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Secured by Stripe
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-error/10 text-error rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}
            
            <div className="mt-auto space-y-4">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-primary text-on-primary hover:bg-primary-dark font-label-lg rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  <>Continue / Pay {price}</>
                )}
              </button>
              
              <Link 
                href="/subscriptions"
                className="block w-full py-4 text-center text-on-surface hover:bg-surface-container rounded-full font-label-md transition-colors"
              >
                Back to Plans
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-container-low flex justify-center items-center">Loading checkout...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
