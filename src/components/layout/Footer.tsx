import { Radio } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Radio className="h-4 w-4" />
          <span>&copy; {year} Yotuna</span>
        </div>
        <a
          href="https://yotuna.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
        >
          yotuna.com
        </a>
      </div>
    </footer>
  );
}
