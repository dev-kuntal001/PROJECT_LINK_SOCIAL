import React, { useEffect } from 'react';
import { CheckIcon, XCloseIcon } from './icons';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyles =
    toast.type === 'error'
      ? 'bg-white border-2 border-[#111111] text-[#EA4335] shadow-[4px_4px_0px_#EA4335]'
      : toast.type === 'info'
      ? 'bg-white border-2 border-[#111111] text-[#4285F4] shadow-[4px_4px_0px_#4285F4]'
      : 'bg-white border-2 border-[#111111] text-[#111111] shadow-[4px_4px_0px_#34A853]';

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl transition-all duration-300 animate-slide-up text-sm font-bold ${bgStyles}`}
    >
      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-neutral-100 border border-neutral-300 shrink-0">
        <CheckIcon className="w-3.5 h-3.5 text-[#34A853]" />
      </div>
      <span className="pr-2">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-500 hover:text-black transition-colors p-0.5"
        aria-label="Dismiss notification"
      >
        <XCloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
