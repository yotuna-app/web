import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// When running under Vitest, force a non-production NODE_ENV so that React 19
// loads its development builds. In production builds React omits `React.act`,
// which makes @testing-library/react fall back to the removed
// `react-dom/test-utils` and throw "React.act is not a function".
// This matters on machines where NODE_ENV=production is set globally.
if (process.env.VITEST && process.env.NODE_ENV === "production") {
  process.env.NODE_ENV = "test";
}

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    pure:
      mode === "production"
        ? ["console.log", "console.info", "console.debug", "console.trace"]
        : [],
  },
  server: {
    allowedHosts: ["localhost-vite.mobulum.xyz", "yotuna.mobulum.com", "yotuna.github.io"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
  },
}));
