
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { email, password, fullName, role } = await req.json();
    
    console.log("Creating admin user with data:", { email, fullName, role });
    
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: password || '',
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role || 'admin'
      }
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ error: `Failed to create admin user: ${authError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!authData || !authData.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create auth user: No data returned' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log("Auth user created:", authData.user);
    
    // Then create the admin user entry
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        auth_user_id: authData.user.id,
        email,
        full_name: fullName,
        role: role || 'admin'
      })
      .select()
      .maybeSingle();
    
    if (adminError) {
      console.error("Error creating admin user record:", adminError);
      return new Response(
        JSON.stringify({ error: `Failed to create admin user record: ${adminError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Also create a profile entry for the user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: role || 'admin'
      });
    
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      console.warn("Profile creation failed, but admin user was created");
    }
    
    return new Response(
      JSON.stringify(adminUser),
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
