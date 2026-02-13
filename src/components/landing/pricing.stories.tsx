import type { Meta, StoryObj } from "@storybook/react";
import { Pricing } from "./pricing";

const meta = {
  title: "Landing/Pricing",
  component: Pricing,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pricing>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
