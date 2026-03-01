import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForgotPasswordForm } from "./forgot-password-form";

const meta = {
  title: "Landing/ForgotPasswordForm",
  component: ForgotPasswordForm,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-[80vh] w-full bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const OnPage: Story = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="absolute bottom-0 left-1/2 h-[60vh] w-[80vw] max-w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-escobets-yellow/20 via-escobets-yellow/5 to-transparent blur-3xl" />
          <Story />
        </div>
      </div>
    ),
  ],
};
