
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
    
    const { clientId } = await req.json();
    
    if (!clientId) {
      throw new Error("Client ID is required");
    }
    
    console.log(`Generating daily drip for client: ${clientId}`);
    
    // Get client info and program
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("id, start_date, program_id, programs:program_id(type)")
      .eq("id", clientId)
      .single();
      
    if (clientError) {
      throw new Error(`Failed to fetch client: ${clientError.message}`);
    }
    
    if (!clientData || !clientData.start_date || !clientData.program_id) {
      throw new Error("Client has no program or start date");
    }
    
    // Calculate current day of program
    const startDate = new Date(clientData.start_date);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentDay = daysDiff + 1; // Day 1 is the first day
    
    if (currentDay < 1) {
      return new Response(
        JSON.stringify({ 
          message: "Program hasn't started yet" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if we already have sent a message for today
    const { data: existingMessage } = await supabase
      .from("client_drip_messages")
      .select("id")
      .eq("client_id", clientId)
      .eq("day_number", currentDay)
      .maybeSingle();
      
    if (existingMessage) {
      // Get the message content
      const { data: messageData, error: messageError } = await supabase
        .rpc("get_client_daily_drip", { client_id_param: clientId });
        
      if (messageError) {
        throw messageError;
      }
      
      return new Response(
        JSON.stringify({ 
          id: messageData.id,
          message: {
            subject: messageData.subject,
            content: messageData.content
          },
          day_number: currentDay,
          is_read: messageData.is_read
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get program type
    const programType = clientData.programs?.type || "practice_naturals";
    
    // Find the template for this day and program
    const { data: template, error: templateError } = await supabase
      .from("drip_content_templates")
      .select("*")
      .eq("program_type", programType)
      .eq("day_number", currentDay)
      .maybeSingle();
      
    if (templateError) {
      throw new Error(`Failed to fetch template: ${templateError.message}`);
    }
    
    // If no template exists for this day, use day 1 (or some fallback)
    const finalTemplate = template || await (async () => {
      const { data: fallbackTemplate } = await supabase
        .from("drip_content_templates")
        .select("*")
        .eq("program_type", programType)
        .eq("day_number", 1)
        .single();
        
      return fallbackTemplate;
    })();
    
    if (!finalTemplate) {
      throw new Error("No template found");
    }
    
    // Create message for the client
    const { data: newMessage, error: insertError } = await supabase
      .from("client_drip_messages")
      .insert({
        client_id: clientId,
        drip_template_id: finalTemplate.id,
        day_number: currentDay,
        is_read: false
      })
      .select("id")
      .single();
      
    if (insertError) {
      throw new Error(`Failed to create message: ${insertError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        id: newMessage.id,
        message: {
          subject: finalTemplate.subject,
          content: finalTemplate.content
        },
        day_number: currentDay,
        is_read: false
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error generating daily drip:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
