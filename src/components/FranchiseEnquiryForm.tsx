"use client";

import React, { useState, useRef, useEffect } from "react";
import { COUNTRY_CODES } from "@/data/countryCodes";

const LAND_STATUS_OPTIONS = [
  "Already own land (2–5 acres)",
  "Already own land (5+ acres)",
  "In process of purchasing / leasing land",
  "Looking for guidance on site selection",
  "Exploring preliminary feasibility",
];

export default function FranchiseEnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Default to +91 India
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [city, setCity] = useState("");
  const [landStatus, setLandStatus] = useState(LAND_STATUS_OPTIONS[0]);
  const [isLandDropdownOpen, setIsLandDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Hidden anti-spam field. Real visitors never see or fill this.
  const [website, setWebsite] = useState("");

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const landDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (landDropdownRef.current && !landDropdownRef.current.contains(event.target as Node)) {
        setIsLandDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (phone.trim().length < 6) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!city.trim()) newErrors.city = "Please enter your proposed city / location";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "franchise",
          name,
          email,
          phone,
          countryCode: selectedCountry.code,
          city,
          landStatus,
          message,
          website,
          source: typeof window !== "undefined" ? window.location.pathname : "/beyond",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Could not submit your enquiry.");
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Could not submit your enquiry. Please try again or call us.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setMessage("");
    setWebsite("");
    setLandStatus(LAND_STATUS_OPTIONS[0]);
    setErrors({});
    setSubmitError("");
    setIsSubmitted(false);
  };

  return (
    <div
      id="enquire-details"
      className="scroll-mt-28 bg-[#F2EBD9] p-6 sm:p-8 md:p-9 rounded-2xl shadow-xl border border-[#85431E]/15 text-[#85431E] transition-all"
    >
      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#DA7347]/15 text-[#DA7347] mb-3">
          Franchise Opportunities
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-medium text-[#85431E] leading-tight">
          Enquire Details
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#85431E]/80 font-light leading-relaxed">
          Submit your enquiry below to receive our franchise prospectus, unit economics, and operational blueprints.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-[#FFFCF4] p-6 sm:p-8 rounded-xl border border-[#DA7347]/30 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#DA7347]/15 text-[#DA7347] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-[#85431E] mb-2 font-heading">
            Enquiry Received!
          </h3>
          <p className="text-sm text-[#85431E]/85 font-light leading-relaxed max-w-sm mb-6">
            Thank you, <strong className="font-semibold text-[#85431E]">{name}</strong>. Our franchise management team has received your details and will get in touch with you shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded bg-[#85431E] text-white hover:bg-[#6e3718] transition-colors"
            >
              Submit Another
            </button>
            <a
              href="tel:+919901794713"
              className="flex-1 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded border border-[#DA7347] text-[#DA7347] hover:bg-[#DA7347] hover:text-white transition-colors text-center"
            >
              Call Us Directly
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="franchise-website">Website</label>
            <input
              id="franchise-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          {/* Full Name */}
          <div>
            <label className="text-[#85431E]/80 text-xs uppercase mb-1.5 block font-medium tracking-wide">
              Your Name <span className="text-[#DA7347]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Rahul Sharma"
              className={`w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] rounded border transition-all outline-none ${
                errors.name
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#85431E]/15 focus:border-[#DA7347] focus:ring-1 focus:ring-[#DA7347]/30"
              }`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[#85431E]/80 text-xs uppercase mb-1.5 block font-medium tracking-wide">
              Email Address <span className="text-[#DA7347]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="rahul@example.com"
              className={`w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] rounded border transition-all outline-none ${
                errors.email
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#85431E]/15 focus:border-[#DA7347] focus:ring-1 focus:ring-[#DA7347]/30"
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Contact Number with Country Code */}
          <div className="relative" ref={countryDropdownRef}>
            <label className="text-[#85431E]/80 text-xs uppercase mb-1.5 block font-medium tracking-wide">
              Contact Number <span className="text-[#DA7347]">*</span>
            </label>
            <div
              className={`flex bg-[#FFFCF4] rounded border transition-all ${
                errors.phone
                  ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                  : "border-[#85431E]/15 focus-within:border-[#DA7347] focus-within:ring-1 focus-within:ring-[#DA7347]/30"
              }`}
            >
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-2 px-3 py-3 border-r border-[#85431E]/15 hover:bg-black/5 transition-colors shrink-0"
                aria-label="Select country code"
              >
                <span className="text-base">{selectedCountry.flag}</span>
                <span className="text-sm font-medium text-[#1a1a1a]">{selectedCountry.code}</span>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 11 7"
                  fill="none"
                  className={`transition-transform duration-200 ${isCountryDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1L5.5 5.5L10 1" stroke="#DA7347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="98765 43210"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-[#1a1a1a] outline-none"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}

            {/* Country Dropdown */}
            {isCountryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 w-72 shadow-2xl rounded-lg overflow-hidden bg-[#FFF8E5] border border-[#85431E]/20 max-h-60 overflow-y-auto">
                <div className="flex flex-col">
                  {COUNTRY_CODES.map((country, i) => (
                    <div
                      key={i}
                      className="px-4 py-2.5 flex items-center gap-3 text-sm text-[#85431E] cursor-pointer hover:bg-[#DA7347]/10 transition-colors"
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsCountryDropdownOpen(false);
                      }}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-semibold w-12 text-[#DA7347]">{country.code}</span>
                      <span className="truncate text-xs font-light">{country.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* City / Proposed Location */}
          <div>
            <label className="text-[#85431E]/80 text-xs uppercase mb-1.5 block font-medium tracking-wide">
              City / Proposed Location <span className="text-[#DA7347]">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
              }}
              placeholder="e.g. Hyderabad, Pune, Coimbatore"
              className={`w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] rounded border transition-all outline-none ${
                errors.city
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-[#85431E]/15 focus:border-[#DA7347] focus:ring-1 focus:ring-[#DA7347]/30"
              }`}
            />
            {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
          </div>

          {/* Land / Property Status Dropdown */}
          <div className="relative" ref={landDropdownRef}>
            <label className="text-[#85431E]/80 text-xs uppercase mb-1.5 block font-medium tracking-wide">
              Land / Property Status
            </label>
            <div
              onClick={() => setIsLandDropdownOpen(!isLandDropdownOpen)}
              className="w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] flex justify-between items-center cursor-pointer rounded border border-[#85431E]/15 focus:border-[#DA7347] transition-all"
            >
              <span className="truncate">{landStatus}</span>
              <svg
                width="11"
                height="7"
                viewBox="0 0 11 7"
                fill="none"
                className={`transition-transform duration-200 shrink-0 ml-2 ${isLandDropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1L5.5 5.5L10 1" stroke="#DA7347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {isLandDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 shadow-2xl rounded-lg overflow-hidden bg-[#FFF8E5] border border-[#85431E]/20">
                <div className="flex flex-col">
                  {LAND_STATUS_OPTIONS.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setLandStatus(opt);
                        setIsLandDropdownOpen(false);
                      }}
                      className="px-4 py-3 text-xs sm:text-sm text-[#85431E] cursor-pointer hover:bg-[#DA7347]/10 transition-colors border-b border-[#85431E]/10 last:border-b-0"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message / Notes */}
          <div>
            <label className="text-[#85431E]/80 text-xs uppercase mb-1.5 block font-medium tracking-wide">
              Message / Specific Requirements
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your background, property details, or target launch timeline..."
              className="w-full bg-[#FFFCF4] px-4 py-3 text-sm text-[#1a1a1a] rounded border border-[#85431E]/15 focus:border-[#DA7347] focus:ring-1 focus:ring-[#DA7347]/30 resize-none outline-none placeholder:text-[#1a1a1a]/40"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            {submitError && (
              <p role="alert" className="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-[#DA7347] text-white py-3.5 px-6 rounded font-medium text-sm uppercase tracking-wider shadow-md hover:bg-[#c4643b] active:scale-[0.99] transition-all disabled:opacity-70 group cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Franchise Enquiry</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Trust note */}
          <p className="text-[11px] text-center text-[#85431E]/60 pt-1 font-light">
            🔒 Your details are kept strictly confidential under NDA.
          </p>
        </form>
      )}

      {/* Direct Call / Email footer */}
      <div className="mt-6 pt-5 border-t border-[#85431E]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#85431E]/80">
        <span className="font-light">Prefer to talk directly?</span>
        <div className="flex items-center gap-4">
          <a
            href="tel:+919901794713"
            className="font-medium text-[#DA7347] hover:underline flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +91 99017 94713
          </a>
          <span>•</span>
          <a
            href="mailto:info@teamzippy.in"
            className="font-medium text-[#DA7347] hover:underline"
          >
            info@teamzippy.in
          </a>
        </div>
      </div>
    </div>
  );
}
