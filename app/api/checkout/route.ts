import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookieStore).get(name)?.value;
          },
          async set(name: string, value: string, options: any) {
            try {
              (await cookieStore).set({ name, value, ...options });
            } catch (error) {}
          },
          async remove(name: string, options: any) {
            try {
              (await cookieStore).set({ name, value: '', ...options });
            } catch (error) {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (plan === 'free') {
      // Free plan just updates DB directly
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: 'free', subscription_status: 'active' })
        .eq('id', user.id);
        
      if (error) throw error;
      
      return NextResponse.json({ url: '/dashboard' });
    }

    // Determine pricing based on plan
    let priceId = '';
    let unitAmount = 0;
    
    if (plan === 'premium-basic' || plan === 'basic') {
      priceId = process.env.STRIPE_PRICE_BASIC || 'price_basic_mock';
      unitAmount = 2000;
    } else if (plan === 'premium-pro' || plan === 'pro') {
      priceId = process.env.STRIPE_PRICE_PRO || 'price_pro_mock';
      unitAmount = 4500;
    } else {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'dummy_test_key_that_fails_gracefully') {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-01-27.acacia' as any,
      });

      // Create actual Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscriptions/cancel`,
        client_reference_id: user.id,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          plan: plan,
        }
      });

      return NextResponse.json({ url: session.url });
    } else {
      // DEVELOPMENT MODE: Return a URL to our mock dev checkout page
      const devUrl = new URL(`${origin}/checkout/dev-mode`);
      devUrl.searchParams.set('plan', plan);
      devUrl.searchParams.set('amount', unitAmount.toString());
      devUrl.searchParams.set('userId', user.id);
      
      return NextResponse.json({ url: devUrl.pathname + devUrl.search });
    }

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
