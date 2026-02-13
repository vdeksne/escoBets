import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./hero";

const meta = {
  title: "Landing/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
