"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PricingCard } from '@/components/subscriptions/PricingCard';
import { ComparisonTable } from '@/components/subscriptions/ComparisonTable';
import { createClient } from '@/utils/supabase/client';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessingFree, setIsProcessingFree] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadCurrentPlan() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', session.user.id)
          .single();
          
        if (data && !error) {
          setCurrentPlan(data.subscription_plan);
        } else {
          setCurrentPlan('free');
        }
      } else {
        setCurrentPlan('guest');
      }
    }
    loadCurrentPlan();
  }, [supabase]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3000);
  };

  const handleSelectPlan = async (planId: string, planName: string) => {
    if (planId === currentPlan || (planId === 'premium-basic' && currentPlan === 'basic') || (planId === 'premium-pro' && currentPlan === 'pro')) {
      return; // Do nothing if it's already the current plan
    }

    if (planId === 'free') {
      setIsProcessingFree(true);
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'free' }),
        });
        const data = await res.json();
        if (data.url) {
          router.push(data.url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessingFree(false);
      }
      return;
    }

    router.push(`/checkout?plan=${planId}`);
  };

  const getButtonText = (planId: string) => {
    const isPro = currentPlan === 'pro' || currentPlan === 'premium-pro';
    const isBasic = currentPlan === 'basic' || currentPlan === 'premium-basic';
    
    if (planId === 'free') {
      return currentPlan === 'free' ? 'Current Plan' : (isProcessingFree ? 'Activating...' : 'Activate Free Plan');
    }
    if (planId === 'premium-basic') {
      if (isBasic) return 'Current Plan';
      if (isPro) return 'Downgrade';
      return 'Continue to Payment';
    }
    if (planId === 'premium-pro') {
      if (isPro) return 'Current Plan';
      return 'Continue to Payment';
    }
    return 'Select Plan';
  };

  return (
    <div className="stitch-screen-wrapper bg-background min-h-screen w-full pt-28 pb-20 px-margin-mobile md:px-margin-desktop relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-label-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
          {toastMessage}
        </div>
      )}

      <div className="max-w-container-max mx-auto space-y-12">
        
        {/* Back Link to User Preview */}
        <div className="flex items-center justify-between">
          <Link
            href="/join"
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Entry
          </Link>
          {currentPlan && currentPlan !== 'guest' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-primary font-bold text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Current Plan: {currentPlan === 'free' ? 'Free' : (currentPlan === 'basic' || currentPlan === 'premium-basic') ? 'Premium Basic' : 'Premium Pro'}
            </div>
          )}
        </div>

        {/* Page Title & Subtitle */}
        <div className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-label-sm font-label-sm uppercase tracking-wider font-bold">
            Subscription Plans
          </span>
          <h1 className="font-display-lg text-display-lg text-primary font-serif">
            Choose the visibility that fits your ambition
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Start free. Upgrade when you are ready to be discovered, trusted, and recognized.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* Free Tier */}
          <PricingCard
            name="Free"
            price="0 DA"
            description="Join the first professional network dedicated to Algeria’s textile ecosystem. Create your profile, showcase your work, and start connecting with professionals across the country completely free."
            features={[
              'Professional Profile',
              'Multiple Professional Roles',
              'Up to 10 Portfolio Images',
              'Publish Posts in Community Feed',
              'Search Professionals',
              'Direct Messaging',
              'Basic Search Filters',
              'Standard Search Visibility',
              'Very Basic Profile Analytics',
            ]}
            buttonText={getButtonText('free')}
            isPopular={false}
            onSelect={() => handleSelectPlan('free', 'Free')}
          />

          {/* Premium Basic Tier */}
          <PricingCard
            name="Premium Basic"
            price="2,000 DA"
            description="Stop being invisible. Get enhanced visibility in search results, reach more professionals, and access the insights you need to grow your network."
            features={[
              'Everything in Free',
              'Up to 30 Portfolio Images',
              'Up to 10 Portfolio Videos',
              'Advanced Search Filters',
              'Enhanced Search Visibility',
              'Limited Profile Visitor Insights',
              'Basic Profile Analytics',
            ]}
            buttonText={getButtonText('premium-basic')}
            isPopular={false}
            onSelect={() => handleSelectPlan('premium-basic', 'Premium Basic')}
          />

          {/* Premium Pro Tier */}
          <PricingCard
            name="Premium Pro"
            price="4,500 DA"
            description="Become a reference in your field. Receive priority placement, a verified professional badge, and advanced analytics to understand and grow your impact."
            features={[
              'Everything in Premium Basic',
              'Unlimited Portfolio Images',
              'Unlimited Portfolio Videos',
              'Priority Search Visibility',
              'Full Profile Visitor Insights',
              'Advanced Profile Analytics',
              'Verified Professional Badge',
              'Priority Customer Support',
              'Early Access to New Features',
            ]}
            buttonText={getButtonText('premium-pro')}
            isPopular={true}
            onSelect={() => handleSelectPlan('premium-pro', 'Premium Pro')}
          />

        </div>

        {/* Features Comparison Matrix */}
        <div className="pt-8">
          <ComparisonTable />
        </div>

      </div>
    </div>
  );
}
