"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegistrationHero() {
  return (
    <>
      {/* Top Terracotta Header Section (Matching Blog Page) */}
      <section className="w-full bg-[#DA7347] text-white pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Category Tag */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-white/80 text-xs md:text-sm tracking-wider uppercase font-medium mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href="/programs" className="hover:text-white transition-colors">
              Riding Programs
            </Link>
            <span>•</span>
            <span className="text-white font-semibold">Student Registration</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white font-heading leading-[1.12]">
            Registration &amp; Rider&apos;s Code of Conduct
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/90 font-light max-w-2xl leading-relaxed">
            Welcome to Zippy Equestrian Center. Please complete your registration details and review our horse rider safety commitments before your first ride in the arena.
          </p>
        </div>
      </section>

      {/* Large Banner Image with Quote Overlay (Matching Blog Page Hero) */}
      <section
        id="page-hero-section"
        className="relative w-full h-[320px] md:h-[440px] lg:h-[500px] overflow-hidden"
      >
        <Image
          src="/assets/images/Programs/Webp/Hero.webp"
          alt="Zippy Equestrian Center Arena & Stables"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Ambient Darkened Overlay */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />

        {/* Center Quote Overlay with Horse Crest (Matching Blog Post Overlay) */}
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-2xl px-6 py-4 rounded-xl backdrop-blur-[2px] bg-black/25 border border-white/10 shadow-lg">
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-light tracking-wide italic font-optima-medium drop-shadow-md">
              &ldquo;Safety, horsemanship, and mutual trust in every ride.&rdquo;
            </p>

            <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 opacity-90 drop-shadow">
              <Image
                src="/assets/images/zippyfooter1.svg"
                alt="Zippy Equestrian Crest"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
