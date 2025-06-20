import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Idea schemas
export const ideaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  category: z.enum(['innovation', 'improvement', 'problem_solving', 'cost_saving', 'revenue_generation', 'other']),
  tags: z.string().transform((val) => val.split(',').map(tag => tag.trim()).filter(Boolean)),
});

// Comment schema
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment must be less than 500 characters'),
});

// Decision schema
export const decisionSchema = z.object({
  decision_type: z.enum(['implementation', 'rejection', 'modification', 'escalation', 'deferral']),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500, 'Summary must be less than 500 characters'),
  rationale: z.string().min(20, 'Rationale must be at least 20 characters').max(1000, 'Rationale must be less than 1000 characters'),
  conditions: z.string().optional().transform((val) => val ? val.split(',').map(c => c.trim()).filter(Boolean) : []),
  timeline_days: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type IdeaFormData = z.infer<typeof ideaSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type DecisionFormData = z.infer<typeof decisionSchema>;