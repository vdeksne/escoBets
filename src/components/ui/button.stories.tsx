import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Join Now",
    variant: "default",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Login",
    variant: "outline",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: "Learn more",
    variant: "ghost",
    size: "default",
  },
};

export const Link: Story = {
  args: {
    children: "View subscription",
    variant: "link",
    size: "default",
  },
};

export const Large: Story = {
  args: {
    children: "Get Started",
    variant: "outline",
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    children: "Subscribe",
    variant: "default",
    size: "sm",
  },
};
