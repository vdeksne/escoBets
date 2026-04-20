import type { ReactNode } from "react";

/**
 * EscoBets Terms and Conditions — legal copy (update governing law / dates as needed).
 */
export const TERMS_LAST_UPDATED_LABEL = "21 January 2026";

export function TermsAndConditionsBody({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-gotham text-sm leading-relaxed text-white/85">
        These Terms and Conditions (&quot;Terms&quot;) govern your use of{" "}
        <strong className="text-white">EscoBets</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a
        sports tipster and betting information website. By accessing or using this website, you agree to be
        bound by these Terms. If you do not agree, you must not use the website.
      </p>

      <Section title="1. Eligibility">
        <p>
          You must be at least 18 years old (or the legal gambling age in your jurisdiction) to use this
          website. By using the site, you confirm that you meet this requirement.
        </p>
      </Section>

      <Section title="2. Nature of Services">
        <p>All content provided on this website, including but not limited to:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Betting tips</li>
          <li>Predictions</li>
          <li>Analysis</li>
          <li>Statistics</li>
          <li>Opinions</li>
        </ul>
        <p className="mt-3">
          is for <strong className="text-white">informational and entertainment purposes only</strong>. We do{" "}
          <strong className="text-white">not</strong> provide gambling services, accept bets, or act as a
          bookmaker.
        </p>
      </Section>

      <Section title="3. No Guarantee of Results">
        <p>We make no guarantees regarding the accuracy, profitability, or outcome of any tips or predictions.</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Past performance does not guarantee future results</li>
          <li>Betting involves risk</li>
          <li>You may lose some or all of your money</li>
        </ul>
        <p className="mt-3">
          You acknowledge that you use our information <strong className="text-white">entirely at your own risk</strong>.
        </p>
      </Section>

      <Section title="4. Personal Responsibility">
        <p>You are solely responsible for:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Your betting decisions</li>
          <li>Any financial losses incurred</li>
          <li>Ensuring gambling is legal in your jurisdiction</li>
        </ul>
        <p className="mt-3">
          We are <strong className="text-white">not liable</strong> for any losses, damages, or consequences
          arising from the use of our content.
        </p>
      </Section>

      <Section title="5. Subscription & Payments (If Applicable)">
        <p>If we offer paid subscriptions:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>All payments are final unless stated otherwise</li>
          <li>No refunds are provided for losses incurred</li>
          <li>Access may be suspended or terminated for misuse or breach of these Terms</li>
          <li>We reserve the right to change pricing or subscription features at any time</li>
        </ul>
      </Section>

      <Section title="6. Intellectual Property">
        <p>
          All content on this website, including text, logos, graphics, and data, is the property of{" "}
          <strong className="text-white">EscoBets</strong> and is protected by intellectual property laws.
        </p>
        <p className="mt-2">You may not:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Copy, reproduce, or redistribute content</li>
          <li>Sell or republish our tips</li>
          <li>Use our content for commercial purposes</li>
        </ul>
        <p className="mt-3">without prior written permission.</p>
      </Section>

      <Section title="7. Prohibited Use">
        <p>You agree not to:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Use the website for unlawful purposes</li>
          <li>Attempt to hack, disrupt, or reverse-engineer the site</li>
          <li>Share or resell paid content</li>
          <li>Misrepresent our services or results</li>
        </ul>
        <p className="mt-3">We reserve the right to terminate access without notice for violations.</p>
      </Section>

      <Section title="8. Third-Party Links">
        <p>
          This website may contain links to third-party websites or bookmakers. We are{" "}
          <strong className="text-white">not responsible</strong> for:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Their content</li>
          <li>Their terms or policies</li>
          <li>Any losses or disputes arising from their services</li>
        </ul>
        <p className="mt-3">Use third-party services at your own discretion.</p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, <strong className="text-white">EscoBets</strong> shall not be
          liable for any:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Direct or indirect losses</li>
          <li>Financial losses</li>
          <li>Loss of profits or data</li>
        </ul>
        <p className="mt-3">arising from your use of the website or reliance on its content.</p>
      </Section>

      <Section title="10. Disclaimer">
        <p>Nothing on this website constitutes:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
          <li>Financial advice</li>
          <li>Investment advice</li>
          <li>Legal advice</li>
        </ul>
        <p className="mt-3">Always gamble responsibly.</p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>
          We reserve the right to update or modify these Terms at any time. Changes will be effective immediately
          upon posting on the website. Your continued use of the site constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="12. Governing Law">
        <p>
          These Terms shall be governed and interpreted in accordance with the laws of{" "}
          <strong className="text-white">England and Wales</strong>. If your entity or users are elsewhere, update
          this clause with advice from qualified counsel.
        </p>
      </Section>

      <Section title="13. Contact Information">
        <p>If you have any questions regarding these Terms, you may contact us at:</p>
        <ul className="mt-3 list-none space-y-2 pl-0">
          <li>
            <span className="text-white/60">Email:</span>{" "}
            <a href="mailto:support@escobets.com" className="text-escobets-yellow underline hover:no-underline">
              support@escobets.com
            </a>
          </li>
          <li>
            <span className="text-white/60">Website:</span>{" "}
            <a
              href="https://www.escobets.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-escobets-yellow underline hover:no-underline"
            >
              www.escobets.com
            </a>
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 border-t border-white/10 pt-5">
      <h2 className="font-gotham text-base font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-2 space-y-2 font-gotham text-sm leading-relaxed text-white/80">{children}</div>
    </section>
  );
}
