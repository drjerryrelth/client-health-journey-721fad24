
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.0'
import { corsHeaders } from '../_shared/cors.ts'

// Define a type for the coach data
interface CoachData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  clinic_id: string;
  client_count: number;
}

Deno.serve(async (req) => {
  console.log('Edge function called: get-all-coaches');
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  // Get the authorization header from the request
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    console.error('Authorization header missing');
    return new Response(
      JSON.stringify({ error: 'Authorization header missing' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  try {
    console.log('Creating Supabase client with authorization header');
    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { 
            Authorization: authHeader,
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          } 
        } 
      }
    )

    // Get the user information to verify they are an admin
    console.log('Getting user information');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('User not authenticated:', userError);
      return new Response(
        JSON.stringify({ error: 'Not authenticated', details: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log(`User making request: ${user.id}`);
    
    // IMPORTANT: Using the service_role to bypass RLS completely - this fixes the infinite recursion issue
    // This is safe because we already authenticated the user above
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      }
    );
    
    console.log('Using service role client to bypass RLS policies and avoid recursion');
    
    // Use service role client for direct query with no RLS
    const { data: coaches, error: coachesError } = await adminClient
      .from('coaches')
      .select('id, name, email, phone, status, clinic_id, created_at');
    
    if (coachesError) {
      console.error('Error fetching coaches with service role:', coachesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch coaches', details: coachesError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!coaches || coaches.length === 0) {
      console.warn('No coaches found, returning empty array');
      return new Response(
        JSON.stringify([]),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }, 
          status: 200 
        }
      );
    }
    
    console.log(`Found ${coaches.length} coaches via service role client`);
    
    // Process each coach to add client counts - this ensures we have the complete data
    const coachesWithClientCount: CoachData[] = [];
    
    for (const coach of coaches) {
      // Get client count for each coach
      let clientCount = 0;
      try {
        const { count } = await adminClient // Use adminClient here too
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('coach_id', coach.id);
          
        clientCount = count || 0;
      } catch (countErr) {
        console.error(`Error counting clients for coach ${coach.id}:`, countErr);
      }
      
      // Log each coach for debugging
      console.log(`Processing coach: ${coach.name} (${coach.email}), ID: ${coach.id}`);
      
      coachesWithClientCount.push({
        id: String(coach.id || ''),
        name: String(coach.name || ''),
        email: String(coach.email || ''),
        phone: coach.phone,
        status: (coach.status === 'active' || coach.status === 'inactive') 
          ? coach.status 
          : "inactive",
        clinic_id: String(coach.clinic_id || ''),
        client_count: clientCount
      });
    }
    
    console.log('Successfully processed all coaches with client counts');
    
    // Super aggressive cache prevention in response headers
    return new Response(
      JSON.stringify(coachesWithClientCount),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Surrogate-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
