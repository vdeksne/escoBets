import React from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/app/globals.css";

// Shim for Next.js / other code that expects process.env (avoids "process is not defined" in Storybook)
if (typeof globalThis.process === "undefined") {
  (globalThis as typeof globalThis & { process: NodeJS.Process }).process = {
    env: {},
  } as NodeJS.Process;
}

// So components compiled with classic JSX (React.createElement) have React in scope
if (typeof globalThis !== "undefined") {
  (globalThis as typeof globalThis & { React: typeof React }).React = React;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        dark: { name: "dark", value: "#000000" },
        light: { name: "light", value: "#ffffff" }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: "dark"
    }
  },

  decorators: [
    (Story) => (
      <div className="font-sans">
        <Story />
      </div>
    ),
  ],
};

export default preview;
