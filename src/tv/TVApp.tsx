import { useState, useEffect, useCallback, useRef } from "react";
import { ApolloProvider } from "@apollo/client";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useTranslation } from "react-i18next";
import { apolloClient } from "@/services";
import { useAudioStore } from "@/stores";
import { registerBackHandler, registerVisibilityHandler } from "./webos/lifecycle";
import { type NavigationHistory, createInitialState, navigateTo, goBack, canGoBack, type TVPage } from "./navigation";
import TVLayout from "./components/layout/TVLayout";
import Toast from "./components/common/Toast";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import StationPage from "./pages/StationPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";

export default function TVApp() {
  const { t } = useTranslation();
  const [nav, setNav] = useState<NavigationHistory>(createInitialState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show toast when audio error occurs
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleAudioError = () => {
      setToastMessage(t("station.playbackError", "Unable to play station. The stream may be unavailable."));
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setToastMessage(null);
        useAudioStore.getState().clearPlaybackError();
      }, 4000);
    };

    window.addEventListener("yotuna:audio-error", handleAudioError);
    return () => {
      window.removeEventListener("yotuna:audio-error", handleAudioError);
      if (timer) clearTimeout(timer);
    };
  }, [t]);

  const handleNavigate = useCallback((page: TVPage, params?: Record<string, string>) => {
    setNav(prev => navigateTo(prev, page, params));
  }, []);

  const handleBack = useCallback(() => {
    if (canGoBack(nav)) {
      setNav(prev => goBack(prev));
    } else {
      // At root (Home) — exit the app
      // Try webOS-specific close, PalmSystem back, then standard window.close()
      const win = window as unknown as Record<string, unknown>;
      const webOSSystem = win.webOSSystem as { close?: () => void } | undefined;
      const palmSystem = win.PalmSystem as { platformBack?: () => void } | undefined;

      if (webOSSystem?.close) {
        webOSSystem.close();
      } else if (palmSystem?.platformBack) {
        palmSystem.platformBack();
      } else {
        window.close();
      }
    }
  }, [nav]);

  // Keep a stable ref so registerBackHandler never detaches/reattaches on state changes
  const handleBackRef = useRef(handleBack);
  useEffect(() => {
    handleBackRef.current = handleBack;
  }, [handleBack]);

  // Set initial focus on the sidebar home button after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFocus("nav-home");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Register webOS back button once
  useEffect(() => {
    return registerBackHandler(() => {
      handleBackRef.current();
    });
  }, []);

  // Handle visibility changes - pause/resume audio
  useEffect(() => {
    return registerVisibilityHandler(
      () => {
        // App hidden (minimized) - pause audio
        const { isPlaying, pauseAudio } = useAudioStore.getState();
        if (isPlaying) {
          pauseAudio();
        }
      },
      () => {
        // App visible (restored) - no auto-resume
      },
    );
  }, []);

  function renderPage() {
    switch (nav.current.page) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "search":
        return <SearchPage onNavigate={handleNavigate} />;
      case "station":
        return <StationPage stationName={nav.current.params?.name ?? ""} onNavigate={handleNavigate} onBack={handleBack} />;
      case "settings":
        return <SettingsPage onBack={handleBack} />;
      case "about":
        return <AboutPage onBack={handleBack} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  }

  return (
    <ApolloProvider client={apolloClient}>
      <TVLayout onNavigate={handleNavigate} currentPage={nav.current.page}>
        {renderPage()}
      </TVLayout>
      <Toast message={toastMessage ?? ""} visible={!!toastMessage} />
    </ApolloProvider>
  );
}
