import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ScrollCarousel from "@/components/ScrollCarousel";
import ActivitiesSection from "@/components/ActivitiesSection";
import ZippyFamilySection from "@/components/ZippyFamilySection";
import FaqSection from "@/components/FaqSection";
import TestimonialSection from "@/components/TestimonialSection";
import StoriesInstagramSection from "@/components/StoriesInstagramSection";
import Footer from "@/components/Footer";

import {
  getRiderStories,
  getWebsiteFaqs,
  getGalleryItems,
  getStats,
  getActivities,
} from "@/sanity/lib/fetch";

export default async function Home() {
  const [testimonials, faqs, galleryItems, stats, activities] = await Promise.all([
    getRiderStories([]),
    getWebsiteFaqs(),
    getGalleryItems(),
    getStats(),
    getActivities(),
  ]);

  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      <AboutSection initialStats={stats} />
      <ScrollCarousel />
      <TestimonialSection initialTestimonials={testimonials} />
      <ActivitiesSection initialActivities={activities} />
      <ZippyFamilySection />
      <FaqSection initialFaqs={faqs} />
      <StoriesInstagramSection initialGallery={galleryItems} />
      <Footer />
    </main>
  );
}
