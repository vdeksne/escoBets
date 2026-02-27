import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta = {
  title: "Landing/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
