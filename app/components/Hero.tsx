"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowRight,
  FaPlane,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { Trip } from "@/lib/mongo/trips";
import { content } from "../content";

/* ────────────────────── Animation Variants ────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 1.2 }, // Delayed for Navbar (0.8s) + buffer
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Subtle lift from 20
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] } }, // Custom ease
};

const AUTOPLAY_DURATION = 7000;

import Image from 'next/image';

/* ────────────────────── Main Component ────────────────────── */
const Hero = ({ trips, lang, dictionary }: { trips: Trip[], lang: "mn" | "en" | "ko" | "de", dictionary: any }) => {
  const { language } = useLanguage();
  const activeLang = language;
  const { t: translate } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Define slides with localization
  const slides = useMemo(() => [
    {
      id: 1,
      label: activeLang === 'mn' ? "ЕВРОП" : activeLang === 'ko' ? "유럽" : activeLang === 'de' ? "EUROPA" : "EUROPE",
      title: activeLang === 'mn'
        ? <>ӨМНӨД ЕВРОПЫН <br /> 16 ХОНОГИЙН <br /> АЯЛАЛ</>
        : activeLang === 'ko'
          ? <>남부 유럽 <br /> 16일 <br /> 그랜드 투어</>
          : activeLang === 'de'
            ? <>SÜDEUROPA <br /> 16 TAGE <br /> GROSSE TOUR</>
            : <>SOUTHERN EUROPE <br /> 16 DAYS <br /> GRAND TOUR</>,
      desc: activeLang === 'mn'
        ? "Таныг Өрнөдийн соёл иргэншлийн өлгий Грек, эзэнт гүрний сүр жавхлан Итали, Гаудигийн үлгэрийн ертөнц Испани, болон далайчдын эх орон Португал улсаар аялуулах болно."
        : activeLang === 'ko'
          ? "서양 문명의 요람 그리스, 제국의 위엄 이탈리아, 가우디의 스페인, 선원들의 고향 포르투갈을 탐험하세요."
          : activeLang === 'de'
            ? "Entdecken Sie die Wiege der westlichen Zivilisation Griechenland, die Majestät Italiens, Gaudis Spanien und die Heimat der Seefahrer Portugal."
            : "Explore the cradle of Western civilization Greece, the majesty of Italy, Gaudi's Spain, and the sailors' home Portugal.",
      duration: activeLang === 'mn' ? "15 шөнө, 16 өдөр" : activeLang === 'ko' ? "15박 16일" : activeLang === 'de' ? "15 Nächte, 16 Tage" : "15 Nights, 16 Days",
      route: activeLang === 'mn' ? "Грек - Итали - Сицил - Испани - Португал" : activeLang === 'ko' ? "그리스 - 이탈리아 - 시칠리아 - 스페인 - 포르투갈" : activeLang === 'de' ? "Griechenland - Italien - Sizilien - Spanien - Portugal" : "Greece - Italy - Sicily - Spain - Portugal"
    },
    {
      id: 2,
      label: activeLang === 'mn' ? "МОНГОЛ" : activeLang === 'ko' ? "몽골" : activeLang === 'de' ? "MONGOLEI" : "MONGOLIA",
      title: content.hero.title[activeLang] || content.hero.title.en,
      desc: content.hero.subText[activeLang] || content.hero.subText.en,
      duration: activeLang === 'mn' ? "7 шөнө, 8 өдөр" : activeLang === 'ko' ? "7박 8일" : activeLang === 'de' ? "7 Nächte, 8 Tage" : "7 Nights, 8 Days",
      route: activeLang === 'mn' ? "Улаанбаатар - Тэрэлж - Хустай" : activeLang === 'ko' ? "울란바토르 - 테렐지 - 후스타이" : activeLang === 'de' ? "Ulaanbaatar - Terelj - Hustai" : "Ulaanbaatar - Terelj - Hustai"
    },
    {
      id: 3,
      label: activeLang === 'mn' ? "ГОВЬ" : activeLang === 'ko' ? "고비" : activeLang === 'de' ? "GOBI" : "GOBI",
      title: activeLang === 'mn'
        ? <>ГОВИЙН <br /> ГАЙХАМШИГ <br /> <span className="text-white/70">ЭЛСЭН</span> <br /> МАНХАН</>
        : activeLang === 'ko'
          ? <>고비 사막 <br /> 탐험 <br /> <span className="text-white/70">황금</span> <br /> 모래</>
          : activeLang === 'de'
            ? <>GOBI WÜSTE <br /> ENTDECKUNG <br /> <span className="text-white/70">GOLDENE</span> <br /> SANDE</>
            : <>GOBI DESERT <br /> DISCOVERY <br /> <span className="text-white/70">GOLDEN</span> <br /> SANDS</>,
      desc: activeLang === 'mn'
        ? "Өмнийн говийн үзэсгэлэнт байгаль, ховор ан амьтадтай танилцах аялал."
        : activeLang === 'ko'
          ? "남부 고비의 아름다운 자연과 희귀 야생 동물을 발견하는 여행."
          : activeLang === 'de'
            ? "Durchqueren Sie die weiten goldenen Gobi-Sande und entdecken Sie die einzigartige Tierwelt und atemberaubende Landschaften der Südmongolei."
            : "Traverse the vast Golden Gobi sands and discover the unique wildlife and stunning landscapes of Southern Mongolia.",
      route: activeLang === 'mn' ? "Даланзадгад - Хонгорын элс - Баянзаг" : activeLang === 'ko' ? "달란자드가드 - 홍고르 엘스 - 바얀작" : activeLang === 'de' ? "Dalanzadgad - Khongor Sand Dunes - Bayanzag" : "Dalanzadgad - Khongor Sand Dunes - Bayanzag"
    },
    {
      id: 4,
      label: activeLang === 'mn' ? "ХӨВСГӨЛ" : activeLang === 'ko' ? "홉스골" : activeLang === 'de' ? "KHUVSGUL" : "KHUVSGUL",
      title: activeLang === 'mn'
        ? <>ХӨВСГӨЛ <br /> ДАЛАЙ <br /> <span className="text-white/70">ЦЭНГЭГ</span> <br /> УС</>
        : activeLang === 'ko'
          ? <>홉스골 호수 <br /> 푸른 <br /> <span className="text-white/70">진주</span> <br /> 투어</>
          : activeLang === 'de'
            ? <>KHUVSGUL SEE <br /> BLAUE PERLE <br /> <span className="text-white/70">NORD</span> <br /> MONGOLEI</>
            : <>KHUVSGUL LAKE <br /> BLUE PEARL <br /> <span className="text-white/70">NORTHERN</span> <br /> MONGOLIA</>,
      desc: activeLang === 'mn'
        ? "Монголын хөх сувд Хөвсгөл далай, тайгаар аялах байгалийн аялал."
        : activeLang === 'ko'
          ? "몽골의 푸른 진주 홉스골 호수와 타이가 숲을 여행하는 자연 투어."
          : activeLang === 'de'
            ? "Besuchen Sie die Blaue Perle der Mongolei, den Khuvsgul-See. Tauchen Sie ein in die unberührte Natur der nördlichen Taiga."
            : "Visit the Blue Pearl of Mongolia, Lake Khuvsgul. Immerse yourself in the pristine nature of the Northern Taiga."
    },
    {
      id: 4,
      label: activeLang === 'mn' ? "ОРХОН" : activeLang === 'ko' ? "오르혼" : activeLang === 'de' ? "ORKHON" : "ORKHON",
      title: activeLang === 'mn'
        ? <>ОРХОНЫ <br /> ХӨНДИЙ <br /> <span className="text-white/70">ТҮҮХЭН</span> <br /> АЯЛАЛ</>
        : activeLang === 'ko'
          ? <>오르혼 계곡 <br /> 역사 <br /> <span className="text-white/70">문화</span> <br /> 탐방</>
          : activeLang === 'de'
            ? <>ORKHON TAL <br /> KULTUR <br /> <span className="text-white/70">ERBE</span> <br /> TOUR</>
            : <>ORKHON VALLEY <br /> CULTURAL <br /> <span className="text-white/70">HERITAGE</span> <br /> TOUR</>,
      desc: activeLang === 'mn'
        ? "Орхоны хөндийн түүх соёлын дурсгалт газрууд, Улаан цутгалан хүрхрээ."
        : activeLang === 'ko'
          ? "오르혼 계곡의 역사 문화 유적지와 울란 추트갈란 폭포를 방문하세요."
          : activeLang === 'de'
            ? "Erkunden Sie das UNESCO-Weltkulturerbe Orkhon-Tal mit antiken Ruinen und dem großartigen Ulaan Tsutgalan Wasserfall."
            : "Explore the UNESCO World Heritage Orkhon Valley, featuring ancient ruins and the magnificent Ulaan Tsutgalan waterfall.",
      duration: activeLang === 'mn' ? "3 шөнө, 4 өдөр" : activeLang === 'ko' ? "3박 4일" : activeLang === 'de' ? "3 Nächte, 4 Tage" : "3 Nights, 4 Days",
      route: activeLang === 'mn' ? "Хархорин - Орхоны хүрхрээ - Төвхөн" : activeLang === 'ko' ? "카라코룸 - 오르혼 폭포 - 투브훈" : activeLang === 'de' ? "Kharkhorin - Orkhon Waterfall - Tuvkhun" : "Kharkhorin - Orkhon Waterfall - Tuvkhun"
    }
  ], [activeLang]);

  const activeSlide = slides[slideIndex];

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for cleaner movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Map mouse 0-1 to translate % (Reverse direction for depth: move mouse right -> bg moves left)
  const x = useTransform(springX, [0, 1], ["2%", "-2%"]);
  const y = useTransform(springY, [0, 1], ["2%", "-2%"]);

  useEffect(() => {
    // Skip parallax on mobile — no mouse events on touch devices
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to 0-1
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isMobile]);

  const t = useCallback((obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[activeLang] || obj.en || "";
  }, [activeLang]);

  const getButtonText = useCallback(() => {
    if (activeLang === 'mn') return 'Дэлгэрэнгүй';
    if (activeLang === 'ko') return '자세히 보기';
    if (activeLang === 'de') return 'Tour Entdecken';
    return 'Explore Tour';
  }, [activeLang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  if (!activeSlide) return null;

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-slate-900 text-white flex items-center justify-center overflow-hidden">
      {/* ─── 1. Background Video with Fallback Image ─── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={isMobile ? { scale: 1.05 } : { x, y, scale: 1.1 }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload={isMobile ? "none" : "metadata"}
          poster={isMobile
            ? "https://res.cloudinary.com/dc127wztz/image/upload/f_auto,q_auto,w_800/v1770961573/hero-poster_c2nbaw.png"
            : "https://res.cloudinary.com/dc127wztz/image/upload/f_auto,q_auto,w_1920/v1770961573/hero-poster_c2nbaw.png"
          }
          className="w-full h-full object-cover opacity-100"
        >
          <source src="https://res.cloudinary.com/dc127wztz/video/upload/v1769511944/hero_uzq5wr.mp4" type="video/mp4" />
          <track kind="captions" label="No captions" />
        </video>
        {/* LCP Optimization: Visible prioritized image behind video */}
        <div className="absolute inset-0 -z-20">
          <Image
            src={isMobile
              ? "https://res.cloudinary.com/dc127wztz/image/upload/f_auto,q_auto,w_800/v1770961573/hero-poster_c2nbaw.png"
              : "https://res.cloudinary.com/dc127wztz/image/upload/f_auto,q_auto,w_1920/v1770961573/hero-poster_c2nbaw.png"
            }
            alt="Tourists enjoying a Mongol travel experience in the Mongolian steppe"
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </motion.div>

      {/* ─── 2. Gradient Overlays ─── */}
      {/* Top Gradient for Navbar readability */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

      {/* General Dark Overlay - Luxury refinement */}
      <div className="absolute inset-0 z-0 bg-black/20" />

      {/* Bottom Gradient for Content readability - Deeper for luxury pop */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* ─── 3. Content ─── */}
      <div className="relative z-10 container mx-auto px-6 md:pl-12 max-w-screen-2xl w-full flex flex-col justify-center h-full">
        {/* SEO: Static H1 for search engines */}
        <h1 className="sr-only">
          Mongolia Travel & Tours | Mongol Trail Expeditions
        </h1>

        {/* Top Badges (NATURE, STAR) - Restored per image */}
        <div className="absolute top-32 left-6 md:left-10 flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
          >
            <FaPlane className="text-emerald-400 text-xs rotate-[-45deg]" />
            <span className="text-[12px] font-medium tracking-[0.2em] text-white/90 uppercase font-[var(--font-inter)]">Nature</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
          >
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-[12px] font-medium tracking-[0.2em] text-white/90 uppercase font-[var(--font-inter)]">4.9</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content (Left side) */}
          <div className="lg:col-span-8 pt-20">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeSlide?.id || 'static'}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-5xl text-left"
              >
                {/* Title - Refined Luxury Style */}
                <motion.h2
                  variants={itemVariants}
                  className="text-4xl md:text-7xl max-w-[800px] font-black leading-[1.05] mb-8 text-white tracking-tighter drop-shadow-2xl font-[var(--font-montserrat)] uppercase"
                >
                  {activeSlide.title}
                </motion.h2>

                {/* Subtext with Backdrop Blur */}
                <motion.p
                  variants={itemVariants}
                  className="text-lg font-light leading-relaxed text-white/80 max-w-2xl bg-black/10 backdrop-blur-md p-6 pt-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group font-sans mt-4"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
                  <span className="relative z-10">
                    {activeSlide.desc}
                  </span>
                </motion.p>

                {/* Duration & Route Badges */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  {/* Duration Badge */}
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 group/badge cursor-default">
                    <div className="bg-white/10 p-2 rounded-full text-white/90 group-hover/badge:bg-white/20 transition-colors">
                      <FaClock className="text-sm" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide font-[var(--font-inter)]">
                      {activeSlide.duration}
                    </span>
                  </div>

                  {/* Route Badge */}
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 group/badge cursor-default">
                    <div className="bg-white/10 p-2 rounded-full text-white/90 group-hover/badge:bg-white/20 transition-colors">
                      <FaMapMarkerAlt className="text-sm" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide font-[var(--font-inter)]">
                      {activeSlide.route}
                    </span>
                  </div>
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Pagination/Locations List (Right side) */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end gap-6 pr-10 mt-20">
            {/* Dynamic List matching slides */}
            {slides.map((item, idx) => {
              const isActive = idx === slideIndex;
              return (
                <Magnetic key={`${item.id}-${idx}`}>
                  <motion.div
                    onClick={() => setSlideIndex(idx)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + idx * 0.1 }}
                    className="flex items-center gap-6 group cursor-pointer relative transition-all duration-300 hover:scale-105 justify-end w-full"
                  >
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold tracking-[0.2em] transition-colors font-[var(--font-inter)] mb-1 ${isActive ? 'text-sky-400' : 'text-white/30 group-hover:text-white/70'}`}>
                        0{item.id}
                      </span>
                      <span className={`text-[14px] font-bold tracking-[0.1em] uppercase transition-all duration-300 text-right leading-relaxed font-[var(--font-inter)] ${isActive ? 'text-white scale-110 origin-right' : 'text-white/40 group-hover:text-white/80'}`}>
                        {item.label}
                      </span>
                    </div>

                    {/* Active Indicator Line */}
                    <div className={`relative w-[3px] rounded-full overflow-hidden transition-all duration-500 ease-out ${isActive ? 'h-16 bg-white/10' : 'h-8 bg-white/5 group-hover:h-10'}`}>
                      <motion.div
                        className={`absolute top-0 left-0 w-full bg-gradient-to-b from-sky-400 to-blue-600 shadow-[0_0_15px_rgba(56,189,248,0.6)]`}
                        initial={{ height: "0%" }}
                        animate={{ height: isActive ? "100%" : "0%" }}
                        transition={{ duration: isActive ? 0.6 : 0.3 }}
                      />
                    </div>
                  </motion.div>
                </Magnetic>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────── Helpers ────────────────────── */

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      x.set(middleX * 0.15); // Magnetic strength
      y.set(middleY * 0.15);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

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
