"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

// Map of route → hero image to silently prefetch when the user hovers the link
const ROUTE_PREFETCH: Record<string, string> = {
  "/about":        "/assets/images/About/Webp/hero.webp",
  "/programs":     "/assets/images/Programs/Webp/Hero.webp",
  "/beyond":       "/assets/images/BeyondRide/Webp/beyond-hero.webp",
  "/stories":      "/assets/images/Rider_stories/Webp/riders-hero.webp",
  "/registration": "/assets/images/Programs/Webp/Hero.webp",
};

/** Kicks off a background download so the image is cached before navigation. */
function prefetchImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}

interface HeaderProps {
  theme?: "dark" | "light";
  bodyTheme?: "dark" | "light";
  disableThemeChangeOnScroll?: boolean;
  navVariant?: "default" | "cream";
}

export default function Header({
  theme = "dark",
  bodyTheme,
  disableThemeChangeOnScroll = false,
  navVariant = "default",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterActive, setIsFooterActive] = useState(false);
  const [isHerdInView, setIsHerdInView] = useState(false);
  const [isInTestimonial, setIsInTestimonial] = useState(false);
  const [isInStoriesRiders, setIsInStoriesRiders] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Observe body class for footer-active
  useEffect(() => {
    const updateFooterState = () => {
      setIsFooterActive(document.body.classList.contains("footer-active"));
    };

    const rafId = requestAnimationFrame(updateFooterState);

    const observer = new MutationObserver(updateFooterState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const NAV_LINKS: [string, string][] = [
    ["/", "HOME"],
    ["/about", "ABOUT"],
    ["/programs", "PROGRAMS"],
    ["/stories", "RIDERS STORIES"],
    ["/beyond", "BEYOND THE RIDE"],
    ["/contact", "JOIN ZIPPY"],
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled(currentY > 50);
          
          // Switch theme when scrolling past the hero section
          // If page has a specific hero element (id="page-hero-section"), measure its bottom boundary against the header (~80px).
          // Otherwise, fall back to window.innerHeight - 80px (standard full-viewport hero).
          const heroSection = document.getElementById("page-hero-section") || document.getElementById("hero-section");
          if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            setIsPastHero(rect.bottom <= 80);
          } else {
            setIsPastHero(currentY > window.innerHeight - 80);
          }
          
          const herdSection = document.getElementById("herd-section");
          if (herdSection) {
            const rect = herdSection.getBoundingClientRect();
            // Header is ~80px. Check if herd section is overlapping the header area.
            setIsHerdInView(rect.top <= 80 && rect.bottom >= 50);
          } else {
            setIsHerdInView(false);
          }
          
          const testimonialSection = document.getElementById("testimonial-section");
          if (testimonialSection) {
            const rect = testimonialSection.getBoundingClientRect();
            setIsInTestimonial(rect.top <= 80 && rect.bottom >= 50);
          } else {
            setIsInTestimonial(false);
          }
          
          const storiesRidersSection = document.getElementById("stories-riders-section");
          if (storiesRidersSection) {
            const rect = storiesRidersSection.getBoundingClientRect();
            setIsInStoriesRiders(rect.top <= 80 && rect.bottom >= 50);
          } else {
            setIsInStoriesRiders(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let isLight = theme === "light";
  if (!disableThemeChangeOnScroll && isPastHero) {
    isLight = bodyTheme !== undefined ? bodyTheme === "light" : true;
  }

  if (pathname === '/about' && isPastHero && !isFooterActive) {
    isLight = isHerdInView;
  }

  if (isFooterActive || isInTestimonial || isInStoriesRiders) {
    isLight = false;
  }
  
  const showDarkLogo = isLight;

  const handleNavHover = useCallback((href: string) => {
    if (ROUTE_PREFETCH[href]) {
      prefetchImage(ROUTE_PREFETCH[href]);
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans md:bg-transparent md:backdrop-blur-none md:shadow-none ${
        isScrolled
          ? `py-3 md:py-4 max-md:backdrop-blur-md max-md:shadow-sm ${
              showDarkLogo
                ? "max-md:bg-[#FFF8E5]/80 max-md:border-b max-md:border-[#85431E]/10"
                : "max-md:bg-[#DA7347]/80 max-md:border-b max-md:border-white/15"
            }`
          : `py-4 md:py-8 max-md:backdrop-blur-md ${
              showDarkLogo
                ? "max-md:bg-[#FFF8E5]/70 max-md:border-b max-md:border-[#85431E]/10"
                : "max-md:bg-black/25 max-md:border-b max-md:border-white/10"
            }`
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-36 h-16 md:w-56 md:h-24 transition-transform group-hover:scale-105 duration-500">
            <Image
              src={showDarkLogo ? "/assets/images/zippylogo-dark.svg" : "/assets/images/zippylogo2.svg"}
              alt="Zippy Equestrian Logo"
              fill
              sizes="(max-width: 768px) 144px, 224px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className={`hidden lg:flex items-center backdrop-blur-md rounded-md overflow-hidden h-12 shadow-xl border ${navVariant === 'cream' ? 'bg-[#FFF8E5]/90 border-[#85431E]/10' : (isLight ? 'bg-[#85431E]/80 border-white/20' : 'bg-[#DA7347]/70 border-white/10')}`}>
          <Link href="/" className={`px-6 py-2 text-[11px] font-medium transition-colors ${navVariant === 'cream' ? 'text-[#85431E] hover:text-[#DA7347]' : 'text-[#F2EBD9] hover:text-white'}`}>HOME</Link>
          <Link href="/about" onMouseEnter={() => handleNavHover("/about")} className={`px-6 py-2 text-[11px] font-medium transition-colors ${navVariant === 'cream' ? 'text-[#85431E] hover:text-[#DA7347]' : 'text-[#F2EBD9] hover:text-white'}`}>ABOUT</Link>
          <Link href="/programs" onMouseEnter={() => handleNavHover("/programs")} className={`px-6 py-2 text-[11px] font-medium transition-colors ${navVariant === 'cream' ? 'text-[#85431E] hover:text-[#DA7347]' : 'text-[#F2EBD9] hover:text-white'}`}>PROGRAMS</Link>
          <Link href="/stories" onMouseEnter={() => handleNavHover("/stories")} className={`px-6 py-2 text-[11px] font-medium transition-colors ${navVariant === 'cream' ? 'text-[#85431E] hover:text-[#DA7347]' : 'text-[#F2EBD9] hover:text-white'}`}>RIDERS STORIES</Link>
          <Link href="/beyond" onMouseEnter={() => handleNavHover("/beyond")} className={`px-6 py-2 text-[11px] font-medium transition-colors ${navVariant === 'cream' ? 'text-[#85431E] hover:text-[#DA7347]' : 'text-[#F2EBD9] hover:text-white'}`}>BEYOND THE RIDE</Link>
          <Link href="/contact" className={`px-8 py-2 h-full flex items-center font-black text-xs transition-all bg-[#F2EBD9] text-[#85431E] hover:bg-[#DA7347] hover:text-[#F2EBD9] rounded-r-[5px]`}>JOIN ZIPPY</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={`lg:hidden p-2 ${showDarkLogo ? 'text-[#85431E]' : 'text-[#F2EBD9]'}`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Drawer rendered via createPortal directly into document.body */}
      {mounted && typeof document !== "undefined" && createPortal(
        <div
          className={`lg:hidden fixed inset-0 z-[9999] ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!menuOpen}
        >
          {/* Backdrop with dark blur */}
          <div
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Drawer Panel - Solid opaque luxury equestrian background */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#5C280D] bg-gradient-to-b from-[#6B3012] to-[#451B07] text-[#F2EBD9] flex flex-col justify-between shadow-[-12px_0_36px_rgba(0,0,0,0.6)] border-l border-white/10 transition-transform duration-300 ease-out ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Top Bar with Logo & Close Button */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative w-28 h-10 block">
                <Image
                  src="/assets/images/zippylogo2.svg"
                  alt="Zippy Equestrian"
                  fill
                  className="object-contain object-left"
                />
              </Link>

              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#F2EBD9] hover:bg-white/20 active:scale-95 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.filter(([_, label]) => label !== "JOIN ZIPPY").map(([href, label], idx) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={() => handleNavHover(href)}
                      className={`group flex items-center justify-between py-3.5 px-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-white/10 text-white font-medium"
                          : "text-[#F2EBD9]/85 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base font-normal tracking-wide uppercase">{label}</span>
                      <span className={`text-xs font-mono transition-transform duration-200 group-hover:translate-x-1 ${
                        isActive ? "text-[#DA7347]" : "text-[#F2EBD9]/40"
                      }`}>
                        0{idx + 1}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Call to action & Footer within drawer */}
              <div className="pt-6 mt-4 border-t border-white/10 flex flex-col gap-5">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-md bg-[#F2EBD9] text-[#5C280D] font-semibold text-xs tracking-wider uppercase hover:bg-white active:scale-[0.98] transition-all shadow-md"
                >
                  <span>Join Zippy</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                {/* Stables contact & social strip */}
                <div className="flex items-center justify-between pt-2 text-[#F2EBD9]/70 text-xs">
                  <a href="tel:+919882988267" className="hover:text-white transition-colors">
                    +91 98829 88267
                  </a>

                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com/zippy.equestrian"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
                      aria-label="Instagram"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/919882988267"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
                      aria-label="WhatsApp"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.facebook.com/zippyequestriancenter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
                      aria-label="Facebook"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}

