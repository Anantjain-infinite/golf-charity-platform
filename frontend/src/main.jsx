import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { queryClient } from './lib/queryClient';
import AppRouter from './router/index';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#13131A',
          border: '1px solid #2A2A3D',
          color: '#F9FAFB',
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);