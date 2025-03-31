
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MealPlanRequest {
  program: string;
  programCategory?: string; 
  days: number;
  allergies: string[];
  preferences: {
    likes: string[];
    dislikes: string[];
  };
  dietaryRestrictions: string[];
  calorieTarget?: number;
  proteinTarget?: number;
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { program, programCategory, days = 7, allergies, preferences, dietaryRestrictions, calorieTarget, proteinTarget } = await req.json() as MealPlanRequest;
    
    console.log("Generating meal plan for:", { program, programCategory, days, allergies });
    
    let systemPrompt = "You are a professional nutritionist specializing in creating personalized meal plans. ";
    
    // Add program-specific instructions
    if (program === 'practice_naturals') {
      systemPrompt += "This client is on the Practice Naturals program. ";
      
      if (programCategory === 'A') {
        systemPrompt += `
        Follow these strict portion guidelines:
        - Breakfast: 4 oz protein OR 20g protein in a vegan protein shake
        - Lunch: 4 oz protein, 2 oz fruit, 4 oz vegetables
        - Dinner: 4 oz protein, 2 oz fruit, 4 oz vegetables
        `;
      } else if (programCategory === 'B') {
        systemPrompt += `
        Follow these strict portion guidelines:
        - Breakfast: 5 oz protein OR 20g protein in a vegan protein shake
        - Lunch: 4 oz protein, 3 oz fruit, 6 oz vegetables
        - Dinner: 4 oz protein, 3 oz fruit, 4 oz vegetables
        `;
      } else if (programCategory === 'C') {
        systemPrompt += `
        Follow these strict portion guidelines:
        - Breakfast: 5 oz protein OR 20g protein in a vegan protein shake
        - Lunch: 4 oz protein, 4 oz fruit, 6 oz vegetables
        - Dinner: 4 oz protein, 4 oz fruit, 6 oz vegetables
        `;
      }
    } else if (program === 'chirothin') {
      systemPrompt += `
      This client is on the ChiroThin program. Follow these strict guidelines:
      - No breakfast or snacks allowed
      - Lunch: 4 oz protein, 4 oz fruit, 4 oz vegetables
      - Dinner: 4 oz protein, 4 oz fruit, 4 oz vegetables
      `;
    } else {
      systemPrompt += "Create a balanced meal plan with appropriate portions. ";
    }
    
    // Add water intake recommendation for all programs
    systemPrompt += "All clients should be drinking 80-100 oz of water daily. ";
    
    // Add dietary restrictions
    if (allergies && allergies.length > 0) {
      systemPrompt += `The client has the following allergies, DO NOT include these in any recipes: ${allergies.join(", ")}. `;
    }
    
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      systemPrompt += `The client has the following dietary restrictions: ${dietaryRestrictions.join(", ")}. `;
    }
    
    if (preferences) {
      if (preferences.likes && preferences.likes.length > 0) {
        systemPrompt += `The client likes: ${preferences.likes.join(", ")}. `;
      }
      if (preferences.dislikes && preferences.dislikes.length > 0) {
        systemPrompt += `The client dislikes: ${preferences.dislikes.join(", ")}. `;
      }
    }
    
    // Add program-specific dietary guidelines
    systemPrompt += "Both Practice Naturals and ChiroThin focus on high protein, low carb, low fat. They are not Keto and prefer lean proteins. No bacon! ";
    systemPrompt += "Coffee and tea are fine, but watch the creamer. No dairy or alcohol allowed for either Practice Naturals or ChiroThin. ";

    const userPrompt = `Please create a detailed ${days}-day meal plan based on my dietary restrictions, preferences, and program guidelines. For each day, include breakfast, lunch, dinner, and any allowed snacks with exact portions. Also, provide a complete shopping list organized by category (produce, protein, etc.) with exact quantities needed for the entire plan.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    console.log("Received response from OpenAI");
    
    if (!data.choices || !data.choices[0]) {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected API response format");
    }

    const mealPlanText = data.choices[0].message.content;
    
    // Parse the meal plan text to separate the meal plan and shopping list
    let mealPlanSections: {
      mealPlan: string;
      shoppingList: string;
    } = { mealPlan: "", shoppingList: "" };
    
    // Check if there's a section specifically for shopping list
    if (mealPlanText.includes("Shopping List") || mealPlanText.includes("SHOPPING LIST")) {
      const parts = mealPlanText.split(/Shopping List:|SHOPPING LIST:/i);
      mealPlanSections.mealPlan = parts[0].trim();
      mealPlanSections.shoppingList = parts.length > 1 ? parts[1].trim() : "";
    } else {
      mealPlanSections.mealPlan = mealPlanText;
    }

    return new Response(JSON.stringify({
      mealPlan: mealPlanSections.mealPlan,
      shoppingList: mealPlanSections.shoppingList,
      rawResponse: mealPlanText
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  } catch (error) {
    console.error("Error in generate-meal-plan function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  }
});
