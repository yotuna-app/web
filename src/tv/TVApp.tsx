import { useState, useEffect, useCallback } from "react";
import { ApolloProvider } from "@apollo/client";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { apolloClient } from "@/services";
import { useAudioStore } from "@/stores";
import { registerBackHandler, registerVisibilityHandler } from "./webos/lifecycle";
import { type NavigationHistory, createInitialState, navigateTo, goBack, canGoBack, type TVPage } from "./navigation";
import TVLayout from "./components/layout/TVLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import StationPage from "./pages/StationPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";

export default function TVApp() {
  const [nav, setNav] = useState<NavigationHistory>(createInitialState);

  const handleNavigate = useCallback((page: TVPage, params?: Record<string, string>) => {
    setNav(prev => navigateTo(prev, page, params));
  }, []);

  const handleBack = useCallback(() => {
    if (canGoBack(nav)) {
      setNav(prev => goBack(prev));
    } else {
      // At root (Home) — exit the app
      // Try webOS-specific close, then standard window.close()
      const webOSSystem = (window as unknown as Record<string, unknown>).webOSSystem as
        | { close?: () => void }
        | undefined;
      if (webOSSystem?.close) {
        webOSSystem.close();
      } else {
        window.close();
      }
    }
  }, [nav]);

  // Set initial focus on the sidebar home button after mount
  useEffect(() => {
    // Small delay to ensure all focusable elements are registered
    const timer = setTimeout(() => {
      setFocus("nav-home");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Register webOS back button
  useEffect(() => {
    return registerBackHandler(handleBack);
  }, [handleBack]);

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
    </ApolloProvider>
  );
}
