import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountView } from "./account-view";
import { MOCK_PROFILE } from "@/lib/account/mock-data";

const meta = {
  title: "Account/AccountView",
  component: AccountView,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AccountView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: MOCK_PROFILE,
    onSavePassword: async (data) => {
      console.log("Save password:", data);
    },
    onSaveProfile: (data) => console.log("Save profile:", data),
    onUploadAvatar: async (file) => console.log("Upload avatar:", file.name),
    onDeleteAvatar: async () => console.log("Delete avatar"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const FullPage: Story = {
  parameters: {
    layout: "fullscreen",
  },
  args: {
    profile: MOCK_PROFILE,
    onSavePassword: async () => {},
    onSaveProfile: () => {},
    onUploadAvatar: async () => {},
    onDeleteAvatar: async () => {},
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <Story />
        </div>
      </div>
    ),
  ],
};
