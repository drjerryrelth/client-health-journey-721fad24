
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
      { global: { headers: { Authorization: authHeader } } }
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
    
    console.log('Using admin_get_all_coaches RPC function');
    
    try {
      // Use the security-definer RPC function to avoid RLS issues
      const { data: coaches, error: coachesError } = await supabaseClient
        .rpc('admin_get_all_coaches');

      if (coachesError) {
        console.error('Error fetching coaches with RPC:', coachesError);
        throw coachesError;
      }
      
      if (!coaches || coaches.length === 0) {
        console.log('No coaches found with RPC function');
        return new Response(
          JSON.stringify([]),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      console.log(`Found ${coaches.length} coaches via RPC function`);

      // Ensure the response data is properly typed
      const typedCoaches: CoachData[] = coaches.map((coach: any) => ({
        id: coach.id,
        name: coach.name,
        email: coach.email,
        phone: coach.phone,
        status: coach.status || 'inactive',
        clinic_id: coach.clinic_id,
        client_count: coach.client_count || 0
      }));

      return new Response(
        JSON.stringify(typedCoaches),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }, 
          status: 200 
        }
      )
    } catch (rpcError) {
      console.error('RPC approach failed:', rpcError);
      
      // Fall back to direct query if RPC fails
      console.log('Falling back to direct query');
      const { data: directData, error: directError } = await supabaseClient
        .from('coaches')
        .select('id, name, email, phone, status, clinic_id')
        .order('created_at', { ascending: false });
      
      if (directError) {
        console.error('Error with fallback query:', directError);
        throw directError;
      }
      
      if (!directData || directData.length === 0) {
        console.log('No coaches found with direct query');
        return new Response(
          JSON.stringify([]),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
      
      // Process each coach to add client counts
      const coachesWithClientCount = [];
      
      for (const coach of directData) {
        // Get client count
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
        
        coachesWithClientCount.push({
          id: coach.id,
          name: coach.name,
          email: coach.email,
          phone: coach.phone,
          status: (coach.status === 'active' || coach.status === 'inactive') 
            ? coach.status 
            : "inactive",
          clinic_id: coach.clinic_id,
          client_count: clientCount
        });
      }
      
      return new Response(
        JSON.stringify(coachesWithClientCount),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }, 
          status: 200 
        }
      );
    }
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
