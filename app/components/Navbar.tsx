"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

// Icons matching the image style
import { 
  HiHome, HiOutlineHome, 
  HiChartBar, HiOutlineChartBar, 
  HiClock, HiOutlineClock, 
  HiBell, HiOutlineBell, 
  HiUser, HiOutlineUser,
  HiChevronDown, HiGlobeAlt
} from "react-icons/hi2";
import { FaPlane, FaTachometerAlt } from "react-icons/fa";

import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "mn", label: "Mongolian", flag: "🇲🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
];

const Navbar: React.FC<{ dictionary: any }> = ({ dictionary }) => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<{ width: number; left: number } | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 100) setHidden(true);
    else setHidden(false);
  });

  const t = dictionary || {};

  const desktopLinks = [
    { id: "home", label: t.home || "Home", href: `/${language}` },
    { id: "packages", label: t.packages || "Packages", href: `/${language}/packages` },
    { id: "blog", label: t.blog || "Blog", href: `/${language}/blog` },
    { id: "about", label: t.about || "About", href: `/${language}/about` },
  ];

  const dashboardLabel = language === 'mn' ? "Миний аялал" : language === 'ko' ? "내 예약" : "Dashboard";

  const mobileTabs = useMemo(() => [
    { id: "home", href: `/${language}`, icon: HiOutlineHome, activeIcon: HiHome },
    { id: "stats", href: `/${language}/packages`, icon: HiOutlineChartBar, activeIcon: HiChartBar },
    { id: "recent", href: `/${language}/rewards`, icon: HiOutlineClock, activeIcon: HiClock },
    { id: "notifs", href: `/${language}/notifications`, icon: HiOutlineBell, activeIcon: HiBell },
    { id: "profile", href: `/${language}/dashboard`, icon: HiOutlineUser, activeIcon: HiUser },
  ], [language]);

  // Find active index for the mobile dip animation
  const activeIndex = mobileTabs.findIndex(tab => 
    pathname === tab.href || (tab.id === 'home' && pathname === `/${language}`)
  );

  return (
    <>
      {/* ─── DESKTOP HEADER ─── */}
      <motion.header
        animate={hidden ? { y: -100 } : { y: 0 }}
        className="fixed top-0 inset-x-0 z-40 hidden md:flex justify-center p-4"
      >
        <nav className="w-full max-w-screen-2xl bg-white/80 backdrop-blur-md border border-slate-200 px-8 py-3 rounded-full flex items-center justify-between shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <FaPlane size={14} />
            </div>
            <span className="font-black text-slate-800 tracking-tighter">MONGOL TRAIL</span>
          </Link>
          
          <div className="flex gap-6">
            {desktopLinks.map(link => (
               <Link key={link.id} href={link.href} className="text-sm font-bold text-slate-600 hover:text-black">
                 {link.label}
               </Link>
            ))}
            <SignedIn>
              <Link href={`/${language}/dashboard`} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                {dashboardLabel}
              </Link>
            </SignedIn>
          </div>

          <div className="flex items-center gap-4">
            <LanguageDropdown language={language} setLanguage={setLanguage} />
            <SignedIn><UserButton /></SignedIn>
            <SignedOut><Link href="/sign-in" className="text-sm font-bold">Login</Link></SignedOut>
          </div>
        </nav>
      </motion.header>

      {/* ──────────────── MOBILE TAB BAR (IMAGE ACCURATE) ──────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden flex justify-center pb-6 px-4">
        <div className="relative w-full max-w-md h-[70px] flex items-center justify-around">
          
          {/* THE SVG BACKGROUND WITH ANIMATED DIP */}
          <div className="absolute inset-0 z-0">
            <svg
              viewBox="0 0 400 100"
              className="w-full h-full fill-slate-950 filter drop-shadow-2xl"
              preserveAspectRatio="none"
            >
              <motion.path
                animate={{
                  // The "d" attribute draws a rectangle with a U-shaped dip that moves based on activeIndex
                  d: generatePath(activeIndex !== -1 ? activeIndex : 0, mobileTabs.length)
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </svg>
          </div>

          {/* TAB ICONS */}
          {mobileTabs.map((tab, idx) => {
            const isActive = activeIndex === idx;
            const Icon = isActive ? tab.activeIcon : tab.icon;

            return (
              <Link key={tab.id} href={tab.href} className="relative z-20 w-16 h-16 flex items-center justify-center">
                {/* FLOATING ORANGE CIRCLE */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeCircle"
                      className="absolute -top-6 w-14 h-14 bg-[#f3864c] rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    >
                      <Icon className="text-white text-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* INACTIVE ICON */}
                <motion.div
                  animate={{ opacity: isActive ? 0 : 1 }}
                  className="text-slate-500 text-2xl"
                >
                  <Icon />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

/**
 * Generates an SVG path for a bar with a "U" shaped dip at a specific index.
 */
function generatePath(index: number, totalTabs: number) {
  const width = 400; // SVG coordinate width
  const tabWidth = width / totalTabs;
  const centerX = tabWidth * index + tabWidth / 2;
  
  // Dip dimensions
  const dipWidth = 60;
  const dipDepth = 45;

  return `
    M 0 0 
    L ${centerX - dipWidth} 0
    C ${centerX - dipWidth + 10} 0, ${centerX - 25} ${dipDepth}, ${centerX} ${dipDepth}
    C ${centerX + 25} ${dipDepth}, ${centerX + dipWidth - 10} 0, ${centerX + dipWidth} 0
    L ${width} 0
    L ${width} 100
    L 0 100
    Z
  `;
}

/* ─── Language Dropdown ─── */
const LanguageDropdown = ({ language, setLanguage }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-slate-600 hover:text-black transition-colors">
        <HiGlobeAlt size={18} />
        <span className="text-xs font-bold uppercase">{language}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl py-2 border border-slate-100 overflow-hidden"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-50 flex items-center gap-2"
              >
                <span>{lang.flag}</span> {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;