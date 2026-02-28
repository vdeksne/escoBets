import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./header";

const meta = {
  title: "Landing/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["landing", "withLogo"],
      description: "landing = main page (no logo on desktop). withLogo = inner pages (logo left, links to home)",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "landing" },
};

export const WithLogo: Story = {
  args: { variant: "withLogo" },
  parameters: {
    description: "Use on login and other inner pages. Logo on left links to home.",
  },
};
