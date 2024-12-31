import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { price, months, hours, includeCombinedPayment } = await req.json();
    
    // Convertir le prix en centimes et arrondir pour éviter les problèmes de précision
    const amountInCents = Math.round(price * 100);
    const oneTimePaymentAmount = 3000; // 30€ en centimes
    
    console.log(`Creating checkout session for ${hours}h at ${amountInCents} cents (${price}€)`);
    console.log('Using Stripe key:', Deno.env.get('STRIPE_SECRET_KEY')?.substring(0, 8) + '...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Missing Stripe secret key');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    const lineItems = [];

    // Ajouter l'abonnement mensuel
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${hours}h de conduite`,
          description: `Forfait de ${hours}h de conduite sur ${months} mois`,
        },
        unit_amount: amountInCents,
        recurring: {
          interval: 'month',
          interval_count: 1,
        },
      },
      quantity: 1,
    });

    // Si le paiement combiné est demandé, ajouter le produit à paiement unique
    if (includeCombinedPayment) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais d\'inscription',
            description: 'Frais d\'inscription uniques',
          },
          unit_amount: oneTimePaymentAmount,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: lineItems,
      mode: includeCombinedPayment ? 'subscription_and_payment' : 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard/student?success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard/student?canceled=true`,
      metadata: {
        user_id: user.id,
        hours: hours,
        months: months,
        includes_registration_fee: includeCombinedPayment ? 'true' : 'false',
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});