
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key for admin operations
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get user session to verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is missing" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Verify that the user is an admin by checking both the profiles and admin_users tables
    const { data: userData, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Not authorized" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    console.log("User making request:", userData.user.id);
    
    // Fetch the user's role from profiles table
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .maybeSingle();
    
    // Check for admin role in admin_users table as fallback
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role, email')
      .eq('auth_user_id', userData.user.id)
      .maybeSingle();
    
    // Consider user an admin if either check passes
    const isAdmin = (userProfile?.role === 'admin') || (adminUser?.role === 'admin');
    
    if (!isAdmin) {
      console.log("User is not an admin. Profile:", userProfile, "Admin:", adminUser);
      return new Response(
        JSON.stringify({ error: "Admin privileges required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    console.log("Admin verified, fetching all coaches");
    
    // Fetch all coaches with client counts across all clinics (admin view)
    const { data: coaches, error: coachesError } = await supabase
      .from('coaches')
      .select(`
        *,
        clients(id)
      `)
      .order('name');
    
    if (coachesError) {
      console.error("Error fetching coaches:", coachesError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch coaches: ${coachesError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Process the coaches to calculate client count
    const processedCoaches = coaches.map(coach => {
      // Process the count from the client relationship
      const clientCount = coach.clients ? coach.clients.length : 0;
      
      // Remove the clients array from the response
      const { clients, ...coachData } = coach;
      
      return {
        ...coachData,
        client_count: clientCount
      };
    });
    
    console.log(`Found ${processedCoaches.length} coaches across all clinics`);
    
    return new Response(
      JSON.stringify(processedCoaches),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
