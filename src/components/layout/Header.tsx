import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Radio, Settings, Info, Shield } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { to: "/", label: "nav.home", icon: Radio },
  { to: "/settings", label: "nav.settings", icon: Settings },
  { to: "/about", label: "nav.about", icon: Info },
  { to: "/privacy", label: "nav.privacy", icon: Shield },
];

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-primary-500">
            <Radio className="h-6 w-6" />
            <span className="hidden sm:inline">Yotuna</span>
          </NavLink>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{t(label)}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
