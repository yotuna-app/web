import { useState, useCallback, useRef } from "react";

interface ToastState {
  message: string;
  visible: boolean;
}

export function useToast(duration = 2500) {
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback(
    (message: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setToast({ message, visible: true });
      timeoutRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, duration);
    },
    [duration],
  );

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}
