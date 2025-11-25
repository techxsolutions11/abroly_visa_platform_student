/**
 * Theme Color Constants
 * 
 * This file contains all theme color definitions.
 * To change the primary theme color, update the PRIMARY_COLOR value below.
 * 
 * All components should import colors from this file to maintain consistency.
 * 
 * Usage:
 *   import { PRIMARY_COLOR, getPrimaryGradient } from '@/lib/theme';
 *   
 *   // For inline styles
 *   style={{ backgroundColor: PRIMARY_COLOR }}
 *   
 *   // For Tailwind classes (use arbitrary values)
 *   className="bg-[#ab0d0d]"
 */

// Primary Brand Color - CHANGE THIS TO UPDATE THEME COLOR
export const PRIMARY_COLOR = '#ab0d0d';

// Primary Color Variations (for gradients and hover states)
export const PRIMARY_COLOR_LIGHT = '#c91a1a'; // Lighter shade for hover
export const PRIMARY_COLOR_DARK = '#8a0a0a';  // Darker shade for gradients
export const PRIMARY_COLOR_50 = '#fee2e2';    // Very light for backgrounds
export const PRIMARY_COLOR_100 = '#fecaca';   // Light for backgrounds
export const PRIMARY_COLOR_200 = '#fca5a5';   // Lighter for borders
export const PRIMARY_COLOR_300 = '#f87171';   // Light for hover states
export const PRIMARY_COLOR_400 = '#ef4444';   // Medium
export const PRIMARY_COLOR_500 = PRIMARY_COLOR; // Base color
export const PRIMARY_COLOR_600 = '#dc2626';   // Darker
export const PRIMARY_COLOR_700 = '#b91c1c';   // Darker
export const PRIMARY_COLOR_800 = '#991b1b';   // Darker
export const PRIMARY_COLOR_900 = '#7f1d1d';   // Darkest

// Helper functions for gradients
export const getPrimaryGradient = (direction: 'to-r' | 'to-br' | 'to-b' = 'to-r') => {
  const gradients = {
    'to-r': `linear-gradient(to right, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_DARK})`,
    'to-br': `linear-gradient(to bottom right, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_LIGHT}, ${PRIMARY_COLOR_DARK})`,
    'to-b': `linear-gradient(to bottom, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_DARK})`,
  };
  return gradients[direction];
};

// For inline styles
export const PRIMARY_COLOR_STYLES = {
  primary: PRIMARY_COLOR,
  primaryLight: PRIMARY_COLOR_LIGHT,
  primaryDark: PRIMARY_COLOR_DARK,
  gradient: getPrimaryGradient('to-r'),
  gradientBr: getPrimaryGradient('to-br'),
  gradientB: getPrimaryGradient('to-b'),
};

// Tailwind class helpers (use with arbitrary values)
export const PRIMARY_CLASSES = {
  bg: `bg-[${PRIMARY_COLOR}]`,
  text: `text-[${PRIMARY_COLOR}]`,
  border: `border-[${PRIMARY_COLOR}]`,
  gradientFrom: `from-[${PRIMARY_COLOR}]`,
  gradientVia: `via-[${PRIMARY_COLOR_LIGHT}]`,
  gradientTo: `to-[${PRIMARY_COLOR_DARK}]`,
};

