import type { Meta, StoryObj } from "@storybook/react";
import { PromoBanner } from "./promo-banner";

const meta = {
  title: "Landing/PromoBanner",
  component: PromoBanner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PromoBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
