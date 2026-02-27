import type { Meta, StoryObj } from "@storybook/react-vite";
import { TweetCarousel } from "./tweet-carousel";

const meta = {
  title: "Landing/TweetCarousel",
  component: TweetCarousel,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TweetCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
