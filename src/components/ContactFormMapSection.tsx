"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/ui/Reveal";

const INTEREST_OPTIONS = [
  "Riding Programs",
  "Children's camps",
  "Horse boarding",
  "Buy a horse",
  "Book a venue",
  "Consultation",
  "Photoshoot",
  "Horse Rent / Lease",
  "Franchise"
];
import { COUNTRY_CODES } from "@/data/countryCodes";

export default function ContactFormMapSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Riding Programs");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Hidden anti-spam field. Real visitors never see or fill this.
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const programDropdownRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const program = searchParams?.get("program");
    const interest = searchParams?.get("interest");
    const msg = searchParams?.get("message");
    
    if (interest && INTEREST_OPTIONS.includes(interest)) {
      setSelectedOption(interest);
    } else if (program) {
      setSelectedOption("Riding Programs");
    }

    const finalMessage = msg || program;
    if (finalMessage) {
      setMessage(`${finalMessage}`);
    }
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (programDropdownRef.current && !programDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 6) {
      setSubmitError("Please enter a valid phone number.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "contact",
          name,
          phone,
          countryCode: selectedCountry.code,
          interest: selectedOption,
          message,
          website,
          source: typeof window !== "undefined" ? window.location.pathname : "/contact",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Could not send your enquiry.");
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Could not send your enquiry. Please try again or call us.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setMessage("");
    setSelectedOption("Riding Programs");
    setWebsite("");
    setSubmitError("");
    setIsSubmitted(false);
  };

  return (
    <section className="w-full bg-transparent pt-16 md:pt-24 pb-4 md:pb-6 max-md:pt-12">
      {/* Aligned with Header container */}
      <div className="container mx-auto px-6 md:px-12 roun max-sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[42fr_58fr] gap-12 lg:gap-16 max-md:gap-8">

          {/* LEFT: Form + Location text */}
          <div className="flex flex-col max-md:gap-8">

            {/* Form */}
            <Reveal>
              <div>
                <h1 className="text-[#85431E] text-4xl md:text-5xl font-light leading-tight mb-10 max-sm:text-3xl max-md:mb-6">
                  Time to take action
                </h1>

                <div className="p-6 md:p-8 max-sm:p-5 rounded-sm" style={{ backgroundColor: "#F2EBD9" }}>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center text-center py-2">
                      <div className="w-14 h-14 rounded-full bg-[#DA7347]/15 text-[#DA7347] flex items-center justify-center mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-xl md:text-2xl text-[#85431E] font-light mb-2">
                        Enquiry received
                      </h2>
                      <p className="text-sm text-[#85431E]/80 font-light leading-relaxed max-w-sm mb-6">
                        Thank you{name ? `, ${name}` : ""}. Our team has your details and will get back to you shortly.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="flex-1 px-4 py-2.5 text-[11px] uppercase tracking-wider text-white rounded-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: "#85431E" }}
                        >
                          Send another
                        </button>
                        <a
                          href="https://wa.me/919882988267"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2.5 text-[11px] uppercase tracking-wider text-center text-[#DA7347] border border-[#DA7347] rounded-sm hover:bg-[#DA7347] hover:text-white transition-colors"
                        >
                          WhatsApp us
                        </a>
                      </div>
                    </div>
                  ) : (
                  <form onSubmit={handleSubmit} noValidate>
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="text-[#85431E]/70 text-xs  uppercase mb-2 block font-light">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] outline-none border-0 rounded-sm focus:ring-1 focus:ring-[#DA7347]/30 max-md:py-3.5"
                    />
                  </div>

                  <div className="mb-5 relative" ref={countryDropdownRef}>
                    <label className="text-[#85431E]/70 text-xs  uppercase mb-2 block font-light">
                      Contact Number
                    </label>
                    <div className="flex bg-[#FFFCF4] rounded-sm focus-within:ring-1 focus-within:ring-[#DA7347]/30">
                      <div
                        className="flex items-center gap-2 px-3 py-3 cursor-pointer border-r border-[#DA7347]/20 max-md:py-3.5"
                        onClick={() => {
                          setIsCountryDropdownOpen(!isCountryDropdownOpen);
                          if (!isCountryDropdownOpen) setIsDropdownOpen(false);
                        }}
                      >
                        <span className="text-sm text-[#1a1a1a]">{selectedCountry.code}</span>
                        <svg width="10" height="6" viewBox="0 0 11 7" fill="none" className={`transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`}>
                          <path d="M1 1L5.5 5.5L10 1" stroke="#DA7347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-3 text-sm text-[#1a1a1a] outline-none border-0 max-md:py-3.5"
                        placeholder="Phone number"
                      />
                    </div>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 z-50 w-64 shadow-xl rounded-sm overflow-hidden bg-[#FFF8E5] border border-black/5 max-h-60 overflow-y-auto">
                        <div className="flex flex-col">
                          {COUNTRY_CODES.map((country, i) => (
                            <div
                              key={i}
                              className="px-4 py-3 flex items-center gap-3 text-sm text-[#85431E] cursor-pointer hover:bg-black/10 transition-colors"
                              onClick={() => {
                                setSelectedCountry(country);
                                setIsCountryDropdownOpen(false);
                              }}
                            >
                              <span className="text-lg">{country.flag}</span>
                              <span className="font-medium w-10">{country.code}</span>
                              <span className="truncate">{country.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-7 relative" ref={programDropdownRef}>
                    <label className="text-[#85431E]/70 text-xs  uppercase mb-2 block font-light">
                      I&apos;m interested in:
                    </label>
                    <div
                      className="w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#DA7347] flex justify-between items-center cursor-pointer border-0 outline-none rounded-sm max-md:py-3.5"
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        if (!isDropdownOpen) setIsCountryDropdownOpen(false);
                      }}
                    >
                      <span>{selectedOption}</span>
                      <svg width="11" height="7" viewBox="0 0 11 7" fill="none" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        <path d="M1 1L5.5 5.5L10 1" stroke="#DA7347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 shadow-xl rounded-sm overflow-hidden bg-[#F2EBD9]/80 backdrop-blur-md border border-black/5">
                        <div className="flex flex-col">
                          {INTEREST_OPTIONS.map((opt, i) => (
                            <div
                              key={i}
                              className="px-4 py-3 text-sm text-[#85431E] cursor-pointer hover:bg-black/5"
                              style={{ borderBottom: i < INTEREST_OPTIONS.length - 1 ? "1px solid #DA7347" : "none" }}
                              onClick={() => {
                                setSelectedOption(opt);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-7">
                    <label className="text-[#85431E]/70 text-xs uppercase mb-2 block font-light">
                      Any message/notes:
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write here"
                      className="w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] outline-none border-0 rounded-sm focus:ring-1 focus:ring-[#DA7347]/30 resize-none placeholder:text-[#1a1a1a]/35"
                    />
                  </div>

                  {submitError && (
                    <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <div className="flex justify-end max-md:justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-3 text-white text-[11px]  uppercase px-6 py-3 rounded-sm hover:opacity-90 transition-opacity max-md:w-full max-md:justify-center max-md:py-3.5 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#DA7347" }}
                    >
                      {isSubmitting ? "Sending..." : "Send Enquiry"}
                      {isSubmitting ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                  </form>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Location text — vertically centred in the left column (equal space to form above and directory below) */}
            <Reveal delay={0.2} className="md:my-auto md:py-10">
              <div>
                <p className="font-gt-ultra-fine text-[#85431E] text-[24px] md:text-[28px] leading-[1.3] max-sm:text-[22px]">
                  We&apos;re in JP Nagar, 7th Phase<br />
                  In the heart of South Bangalore.<br />
                  <span className="text-[#DA7347]">Easy to find, easy to get to.</span>
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Info + WhatsApp + Map */}
          <Reveal delay={0.4}>
            <div className="flex flex-col gap-6 md:pt-12 md:pl-8 lg:pl-12">
              <div>
                <p className="text-[#85431E] text-[14px] md:pb-4 font-light max-w-[28rem]">
                  Call us or find us when you are ready or when you feel like you need to know more.
                  We&apos;re ready to assist you to experience the fun of being around horses.
                </p>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/919882988267"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 w-full max-w-[420px] text-white text-sm uppercase px-5 py-2 rounded-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#DA7347" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    <span>Text us now</span>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              {/* Interactive Google Map Embed */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="w-full h-[400px] sm:h-[460px] md:h-[480px] lg:h-[500px] rounded-sm overflow-hidden border border-[#85431E]/20 shadow-sm bg-[#F2EBD9]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.1872075629976!2d77.57611261430367!3d12.895680720030047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae401309c2b543%3A0xfb9d4ad860f22c8a!2sZippy%20Equestrian%20Center!5e0!3m2!1sen!2sin!4v1642764924543!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Zippy Equestrian Center Google Map Location"
                    className="w-full h-full block"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#85431E]/75 px-0.5">
                  <span>102/2, Puttenahalli, JP Nagar 7th Phase, Bengaluru</span>
                  <a
                    href="https://maps.google.com/?q=Zippy+Equestrian+Center"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DA7347] hover:underline flex items-center gap-1 font-medium shrink-0"
                  >
                    <span>Open in Google Maps</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
