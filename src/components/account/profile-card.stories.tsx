import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileCard } from "./profile-card";
import { MOCK_PROFILE } from "@/lib/account/mock-data";

const meta = {
  title: "Account/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: MOCK_PROFILE,
    onEdit: () => console.log("Edit"),
    onShare: () => console.log("Share"),
    onAddSocial: () => console.log("Add social"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
