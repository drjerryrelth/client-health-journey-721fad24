
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

export interface ClinicTheme {
  primaryColor: string | null;
  secondaryColor: string | null;
  logo: string | null;
  clinicName: string | null;
}

interface ThemeContextType {
  theme: ClinicTheme;
  isLoading: boolean;
  error: Error | null;
}

const defaultTheme: ClinicTheme = {
  primaryColor: null,
  secondaryColor: null,
  logo: null,
  clinicName: null,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isLoading: false,
  error: null,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<ClinicTheme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClinicTheme = async () => {
      if (!user?.clinicId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('name, logo, primary_color, secondary_color')
          .eq('id', user.clinicId)
          .single();

        if (error) throw error;

        setTheme({
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          logo: data.logo,
          clinicName: data.name,
        });
      } catch (err) {
        console.error('Error fetching clinic theme:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicTheme();
  }, [user?.clinicId]);

  return (
    <ThemeContext.Provider value={{ theme, isLoading, error }}>
      {children}
    </ThemeContext.Provider>
  );
};
