/**
 * Form data types for type-safe form handling
 */

import type { Database } from '@/integrations/supabase/types';

// Base form interfaces
export interface BaseFormData {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

// User and Profile Forms
export interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  username?: string;
  avatar_url?: string;
  bio?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Content Management Forms
export interface ArticleFormData extends BaseFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  slug?: string;
  content_type: string;
  date: string;
}

export interface ToolFormData extends BaseFormData {
  title: string;
  description: string;
  category: string;
  url?: string;
  image_url?: string;
  featured: boolean;
  pricing?: string;
  tags?: string[];
}

export interface CourseFormData extends BaseFormData {
  title: string;
  description: string;
  content: string;
  instructor: string;
  duration: string;
  difficulty: string;
  price: number;
  published: boolean;
  featured: boolean;
  image_url?: string;
  category: string;
  tags?: string[];
  requirements?: string[];
  learning_objectives?: string[];
}

// Content Section Forms
export interface HeroSectionFormData extends BaseFormData {
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  background_image_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface CTASectionFormData extends BaseFormData {
  title: string;
  description?: string;
  button_text: string;
  button_url: string;
  background_color?: string;
  text_color?: string;
  is_active: boolean;
  display_order: number;
}

// Contact and Communication Forms
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

export interface NewsletterSubscriptionData {
  email: string;
  name?: string;
  preferences?: {
    articles: boolean;
    tools: boolean;
    courses: boolean;
    updates: boolean;
  };
}

// Admin Management Forms
export interface UserManagementData {
  id: string;
  email: string;
  username?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  last_login?: string;
}

export interface BulkActionData {
  action: 'delete' | 'activate' | 'deactivate' | 'publish' | 'unpublish';
  selectedIds: string[];
  confirmation: boolean;
}

// File Upload Forms
export interface FileUploadData {
  file: File;
  fileName?: string;
  description?: string;
  category?: string;
  isPublic: boolean;
}

export interface ImageUploadData extends FileUploadData {
  altText?: string;
  width?: number;
  height?: number;
  quality?: number;
}

// Search and Filter Forms
export interface SearchFormData {
  query: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'title' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface FilterFormData {
  categories: string[];
  tags: string[];
  featured?: boolean;
  published?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

// Form validation schemas (for use with react-hook-form + zod)
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'file' | 'number';
  required: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
  };
  options?: Array<{ value: string; label: string }>;
}

export interface FormConfig<TData = Record<string, unknown>> {
  fields: FormField[];
  submitButtonText: string;
  resetButtonText?: string;
  onSubmit: (data: TData) => Promise<void> | void;
  onReset?: () => void;
  defaultValues?: Partial<TData>;
}

// Form state management
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FormActions<T> {
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
}

// Form hook return type
export interface UseFormReturn<T> {
  state: FormState<T>;
  actions: FormActions<T>;
  register: <K extends keyof T>(field: K) => {
    name: string;
    value: T[K] | undefined;
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error?: string;
  };
}

// Utility types for form handling
export type FormDataFromTable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateFormDataFromTable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Async form submission
export interface AsyncFormSubmission<T> {
  data: T;
  onSuccess?: (result: unknown) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
}

// Form component props
export interface BaseFormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Multi-step form types
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  isOptional?: boolean;
}

export interface MultiStepFormData<T> {
  currentStep: number;
  steps: FormStep[];
  data: Partial<T>;
  completedSteps: Set<number>;
}

// Form analytics and tracking
export interface FormAnalytics {
  formId: string;
  startTime: Date;
  endTime?: Date;
  abandonedAt?: string;
  submissionAttempts: number;
  validationErrors: Record<string, number>;
  completionTime?: number;
}