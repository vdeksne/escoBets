import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsPostEditor } from "./news-post-editor";

const meta = {
  title: "Admin/NewsPostEditor",
  component: NewsPostEditor,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NewsPostEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NewPost: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};

export const EditPost: Story = {
  args: {
    postId: "post-1",
    initialTitle: "Soccer Betting Tips for Champions League",
    initialCategory: "Soccer",
    initialContent: `
      <h1>Heading1</h1>
      <h2>Heading2</h2>
      <h3>Heading3</h3>
      <h1>Heading1</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <ul>
        <li>unordered list item</li>
        <li>unordered list item</li>
      </ul>
      <ol>
        <li>ordered list item</li>
        <li>ordered list item</li>
      </ol>
      <blockquote>Nothing is impossible, the word itself says I'm possible!</blockquote>
    `,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
