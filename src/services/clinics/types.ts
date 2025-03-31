
export interface Clinic {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  // Address fields
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  primaryContact: string | null;
  // Billing fields
  billingContactName: string | null;
  billingEmail: string | null;
  billingPhone: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
  paymentMethod: string | null;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  // Branding
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
}
