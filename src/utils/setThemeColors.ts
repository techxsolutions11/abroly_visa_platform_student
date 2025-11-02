import axios from "axios";
import { getPrimaryColor, getPrimaryForegroundColor, getDarkPrimaryColor } from "./config";
import { getAuthToken } from "./localstorage";

/**
 * Set theme colors from localStorage (fetched from backend) with fallback to environment variables
 * This function can be called outside React components (no hooks)
 */
export const setThemeColors = () => {
  const root = document.documentElement;

  const applyConfigColors = () => {
    // Get colors from localStorage/config with fallback to env variables
    const primaryColor = getPrimaryColor();
    const primaryForegroundColor = getPrimaryForegroundColor();
    const darkPrimaryColor = getDarkPrimaryColor();
    
    // Set CSS variables
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-foreground-color', primaryForegroundColor);
    root.style.setProperty('--dark-primary-color', darkPrimaryColor);
  }

  // Apply colors immediately from config
  applyConfigColors();

  // Optionally fetch from API if token exists (async, won't block)
  // fetchThemeColorsFromAPI();
};

/**
 * Fetch theme colors from API (runs asynchronously, doesn't block)
 * This is optional and will update colors if API call succeeds
 */
// const fetchThemeColorsFromAPI = async () => {
//   try {
//     const BaseUrl = import.meta.env.VITE_API_BASE_URL as string;
//     const token = getAuthToken();
    
//     if (!token) {
//       // No token, skip API call
//       return;
//     }

//     const response = await axios.get(`${BaseUrl}/v1/settings/theme_color`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (response?.status === 200 && response?.data?.success === true) {
//       const data = response.data.data;
//       const root = document.documentElement;
      
//       if (data.primary_color) {
//         root.style.setProperty('--primary-color', data.primary_color);
//       }
//       if (data.primary_foreground_color) {
//         root.style.setProperty('--primary-foreground-color', data.primary_foreground_color);
//       }
//       if (data.dark_primary_color) {
//         root.style.setProperty('--dark-primary-color', data.dark_primary_color);
//       }
//     }
//   } catch (error) {
//     // Silently fail - we already applied colors from config
//     console.debug('Failed to fetch theme colors from API, using config values');
//   }
// };

