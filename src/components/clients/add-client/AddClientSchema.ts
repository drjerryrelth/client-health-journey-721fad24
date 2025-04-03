
import { z } from 'zod';

// Form schema with validation
export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  programId: z.string().optional(),
  programCategory: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
    message: 'Please enter a valid date in YYYY-MM-DD format.'
  }),
  notes: z.string().optional(),
});

export type AddClientFormValues = z.infer<typeof formSchema>;
