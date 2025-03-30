
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
    return new Response(
      JSON.stringify({ error: 'Authorization header missing' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  try {
    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the user information to verify they are an admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.log('User making request: Not authenticated')
      return new Response(
        JSON.stringify({ error: 'Not authenticated', details: userError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log(`User making request: ${user.id}`)
    
    // Check if user is an admin
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profileData || profileData.role !== 'admin') {
      console.log('Admin verification failed', { profileError, profileData })
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log('Admin verified, fetching all coaches')

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
      console.error('Error fetching coaches:', coachesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch coaches', details: coachesError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // For each coach, count their clients
    const coachesWithClientCount = await Promise.all(coaches.map(async (coach) => {
      const { count, error: countError } = await supabaseClient
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .eq('coach_id', coach.id)
      
      if (countError) {
        console.error(`Error counting clients for coach ${coach.id}:`, countError)
      }

      return {
        ...coach,
        client_count: count || 0
      }
    }))

    console.log(`Found ${coachesWithClientCount.length} coaches across all clinics`)

    return new Response(
      JSON.stringify(coachesWithClientCount),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
