/**
 * Set theme colors from environment variables
 * Call this function in your main.tsx or App.tsx to load colors from .env
 */
export const setThemeColors = () => {
  const root = document.documentElement;
  
  // Get colors from environment variables
  const primaryColor = import.meta.env.VITE_PRIMARY_COLOR || '#f66b47';
  const primaryForegroundColor = import.meta.env.VITE_PRIMARY_FOREGROUND_COLOR || '#ffffff';
  const darkPrimaryColor = import.meta.env.VITE_DARK_PRIMARY_COLOR || '#050a30';
  
  // Set CSS variables
  root.style.setProperty('--primary-color', primaryColor);
  root.style.setProperty('--primary-foreground-color', primaryForegroundColor);
  root.style.setProperty('--dark-primary-color', darkPrimaryColor);
};

