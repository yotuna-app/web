import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import pl from "./locales/pl.json";
import ar from "./locales/ar.json";
import zh from "./locales/zh.json";
import es from "./locales/es.json";
import hi from "./locales/hi.json";
import ja from "./locales/ja.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";

export const SUPPORTED_LANGUAGES = ["en", "pl", "de", "fr", "es", "ar", "zh", "hi", "ja"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: SupportedLanguage[] = ["ar"];

const resources = {
  en: { translation: en },
  pl: { translation: pl },
  ar: { translation: ar },
  zh: { translation: zh },
  es: { translation: es },
  hi: { translation: hi },
  ja: { translation: ja },
  fr: { translation: fr },
  de: { translation: de },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "yotuna-language",
      caches: ["localStorage"],
    },
  });

export function updateDocumentDirection(language: string): void {
  const isRTL = RTL_LANGUAGES.includes(language as SupportedLanguage);
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = language;
}

updateDocumentDirection(i18n.language);
i18n.on("languageChanged", updateDocumentDirection);

export default i18n;
