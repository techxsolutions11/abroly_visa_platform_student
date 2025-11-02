import { getFromLocal } from './localstorage';

/**
 * Get configuration value from localStorage with fallback to environment variables
 * This allows for dynamic configuration from backend while maintaining backward compatibility
 * IMPORTANT: localStorage values always take priority over env vars
 */
export const getConfig = (key: string, defaultValue: string = ''): string => {
    const storedConfig = getFromLocal('app_config');
    
    if (storedConfig) {
        try {
            const config = JSON.parse(storedConfig);
            // Check if key exists in config (even if empty string, it was set)
            if (config.hasOwnProperty(key)) {
                // Return the value (even if empty) - localStorage value takes priority
                return config[key] || defaultValue;
            }
        } catch (e) {
            console.error('Error parsing app_config from localStorage:', e);
        }
    }
    
    // Fallback to environment variables only if no localStorage config exists
    const envKey = `VITE_${key}` as keyof ImportMetaEnv;
    return import.meta.env[envKey] || defaultValue;
};

/**
 * Get all configuration values as an object
 */
export const getAllConfig = (): Record<string, string> => {
    const storedConfig = getFromLocal('app_config');
    
    if (storedConfig) {
        try {
            return JSON.parse(storedConfig);
        } catch (e) {
            console.error('Error parsing app_config from localStorage:', e);
        }
    }
    
    // Return empty object if no config found
    return {};
};

// Convenience functions for commonly used config values
export const getAgentUuid = (): string => getConfig('AGENT_UUID');
export const getAgentId = (): string => getConfig('AGENT_ID');
export const getPrimaryColor = (): string => getConfig('PRIMARY_COLOR', '#f66b47');
export const getPrimaryForegroundColor = (): string => getConfig('PRIMARY_FOREGROUND_COLOR', '#ffffff');
export const getDarkPrimaryColor = (): string => getConfig('DARK_PRIMARY_COLOR', '#050a30');
export const getAppName = (): string => getConfig('APP_NAME');
export const getSupportNumber = (): string => getConfig('SUPPORT_NUMBER');
export const getSupportEmail = (): string => getConfig('SUPPORT_EMAIL');
export const getCertificateUrl = (): string => getConfig('CERTIFICATE_URL');
export const getAgencyAddress = (): string => getConfig('AGENCY_ADDRESS');
export const getFaviconUrl = (): string => getConfig('FAVICON_URL', '/logo.png');
export const getMetaDescription = (): string => getConfig('META_DESCRIPTION');
export const getMetaKeywords = (): string => getConfig('META_KEYWORDS');
export const getOgImage = (): string => getConfig('OG_IMAGE');
export const getOgUrl = (): string => getConfig('OG_URL');

