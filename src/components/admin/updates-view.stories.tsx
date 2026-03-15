import type { Meta, StoryObj } from "@storybook/react-vite";
import { UpdatesView } from "./updates-view";
import {
  MOCK_NEWS_POSTS,
  MOCK_UPDATES_STATS,
} from "@/lib/updates/mock-data";

const meta = {
  title: "Admin/UpdatesView",
  component: UpdatesView,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UpdatesView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullDashboard: Story = {
  args: {
    posts: MOCK_NEWS_POSTS,
    stats: MOCK_UPDATES_STATS,
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
    posts: MOCK_NEWS_POSTS.slice(0, 20),
    stats: {
      totalPosts: 20,
      newPosts: 2,
      livePosts: 15,
      totalViews: "50K",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
