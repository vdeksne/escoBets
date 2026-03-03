import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChangePassword } from "./change-password";

const meta = {
  title: "Account/ChangePassword",
  component: ChangePassword,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChangePassword>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSave: (data) => console.log("Save password:", data),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
