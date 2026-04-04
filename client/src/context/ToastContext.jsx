import { Toaster, toast } from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    duration: 3000,
    style: {
      background: '#10B981',
      color: '#fff',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    duration: 4000,
    style: {
      background: '#EF4444',
      color: '#fff',
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

// Add Toaster component to your App.jsx
export const ToastProvider = () => {
  return <Toaster />;
};