import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { PromoBanner } from "@/components/landing/promo-banner";
import { TweetCarousel } from "@/components/landing/tweet-carousel";
import { Pricing } from "@/components/landing/pricing";
import { BookDemo } from "@/components/landing/book-demo";
import { NewDeals } from "@/components/landing/new-deals";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PromoBanner />
        <TweetCarousel />
        <Pricing />
        <BookDemo />
        <NewDeals />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
