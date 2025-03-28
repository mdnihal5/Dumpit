import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email' });

// Password validation schema
export const passwordSchema = z
  .string()
  .min(1, { message: 'Password is required' })
  .min(6, { message: 'Password must be at least 6 characters' });

// Phone validation schema
export const phoneSchema = z
  .string()
  .min(1, { message: 'Phone number is required' })
  .refine((val) => /^\d{10,}$/.test(val.replace(/\D/g, '')), {
    message: 'Please enter a valid phone number with at least 10 digits',
  });

// Name validation schema
export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .min(2, { message: 'Name must be at least 2 characters' });

// Role validation schema
export const roleSchema = z
  .enum(['user', 'vendor', 'admin'], {
    message: 'Please select a valid role',
  });

// User schema for registration
export const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// User schema for login
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// User schema for profile update
export const profileUpdateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
});

// Password schema for password reset
export const passwordSchemaReset = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Schema for password change
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof userSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Helper functions for common validations (legacy compatibility)
export const validateEmail = (email: string): boolean => {
  const result = emailSchema.safeParse(email);
  return result.success;
};

export const validatePassword = (password: string, minLength = 6): boolean => {
  const schema = z.string().min(minLength);
  const result = schema.safeParse(password);
  return result.success;
};

export const validatePhone = (phone: string): boolean => {
  const result = phoneSchema.safeParse(phone);
  return result.success;
};

export const validateRequired = (value: string): boolean => {
  const result = z.string().min(1).safeParse(value);
  return result.success;
}; 