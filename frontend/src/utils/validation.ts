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

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Registration validation schema
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  role: roleSchema.optional().default('user'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
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