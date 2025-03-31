
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  mealPlan: string;
  shoppingList: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { to, subject, mealPlan, shoppingList } = await req.json() as EmailRequest;
    
    console.log(`Attempting to send meal plan email to ${to}`);
    
    // Format meal plan text for email
    const formattedMealPlan = mealPlan.replace(/\n/g, "<br>");
    const formattedShoppingList = shoppingList.replace(/\n/g, "<br>");
    
    // Add food prep reminder section
    const foodPrepReminder = `
      <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 5px solid #ffc107; border-radius: 4px;">
        <h3 style="color: #856404; margin-top: 0;">Important Food Prep Reminders</h3>
        <ul style="color: #856404;">
          <li><strong>Avoid cooking oils</strong> - use dry rubs and seasonings instead</li>
          <li>For salads, avoid dairy-based dressings</li>
          <li>If needed, use only 1 tablespoon of olive oil or avocado oil for salad dressing</li>
          <li>Recommended cooking methods: grilling, baking (without oil), steaming, or poaching</li>
        </ul>
      </div>
    `;

    // Create the email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            .container {
              padding: 20px;
            }
            h1 {
              color: #2c3e50;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            h2 {
              color: #3498db;
              margin-top: 30px;
            }
            .section {
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${subject}</h1>
            
            ${foodPrepReminder}
            
            <div class="section">
              <h2>Your Meal Plan</h2>
              <div>${formattedMealPlan}</div>
            </div>
            
            <div class="section">
              <h2>Shopping List</h2>
              <div>${formattedShoppingList}</div>
            </div>
            
            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #777;">
              <p>This meal plan was generated based on your preferences and dietary needs. 
              Always consult with your healthcare provider before making significant changes to your diet.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create SMTP client and send email
    // Note: This is just example code - you would need to set up actual SMTP credentials
    // For production, consider using a service like SendGrid, Mailgun, etc.
    const client = new SmtpClient();
    
    try {
      await client.connect({
        hostname: Deno.env.get("SMTP_HOST") || "smtp.example.com",
        port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
        username: Deno.env.get("SMTP_USERNAME") || "user@example.com",
        password: Deno.env.get("SMTP_PASSWORD") || "password",
      });
      
      await client.send({
        from: Deno.env.get("SMTP_FROM") || "mealplan@example.com",
        to: to,
        subject: subject,
        content: "Your meal plan is attached.",
        html: emailHtml,
      });
      
      await client.close();
      
      console.log("Email sent successfully");
      
      return new Response(
        JSON.stringify({ success: true, message: "Meal plan email sent" }),
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        }
      );
    } catch (smtpError) {
      console.error("SMTP Error:", smtpError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to send email. This is likely due to missing SMTP configuration.",
          error: smtpError.message
        }),
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        }
      );
    }
  } catch (error) {
    console.error("Error in email-meal-plan function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  }
});
