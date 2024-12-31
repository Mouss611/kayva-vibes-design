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
    const registrationFeeAmount = 3000; // 30€ en centimes
    
    console.log(`Creating checkout session for ${hours}h at ${amountInCents} cents (${price}€)`);
    
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

    // Créer deux sessions distinctes si le paiement combiné est demandé
    if (includeCombinedPayment) {
      // 1. Session pour les frais d'inscription (paiement unique)
      const registrationSession = await stripe.checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: user.id,
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Frais d\'inscription',
              description: 'Frais d\'inscription uniques',
            },
            unit_amount: registrationFeeAmount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/dashboard/student?registration=success`,
        cancel_url: `${req.headers.get('origin')}/dashboard/student?canceled=true`,
        metadata: {
          user_id: user.id,
          type: 'registration_fee'
        },
      });

      // 2. Session pour l'abonnement mensuel
      const subscriptionSession = await stripe.checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: user.id,
        line_items: [{
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
        }],
        mode: 'subscription',
        success_url: `${req.headers.get('origin')}/dashboard/student?subscription=success`,
        cancel_url: `${req.headers.get('origin')}/dashboard/student?canceled=true`,
        metadata: {
          user_id: user.id,
          hours: hours,
          months: months,
          type: 'subscription'
        },
      });

      // Retourner les deux URLs
      return new Response(
        JSON.stringify({ 
          registrationUrl: registrationSession.url,
          subscriptionUrl: subscriptionSession.url 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      // Si pas de paiement combiné, créer uniquement la session d'abonnement
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: user.id,
        line_items: [{
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
        }],
        mode: 'subscription',
        success_url: `${req.headers.get('origin')}/dashboard/student?success=true`,
        cancel_url: `${req.headers.get('origin')}/dashboard/student?canceled=true`,
        metadata: {
          user_id: user.id,
          hours: hours,
          months: months,
          type: 'subscription'
        },
      });

      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
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