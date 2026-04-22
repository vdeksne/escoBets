import type { Meta, StoryObj } from "@storybook/react-vite";
import { TweetCarousel } from "./tweet-carousel";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";

const meta = {
  title: "Landing/TweetCarousel",
  component: TweetCarousel,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  args: {
    apiTweets: [],
    xFeed: DEFAULT_SITE_SETTINGS.xFeed,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TweetCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
