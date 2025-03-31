
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export const ClinicThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  React.useEffect(() => {
    // Apply theme colors to CSS variables if they exist
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary-500', theme.primaryColor);
    }
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-500', theme.secondaryColor);
    }

    // Clean up when component unmounts
    return () => {
      // Reset to default theme
      document.documentElement.style.removeProperty('--primary-500');
      document.documentElement.style.removeProperty('--secondary-500');
    };
  }, [theme.primaryColor, theme.secondaryColor]);

  return <>{children}</>;
};
