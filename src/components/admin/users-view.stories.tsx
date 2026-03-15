import type { Meta, StoryObj } from "@storybook/react-vite";
import { UsersView } from "./users-view";
import { MOCK_ADMIN_USERS } from "@/lib/users/mock-data";

const meta = {
  title: "Admin/UsersView",
  component: UsersView,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UsersView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullList: Story = {
  args: {
    users: MOCK_ADMIN_USERS,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};

export const SmallList: Story = {
  args: {
    users: MOCK_ADMIN_USERS.slice(0, 15),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
