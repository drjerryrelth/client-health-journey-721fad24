
// Helper functions to map between API data and application types
export const mapDbClinicToClinic = (dbClinic: any) => ({
  id: dbClinic.id,
  name: dbClinic.name,
  email: dbClinic.email,
  phone: dbClinic.phone,
  status: (dbClinic.status || 'active') as 'active' | 'inactive',
  createdAt: dbClinic.created_at,
  streetAddress: dbClinic.street_address,
  city: dbClinic.city,
  state: dbClinic.state,
  zip: dbClinic.zip,
  primaryContact: dbClinic.primary_contact,
  // Billing fields
  billingContactName: dbClinic.billing_contact_name,
  billingEmail: dbClinic.billing_email,
  billingPhone: dbClinic.billing_phone,
  billingAddress: dbClinic.billing_address,
  billingCity: dbClinic.billing_city,
  billingState: dbClinic.billing_state,
  billingZip: dbClinic.billing_zip,
  paymentMethod: dbClinic.payment_method,
  subscriptionTier: dbClinic.subscription_tier,
  subscriptionStatus: dbClinic.subscription_status
});

export const mapClinicToDbClinic = (clinic: any) => ({
  name: clinic.name,
  email: clinic.email || null,
  phone: clinic.phone || null,
  status: clinic.status || 'active',
  street_address: clinic.streetAddress || null,
  city: clinic.city || null,
  state: clinic.state || null,
  zip: clinic.zip || null,
  primary_contact: clinic.primaryContact || null,
  billing_contact_name: clinic.billingContactName || null,
  billing_email: clinic.billingEmail || null,
  billing_phone: clinic.billingPhone || null,
  billing_address: clinic.billingAddress || null,
  billing_city: clinic.billingCity || null,
  billing_state: clinic.billingState || null,
  billing_zip: clinic.billingZip || null,
  payment_method: clinic.paymentMethod || null,
  subscription_tier: clinic.subscriptionTier || null,
  subscription_status: clinic.subscriptionStatus || 'active'
});
