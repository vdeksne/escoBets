import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvoiceTable } from "./invoice-table";
import type { Invoice } from "@/types/subscription-account";

const meta = {
  title: "SubscriptionAccount/InvoiceTable",
  component: InvoiceTable,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#000000" }] },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InvoiceTable>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockInvoices: Invoice[] = [
  { id: "23456", billingDate: "23 Jan 2026", plan: "Basic Plan", amount: "$20", status: "paid" },
  { id: "56489", billingDate: "23 Feb 2026", plan: "Pro Plan", amount: "$20", status: "paid" },
  { id: "98380", billingDate: "23 Mar 2026", plan: "Growth Plan", amount: "$20", status: "paid" },
  { id: "83942", billingDate: "23 Jul 2026", plan: "Growth Plan", amount: "$20", status: "pending" },
];

export const Default: Story = {
  args: {
    invoices: mockInvoices,
    onDownload: () => console.log("Download clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
