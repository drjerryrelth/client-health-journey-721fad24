
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { coachFormSchema, CoachFormValues } from './schema/coach-form-schema';

interface CoachFormProps {
  onSubmit: (values: CoachFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const CoachForm = ({ onSubmit, isSubmitting, onCancel }: CoachFormProps) => {
  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel htmlFor="name" className="text-right">
                  Name <span className="text-red-500">*</span>
                </FormLabel>
                <div className="col-span-3">
                  <FormControl>
                    <Input 
                      id="name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel htmlFor="email" className="text-right">
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <div className="col-span-3">
                  <FormControl>
                    <Input 
                      id="email" 
                      type="email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormLabel htmlFor="phone" className="text-right">
                  Phone
                </FormLabel>
                <div className="col-span-3">
                  <FormControl>
                    <Input 
                      id="phone" 
                      type="tel" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Coach'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CoachForm;
