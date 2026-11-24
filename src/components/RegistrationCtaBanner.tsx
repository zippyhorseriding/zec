"use client";

import Link from "next/link";

export default function RegistrationCtaBanner() {
  return (
    <section className="w-full bg-[#FFFBF7] pb-14 md:pb-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#DA7347]/15 p-8 md:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Heading & Information */}
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs uppercase tracking-wider text-[#85431E] font-medium block mb-2">
              NEED HELP ENROLLING?
            </span>
            <h2 className="text-2xl md:text-4xl font-medium text-[#242A59] tracking-tight mb-3 font-heading leading-tight">
              Book a Ride or Speak With Our Team
            </h2>
            <p className="text-sm md:text-base text-[#5C381E]/80 font-light leading-relaxed">
              Have questions about which riding program suits you, or need help completing registration? Our trainers and marshals are available 7 days a week.
            </p>
          </div>

          {/* Right Column: Blog-style Call & WhatsApp Actions */}
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto shrink-0 justify-center">
            
            {/* Call Action Button */}
            <a
              href="tel:+919742371317"
              className="bg-[#DA7347] text-white px-7 py-3.5 rounded-md font-medium text-sm inline-flex items-center justify-center gap-2.5 hover:bg-[#C5653C] transition-all shadow-sm group"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call +91 9742371317</span>
            </a>

            {/* WhatsApp Action Button */}
            <a
              href="https://wa.me/919882988267?text=Hi%20ZEC%2C%20I%20have%20an%20enquiry%20regarding%20Rider%20Registration."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFFBF2] text-[#85431E] border border-[#DA7347]/30 hover:border-[#DA7347] px-7 py-3.5 rounded-md font-medium text-sm inline-flex items-center justify-center gap-2.5 hover:bg-white transition-all shadow-sm group"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25D366"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}
