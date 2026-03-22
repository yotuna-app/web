import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/services/apolloClient";
import Layout from "@/components/layout/Layout";
import PageLoader from "@/components/common/PageLoader";
import GDPRModal from "@/components/common/GDPRModal";

const HomePage = lazy(() => import("@/pages/HomePage"));
const StationPage = lazy(() => import("@/pages/StationPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter basename="/">
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="station/:name"
              element={
                <Suspense fallback={<PageLoader />}>
                  <StationPage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="privacy"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
        <GDPRModal />
      </BrowserRouter>
    </ApolloProvider>
  );
}
