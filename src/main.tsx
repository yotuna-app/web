import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/i18n";
import App from "./App";
import { useSettingsStore, useDeviceStore } from "@/stores";

// Initialize theme and device ID before render
useSettingsStore.getState().initTheme();
useDeviceStore.getState().generateDeviceId();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
