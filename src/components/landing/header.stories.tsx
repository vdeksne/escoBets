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
    showDesktopBrand: {
      control: "boolean",
      description:
        "When false, desktop hides the small header logo but keeps the same column width (e.g. age gate).",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showDesktopBrand: true },
};

export const HideDesktopBrand: Story = {
  args: { showDesktopBrand: false },
  parameters: {
    description: "Age gate: no small logo in the bar; layout matches the default so it does not jump.",
  },
};
