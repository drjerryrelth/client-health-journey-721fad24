
import { Clinic } from './types';

// Map database fields to frontend fields
export const mapDbToClinic = (dbClinic: any): Clinic => {
  return {
    id: dbClinic.id,
    name: dbClinic.name,
    email: dbClinic.email,
    phone: dbClinic.phone,
    status: dbClinic.status || 'inactive',
    createdAt: dbClinic.created_at,
    streetAddress: dbClinic.street_address,
    city: dbClinic.city,
    state: dbClinic.state,
    zip: dbClinic.zip,
    primaryContact: dbClinic.primary_contact,
    billingContactName: dbClinic.billing_contact_name,
    billingEmail: dbClinic.billing_email,
    billingPhone: dbClinic.billing_phone,
    billingAddress: dbClinic.billing_address,
    billingCity: dbClinic.billing_city,
    billingState: dbClinic.billing_state,
    billingZip: dbClinic.billing_zip,
    paymentMethod: dbClinic.payment_method,
    subscriptionTier: dbClinic.subscription_tier,
    subscriptionStatus: dbClinic.subscription_status,
    logo: dbClinic.logo,
    primaryColor: dbClinic.primary_color,
    secondaryColor: dbClinic.secondary_color,
  };
};

// Map frontend fields to database fields
export const mapClinicToDb = (clinic: Partial<Clinic>) => {
  return {
    name: clinic.name,
    email: clinic.email,
    phone: clinic.phone,
    status: clinic.status,
    street_address: clinic.streetAddress,
    city: clinic.city,
    state: clinic.state,
    zip: clinic.zip,
    primary_contact: clinic.primaryContact,
    billing_contact_name: clinic.billingContactName,
    billing_email: clinic.billingEmail,
    billing_phone: clinic.billingPhone,
    billing_address: clinic.billingAddress,
    billing_city: clinic.billingCity,
    billing_state: clinic.billingState,
    billing_zip: clinic.billingZip,
    payment_method: clinic.paymentMethod,
    subscription_tier: clinic.subscriptionTier,
    subscription_status: clinic.subscriptionStatus,
    logo: clinic.logo,
    primary_color: clinic.primaryColor,
    secondary_color: clinic.secondaryColor,
  };
};
