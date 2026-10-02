interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 z-50 -translate-x-1/2 rounded-tv-lg bg-gray-800 px-tv-4 py-tv-2 shadow-2xl">
      <span className="text-tv-sm font-medium text-white">{message}</span>
    </div>
  );
}
