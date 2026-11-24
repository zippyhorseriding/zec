"use client";

import { useState } from "react";

interface RegistrationContentSectionProps {
  /** Optional custom Google Form embed URL. Defaults to env var or sample viewform URL */
  googleFormUrl?: string;
}

const DEFAULT_FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSeEsmH34n6lXy_demo_form/viewform?embedded=true";

const CODE_OF_CONDUCT_POINTS = [
  {
    title: "Inherent Risk & Risk Acceptance",
    text: "I understand that riding at any standard has inherent risk and that all horses may react unpredictably on occasions. I may fall off and could be injured. I accept that risk.",
  },
  {
    title: "Safety Instructions",
    text: "I understand that instructions are given for my safety and agree to follow instructions given to me by staff and instructions of the riding academy.",
  },
  {
    title: "Helmet & Protective Equipment",
    text: "I reserve that wearing an appropriate riding helmet and body protector may reduce the severity of injury should an accident happen and agree that I will always wear a riding helmet while riding, leading and grooming at the riding academy.",
  },
  {
    title: "Body Protector Guidelines",
    text: "I understand it is my choice whether or not I wear a body protector if I am an adult over 18. I understand that if I am riding in the cross-country fields I must wear a body protector. Young people, under 18, must wear body protectors at all times while riding.",
  },
  {
    title: "Instructor Information & Medical Disclosure",
    text: "I understand that my riding instructor will make decisions based on information I give them and agree to always be honest and volunteer information about:",
    subpoints: [
      "My abilities and riding experience",
      "Any previous riding accidents",
      "Any medical condition(s) that may affect my ability to ride",
    ],
  },
  {
    title: "Supervision of Children",
    text: "I understand that children are at particular risk around horses and agree that I will keep children that I am responsible for under close supervision when the riding academy is not instructing them.",
  },
  {
    title: "Academy Discretion & Operational Safety",
    text: "I understand that the riding academy may refuse my request to ride for safety and operational reasons.",
  },
  {
    title: "Competitions & Enhanced Risk",
    text: "I understand that competing carries enhanced risk over and above general riding and agree that if I choose to participate in any competition or event, it is up to me to ensure that I have the experience and ability to undertake the ridden tasks including any jumps which form part of it. If I am in any doubt, I will use my judgment and experience and not enter.",
  },
];

export default function RegistrationContentSection({
  googleFormUrl = DEFAULT_FORM_URL,
}: RegistrationContentSectionProps) {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Derive direct link from embed URL
  const directFormUrl = googleFormUrl.replace("embedded=true", "").replace(/\?$/, "");

  return (
    <section className="w-full bg-[#FFFBF7] py-14 md:py-20 px-6 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Embedded Google Form (Blog Card Style) */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white rounded-2xl overflow-hidden border border-[#DA7347]/15 shadow-sm hover:shadow-md transition-shadow duration-300">
              
              {/* Form Card Header (Terracotta Accent matching Blog page) */}
              <div className="bg-[#DA7347] text-white px-6 py-4 md:px-8 md:py-5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-white/80 block">
                    ONLINE ENROLLMENT
                  </span>
                  <h2 className="text-lg md:text-xl font-medium tracking-tight text-white font-heading">
                    Registration Form
                  </h2>
                </div>

                <a
                  href={directFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3.5 py-1.5 rounded-md inline-flex items-center gap-1.5 transition-colors shrink-0"
                  title="Open form in new tab"
                >
                  <span>Full Screen</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>

              {/* Form iFrame Container */}
              <div className="relative w-full min-h-[750px] md:min-h-[920px] bg-white">
                {!isIframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-[#85431E]/70 bg-white">
                    <div className="w-8 h-8 border-2 border-[#DA7347] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs md:text-sm font-medium">Loading Registration Form...</p>
                  </div>
                )}

                <iframe
                  src={googleFormUrl}
                  onLoad={() => setIsIframeLoaded(true)}
                  className="w-full h-[780px] md:h-[950px] border-0"
                  title="Zippy Equestrian Center Registration Form"
                >
                  Loading form…
                </iframe>
              </div>

              {/* Card Footer Helper */}
              <div className="px-6 py-3.5 bg-[#FFFBF2] border-t border-[#DA7347]/15 flex items-center justify-between text-xs text-[#5C381E]/80">
                <span>Prefer a wider view?</span>
                <a
                  href={directFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#DA7347] font-medium hover:underline inline-flex items-center gap-1"
                >
                  Open in separate tab →
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Code of Conduct (Blog Article Typography) */}
          <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DA7347]/15 shadow-sm">
              
              {/* Category & Title */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#85431E] font-medium mb-3">
                <span>Safety Commitments</span>
                <span>•</span>
                <span>Academy Rules</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-medium text-[#242A59] tracking-tight mb-3 font-heading leading-snug">
                The Horse Rider&apos;s Code of Conduct
              </h2>

              <p className="text-sm text-[#5C381E]/80 font-light leading-relaxed mb-6">
                Equestrian discipline is founded upon mutual trust between horse and rider. Every student and guardian is required to read, acknowledge, and adhere to our safety standards.
              </p>

              {/* Points List */}
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2 no-scrollbar">
                {CODE_OF_CONDUCT_POINTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FFFBF7] border border-[#DA7347]/10 hover:border-[#DA7347]/25 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#DA7347] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#242A59] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[#4A2810]/85 font-light leading-relaxed">
                          {item.text}
                        </p>

                        {item.subpoints && (
                          <ul className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-[#DA7347]/30">
                            {item.subpoints.map((sub, sIdx) => (
                              <li
                                key={sIdx}
                                className="text-xs text-[#5C381E]/90 flex items-center gap-1.5 font-light"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#DA7347] shrink-0" />
                                <span>{sub}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Refund Policy Card (Matching Blog's contactInfo card) */}
              <div className="mt-6 p-5 sm:p-6 rounded-xl bg-[#FFFBF2] border border-[#DA7347]/20 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#85431E]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <h3 className="text-sm font-semibold tracking-wide uppercase">
                    Refund &amp; Transfer Policy
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-[#5C381E]/90 font-light leading-relaxed pt-1">
                  <strong className="text-[#DA7347] font-semibold">Note:</strong> Amount once paid shall not be refunded but could be transferred to any other person with an additional cost of ₹2,500.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
