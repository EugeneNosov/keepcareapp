export interface ToastMessage {
  id: number;
  message: string;
}

type ToastListener = () => void;

const listeners = new Set<ToastListener>();

let activeToast: ToastMessage | null = null;
let nextToastId = 0;

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const toast = {
  error(message: string) {
    activeToast = {
      id: ++nextToastId,
      message,
    };
    notifyListeners();
  },

  dismiss(id?: number) {
    if (id !== undefined && activeToast?.id !== id) {
      return;
    }

    activeToast = null;
    notifyListeners();
  },
};

export function getActiveToast() {
  return activeToast;
}

export function subscribeToToast(listener: ToastListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
