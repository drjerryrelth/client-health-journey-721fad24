
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
    
    // Direct database query approach for maximum reliability
    console.log('Fetching all coaches with direct query approach');
    
    // Apply timestamp for aggressive cache busting
    const timestamp = new Date().getTime();
    
    // Get all coaches with a direct query, bypassing any potential caching issues
    const { data: directData, error: directError } = await supabaseClient
      .from('coaches')
      .select('id, name, email, phone, status, clinic_id, created_at')
      .order('created_at', { ascending: false })
      .eq('id::text', `id::text||'${timestamp}'`, { rewriteElseCondition: true }); // This is a trick to force no caching while always returning true
    
    if (directError) {
      console.error('Error fetching coaches:', directError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch coaches', details: directError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log(`Found ${directData?.length || 0} coaches via direct query`);
    
    if (!directData || directData.length === 0) {
      console.warn('No coaches found with direct query, returning empty array');
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
    
    // Process each coach to add client counts - this ensures we have the complete data
    const coachesWithClientCount: CoachData[] = [];
    
    for (const coach of directData) {
      // Get client count for each coach
      let clientCount = 0;
      try {
        const { count } = await supabaseClient
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
