import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PromoBanner } from "@/components/landing/promo-banner";
import { StarfieldBackground } from "@/components/landing/starfield-background";
import { TweetCarousel } from "@/components/landing/tweet-carousel";
import { Pricing } from "@/components/landing/pricing";
import { NewDeals } from "@/components/landing/new-deals";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { getSiteSettings } from "@/lib/site-settings/get-site-settings";
import { getCachedXTimelineByHandle } from "@/lib/x/cached-x-timeline";

export default async function Home() {
  const site = await getSiteSettings();
  const xTimeline = await getCachedXTimelineByHandle(site.xFeed.handle);
  return (
    <>
      <StarfieldBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero hero={site.hero} />
          <PromoBanner imageSrc={site.promoBanner.imageSrc} />
          <TweetCarousel xFeed={site.xFeed} apiTweets={xTimeline} />
          <Pricing
            sectionSub={site.pricing.sectionSub}
            plans={{ monthly: site.pricing.monthly, annual: site.pricing.annual }}
          />
          <NewDeals deals={site.deals} />
          <FAQ intro={site.faq.intro} items={site.faq.items} />
        </main>
        <Footer />
      </div>
    </>
  );
}
