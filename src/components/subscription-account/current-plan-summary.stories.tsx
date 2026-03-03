import type { Meta, StoryObj } from "@storybook/react-vite";
import { CurrentPlanSummary } from "./current-plan-summary";
import type { PlanSummary } from "@/types/subscription-account";

const meta = {
  title: "SubscriptionAccount/CurrentPlanSummary",
  component: CurrentPlanSummary,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "Plan summary – replace with API data",
    },
  },
} satisfies Meta<typeof CurrentPlanSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockPlan: PlanSummary = {
  planName: "Growth Plan",
  billingCycle: "monthly",
  planCost: "$20",
};

export const Default: Story = {
  args: {
    data: mockPlan,
    onUpgrade: () => console.log("Upgrade clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const AnnualPlan: Story = {
  args: {
    data: {
      planName: "Pro Plan",
      billingCycle: "annual",
      planCost: "$16",
    },
    onUpgrade: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
