
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { clientId } = await req.json();
    
    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get client information
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("*, programs:program_id(*)")
      .eq("id", clientId)
      .single();
      
    if (clientError || !clientData) {
      throw new Error("Client not found or error fetching client data");
    }
    
    // Calculate which day of the program the client is on
    const startDate = new Date(clientData.start_date);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentDay = daysDiff + 1; // Day 1 is the first day
    
    const programType = clientData.programs?.type || "practice_naturals";
    const programDuration = clientData.programs?.duration || 30;
    
    // Check if client is still within program duration
    if (currentDay > programDuration) {
      return new Response(
        JSON.stringify({ message: "Program completed, no more drips to send" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the drip template for today
    const { data: templateData, error: templateError } = await supabase
      .from("drip_content_templates")
      .select("*")
      .eq("program_type", programType)
      .eq("day_number", currentDay)
      .single();
      
    if (templateError || !templateData) {
      // If no template exists for this program type and day, try to generate one with OpenAI
      const { data: generatedTemplate } = await generateTemplate(openai, programType, currentDay, programDuration);
      
      // Store the newly generated template
      const { data: insertedTemplate, error: insertError } = await supabase
        .from("drip_content_templates")
        .insert({
          program_type: programType,
          day_number: currentDay,
          subject: generatedTemplate.subject,
          content: generatedTemplate.content
        })
        .select()
        .single();
        
      if (insertError) {
        throw new Error("Failed to insert generated template");
      }
      
      // Use the newly created template
      const template = insertedTemplate;
      
      // Record that this message was sent to the client
      await supabase.from("client_drip_messages").insert({
        client_id: clientId,
        drip_template_id: template.id,
        day_number: currentDay
      });
      
      return new Response(
        JSON.stringify({ message: "Generated and sent new drip content", template }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if this message has already been sent to the client
    const { data: existingMessage } = await supabase
      .from("client_drip_messages")
      .select("*")
      .eq("client_id", clientId)
      .eq("drip_template_id", templateData.id)
      .single();
      
    if (existingMessage) {
      return new Response(
        JSON.stringify({ message: "Message already sent to client", template: templateData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Personalize the message using OpenAI
    const personalizedContent = await personalizeContent(
      openai,
      templateData.content,
      clientData.name
    );
    
    // Record that this message was sent to the client
    await supabase.from("client_drip_messages").insert({
      client_id: clientId,
      drip_template_id: templateData.id,
      day_number: currentDay
    });
    
    return new Response(
      JSON.stringify({
        message: "Drip content sent successfully",
        template: {
          ...templateData,
          content: personalizedContent
        }
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

// Function to personalize content using OpenAI
async function personalizeContent(
  openaiClient: OpenAI, 
  content: string,
  clientName: string
): Promise<string> {
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert nutritionist and wellness coach. Your task is to personalize motivational messages for clients following a weight loss program."
      },
      {
        role: "user",
        content: `Please personalize this message for a client named ${clientName}. 
        The message should be friendly, encouraging and directly address the client by name at least once.
        Here's the template message: "${content}"`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  return response.choices[0].message.content || content;
}

// Function to generate a new template if one doesn't exist for a specific day
async function generateTemplate(
  openaiClient: OpenAI,
  programType: string,
  dayNumber: number,
  totalDays: number
): Promise<{ data: { subject: string; content: string } }> {
  const progression = dayNumber / totalDays; // Value between 0-1 representing progress through program
  
  let phase = "beginning";
  if (progression < 0.33) {
    phase = "beginning";
  } else if (progression < 0.66) {
    phase = "middle";
  } else {
    phase = "end";
  }
  
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert nutritionist and wellness coach creating daily motivational messages for weight loss program clients. 
        You're writing for day ${dayNumber} of a ${totalDays}-day program called ${programType.replace('_', ' ')}.
        This is in the ${phase} phase of the program.`
      },
      {
        role: "user",
        content: `Create a motivational message for day ${dayNumber} of our weight loss program.
        The message should include:
        1. A catchy subject line with an emoji (less than 60 characters)
        2. A motivational message body (100-150 words)
        3. Practical tips specific to this stage of the journey
        4. Acknowledgment of common challenges on this day
        5. Encouragement to keep going
        
        Format the response as a JSON object with "subject" and "content" fields.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 800
  });
  
  const generatedContent = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    data: {
      subject: generatedContent.subject || `Day ${dayNumber} of Your Journey!`,
      content: generatedContent.content || `Keep going strong on day ${dayNumber}!`
    }
  };
}
