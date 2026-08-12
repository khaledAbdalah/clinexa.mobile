import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/error-handler';
import type { AxiosError } from 'axios';
import type { ApiError, UseApiMutationOptions } from './types';

export function useApiMutation<TData, TVariables, TContext = unknown>(
  options: UseApiMutationOptions<TData, TVariables, TContext>
) {
  const {
    mutationFn,
    successMessage,
    errorMessage,
    invalidateQueryKeys,
    onMutate,
    onSuccess,
    onError,
    setFieldErrors,
  } = options;
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation<TData, AxiosError<ApiError>, TVariables, TContext>({
    mutationFn,
    onMutate,
    onSuccess: (data, variables) => {
      invalidateQueryKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      if (successMessage) {
        showSuccess(successMessage);
      }
      onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors && setFieldErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          setFieldErrors(field, messages[0]);
        });
        return;
      }

      if (onError) {
        onError(error, variables, context);
      } else {
        showError(errorMessage ?? getErrorMessage(error));
      }
    },
  });
}
