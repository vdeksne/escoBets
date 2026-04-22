import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsArticleView } from "./news-article-view";
import {
  MOCK_NEWS_ARTICLES,
  getSimilarArticles,
} from "@/lib/news/mock-data";

const fullArticle =
  MOCK_NEWS_ARTICLES.find((a) => a.id === "soccer-betting-guide-2026") ??
  MOCK_NEWS_ARTICLES[0];
const similarArticles = getSimilarArticles();

const meta = {
  title: "News/NewsArticleView",
  component: NewsArticleView,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NewsArticleView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullArticle: Story = {
  args: {
    article: fullArticle,
    similarArticles,
    viewSlug: fullArticle.slug ?? "soccer-betting-guide-2026",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};

export const BasicArticle: Story = {
  args: {
    article: MOCK_NEWS_ARTICLES[1],
    similarArticles: similarArticles.slice(0, 2),
    viewSlug: MOCK_NEWS_ARTICLES[1].slug ?? "story",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
