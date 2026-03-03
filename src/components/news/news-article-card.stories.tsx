import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsArticleCard } from "./news-article-card";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";

const meta = {
  title: "News/NewsArticleCard",
  component: NewsArticleCard,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["large", "medium", "small"],
    },
  },
} satisfies Meta<typeof NewsArticleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: {
    article: MOCK_NEWS_ARTICLES[0],
    size: "large",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const Medium: Story = {
  args: {
    article: MOCK_NEWS_ARTICLES[1],
    size: "medium",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const Small: Story = {
  args: {
    article: MOCK_NEWS_ARTICLES[2],
    size: "small",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const Featured: Story = {
  args: {
    article: MOCK_NEWS_ARTICLES[0],
    featured: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
