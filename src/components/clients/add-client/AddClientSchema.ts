
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
  // Add new fields for measurements and goals
  initialWeight: z.number().optional(),
  weightDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Please enter a valid date in YYYY-MM-DD format.'
  }),
  goals: z.array(z.enum(['weight_loss', 'skin_tightening', 'build_muscle', 'improve_health'])).default([]),
});

export type AddClientFormValues = z.infer<typeof formSchema>;

export const clientGoals = [
  { id: 'weight_loss', label: 'Weight Loss' },
  { id: 'skin_tightening', label: 'Skin Tightening' },
  { id: 'build_muscle', label: 'Build Muscle' },
  { id: 'improve_health', label: 'Improve Overall Health' }
] as const;
