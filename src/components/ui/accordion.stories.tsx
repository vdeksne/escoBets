import type { Meta } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-black p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;

export const Default = {
  render: () => (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem value="1" className="rounded-lg border border-white/10 bg-[#262626] px-4">
        <AccordionTrigger>What betting markets do you cover?</AccordionTrigger>
        <AccordionContent>
          We cover major football leagues, international tournaments, and select
          other sports.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="2" className="rounded-lg border border-white/10 bg-[#262626] px-4">
        <AccordionTrigger>How often are tips posted?</AccordionTrigger>
        <AccordionContent>
          High-confidence tips are posted daily in our private Telegram channel.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="3" className="rounded-lg border border-white/10 bg-[#262626] px-4">
        <AccordionTrigger>Can I pause or cancel?</AccordionTrigger>
        <AccordionContent>
          Yes. You can pause or cancel anytime from your account.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
