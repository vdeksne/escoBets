import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileUpdateForm } from "./profile-update-form";
import { MOCK_PROFILE } from "@/lib/account/mock-data";

const meta = {
  title: "Account/ProfileUpdateForm",
  component: ProfileUpdateForm,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileUpdateForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: MOCK_PROFILE,
    onSubmit: (data) => console.log("Submit:", data),
    onUploadAvatar: () => console.log("Upload"),
    onDeleteAvatar: () => console.log("Delete"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
