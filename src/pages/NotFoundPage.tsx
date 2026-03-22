import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("notFound.title")}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{t("notFound.message")}</p>
      <button
        onClick={() => navigate("/")}
        className="mt-2 flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
      >
        <Home className="h-4 w-4" />
        {t("notFound.goHome")}
      </button>
    </div>
  );
}
