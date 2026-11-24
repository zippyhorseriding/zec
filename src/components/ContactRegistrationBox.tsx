"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function ContactRegistrationBox() {
  return (
    <section className="w-full bg-[#FFF8E5] pb-16 md:pb-20 px-6 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <div className="relative bg-[#1A1F3D] rounded-2xl overflow-hidden shadow-lg border border-[#242A59]/60 p-8 md:p-12">
            {/* Subtle radial glow */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,115,74,0.22),transparent_65%)] pointer-events-none"
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
              {/* Text content */}
              <div className="max-w-xl text-center lg:text-left">
                <span className="text-[#D9734A] text-xs font-gt-ultra uppercase tracking-widest font-semibold block mb-2">
                  Student Rider Enrollment
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white leading-snug mb-3">
                  Ready to Start Riding? Complete Your Registration
                </h3>
                <p className="text-white/75 text-xs md:text-sm leading-relaxed font-light">
                  Fill out our online student registration form and review the Horse Rider&apos;s Code of Conduct before your first session in the arena.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto justify-center">
                <Link
                  href="/registration"
                  className="bg-[#DA7347] hover:bg-[#C2613D] text-white px-8 py-4 rounded-md font-medium text-sm md:text-base inline-flex items-center justify-center gap-3 transition-all duration-300 shadow-md group w-full sm:w-auto"
                >
                  <span>Registration Form</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
