import { getAppName, getConfig } from './config';

/**
 * Set website favicon dynamically
 */
export const setFavicon = (faviconUrl?: string) => {
    const favicon = faviconUrl || getConfig('FAVICON_URL') || '/logo.png';
    
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());
    
    // Create and append new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = favicon;
    document.head.appendChild(link);
    
    // Also add apple-touch-icon for better mobile support
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = favicon;
    document.head.appendChild(appleLink);
};

/**
 * Set website title dynamically
 */
export const setTitle = (title?: string) => {
    const appName = title || getAppName() || 'Student Portal';
    document.title = appName;
    
    // Update og:title meta tag if it exists
    updateMetaTag('property', 'og:title', appName);
};

/**
 * Helper function to convert relative URL to absolute URL
 */
const getAbsoluteUrl = (url: string): string => {
    if (!url) return '';
    
    // If already absolute URL (starts with http:// or https://), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // If relative URL, make it absolute
    if (url.startsWith('/')) {
        return window.location.origin + url;
    }
    
    // If relative path without leading slash, add it
    return window.location.origin + '/' + url;
};

/**
 * Set website meta tags dynamically
 */
export const setMetaTags = () => {
    const appName = getAppName() || 'Student Portal';
    const metaDescription = getConfig('META_DESCRIPTION') || `${appName}: Track university applications, access educational resources, and manage your journey with our student dashboard.`;
    const metaKeywords = getConfig('META_KEYWORDS') || `${appName}, student dashboard, university application tracking, educational resources, student tools, college applications`;
    const ogImageRaw = getConfig('OG_IMAGE') || getConfig('FAVICON_URL') || '/logo.png';
    const ogImage = getAbsoluteUrl(ogImageRaw);
    const ogUrl = getConfig('OG_URL') || window.location.origin;
    
    // Update or create meta description
    updateMetaTag('name', 'description', metaDescription);
    
    // Update or create meta keywords
    updateMetaTag('name', 'keywords', metaKeywords);
    
    // Update or create Open Graph tags
    updateMetaTag('property', 'og:title', appName);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', ogUrl);
    updateMetaTag('property', 'og:type', 'website');
    
    // Update or create Twitter Card tags (optional, but good for social sharing)
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', appName);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', ogImage);
};

/**
 * Helper function to update or create meta tags
 */
const updateMetaTag = (attribute: string, value: string, content: string) => {
    let metaTag = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    
    if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute(attribute, value);
        document.head.appendChild(metaTag);
    }
    
    metaTag.content = content;
};

/**
 * Initialize all meta tags, favicon, and title from config
 * Call this function after config is loaded
 */
export const initializeMetaTags = () => {
    setFavicon();
    setTitle();
    setMetaTags();
};

