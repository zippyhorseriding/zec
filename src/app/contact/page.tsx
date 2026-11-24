import Header from "@/components/Header";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import ContactFormMapSection from "@/components/ContactFormMapSection";
import ContactDirectorySection from "@/components/ContactDirectorySection";
import ContactInstagramSection from "@/components/ContactInstagramSection";
import ContactRegistrationBox from "@/components/ContactRegistrationBox";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-[#FFF8E5]">
      <Header theme="light" />
      <div className="pt-36">
        <Suspense fallback={<div>Loading form...</div>}>
          <ContactFormMapSection />
        </Suspense>
        <ContactDirectorySection />
        <ContactInstagramSection bgColor="#FFF8E5" />
        <ContactRegistrationBox />
      </div>
      <Footer />
    </main>
  );
}
