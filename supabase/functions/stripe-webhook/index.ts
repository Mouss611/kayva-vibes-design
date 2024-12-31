import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        const customerId = invoice.customer;

        if (!subscriptionId || !customerId) {
          throw new Error('Missing required fields in invoice');
        }

        const { data: subscription } = await supabaseClient
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (subscription) {
          // Vérifier si c'est le 3ème paiement
          const newPaymentCount = subscription.payment_count + 1;
          
          if (newPaymentCount >= 3) {
            console.log(`Cancelling subscription ${subscriptionId} after 3 payments`);
            
            // Annuler l'abonnement Stripe
            await stripe.subscriptions.update(subscriptionId, {
              cancel_at_period_end: true,
            });

            // Mettre à jour le statut dans la base de données
            await supabaseClient
              .from('subscriptions')
              .update({
                payment_count: newPaymentCount,
                last_payment_date: new Date().toISOString(),
                status: 'completed',
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours à partir de maintenant
              })
              .eq('stripe_subscription_id', subscriptionId);
          } else {
            // Mettre à jour le compteur de paiements
            await supabaseClient
              .from('subscriptions')
              .update({
                payment_count: newPaymentCount,
                last_payment_date: new Date().toISOString(),
                next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active'
              })
              .eq('stripe_subscription_id', subscriptionId);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        await supabaseClient
          .from('subscriptions')
          .update({
            status: 'cancelled',
            end_date: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscriptionId);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});