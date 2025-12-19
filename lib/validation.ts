import { z } from 'zod';

// Property validation schemas
export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priceUSD: z.number().positive('Price must be positive'),
  city: z.string().min(2, 'City is required'),
  propertyType: z.enum(['apartment', 'villa', 'penthouse', 'commercial']),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  areaSqm: z.number().positive('Area must be positive'),
  listingType: z.enum(['sale', 'rent', 'both']),
  agentId: z.string().min(1, 'Agent is required'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['buyer', 'seller', 'admin']).default('buyer'),
});

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 10000); // Limit length
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (Lebanese format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+961|00961|961)?[1-9]\d{6,7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}


