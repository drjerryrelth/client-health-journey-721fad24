
/**
 * Format text for email by converting newlines to HTML breaks
 */
function formatText(text: string): string {
  return text.replace(/\n/g, "<br>");
}

/**
 * Create a food prep reminder section for the email
 */
export function createFoodPrepReminder(): string {
  return `
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
}

/**
 * Build the complete HTML email from components
 */
export function buildEmailHtml(subject: string, mealPlan: string, shoppingList: string): string {
  const formattedMealPlan = formatText(mealPlan);
  const formattedShoppingList = formatText(shoppingList);
  const foodPrepReminder = createFoodPrepReminder();

  return `
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
}
