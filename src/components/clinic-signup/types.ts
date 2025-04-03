
import { z } from 'zod';

export const clinicSignupSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicEmail: z.string().email("Invalid email format").min(1, "Email is required"),
  clinicPhone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  primaryContact: z.string().min(1, "Primary contact is required"),
  
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  hipaaAcknowledgment: z.boolean().refine(val => val === true, {
    message: "You must acknowledge the HIPAA disclaimer",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ClinicSignupFormValues = z.infer<typeof clinicSignupSchema>;

export type CoachFormData = {
  name: string;
  email: string;
  phone: string;
};
