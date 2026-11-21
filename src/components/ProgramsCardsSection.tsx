"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";

const cardsData = [
  {
    id: "discovery",
    slug: "discovery-ride",
    category: "TRIAL EXPERIENCE",
    categoryColor: "text-[#D9734A]",
    categoryBorder: "",
    title: "Discovery Ride",
    description: "Anyone who wants to try horse riding for the first time. No experience, no fitness level, no age requirement — if you're curious, this is for you.",
    features: [
      "A brief introduction to the horse and basic safety",
      "Guided mounting with full instructor support",
      "A 30-minute supervised ride walking pace, fully guided",
      "A post-ride chat about which program to join next, if you'd like to continue"
    ],
    duration: "1 session - 45 minutes",
    sessions: null,
    bgColor: "bg-[#D9734A]",
    textColor: "text-white",
    featureBorder: "border-white/20",
    image: "/assets/images/Programs/Webp/r1.webp",
    scale: 1.15,
    translateY: 0,
    transformOrigin: "40% 100%"
  },
  {
    id: "foundation",
    slug: "foundation-program",
    category: "BEGINNER LEVEL",
    categoryColor: "text-[#4271B3]",
    categoryBorder: "",
    title: "Foundation Program",
    description: "Focused on building strong fundamentals in riding and horse management. The right place to begin your riding journey — no prior experience needed.",
    features: [
      "Walk, trot, and canter development",
      "Correct posture, balance, and control",
      "Understanding horse behaviour and communication",
      "Introduction to grooming and stable practices"
    ],
    duration: "1 session - 45 minutes",
    sessions: "50",
    bgColor: "bg-[#F2F9FF]",
    textColor: "text-[#242A59]",
    featureBorder: "border-[#242A59]/20",
    image: "/assets/images/Programs/Webp/r2.webp",
    scale: 1,
    translateY: 0,
    transformOrigin: "50% 50%"
  },
  {
    id: "development",
    slug: "development-program",
    category: "INTERMEDIATE",
    categoryColor: "text-[#5A7BB5]",
    categoryBorder: "",
    title: "Development Program",
    description: "For riders who have completed the foundation program and are ready to advance. A structured, performance-focused program to take you from a confident rider to competition-ready.",
    features: [
      "Improved contact, balance, and riding technique across all gaits",
      "Introduction to jumping and discipline-specific training",
      "Structured, performance-focused progression",
      "Introduction to grooming and stable practices"
    ],
    duration: "1 session - 45 minutes",
    sessions: "50",
    bgColor: "bg-[#5A7BB5]",
    textColor: "text-white",
    featureBorder: "border-white/20",
    image: "/assets/images/Programs/Webp/r3.webp",
    scale: 1,
    translateY: 0,
    transformOrigin: "50% 50%"
  },
  {
    id: "performance",
    slug: "performance-program",
    category: "ADVANCED / COMPETITIVE",
    categoryColor: "text-[#91572D]",
    categoryBorder: "",
    title: "Performance Program",
    description: "A high-performance track for riders aiming to compete nationally and represent at state and international levels. Professional coaching, structured training plans, and a competitive environment.",
    features: [
      "Advanced techniques and discipline specialization - Show jumping and dressage",
      "Competition preparation and strategy",
      "Professional coaching and structured training plans",
      "Pathway to national and international competitions"
    ],
    duration: "1 session - 45 minutes",
    sessions: "50",
    bgColor: "bg-[#91572D]",
    textColor: "text-white",
    featureBorder: "border-white/20",
    image: "/assets/images/Programs/Webp/r4.webp",
    scale: 1,
    translateY: 0,
    transformOrigin: "50% 50%"
  },
  {
    id: "dressage",
    slug: "dressage-program",
    category: "SPECIALIZATION",
    categoryColor: "text-[#242A59]",
    categoryBorder: "",
    title: "Dressage Program",
    description: "Riders who have completed the Performance Program and want to pursue Dressage as a discipline. A structured introduction to the precision, balance, and harmony that defines dressage riding.",
    features: [
      "Correct dressage seat and refined position in the saddle",
      "Precise aids and communication with the horse",
      "Transitions, lateral movements, and rhythm at all gaits",
      "Building the connection and collection that dressage demands"
    ],
    duration: "1 session - 45 minutes",
    sessions: "12 sessions a month",
    bgColor: "bg-[#242A59]",
    textColor: "text-white",
    featureBorder: "border-white/20",
    image: "/assets/images/Programs/Webp/r5.webp",
    scale: 1,
    translateY: 0,
    transformOrigin: "50% 50%",
    objectPosition: "50% 20%"
  },
  {
    id: "showjumping",
    slug: "showjumping-program",
    category: "SPECIALIZATION",
    categoryColor: "text-[#242A59]",
    categoryBorder: "",
    title: "Showjumping Program",
    description: "Riders who are comfortable cantering independently and want to learn the technique and thrill of jumping. A progressive introduction to showjumping - from ground poles to courses.",
    features: [
      "The jumping position and two-point seat",
      "Approach, take-off, and landing technique",
      "Gridwork and gymnastic exercises to build confidence",
      "Riding a course of fences with control and rhythm"
    ],
    duration: "1 session - 45 minutes",
    sessions: "12 sessions a month",
    bgColor: "bg-[#242A59]",
    textColor: "text-white",
    featureBorder: "border-white/20",
    image: "/assets/images/Programs/Webp/r6.webp",
    scale: 1,
    translateY: 0,
    transformOrigin: "50% 50%"
  },
  {
    id: "practice",
    slug: "practice-program",
    category: "FOR PRACTICE ADD ON",
    categoryColor: "text-[#111111]",
    categoryBorder: "",
    title: "Practice Program",
    description: "Riders currently enrolled in our Zec Equestrian Centre programs who need additional saddle time to perfect a skill set. An unstructured saddle time to do exactly that. It's a \"do as you please\" program - it's extra practice on your current program level.",
    features: [
      "Your instructor will suggest Practice sessions when they feel additional time on a specific skill will help you progress faster. Sessions are priced at the same rate as your current program."
    ],
    duration: "1 session - 45 minutes",
    sessions: null,
    bgColor: "bg-[#111111]",
    textColor: "text-white",
    featureBorder: "border-white/20",
    image: "/assets/images/Programs/Webp/r7.webp",
    scale: 1,
    transformOrigin: "50% 50%"
  }
];

// Map card id & slug → its index in cardsData
const cardIndexMap: Record<string, number> = {};
cardsData.forEach((c, i) => {
  cardIndexMap[c.id] = i;
  if (c.slug) cardIndexMap[c.slug] = i;
});

// Shared card renderer used by both the desktop scroll strip and the mobile carousel
function renderCard(
  card: (typeof cardsData)[number] & { slug?: string },
  isSelected: boolean,
  hasSelection: boolean,
  onSelect: (id: string) => void
) {
  const cardSlug = card.slug || card.id;

  return (
    <div
      className={`w-full md:w-[429px] flex-shrink-0 flex flex-col flex-1 md:h-[591px] max-md:min-h-[480px] transition-all duration-500 ease-out ${
        hasSelection
          ? isSelected
            ? "opacity-100 z-20 relative"
            : "opacity-45 hover:opacity-80"
          : "opacity-100"
      }`}
    >
      {/* Category Header */}
      <div
        className={`uppercase text-[11px] md:text-xl font-normal ${card.categoryColor} min-h-[16px] mb-2 md:mb-3 flex-shrink-0 transition-opacity duration-300 ${
          hasSelection && !isSelected ? "opacity-60" : "opacity-100"
        }`}
      >
        {card.category}
      </div>

      {/* Card Body (Image + Content attached) */}
      <div
        onClick={() => onSelect(card.id)}
        className={`flex flex-col flex-1 shadow-sm overflow-hidden rounded-md md:rounded-sm transition-all duration-500 ease-out cursor-pointer group ${
          isSelected 
            ? "shadow-2xl scale-[1.035] md:scale-[1.045] -translate-y-2 ring-2 ring-[#DA7347]" 
            : hasSelection
              ? "hover:scale-[1.01] hover:shadow-md"
              : "hover:shadow-lg hover:scale-[1.015] hover:-translate-y-1"
        }`}
      >
        {/* Image */}
        <div className="relative h-[22vh] min-h-[130px] max-h-[194px] w-full flex-shrink-0 overflow-hidden">
          <Image loading="lazy"
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 429px"
            style={{
              transform: `translateY(${card.translateY ?? 0}px) scale(${card.scale})`,
              transformOrigin: card.transformOrigin,
              objectPosition: card.objectPosition ?? "50% 50%"
            }}
          />
        </div>

        {/* Content Box */}
        <div className={`flex flex-col flex-1 ${card.bgColor} ${card.textColor} overflow-hidden`}>
          <div className="flex flex-col flex-1 p-4 md:p-5">
            <h3 className="text-lg md:text-xl font-medium mb-2 leading-tight">
              <Link
                href={`/programs/${cardSlug}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline inline-flex items-center gap-1.5"
                title={`View ${card.title} details`}
              >
                <span>{card.title}</span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                >
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </Link>
            </h3>

            <p className={`text-[11px] md:text-[12px] mb-2.5 md:mb-4 leading-snug md:leading-relaxed opacity-90`}>
              {card.description}
            </p>

            <div className="flex flex-col gap-1.5 mt-auto">
              {card.features.map((feature, i) => (
                <div key={i} className={`border-t ${card.featureBorder} pt-1.5 md:pt-2 text-[10px] md:text-[11px] leading-snug md:leading-relaxed opacity-90`}>
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-3 md:pt-4 flex gap-6 items-end mt-3 flex-shrink-0">
              {card.sessions && (
                <div className="flex flex-col">
                  <span className="text-[8.5px] md:text-[9px]  uppercase opacity-80 mb-0.5">Number of Sessions</span>
                  <span className="text-[11px] md:text-[12px] font-medium">{card.sessions}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[8.5px] md:text-[9px]  uppercase opacity-80 mb-0.5">Duration</span>
                <span className="text-[11px] md:text-[12px] font-medium">{card.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProgramsCardsSectionProps {
  initialCards?: any[];
}

export default function ProgramsCardsSection({ initialCards }: ProgramsCardsSectionProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardSelect = (id: string) => {
    setSelectedCardId((prev) => (prev === id ? null : id));
  };

  const activeCards = (initialCards && initialCards.length > 0)
    ? initialCards.map((card, i) => {
        const cardSlug = (card.slug || "").toLowerCase().trim();
        const defaultMeta =
          cardsData.find((c) => {
            const cSlug = (c.slug || "").toLowerCase().trim();
            const cleanCardSlug = cardSlug.replace(/-program$|-ride$/, "");
            const cleanCSlug = cSlug.replace(/-program$|-ride$/, "");
            return (
              c.id === cardSlug ||
              cSlug === cardSlug ||
              (cleanCardSlug.length > 0 && cleanCardSlug === c.id) ||
              (cleanCardSlug.length > 0 && cleanCardSlug === cleanCSlug) ||
              cardSlug.includes(c.id) ||
              c.id === card.id ||
              (card.aliases && card.aliases.includes(c.id))
            );
          }) || cardsData[i % cardsData.length];

        return {
          ...defaultMeta,
          id: defaultMeta.id,
          slug: card.slug || defaultMeta.slug || defaultMeta.id,
          title: card.title || defaultMeta.title,
          description: card.shortDescription || card.description || defaultMeta.description,
          category: card.category || defaultMeta.category,
          features: (card.curriculumList && card.curriculumList.length > 0) ? card.curriculumList : (card.features || defaultMeta.features),
          image: card.bannerImage || card.image || defaultMeta.image,
          duration: card.duration || defaultMeta.duration,
          sessions: card.sessions !== undefined ? card.sessions : defaultMeta.sessions,
        };
      })
    : cardsData;

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const xPercent = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const vwOffset = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const x = useMotionTemplate`calc(${xPercent}% + ${vwOffset}vw)`;

  // Track the viewport breakpoint: desktop drives the background from scroll, mobile uses a static cream
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Hash-based card scroll: jump to the scroll position that reveals the target card
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || !(hash in cardIndexMap)) return;

    const cardIndex = cardIndexMap[hash];

    const scrollToCard = () => {
      const el = targetRef.current;
      if (!el) return;

      // Mobile: scroll the carousel track to the target card (no page scroll-lock on mobile)
      if (window.innerWidth < 768) {
        const track = mobileTrackRef.current;
        const card = track?.querySelectorAll<HTMLElement>("[data-card]")[cardIndex];
        if (!track || !card) return;
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetLeft = track.scrollLeft + (cardRect.left - trackRect.left) - (track.clientWidth - cardRect.width) / 2;
        track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        return;
      }

      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = el.getBoundingClientRect().height;

      // scrollYProgress goes 0→1 over sectionHeight, each card occupies 1/totalCards of that
      const targetProgress = cardIndex / (cardsData.length - 1);
      const targetScrollY = sectionTop + targetProgress * (sectionHeight - window.innerHeight);

      window.scrollTo({ top: Math.max(0, targetScrollY), behavior: 'auto' });
    };

    // Wait for layout to settle after navigation
    const t = setTimeout(scrollToCard, 200);
    return () => clearTimeout(t);
  }, []);

  // Create color stops evenly distributed across the scroll range
  const colorStops = cardsData.map((_, i) => i / Math.max(1, cardsData.length - 1));

  // Background color transitions through lighter, but noticeable, tints of each card
  const sectionBgColors = [
    "#FFF8E5", // Discovery (start with cream to sync with previous section)
    "#D6EDFF",
    "#CBDDF2",
    "#E6CFC0",
    "#E6CFC0",
    "#E6CFC0",
    "#FFF8E5"
  ];

  const sectionBgColor = useTransform(scrollYProgress, colorStops, sectionBgColors);

  return (
    <motion.section
      id="programs-cards"
      ref={targetRef}
      style={{ backgroundColor: isMobile ? "#FFF8E5" : sectionBgColor }}
      className="relative h-[300vh] z-[60] max-md:h-auto max-md:z-0 bg-[#FFF8E5]"
    >
      <div className="sticky top-0 flex flex-col h-screen overflow-hidden justify-between py-6 md:py-8 max-md:static max-md:h-auto">

        {/* Top Title */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex-shrink-0 pt-2 md:pt-4">
          <Reveal>
            <h2 className="programs-heading text-2xl md:text-5xl font-normal text-[#85431E]">
              FIND YOUR RIGHT RIDE
            </h2>
          </Reveal>
        </div>

        {/* Cards Container */}
        <Reveal delay={0.3} className="max-md:hidden">
        <motion.div
          style={{ x }}
          className="flex w-max items-stretch flex-1 py-6 md:py-8 pr-6 md:pr-12"
        >
          {/* Dynamic Spacer to perfectly align first card with max-w-7xl container */}
          <div className="flex-shrink-0 w-[1.5rem] md:w-[max(3rem,calc((100vw-80rem)/2+3rem))]" />

          {activeCards.map((card, idx) => (
            <div key={card.id} className="flex h-full items-stretch">
              {/* Divider Line */}
              {idx > 0 && (
                <div
                  className={`w-px bg-black/10 mx-3 md:mx-6 h-full transition-opacity duration-500 ${
                    selectedCardId ? "opacity-30" : "opacity-100"
                  }`}
                />
              )}

              {renderCard(
                card,
                selectedCardId === card.id,
                Boolean(selectedCardId),
                handleCardSelect
              )}
            </div>
          ))}
        </motion.div>
        </Reveal>

        {/* Mobile Carousel — swipeable cards; color shifts per swiped card */}
        <div className="md:hidden">
          <div
            ref={mobileTrackRef}
            data-mobile-carousel
            className="flex items-stretch overflow-x-auto snap-x snap-proximity no-scrollbar gap-4 touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch] px-6 py-6"
          >
            {activeCards.map((card) => (
              <div key={card.id} data-card className="flex-shrink-0 snap-center w-[85vw] flex flex-col">
                {renderCard(
                  card,
                  selectedCardId === card.id,
                  Boolean(selectedCardId),
                  handleCardSelect
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 z-30 flex-shrink-0 pb-2 md:pb-4">
          <Reveal direction="none" delay={0.2} className="max-md:w-full max-md:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 max-md:w-full">
              <span className="bottom-banner-text text-[#D9734A] text-xs md:text-xl font-medium transition-colors duration-300">Pick your level and start ride withing us</span>
              <Link 
                href={selectedCardId ? `/contact?program=${encodeURIComponent(activeCards.find(c => c.id === selectedCardId)?.title || '')}` : "/contact"} 
                className="bottom-banner-btn bg-[#D9734A] text-white px-5 py-2 md:py-3 text-sm md:text-md font-medium hover:bg-[#C2613D] transition-colors duration-300 flex items-center gap-2 rounded-sm border border-[#D9734A] max-md:w-full max-md:justify-center"
              >
                Enroll now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>

      </div>
    </motion.section>
  );
}
