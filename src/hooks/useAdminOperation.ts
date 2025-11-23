import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SupabaseSessionManager } from '@/utils/supabaseSession';
import { createErrorReport, reportError } from '@/utils/errorReporting';

interface AdminOperationState {
  loading: boolean;
  error: string | null;
}

interface AdminOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Universal hook admin operacijoms su sesijos valdymu
 */
export function useAdminOperation() {
  const [state, setState] = useState<AdminOperationState>({
    loading: false,
    error: null,
  });
  const { toast } = useToast();

  /**
   * Atlikti admin operaciją su automatišku sesijos valdymu ir klaidų apdorojimu
   */
  const execute = async <T>(
    operation: () => Promise<T>,
    options?: {
      operationName?: string;
      successMessage?: string;
      errorMessage?: string;
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
    }
  ): Promise<AdminOperationResult<T>> => {
    const {
      operationName = 'admin operation',
      successMessage,
      errorMessage,
      showSuccessToast = true,
      showErrorToast = true,
    } = options || {};

    setState({ loading: true, error: null });

    try {
      const result = await SupabaseSessionManager.executeAdminOperation(
        operation,
        operationName
      );

      if (result.success) {
        setState({ loading: false, error: null });

        if (showSuccessToast && successMessage) {
          toast({
            title: 'Sėkmingai atlikta',
            description: successMessage,
          });
        }

        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || 'Nežinoma klaida';
        setState({ loading: false, error: errorMsg });

        if (showErrorToast) {
          toast({
            title: 'Klaida',
            description: errorMessage || errorMsg,
            variant: 'destructive',
          });
        }

        return { success: false, error: errorMsg };
      }

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      const errorMsg = err.message;

      setState({ loading: false, error: errorMsg });

      // Pranešti apie klaidą
      const report = createErrorReport(err, {
        errorBoundary: 'useAdminOperation',
        additionalData: { operationName },
      });
      reportError(report);

      if (showErrorToast) {
        toast({
          title: 'Klaida',
          description: errorMessage || errorMsg,
          variant: 'destructive',
        });
      }

      return { success: false, error: errorMsg };
    }
  };

  /**
   * Išvalyti klaidos būseną
   */
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    execute,
    clearError,
  };
}

/**
 * Hook specializuotas CRUD operacijoms
 */
export function useAdminCrud() {
  const adminOp = useAdminOperation();

  const create = async <T>(
    createFn: () => Promise<T>,
    itemName = 'elementas'
  ) => {
    return adminOp.execute(createFn, {
      operationName: `create ${itemName}`,
      successMessage: `${itemName} sėkmingai sukurtas`,
      errorMessage: `Nepavyko sukurti ${itemName}`,
    });
  };

  const update = async <T>(
    updateFn: () => Promise<T>,
    itemName = 'elementas'
  ) => {
    return adminOp.execute(updateFn, {
      operationName: `update ${itemName}`,
      successMessage: `${itemName} sėkmingai atnaujintas`,
      errorMessage: `Nepavyko atnaujinti ${itemName}`,
    });
  };

  const remove = async <T>(
    deleteFn: () => Promise<T>,
    itemName = 'elementas'
  ) => {
    return adminOp.execute(deleteFn, {
      operationName: `delete ${itemName}`,
      successMessage: `${itemName} sėkmingai ištrintas`,
      errorMessage: `Nepavyko ištrinti ${itemName}`,
    });
  };

  return {
    ...adminOp,
    create,
    update,
    remove,
  };
}