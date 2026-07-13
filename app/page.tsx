import { HeroSection } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { CategoriesSection } from "@/components/sections/categories";
import { BestsellersSection } from "@/components/sections/bestsellers";
import { EditorialSection } from "@/components/sections/editorial";
import { NewArrivalsSection } from "@/components/sections/new-arrivals";
import { FlyerSlider } from "@/components/sections/flyer-slider";
import { HorizontalBanner } from "@/components/sections/horizontal-banner";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { TikTokSection } from "@/components/sections/instagram";
import { NewsletterSection } from "@/components/sections/newsletter";
import { HomeFaqSection } from "@/components/sections/home-faq";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <HorizontalBanner />
      <CategoriesSection />
      <BestsellersSection />
      <EditorialSection />
      <NewArrivalsSection />
      <FlyerSlider />
      <TestimonialsSection />
      <TikTokSection />
      <HomeFaqSection />
      <NewsletterSection />
    </>
  );
}
