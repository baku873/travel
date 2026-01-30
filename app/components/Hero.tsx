"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react"; // Added useMemo
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight,
  FaPlane,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { Trip } from "@/lib/mongo/trips";

/* ────────────────────── Animation Variants ────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AUTOPLAY_DURATION = 7000;

/* ────────────────────── Main Component ────────────────────── */
const Hero = ({ trips, lang, dictionary }: { trips: Trip[], lang: "mn" | "en" | "ko", dictionary: any }) => {
  const { language } = useLanguage();
  const activeLang = lang || language; // Fallback to context but prefer prop for sync
  const [slideIndex, setSlideIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. FILTER: Only take the last 3 trips added
  // Assuming trips are coming from DB unsorted or we just want to ensure we get the latest.
  // We use useMemo to avoid re-sorting on every render.
  const heroTrips = useMemo(() => {
    if (!trips) return [];
    // Clone array to avoid mutating props, reverse/sort if needed, then take top 3
    // Assuming your API already sends them sorted or you want the absolute last ones in the array:
    return [...trips].slice(-3).reverse();
    // OR if you want specific sorting by date (if you have createdAt):
    // return [...trips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  }, [trips]);

  const t = useCallback(
    (input: any) => {
      if (!input) return "";
      if (typeof input === "object" && (input.mn || input.en || input.ko)) {
        return input[activeLang as "mn" | "en" | "ko"] || input.en || input.mn || "";
      }
      return input;
    },
    [activeLang]
  );

  useEffect(() => {
    if (!heroTrips || heroTrips.length === 0) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroTrips.length);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [heroTrips.length]);

  // Force video to play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video play failed:", error);
      });
    }
  }, []);

  if (!heroTrips || heroTrips.length === 0) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading tours...
      </div>
    );
  }

  const activeSlide = heroTrips[slideIndex];

  const getButtonText = () => {
    if (dictionary?.book) return dictionary.book;
    if (activeLang === "mn") return "Аялал захиалах";
    if (activeLang === "ko") return "예약하기";
    return "Book Now";
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-slate-900 text-slate-800 flex items-center justify-center overflow-hidden">
      {/* ─── 1. Background Video ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-100"
        >
          <source src="https://res.cloudinary.com/dc127wztz/video/upload/hero_uzq5wr.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ─── 2. Blue Gradient Overlays ─── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-100/60 via-sky-50/40 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent" />

      {/* ─── 3. Content ─── */}
      <div className="relative z-10 container mx-auto px-6 max-w-screen-2xl w-full grid grid-cols-12 items-center h-full">
        {/* SEO: Static H1 for search engines */}
        <h1 className="sr-only">
          {activeLang === 'mn' ? 'Монголын Аялал Жуулчлал' : activeLang === 'ko' ? '몽골 여행 및 투어' : 'Mongolia Travel & Adventure Tours'}
        </h1>

        {/* Left Column: Text Content */}
        <div className="col-span-12 lg:col-span-7 pt-24 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeSlide._id}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-3xl text-left"
            >
              {/* Category & Rating */}
              <motion.div
                variants={itemVariants}
                className="mb-6 flex flex-wrap items-center gap-4"
              >
                <span className="relative px-4 py-2 rounded-full overflow-hidden bg-white/60 backdrop-blur-md border border-sky-200 group">
                  <span className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-100 opacity-50" />
                  <span className="relative text-xs font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 flex items-center gap-2">
                    <FaPlane className="text-sky-500" size={10} />
                    {t(activeSlide.category)}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 font-bold text-sm bg-white/60 border border-white/50 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                  <FaStar className="text-yellow-400 text-base" />
                  <span>{activeSlide.rating || 5.0}</span>
                </span>
              </motion.div>

              {/* Title (Now H2 for SEO hierarchy) */}
              <motion.h2
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6 text-slate-900 tracking-tight drop-shadow-sm"
              >
                {t(activeSlide.title)}
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium line-clamp-3"
              >
                {activeSlide.description
                  ? t(activeSlide.description)
                  : t({ mn: "Мөрөөдлийн аяллаа бидэнтэй хамт бүтээгээрэй.", en: "Create your dream journey with us.", ko: "우리와 함께 꿈의 여행을 만드세요." })}
              </motion.p>

              {/* Meta Data */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 text-slate-700 mb-10 text-sm font-bold tracking-wide"
              >
                <div className="flex items-center gap-3 bg-gradient-to-br from-white/80 to-blue-50/50 px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-900/5 border border-white/60 backdrop-blur-xl">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-full">
                    <FaClock className="text-sm" />
                  </div>
                  {t(activeSlide.duration)}
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-br from-white/80 to-blue-50/50 px-5 py-3.5 rounded-2xl shadow-lg shadow-blue-900/5 border border-white/60 backdrop-blur-xl">
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-full">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  {t(activeSlide.location)}
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <ShinyButton
                  link={`/${activeLang}/tours/${activeSlide._id}`}
                  text={getButtonText()}
                />

                {/* Secondary Button: Custom Trip */}
                <Link href={`/${activeLang}/custom-trip`}>
                  <button className="px-8 py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-800 font-bold text-lg hover:bg-white/60 transition-all duration-300">
                    {activeLang === 'mn' ? 'Аялал бүтээх' : activeLang === 'ko' ? '맞춤 여행' : 'Plan Your Own'}
                  </button>
                </Link>
              </motion.div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Right Column: Pagination (Using heroTrips instead of all trips) */}
        <div className="hidden lg:flex col-span-5 h-full flex-col justify-center items-end pr-10">
          <VerticalPagination
            items={heroTrips}
            currentIndex={slideIndex}
            onSelect={setSlideIndex}
            t={t}
          />
        </div>
      </div>
    </section>
  );
};

/* ────────────────────── Helpers ────────────────────── */

const ShinyButton: React.FC<{ link: string; text: string }> = ({
  link,
  text,
}) => (
  <Link href={link}>
    <motion.button
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-500 text-white font-bold text-lg shadow-xl shadow-blue-500/30 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
    >
      <motion.div
        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
        variants={{ hover: { translateX: "100%", transition: { duration: 0.6 } } }}
      />
      <span className="relative z-10 drop-shadow-md">{text}</span>
      <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
        <FaArrowRight className="text-sm -rotate-45 group-hover:-rotate-0 transition-transform duration-300" />
      </div>
    </motion.button>
  </Link>
);

const VerticalPagination: React.FC<{
  items: Trip[];
  currentIndex: number;
  onSelect: (index: number) => void;
  t: (input: any) => string;
}> = ({ items, currentIndex, onSelect, t }) => (
  <div className="flex flex-col gap-6 w-80">
    {items.map((item, index) => {
      const isActive = index === currentIndex;
      return (
        <button
          key={item._id}
          onClick={() => onSelect(index)}
          className="group relative flex items-center gap-5 text-right transition-all duration-300 outline-none"
        >
          <div
            className={`flex-1 transition-all duration-300 ${isActive
              ? "opacity-100 translate-x-0"
              : "opacity-40 group-hover:opacity-70 translate-x-2"
              }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? "text-blue-600" : "text-slate-400"
                }`}
            >
              0{index + 1}
            </p>
            <p
              className={`text-lg font-bold truncate ${isActive ? "text-slate-900" : "text-slate-500"
                }`}
            >
              {t(item.location)}
            </p>
          </div>
          <div
            className={`w-1.5 h-14 rounded-full overflow-hidden transition-all duration-300 border ${isActive
              ? "border-transparent shadow-lg shadow-blue-500/20 scale-y-110"
              : "border-slate-300 bg-white/30"
              }`}
          >
            {isActive && (
              <motion.div
                className="w-full h-full bg-gradient-to-b from-sky-400 to-blue-600 origin-top"
                initial={{ height: "0%" }}
                animate={{ height: "100%" }}
                transition={{ duration: AUTOPLAY_DURATION / 1000, ease: "linear" }}
                key={currentIndex} // Reset animation on slide change
              />
            )}
          </div>
        </button>
      );
    })}
  </div>
);

export default Hero;