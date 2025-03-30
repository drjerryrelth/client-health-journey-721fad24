
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.0'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
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
    
    // Check if user is an admin
    console.log('Checking if user is an admin');
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile', details: profileError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!profileData || profileData.role !== 'admin') {
      console.error('Admin verification failed:', { profileData });
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log('Admin verified, fetching all coaches');

    // Get all coaches with client count
    const { data: coaches, error: coachesError } = await supabaseClient
      .from('coaches')
      .select(`
        id, 
        name, 
        email, 
        phone, 
        status, 
        clinic_id,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (coachesError) {
      console.error('Error fetching coaches:', coachesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch coaches', details: coachesError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!coaches || coaches.length === 0) {
      console.log('No coaches found in the database');
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // For each coach, count their clients
    console.log(`Found ${coaches.length} coaches, calculating client counts...`);
    const coachesWithClientCount = await Promise.all(coaches.map(async (coach) => {
      console.log(`Calculating client count for coach ${coach.id}`);
      const { count, error: countError } = await supabaseClient
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .eq('coach_id', coach.id)
      
      if (countError) {
        console.error(`Error counting clients for coach ${coach.id}:`, countError);
        return {
          ...coach,
          client_count: 0
        }
      }

      console.log(`Coach ${coach.id} has ${count || 0} clients`);
      return {
        ...coach,
        client_count: count || 0
      }
    }))

    console.log(`Successfully compiled data for ${coachesWithClientCount.length} coaches`);

    return new Response(
      JSON.stringify(coachesWithClientCount),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
