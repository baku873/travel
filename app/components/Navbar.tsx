"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Search,
  User,
  Globe,
  ChevronDown,
  Map as MapIcon,
  Compass,
  Phone,
  Home,
  LogOut,
  Settings,
  Heart,
  LayoutDashboard
} from "lucide-react";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import { useLanguage } from "../context/LanguageContext";
import { Locale } from "@/i18n-config";
import Image from "next/image";
import { content } from "../content";

const LANGUAGES = [
  { code: "mn", label: "MN", flag: "🇲🇳" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ko", label: "KO", flag: "🇰🇷" },
  { code: "de", label: "DE", flag: "🇩🇪" },
] as const;

/* ────────────────────── Flag Component ────────────────────── */
const FlagIcon = ({ code, className = "" }: { code: string, className?: string }) => {
  switch (code) {
    case 'mn':
      return (
        <svg viewBox="0 0 640 480" className={className}>
          <g fillRule="evenodd">
            <path fill="#bd0029" d="M0 0h213.3v480H0z" />
            <path fill="#0066aa" d="M213.3 0h213.4v480H213.3z" />
            <path fill="#bd0029" d="M426.7 0H640v480H426.7z" />
            <path fill="#ffdb00" d="M106.7 348.8l-18.7-6.2v-24.8l18.7 6.2 18.6-6.2v24.8zM106.7 131.2l-18.7-6.2V100l18.7 6.2 18.6-6.2v25zM96 235h21.3v17.5H96zm0-62.5h21.3V190H96zM128 393.8c0 4.8-3.3 8.7-8 10.4l-13.3 5-13.4-5c-4.7-1.7-8-5.6-8-10.4v-8.8l21.4 8 21.3-8v8.8zM106.7 87.5c-11 0-20-8.2-21.3-18.8h42.6c-1.3 10.6-10.3 18.8-21.3 18.8zM85.3 46.2c1.3-10.5 10.3-18.7 21.4-18.7 11 0 20 8.2 21.3 18.7H85.3z" />
          </g>
        </svg>
      );
    case 'en':
      return (
        <svg viewBox="0 0 640 480" className={className}>
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 62V0h75z" />
          <path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
          <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
          <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
        </svg>
      );
    case 'ko':
      return (
        <svg viewBox="0 0 36 24" className={className}>
          <rect width="36" height="24" fill="#fff" />
          <g transform="rotate(-33.69 18 12)">
            <g fill="#000">
              {/* Geon (Top Left) */}
              <path d="M6 4h2v10H6zm3 0h2v10H9zm3 0h2v10h-2z" />
              {/* Gam (Top Right) */}
              <path d="M24 4h2v4.5h-2zm0 5.5h2v4.5h-2zm3-10h2v10h-2zm3 0h2v4.5h-2zm0 5.5h2v4.5h-2z" />
              {/* Gon (Bottom Right) */}
              <path d="M24 16h2v4.5h-2zm0 5.5h2v4.5h-2zm3-10h2v4.5h-2zm0 5.5h2v4.5h-2zm3-10h2v4.5h-2zm0 5.5h2v4.5h-2z" />
              {/* Ri (Bottom Left) */}
              <path d="M6 16h2v10H6zm3 0h2v4.5H9zm0 5.5h2v4.5H9zm3-10h2v10h-2z" />
            </g>
            {/* Taegeuk */}
            <circle cx="18" cy="12" r="6" fill="#cd2e3a" />
            <path d="M18 12a3 3 0 0 0 0 6 6 6 0 0 0 0-12 3 3 0 0 1 0 6z" fill="#0047a0" />
          </g>
        </svg>
      );
    case 'de':
      return (
        <svg viewBox="0 0 5 3" className={className}>
          <rect width="5" height="3" y="0" x="0" fill="#000" />
          <rect width="5" height="2" y="1" x="0" fill="#D00" />
          <rect width="5" height="1" y="2" x="0" fill="#FFCE00" />
        </svg>
      );
    default: return null;
  }
}


const Navbar: React.FC<{ dictionary: any }> = ({ dictionary }) => {
  const { language, setLanguage, t: translate } = useLanguage();
  const { user } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Use client-side content for instant switching
  const navT = content.navbar;

  // Handle Scroll Effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { id: "home", label: translate(navT.home), href: `/${language}` },
    { id: "packages", label: translate(navT.packages), href: `/${language}/packages` },
    { id: "about", label: translate(navT.about), href: `/${language}/about` },
    { id: "contact", label: translate(navT.contact), href: `/${language}/contact` },
  ];

  const wishlistCount = Array.isArray(user?.publicMetadata?.wishlist)
    ? (user?.publicMetadata?.wishlist as string[]).length
    : 0;

  return (
    <>
      {/* DESKTOP NAVBAR (Hidden on Mobile) */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`hidden md:flex fixed top-8 inset-x-0 mx-auto w-fit min-w-[70%] rounded-full transition-all duration-500 z-50 backdrop-blur-xl items-center justify-between hover:bg-white px-8 ${isScrolled
          ? "bg-white/90 shadow-sm border border-slate-200 py-2"
          : "bg-white/70 shadow-none border border-transparent py-4"
          }`}
        role="banner"
      >
        <nav className="w-full flex items-center justify-between gap-12" aria-label="Main Navigation">

          {/* 1. LOGO */}
          <Link href={`/${language}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-full p-0.5 shadow-sm bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-white">
                <Image
                  src="https://res.cloudinary.com/dc127wztz/image/upload/w_200,f_auto,q_auto/v1770961573/hero-poster_c2nbaw.png"
                  alt="Mongol Trail Logo"
                  width={40}
                  height={40}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-lg leading-none font-[var(--font-montserrat)] text-slate-900">
                MONGOL
              </span>
              <span className="font-bold tracking-[0.3em] text-[8px] uppercase leading-none mt-0.5 text-slate-500">
                TRAIL
              </span>
            </div>
          </Link>

          {/* 2. CENTER MENU */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-[13px] font-medium tracking-tight text-slate-600 hover:text-slate-900 transition-colors relative group font-[var(--font-inter)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <LanguageDropdown language={language} setLanguage={setLanguage} />
            </div>
            <Link
              href={`/${language}/dashboard/wishlist`}
              className="relative flex items-center gap-2 bg-slate-100/50 border border-slate-200 rounded-full pl-2 pr-4 py-1.5 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-sm">
                <Heart size={14} />
              </div>
              <span className="text-[13px] font-medium tracking-tight text-slate-900 font-[var(--font-inter)]">
                {translate(navT.wishlist) || "Wishlist"}
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Auth/Profile - Pill Style */}
            <SignedIn>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${language}/profile`}
                  className="flex items-center gap-2 bg-slate-100/50 border border-slate-200 rounded-full pl-2 pr-4 py-1.5 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
                >
                  <div className="w-7 h-7 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-sm">
                    <User size={14} />
                  </div>
                  <span className="text-[13px] font-medium tracking-tight text-slate-900 font-[var(--font-inter)]">
                    {translate(navT.profile) || "Profile"}
                  </span>
                </Link>
                <UserButton
                  afterSignOutUrl={`/`}
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-white shadow-sm",
                      userButtonPopoverCard: "w-[calc(100vw-32px)] max-w-[360px] mx-auto font-[var(--font-inter)]",
                      userButtonPopoverActionButton: "text-blue-600 hover:text-blue-700",
                      userButtonPopoverActionButtonIcon: "text-blue-600"
                    }
                    ,
                    variables: {
                      colorPrimary: '#2563eb',
                      fontFamily: 'var(--font-inter)'
                    }
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <Link
                href={`/${language}/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-2 bg-slate-100/50 border border-slate-200 rounded-full pl-2 pr-4 py-1.5 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
              >
                <div className="w-7 h-7 rounded-full bg-white text-slate-400 flex items-center justify-center shadow-sm">
                  <User size={14} />
                </div>
                <span className="text-[13px] font-medium tracking-tight text-slate-900 font-[var(--font-inter)]">
                  {translate(navT.login)}
                </span>
              </Link>
            </SignedOut>
          </div>
        </nav>
      </motion.header>

      {/* MOBILE HEADER (Just Logo & Profile/Search maybe? - Keeping it minimal as requested) */}
      <div className="md:hidden fixed top-0 inset-x-0 z-[var(--z-navbar)] pt-10 px-4 pb-4 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent">
        <Link href={`/${language}`} className="flex items-center gap-2" aria-label="Mongol Trail Home">
          <div
            className="rounded-full bg-white shadow-md p-0.5 overflow-hidden shrink-0"
            style={{ width: 36, height: 36 }}
          >
            <Image src="https://res.cloudinary.com/dc127wztz/image/upload/w_200,f_auto,q_auto/v1770961573/hero-poster_c2nbaw.png" alt="Mongol Trail Logo" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight whitespace-nowrap">MONGOL TRAIL</span>
        </Link>
        <LanguageDropdown language={language} setLanguage={setLanguage} mobile />
      </div>
    </>
  );
};

const LanguageDropdown = ({ language, setLanguage, mobile }: { language: Locale; setLanguage: (lang: Locale) => void, mobile?: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        aria-label="Select Language"
        aria-expanded={open}
        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 ${mobile
          ? 'bg-white/80 shadow-sm backdrop-blur-sm'
          : 'bg-slate-100/50 border border-slate-200 shadow-sm hover:scale-105 hover:bg-white hover:shadow-md active:scale-95'
          }`}>
        <div className="w-5 h-5 rounded-full overflow-hidden relative shadow-sm border border-slate-100 shrink-0">
          <FlagIcon code={language} className="w-full h-full object-cover" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-slate-700 font-[var(--font-inter)]">{language.toUpperCase()}</span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-40 bg-white rounded-[20px] shadow-xl border border-slate-100 overflow-hidden py-1.5 z-[var(--z-dropdown)]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-[13px] font-semibold flex items-center justify-between group transition-all ${language === lang.code ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <span className="group-hover:translate-x-1 transition-transform">{lang.label}</span>
                <div className="w-6 h-6 rounded-full overflow-hidden relative shadow-sm border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                  <FlagIcon code={lang.code} className="w-full h-full object-cover" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
