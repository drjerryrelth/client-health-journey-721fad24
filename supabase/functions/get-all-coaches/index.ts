
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Create a Supabase client with the auth token from the request
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user session to verify admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is missing" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Not authorized" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const userId = userData.user.id;
    console.log("User making request:", userId);
    
    // First, check if the user is an admin based on user metadata
    const isAdminFromMetadata = userData.user.user_metadata?.role === 'admin';
    
    // Fall back to checking the admin_users table
    let isAdminFromTable = false;
    if (!isAdminFromMetadata) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role')
        .eq('auth_user_id', userId)
        .single();
      
      isAdminFromTable = adminUser?.role === 'admin';
    }
    
    // Final admin check
    const isAdmin = isAdminFromMetadata || isAdminFromTable;
    
    if (!isAdmin) {
      console.log("User is not an admin. Metadata role:", userData.user.user_metadata?.role);
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
