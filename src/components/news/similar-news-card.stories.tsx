import type { Meta, StoryObj } from "@storybook/react-vite";
import { SimilarNewsCard } from "./similar-news-card";
import { getSimilarArticles } from "@/lib/news/mock-data";

const similarArticles = getSimilarArticles();

const meta = {
  title: "News/SimilarNewsCard",
  component: SimilarNewsCard,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SimilarNewsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    article: similarArticles[0]!,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const AllThree: Story = {
  args: {
    article: similarArticles[0]!,
  },
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-6 bg-black p-8 md:grid-cols-3">
      {similarArticles.map((article) => (
        <SimilarNewsCard key={article.id} article={article} />
      ))}
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};
