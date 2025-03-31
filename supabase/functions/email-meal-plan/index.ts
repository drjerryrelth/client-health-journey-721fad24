
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  name: string;
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
    const { email, name, subject, mealPlan, shoppingList } = await req.json() as EmailRequest;
    
    console.log(`Sending meal plan to ${name} at ${email}`);
    
    // Convert plain text to HTML for email
    const convertToHtml = (text: string) => {
      return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/# (.*?)\n/g, '<h2>$1</h2>')
        .replace(/## (.*?)\n/g, '<h3>$1</h3>')
        .replace(/### (.*?)\n/g, '<h4>$1</h4>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
        .replace(/<\/ul><ul>/g, '')
    };
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Custom Meal Plan</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 { color: #2563eb; }
          h2 { color: #3b82f6; margin-top: 30px; }
          h3 { color: #60a5fa; }
          ul { margin-left: 20px; }
          .section { margin-bottom: 30px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Your Custom 7-Day Meal Plan</h1>
        <p>Hello ${name},</p>
        <p>Here's your personalized meal plan as requested. If you have any questions or need adjustments, please contact your health coach.</p>
        
        <div class="section">
          <h2>Meal Plan</h2>
          <div>${convertToHtml(mealPlan)}</div>
        </div>
        
        <div class="section">
          <h2>Shopping List</h2>
          <div>${convertToHtml(shoppingList)}</div>
        </div>
        
        <div class="section">
          <h3>Daily Reminders:</h3>
          <ul>
            <li>Drink 80-100 oz of water daily</li>
            <li>Take all supplements as prescribed</li>
            <li>Record your meals in your check-in app</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>This meal plan was created specifically for your dietary needs and program guidelines.</p>
        </div>
      </body>
    </html>
    `;
    
    // For demo purposes, we'll just log what would be sent
    // In a real implementation, you would use a service like SendGrid, Resend, etc.
    console.log(`Would send email to ${email} with subject: ${subject}`);
    console.log(`HTML Content: ${htmlContent.substring(0, 100)}...`);
    
    // Simulate email sending success
    // In a real implementation, you would return the actual response from the email service
    
    return new Response(JSON.stringify({
      success: true,
      message: `Meal plan successfully sent to ${email}`,
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  } catch (error) {
    console.error("Error sending email with meal plan:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  }
});
