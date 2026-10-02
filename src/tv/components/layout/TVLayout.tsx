import { type ReactNode } from "react";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import { useTranslation } from "react-i18next";
import { Home, Search, Settings, Info } from "lucide-react";
import type { TVPage } from "../../navigation";
import AudioPlayerBar from "../common/AudioPlayerBar";

interface TVLayoutProps {
  children: ReactNode;
  onNavigate: (page: TVPage) => void;
  currentPage: TVPage;
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
  focusKey?: string;
}

function NavItem({ icon, label, isActive, onPress, focusKey: preferredFocusKey }: NavItemProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: onPress,
    focusKey: preferredFocusKey,
  });

  return (
    <div
      ref={ref}
      onClick={onPress}
      className={`flex items-center gap-3 rounded-tv-md px-tv-3 py-tv-2 tv-btn-focus cursor-pointer ${
        focused ? "focused" : ""
      } ${isActive ? "bg-primary-600 text-white" : "text-gray-400 hover:text-white"}`}
    >
      {icon}
      <span className="text-tv-sm font-medium">{label}</span>
    </div>
  );
}

function SidebarNav({ onNavigate, currentPage }: { onNavigate: (page: TVPage) => void; currentPage: TVPage }) {
  const { t } = useTranslation();
  const { ref, focusKey } = useFocusable({
    focusKey: "sidebar",
    isFocusBoundary: false,
    preferredChildFocusKey: "nav-home",
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <nav ref={ref} className="flex w-[240px] shrink-0 flex-col bg-gray-900 border-r border-gray-800 py-tv-4 px-tv-2">
        {/* Logo */}
        <div className="mb-tv-6 px-tv-2">
          <h1 className="text-tv-xl font-bold text-white">Yotuna</h1>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-2">
          <NavItem
            focusKey="nav-home"
            icon={<Home className="h-7 w-7" />}
            label={t("nav.home", "Home")}
            isActive={currentPage === "home"}
            onPress={() => onNavigate("home")}
          />
          <NavItem
            focusKey="nav-search"
            icon={<Search className="h-7 w-7" />}
            label={t("nav.search", "Search")}
            isActive={currentPage === "search"}
            onPress={() => onNavigate("search")}
          />
          <NavItem
            focusKey="nav-settings"
            icon={<Settings className="h-7 w-7" />}
            label={t("nav.settings", "Settings")}
            isActive={currentPage === "settings"}
            onPress={() => onNavigate("settings")}
          />
          <NavItem
            focusKey="nav-about"
            icon={<Info className="h-7 w-7" />}
            label={t("nav.about", "About")}
            isActive={currentPage === "about"}
            onPress={() => onNavigate("about")}
          />
        </div>
      </nav>
    </FocusContext.Provider>
  );
}

function MainContent({ children }: { children: ReactNode }) {
  const { ref, focusKey } = useFocusable({
    focusKey: "main-content",
    isFocusBoundary: false,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="flex flex-1 flex-col overflow-hidden">
        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

        {/* Audio player bar at bottom */}
        <AudioPlayerBar />
      </div>
    </FocusContext.Provider>
  );
}

export default function TVLayout({ children, onNavigate, currentPage }: TVLayoutProps) {
  const { ref: containerRef, focusKey } = useFocusable({
    focusKey: "tv-layout",
    isFocusBoundary: false,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={containerRef} className="flex h-full w-full">
        <SidebarNav onNavigate={onNavigate} currentPage={currentPage} />
        <MainContent>{children}</MainContent>
      </div>
    </FocusContext.Provider>
  );
}
