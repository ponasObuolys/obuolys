/**
 * Calculator Submission Service
 * Handles project calculator submissions and email collection
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { z } from 'zod';
import type { ProjectData } from '@/components/project-calculator/calculatorLogic';
import { calculateProjectEstimate } from '@/components/project-calculator/calculatorLogic';
import { secureLogger } from '@/utils/browserLogger';

// Validation schemas
const CalculatorSubmissionSchema = z.object({
  email: z.string().email('Netinkamas el. pašto formatas'),
  company_name: z.string().trim().min(1).optional().nullable(),
  project_type: z.enum(['mvp', 'crm', 'ecommerce', 'logistics', 'analytics', 'custom']),
  features: z.array(z.string()),
  tech_stack_frontend: z.enum(['react-typescript', 'next-typescript']),
  tech_stack_backend: z.enum(['supabase', 'custom-nodejs']),
  tech_stack_testing: z.boolean(),
  tech_stack_premium_design: z.boolean(),
  estimated_min_cost: z.number().int().positive(),
  estimated_max_cost: z.number().int().positive(),
  estimated_min_weeks: z.number().int().positive(),
  estimated_max_weeks: z.number().int().positive(),
  recommended_package: z.string(),
  ip_address: z.string().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
});

export type CalculatorSubmission = z.infer<typeof CalculatorSubmissionSchema>;
type CalculatorSubmissionRow = Database['public']['Tables']['calculator_submissions']['Row'];
type CalculatorSubmissionInsert = Database['public']['Tables']['calculator_submissions']['Insert'];

/**
 * Submit calculator data and collect email
 * Returns submission ID for tracking
 */
export async function submitCalculatorData(projectData: ProjectData): Promise<{
  success: boolean;
  submissionId?: string;
  error?: string
}> {
  try {
    // Validate email is provided
    if (!projectData.contactInfo.email) {
      return {
        success: false,
        error: 'El. pašto adresas yra privalomas',
      };
    }

    // Validate project type
    if (!projectData.projectType) {
      return {
        success: false,
        error: 'Pasirinkite projekto tipą',
      };
    }

    // Calculate estimate
    const estimate = calculateProjectEstimate(projectData);

    if (!estimate) {
      return {
        success: false,
        error: 'Nepavyko apskaičiuoti įvertinimo',
      };
    }

    // Prepare submission data
    const submissionData: CalculatorSubmissionInsert = {
      email: projectData.contactInfo.email.trim().toLowerCase(),
      company_name: projectData.contactInfo.companyName?.trim() || null,
      project_type: projectData.projectType,
      features: projectData.features,
      tech_stack_frontend: projectData.techStack.frontend,
      tech_stack_backend: projectData.techStack.backend,
      tech_stack_testing: projectData.techStack.testing,
      tech_stack_premium_design: projectData.techStack.premiumDesign,
      estimated_min_cost: estimate.minCost,
      estimated_max_cost: estimate.maxCost,
      estimated_min_weeks: estimate.minWeeks,
      estimated_max_weeks: estimate.maxWeeks,
      recommended_package: estimate.recommendedPackage,
      // Analytics metadata
      ip_address: null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
    };

    // Validate with Zod
    const validated: CalculatorSubmissionInsert = CalculatorSubmissionSchema.parse(submissionData);

    // Insert into database
    const { data, error } = await supabase
      .from('calculator_submissions')
      .insert(validated)
      .select('id')
      .single();

    if (error) {
      secureLogger.error('Supabase submission error', error);
      return {
        success: false,
        error: 'Nepavyko išsaugoti duomenų. Bandykite dar kartą.',
      };
    }

    // Trigger email sending via Edge Function
    try {
      await triggerEmailSending(data.id);
    } catch (emailError) {
      // Don't fail the submission if email fails
      secureLogger.error('Email sending failed (non-critical)', emailError);
    }

    return {
      success: true,
      submissionId: data.id,
    };
  } catch (error) {
    secureLogger.error('Calculator submission error', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Netinkami duomenys. Patikrinkite formos laukus.',
      };
    }

    return {
      success: false,
      error: 'Įvyko nenumatyta klaida. Bandykite dar kartą.',
    };
  }
}

/**
 * Get submission by ID (admin only)
 */
export async function getSubmissionById(submissionId: string) {
  const { data, error } = await supabase
    .from('calculator_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (error) {
    secureLogger.error('Error fetching submission', error);
    return null;
  }

  return data;
}

/**
 * Get all submissions (admin only)
 * Returns submissions ordered by created_at DESC
 */
export async function getAllSubmissions(filters?: {
  leadStatus?: CalculatorSubmissionRow['lead_status'];
  emailSent?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('calculator_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  const leadStatus = filters?.leadStatus;
  if (leadStatus !== undefined) {
    query = query.eq('lead_status', leadStatus);
  }

  if (filters?.emailSent !== undefined) {
    query = query.eq('email_sent', filters.emailSent);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    secureLogger.error('Error fetching submissions', error);
    return [];
  }

  return data || [];
}

/**
 * Update submission status (admin only)
 */
export async function updateSubmissionStatus(
  submissionId: string,
  updates: {
    leadStatus?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    notes?: string;
  }
) {
  const { data, error } = await supabase
    .from('calculator_submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single();

  if (error) {
    secureLogger.error('Error updating submission', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Trigger email sending via Edge Function
 */
async function triggerEmailSending(submissionId: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL not configured');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-calculator-estimate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ submission_id: submissionId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      secureLogger.error('Edge function error', error);
      throw new Error(`Email sending failed: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    secureLogger.info('Email sent successfully', result);
  } catch (error) {
    secureLogger.error('Error triggering email', error);
    throw error;
  }
}

/**
 * Mark email as sent (called by Edge Function after successful send)
 */
export async function markEmailSent(
  submissionId: string,
  success: boolean,
  errorMessage?: string
) {
  const updates: Partial<CalculatorSubmissionRow> = {
    email_sent: success,
    email_sent_at: success ? new Date().toISOString() : null,
  };

  if (!success && errorMessage) {
    updates.email_error = errorMessage;
  }

  const { error } = await supabase
    .from('calculator_submissions')
    .update(updates)
    .eq('id', submissionId);

  if (error) {
    secureLogger.error('Error marking email sent', error);
    return false;
  }

  return true;
}
