
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { buildEmailHtml } from "./email-template.ts";
import { handleCorsRequest, corsHeaders } from "./cors-handler.ts";

interface EmailRequest {
  to: string;
  subject: string;
  mealPlan: string;
  shoppingList: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }
  
  try {
    const { to, subject, mealPlan, shoppingList } = await req.json() as EmailRequest;
    
    console.log(`Attempting to send meal plan email to ${to}`);
    
    // Format and build email HTML
    const emailHtml = buildEmailHtml(subject, mealPlan, shoppingList);

    // Send email using SMTP
    const result = await sendEmailWithSmtp(to, subject, emailHtml);
    
    return new Response(
      JSON.stringify({ 
        success: result.success, 
        message: result.message 
      }),
      {
        status: result.status,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
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

async function sendEmailWithSmtp(to: string, subject: string, htmlContent: string) {
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
      html: htmlContent,
    });
    
    await client.close();
    
    console.log("Email sent successfully");
    return { success: true, message: "Meal plan email sent", status: 200 };
  } catch (smtpError) {
    console.error("SMTP Error:", smtpError);
    await client.close().catch(() => {});
    
    return { 
      success: false, 
      message: "Failed to send email. This is likely due to missing SMTP configuration.",
      error: smtpError.message,
      status: 500
    };
  }
}
