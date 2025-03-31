
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
    const requestData = await req.json();
    const { action } = requestData;

    // Handle different actions
    switch (action) {
      case 'delete':
        return await handleDeleteUser(requestData);
      case 'list':
        return await handleListUsers();
      case 'update':
        return await handleUpdateUser(requestData);
      case 'create':
      default:
        // Default action is to create a user
        return await handleCreateUser(requestData);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function handleListUsers() {
  console.log("Listing all admin users");
  
  // Fetch all admin users
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('full_name');
  
  if (error) {
    console.error("Error fetching admin users:", error);
    return new Response(
      JSON.stringify({ error: `Failed to fetch admin users: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  
  console.log(`Found ${data?.length || 0} admin users`);
  
  return new Response(
    JSON.stringify(data || []),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleCreateUser(requestData) {
  const { email, password, fullName, role } = requestData;
    
  console.log("Creating admin user with data:", { email, fullName, role });
  
  try {
    // First, check if user already exists by email
    const { data: existingUsers, error: lookupError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email);
      
    if (lookupError) {
      console.error("Error checking for existing user:", lookupError);
      return new Response(
        JSON.stringify({ error: `Failed to check for existing user: ${lookupError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // If user already exists, return an informative error
    if (existingUsers && existingUsers.length > 0) {
      console.log("User already exists with this email:", email);
      return new Response(
        JSON.stringify({ 
          error: `A user with email ${email} already exists. To update their role, use the update action instead.`,
          code: "user_exists",
          existingUser: existingUsers[0]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
      );
    }
    
    // Create the auth user
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
    console.error("Error in handleCreateUser:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

async function handleUpdateUser(requestData) {
  const { userId, updates } = requestData;
  
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'User ID is required for updates' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  
  console.log("Updating user with ID:", userId, "Updates:", updates);
  
  try {
    // Get the admin user to update
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Error fetching admin user:", fetchError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch admin user: ${fetchError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!adminUser) {
      return new Response(
        JSON.stringify({ error: `Admin user with ID ${userId} not found` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Update the admin user entry
    const updateFields = {
      full_name: updates.fullName || updates.full_name || adminUser.full_name,
      role: updates.role || adminUser.role,
      is_active: updates.is_active !== undefined ? updates.is_active : adminUser.is_active,
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('admin_users')
      .update(updateFields)
      .eq('id', userId)
      .select()
      .maybeSingle();
      
    if (updateError) {
      console.error("Error updating admin user:", updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update admin user: ${updateError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Also update the profile entry if it exists
    if (adminUser.auth_user_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: updateFields.full_name,
          role: updateFields.role
        })
        .eq('id', adminUser.auth_user_id);
        
      if (profileError) {
        console.warn("Error updating user profile:", profileError);
      }
    }
    
    return new Response(
      JSON.stringify(updatedUser),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Error in handleUpdateUser:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

async function handleDeleteUser(requestData) {
  const { userId } = requestData;
  
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'User ID is required for deletion' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  
  console.log("Deleting user with ID:", userId);
  
  // Delete the user
  const { error } = await supabase.auth.admin.deleteUser(userId);
  
  if (error) {
    console.error("Error deleting user:", error);
    return new Response(
      JSON.stringify({ error: `Failed to delete user: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  
  return new Response(
    JSON.stringify({ success: true, message: 'User successfully deleted' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}
