import { clsx, type ClassValue } from 'clsx';
import type { CSSProperties } from 'react';

/** Merge Tailwind classes safely (no clsx dep needed — simple version) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format phone number for tel: link */
export function telLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}

/** Format WhatsApp link with prefilled text */
export function waLink(number: string, text?: string): string {
  const base = `https://wa.me/${number.replace(/[^0-9]/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Generate mailto link with optional subject */
export function mailtoLink(email: string, subject?: string): string {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** Typed helper for inline CSS custom properties, e.g. style={{ ...cssVars({ '--outline': 'red' }) }} */
export function cssVars(vars: Record<string, string>): CSSProperties {
  return vars as CSSProperties;
}
