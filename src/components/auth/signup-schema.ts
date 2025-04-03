
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  fullName: z.string().min(1, 'Full name is required'),
  hipaaAcknowledgment: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the HIPAA disclaimer' }),
  }),
  legalAcknowledgment: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms and Privacy Policy' }),
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;
