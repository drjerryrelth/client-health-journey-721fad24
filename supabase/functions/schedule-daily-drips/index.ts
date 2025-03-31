
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
    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log("Starting daily drip scheduler...");
    
    // Get all active clients with a program assigned
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, name, program_id, start_date")
      .not("program_id", "is", null);
      
    if (clientsError) {
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
    }
    
    console.log(`Found ${clients.length} clients with assigned programs`);
    
    const results = [];
    
    // Process each client
    for (const client of clients) {
      if (!client.start_date) {
        results.push({
          clientId: client.id,
          status: "skipped",
          reason: "No start date defined"
        });
        continue;
      }
      
      const startDate = new Date(client.start_date);
      const currentDate = new Date();
      
      // Calculate the day number in the program
      const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const currentDay = daysDiff + 1; // Day 1 is the first day
      
      if (currentDay < 1) {
        results.push({
          clientId: client.id,
          status: "skipped",
          reason: "Program hasn't started yet"
        });
        continue;
      }
      
      try {
        // Call the generate-daily-drips function for this client
        await supabase.functions.invoke("generate-daily-drips", {
          body: { clientId: client.id }
        });
        
        results.push({
          clientId: client.id,
          status: "processed",
          day: currentDay
        });
      } catch (error) {
        results.push({
          clientId: client.id,
          status: "error",
          error: error.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Daily drip scheduler completed", 
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in scheduler:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
