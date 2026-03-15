import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgeGate } from "./age-gate";

const meta = {
  title: "Landing/AgeGate",
  component: AgeGate,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AgeGate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onVerified: () => alert("Age verified! (In app, this grants access)"),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
