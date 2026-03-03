import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsGrid } from "./news-grid";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";

const meta = {
  title: "News/NewsGrid",
  component: NewsGrid,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NewsGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articles: MOCK_NEWS_ARTICLES,
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page:", page),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl bg-black p-8">
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
    articles: MOCK_NEWS_ARTICLES,
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black px-4 py-8">
        <h1 className="mx-auto max-w-6xl font-gotham text-3xl font-bold uppercase tracking-tight text-white">
          News and predictions
        </h1>
        <div className="mx-auto mt-8 max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
};
