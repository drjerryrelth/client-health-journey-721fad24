
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Setup Supabase client with admin rights
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase URL or service role key");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Set up the pg_net and pg_cron extensions if they aren't already enabled
    const { error: extensionError } = await supabase.rpc('setup_cron_extensions');
    if (extensionError) {
      // If the function doesn't exist yet, create it
      const { error: sqlError } = await supabase.sql(`
        -- First, let's create a function to set up extensions
        CREATE OR REPLACE FUNCTION setup_cron_extensions()
        RETURNS void AS $$
        BEGIN
          CREATE EXTENSION IF NOT EXISTS pg_net;
          CREATE EXTENSION IF NOT EXISTS pg_cron;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Call the function to set up extensions
        SELECT setup_cron_extensions();
      `);
      
      if (sqlError) {
        throw new Error(`Failed to create setup_cron_extensions: ${sqlError.message}`);
      }
    }
    
    // Create the cron job to run the schedule-daily-drips function daily
    const { error: cronError } = await supabase.sql(`
      -- Create job to run daily at 8am UTC
      SELECT cron.schedule(
        'schedule_daily_drips', -- job name
        '0 8 * * *',           -- cron schedule (8am daily)
        $$
        SELECT
          net.http_post(
              url:='${supabaseUrl}/functions/v1/schedule-daily-drips',
              headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseKey}"}'::jsonb,
              body:='{}'::jsonb
          ) as request_id;
        $$
      );
    `);
    
    if (cronError) {
      throw new Error(`Failed to create cron job: ${cronError.message}`);
    }
    
    return new Response(
      JSON.stringify({ message: "Cron job for daily drips set up successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error setting up cron job:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
