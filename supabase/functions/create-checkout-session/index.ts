import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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
    const { price, months, hours } = await req.json();
    
    // ID des prix pour les deux tarifs
    const priceForSignup = 'price_1Qc6EkEkQMv53qqEIMsF3EEc';  // Frais d'inscription (30€)
    const priceForSubscription = 'price_1QbvIbEkQMv53qqEagiinf7L';  // Abonnement mensuel (79.99€)
    
    console.log(`Creating checkout session for ${hours}h with subscription price ${price}€`);
    
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

    // Créer la session de paiement avec les deux tarifs
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceForSignup,  // Tarif pour les frais d'inscription (ponctuel)
          quantity: 1,
        },
        {
          price: priceForSubscription,  // Tarif pour l'abonnement mensuel (récurrent)
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard/student?success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard/student?canceled=true`,
      metadata: {
        user_id: user.id,
        hours: hours,
        months: months,
        type: 'combined_payment'
      },
      subscription_data: {
        metadata: {
          months_limit: months,
          hours: hours,
        }
      }
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