import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaymentMethod } from "./payment-method";
import type { PaymentMethod as PaymentMethodType } from "@/types/subscription-account";

const meta = {
  title: "SubscriptionAccount/PaymentMethod",
  component: PaymentMethod,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentMethod>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockPayment: PaymentMethodType = {
  brand: "Master Card",
  last4: "4002",
  expiryMonth: "20",
  expiryYear: "2024",
  billingEmail: "billing@acme.corp",
};

export const Default: Story = {
  args: {
    data: mockPayment,
    onChange: () => console.log("Change clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
