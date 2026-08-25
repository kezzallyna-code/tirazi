import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'dummy_test_key_that_fails_gracefully' 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any }) 
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Use Service Role for admin bypassing RLS in webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    if (stripe && webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
      }
    } else {
      // In dev mode without keys, parse JSON directly if simulating
      try {
        event = JSON.parse(body);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid mock event' }, { status: 400 });
      }
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        
        if (userId && plan) {
          const targetPlan = plan === 'premium-basic' || plan === 'basic' ? 'basic' : 'pro';
          
          await supabase
            .from('profiles')
            .update({
              subscription_plan: targetPlan,
              subscription_status: 'active',
              stripe_customer_id: session.customer?.toString() || null,
              stripe_subscription_id: session.subscription?.toString() || null,
            })
            .eq('id', userId);
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single();
          
        if (profile) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: subscription.status,
              subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
            })
            .eq('id', profile.id);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_subscription_id', invoice.subscription)
            .single();
            
          if (profile) {
            await supabase
              .from('profiles')
              .update({
                subscription_status: 'past_due'
              })
              .eq('id', profile.id);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler failed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
