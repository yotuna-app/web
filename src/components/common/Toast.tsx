interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 dark:bg-gray-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}
    >
      {message}
    </div>
  );
}
