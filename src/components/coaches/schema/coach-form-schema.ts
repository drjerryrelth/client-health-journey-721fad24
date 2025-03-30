
import { z } from 'zod';

export const coachFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z.string().optional()
});

export type CoachFormValues = z.infer<typeof coachFormSchema>;
