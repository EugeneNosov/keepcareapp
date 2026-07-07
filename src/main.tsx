import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import ToastContainer from './components/Toast/ToastContainer.tsx';
import { toast } from './components/Toast/toast.ts';
import { AuthProvider } from './features/auth/context/AuthProvider.tsx'
import {
  ApiError,
  getRequestErrorMessage,
  shouldShowGlobalError,
} from './shared/api';
import getEnvVariable from './shared/utils/getEnvVariable.ts';

const googleClientId = getEnvVariable('VITE_GOOGLE_CLIENT_ID');


const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation error:', error);
      if (shouldShowGlobalError(error)) {
        toast.error(getRequestErrorMessage(error));
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError
          && error.status >= 400
          && error.status < 500
          && error.status !== 429
        ) {
          return false;
        }

        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
        <ToastContainer/>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
