
import { z } from 'zod';

export const coachFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
});

export type CoachFormValues = z.infer<typeof coachFormSchema>;
