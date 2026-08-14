import { isAxiosError } from 'axios';

type ErrorMessageOptions = {
  fallback?: string;
  auth?: string;
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const getErrorMessage = (error: unknown, options: ErrorMessageOptions = {}): string => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Network error. Please check your internet connection.';
    }

    const status = error.response.status;

    if (status >= 500) {
      return 'Server error. Please try again later.';
    }
    if (status === 401) {
      return options.auth || 'Your session has expired. Please log in again.';
    }
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'The requested information could not be found.';
    }

    return options.fallback || DEFAULT_ERROR_MESSAGE;
  }

  return options.fallback || DEFAULT_ERROR_MESSAGE;
};
