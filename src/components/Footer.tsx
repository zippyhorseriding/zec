"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useInView, motion } from 'framer-motion';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

const PaintingLogo = ({ src, className, delay = 0 }: { src: string; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  const maskStyle = {
    maskImage: `url(${src})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskImage: `url(${src})`,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Left-to-right reveal that also slides in from the left — matches the
          site loader's letters (power4.out feel, ~0.8s). */}
      <motion.div
        className="relative w-full h-full bg-[#7A4027]"
        style={maskStyle}
        initial={{ clipPath: 'inset(0 100% 0 0)', x: -28 }}
        animate={isInView
          ? { clipPath: 'inset(0 0% 0 0)', x: 0 }
          : { clipPath: 'inset(0 100% 0 0)', x: -28 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

interface FooterProps {
  forceTerracotta?: boolean;
  heading?: string;
  subheading?: string;
  ctaText?: string;
}

const Footer = ({
  forceTerracotta = false,
  heading,
  subheading,
  ctaText,
}: FooterProps) => {
  const settings = useSiteSettings();
  const ref = useRef<HTMLElement>(null);

  // Explicit props win; otherwise fall back to the Site Settings document.
  const resolvedHeading = heading ?? settings.footerHeading;
  const resolvedSubheading = subheading ?? settings.footerSubheading;
  const resolvedCtaText = ctaText ?? settings.footerCtaText;

  // Amount of the footer that must be visible before `footer-active` kicks in.
  // On mobile the footer is taller relative to the viewport, so a 50% threshold
  // fires too late (the banner above the footer has already scrolled away) or,
  // on short screens, never at all. Trigger as soon as the footer top enters
  // the viewport there; keep desktop timing unchanged.
  const [inViewAmount, setInViewAmount] = useState(0.5);

  useEffect(() => {
    const update = () => setInViewAmount(window.innerWidth < 768 ? 0 : 0.5);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isInView = useInView(ref, { amount: inViewAmount });
  const isTerracotta = forceTerracotta || isInView;

  useEffect(() => {
    if (isInView) {
      document.body.classList.add('footer-active');
    } else {
      document.body.classList.remove('footer-active');
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('footer-active');
    };
  }, [isInView]);

  const textColor = isTerracotta ? "text-[#F2EBD9]" : "text-[#DA7347]";
  const borderColor = isTerracotta ? "border-[#F2EBD9]" : "border-[#DA7347]";
  const buttonHover = isTerracotta 
    ? "hover:bg-[#F2EBD9] hover:text-[#D27C55]" 
    : "hover:bg-[#DA7347] hover:text-[#FFF8E5]";
  const underlineColor = isTerracotta ? "decoration-[#F2EBD9]/60" : "decoration-[#DA7347]/60";

  return (
    <footer
      ref={ref}
      className={`relative w-full pt-12 pb-10 sm:pt-16 sm:pb-12 md:pt-64 md:pb-10 transition-colors duration-300 ${isTerracotta ? 'bg-[#DA7347]' : 'bg-[#FFF8E5]'}`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 md:px-16 lg:px-20">

        {/* Main Grid: Left for Logos, Right for Content on Desktop; CTA -> Logos -> Links on Mobile */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-8 lg:gap-16 mb-8 sm:mb-12 md:mb-32">

          {/* CTA Section - Order 1 on mobile */}
          <div className="order-1 md:order-2 md:col-start-2 md:row-start-1 flex flex-col justify-center max-w-lg mx-auto md:mx-0 md:pl-8 lg:pl-16 w-full">
            <div className={`text-center md:text-left ${textColor}`}>
              <h2 className="text-2xl sm:text-3xl md:text-[48px] lg:text-[56px] font-medium leading-[1.15] mb-3 sm:mb-4 md:mb-6 tracking-tight whitespace-pre-line">
                {resolvedHeading}
              </h2>
              <p className="text-xs sm:text-sm md:text-lg opacity-90 mb-5 sm:mb-6 md:mb-10 font-light leading-relaxed whitespace-pre-line max-w-md mx-auto md:mx-0">
                {resolvedSubheading}
              </p>
              <Link href="/contact" className={`group flex items-center justify-center md:justify-start gap-2.5 sm:gap-4 px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-4 border rounded transition-all duration-300 mx-auto md:mx-0 w-fit ${borderColor} ${buttonHover}`}>
                <span className="text-xs sm:text-sm md:text-lg font-light">{resolvedCtaText}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-300 group-hover:translate-x-1 w-4 h-4 md:w-6 md:h-6"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Left Column: Logos & Address - Order 2 on mobile (placed after the button!) */}
          <div className="order-2 md:order-1 md:col-start-1 md:row-start-1 md:row-span-2 flex flex-col justify-center items-center md:items-stretch h-full py-1 md:py-0 w-full">
            {/* Logos: compact horizontal row on mobile, stacked on desktop */}
            <div className="flex flex-row md:flex-col items-center justify-center md:items-start gap-3 md:gap-0 mb-4 md:mb-0">
              {/* Horse Rider Logo */}
              <div className="flex justify-center md:justify-start md:mb-14">
                <PaintingLogo src="/assets/images/zippyfooter1.svg" className="w-12 h-12 sm:w-16 sm:h-16 md:w-[280px] md:h-[280px] lg:w-[280px] lg:h-[280px]" />
              </div>
              {/* Zippy Equestrian Center */}
              <div className="flex items-start justify-center md:justify-start md:mb-20">
                <PaintingLogo
                  src="/assets/images/zippyfooter2.svg"
                  className="w-28 h-8 sm:w-36 sm:h-10 md:w-[240px] md:h-[68px] lg:w-[280px] lg:h-[80px]"
                  delay={0.15}
                />
              </div>
            </div>

            {/* Address */}
            {/* <div className={`text-center md:text-left ${textColor} max-w-xs sm:max-w-sm mx-auto md:mx-0`}>
              <p className="text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider mb-2 opacity-90 flex items-center justify-center md:justify-start gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 md:w-3.5 md:h-3.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Visit Our Stables</span>
              </p>
              <address className="not-italic text-[11px] sm:text-xs md:text-sm font-light leading-snug md:leading-relaxed opacity-85 px-2 sm:px-0">
                102/2, Puttenahalli, JP Nagar 7th Phase, Bengaluru, Karnataka – 560078
              </address>
              <a
                href="https://maps.google.com/?q=Zippy+Equestrian+Center"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium mt-2.5 md:mt-2.5 underline underline-offset-4 ${underlineColor} hover:opacity-80 transition-opacity`}
              >
                <span>Get Directions (Google Maps)</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div> */}
          </div>

          {/* Bottom Links Section - Order 3 on mobile */}
          <div className="order-3 md:order-3 md:col-start-2 md:row-start-2 flex flex-col justify-end max-w-lg mx-auto md:mx-0 md:pl-8 lg:pl-16 w-full">
            <div className={`grid grid-cols-2 gap-x-8 sm:gap-x-10 md:gap-x-16 gap-y-3 sm:gap-y-3.5 md:gap-y-2.5 max-w-[280px] sm:max-w-sm md:max-w-none mx-auto md:mx-0 w-full text-center md:text-left ${textColor}`}>
              <Link href="/" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Zippy Home</Link>
              <Link href="/about" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>About ZEC</Link>
              <Link href="/programs" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Riding programs</Link>
              <Link href="/beyond" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Beyond the ride</Link>
              <Link href="/stories" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Rider Stories</Link>
              <Link href="/stories#gallery" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Gallery</Link>
              <Link href="/blog" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Blog</Link>
              <Link href="/contact" className={`block text-center md:text-left text-xs sm:text-sm md:text-[15px] font-light hover:opacity-80 transition-opacity underline underline-offset-4 ${underlineColor}`}>Contact Zippy</Link>
            </div>
          </div>

        </div>

        {/* Copyright Row */}
        <div className="pt-6 sm:pt-8 md:pt-0 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-2.5 md:gap-4 text-[#7A4027] text-[10px] sm:text-xs lg:text-sm font-medium text-center w-full">
          <span className="flex flex-row items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 md:w-3.5 md:h-3.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
          <p className="whitespace-nowrap md:text-left">JP Nagar 7th Phase, Bengaluru, Karnataka – 560078</p>
          </span>
          <p className="max-w-[280px] sm:max-w-md md:max-w-none text-center md:text-right leading-snug">
            © 2026 All Rights Reserved. ZEC and Zippy is a registered trademark of Zippy Equestrian Pvt Ltd.
          </p>
        </div>
       
      </div>
    </footer>
  );
};

export default Footer;
