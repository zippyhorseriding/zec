"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function RegistrationHero() {
  return (
    <section
      id="page-hero-section"
      className="relative w-full h-[65vh] min-h-[480px] max-h-[700px] flex items-end overflow-hidden bg-[#1A1F3D] pb-14 md:pb-20"
    >
      {/* Background Image */}
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(max-width: 767px)"
          srcSet="/assets/images/Programs/Webp/Hero.webp"
        />
        <Image
          src="/assets/images/Programs/Webp/Hero.webp"
          alt="Zippy Equestrian Center Stables and Arena"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </picture>

      {/* Branded Gradient Overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(26, 31, 61, 0.95) 0%, rgba(26, 31, 61, 0.6) 45%, rgba(20, 24, 48, 0.75) 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 w-full">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-xs md:text-sm text-[#D9734A] font-gt-ultra uppercase tracking-widest font-semibold mb-3">
              Rider Enrollment &amp; Safety Commitment
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal text-white leading-tight mb-4">
              Registration
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-[#F2EBD9]/90 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              Welcome to Zippy Equestrian Center. Please fill out the registration form below and review the Horse Rider&apos;s Code of Conduct to ensure a safe, structured, and rewarding experience in the saddle.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
