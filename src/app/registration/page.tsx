import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegistrationHero from "@/components/RegistrationHero";
import RegistrationContentSection from "@/components/RegistrationContentSection";
import RegistrationCtaBanner from "@/components/RegistrationCtaBanner";

export const metadata: Metadata = {
  title: "Rider Registration & Code of Conduct | Zippy Equestrian Center",
  description:
    "Complete your rider registration with Zippy Equestrian Center. Review our Horse Rider's Code of Conduct, safety policies, and academy guidelines.",
  alternates: {
    canonical: "https://zippyec.com/registration",
  },
  openGraph: {
    title: "Rider Registration & Code of Conduct | Zippy Equestrian Center",
    description:
      "Complete your rider registration with Zippy Equestrian Center. Review our Horse Rider's Code of Conduct, safety policies, and academy guidelines.",
    url: "https://zippyec.com/registration",
    siteName: "Zippy Equestrian Center",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/assets/images/Programs/Webp/Hero.webp",
        width: 1200,
        height: 630,
        alt: "Zippy Equestrian Center Registration",
      },
    ],
  },
};

export default function RegistrationPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Global Fixed Header */}
      <Header theme="dark" bodyTheme="light" />

      {/* Hero Header & Banner (Matching Blog Page) */}
      <RegistrationHero />

      {/* Main 2-Column Content Section */}
      <RegistrationContentSection />

      {/* Call to Action Banner */}
      <RegistrationCtaBanner />

      {/* Gentle gradient transition to terracotta footer (Matching Blog Page) */}
      <div className="w-full h-32 md:h-44 bg-gradient-to-b from-[#FFFBF7] via-[#F5E6DC] to-[#DA7347]" />

      {/* Footer in Terracotta (Matching Blog Page) */}
      <Footer forceTerracotta={true} />
    </main>
  );
}
