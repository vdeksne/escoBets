import type { Meta, StoryObj } from "@storybook/react-vite";
import { SubscriptionAccountView } from "./subscription-account-view";
import { MOCK_SUBSCRIPTION_ACCOUNT_DATA } from "@/lib/subscription-account/mock-data";

const meta = {
  title: "SubscriptionAccount/SubscriptionAccountView",
  component: SubscriptionAccountView,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "Replace with API data when backend is ready",
    },
  },
} satisfies Meta<typeof SubscriptionAccountView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: MOCK_SUBSCRIPTION_ACCOUNT_DATA,
    onUpgrade: () => console.log("Upgrade"),
    onChangePayment: () => console.log("Change payment"),
    onDownloadInvoice: () => console.log("Download"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl bg-black p-8">
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
    data: MOCK_SUBSCRIPTION_ACCOUNT_DATA,
    onUpgrade: () => {},
    onChangePayment: () => {},
    onDownloadInvoice: () => {},
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
};
