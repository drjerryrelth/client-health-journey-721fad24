
export { default as AddClientDialog } from './AddClientDialog';
export { default as AddClientForm } from './AddClientForm';
export { default as ClientSuccessDisplay } from './ClientSuccessDisplay';

// Also export the interfaces if needed by other components
export interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId?: string;
}

export interface AddClientFormProps {
  onSuccess: (email: string, tempPassword: string) => void;
  onCancel: () => void;
  clinicId?: string;
}
