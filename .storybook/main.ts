// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    return {
      ...config,
      base: "/",
      define: {
        ...config.define,
        "process.env": "{}",
      },
      esbuild: {
        ...config.esbuild,
        jsx: "automatic",
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@": path.resolve(__dirname, "../src"),
          "next/link": path.resolve(__dirname, "next-link-stub.tsx"),
          "next/image": path.resolve(__dirname, "next-image-stub.tsx"),
          "next/navigation": path.resolve(__dirname, "next-navigation-stub.ts"),
        },
      },
      // Prevent Vite from pre-bundling next/image so our alias is used (avoids "process is not defined")
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: [...(config.optimizeDeps?.exclude ?? []), "next", "next/image", "next/navigation"],
        include: [...(config.optimizeDeps?.include ?? []), "react", "react-dom"],
      },
    };
  },
};

export default config;
