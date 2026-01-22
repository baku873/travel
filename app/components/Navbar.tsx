"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useMotionTemplate, // Added for smooth color interpolation
  Variants,
} from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSignInAlt,
  FaTimes,
  FaPlane,
  FaUser,
  FaChevronDown,
  FaUmbrellaBeach,
  FaTachometerAlt,
  FaGlobe,
} from "react-icons/fa";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Animation Variants ────────────────────── */
const navContainerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
};

/* ────────────────────── Types ────────────────────── */
type Language = "mn" | "en" | "ko";

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  subMenu?: NavLinkItem[];
}

interface HoveredLink {
  width: number;
  left: number;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "mn", label: "Mongolian", flag: "🇲🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
];

/* ────────────────────── Main Component ────────────────────── */
const Navbar: React.FC<{ dictionary: any }> = ({ dictionary }) => {
  const { language, setLanguage } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<HoveredLink | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  // Scroll Logic: Hide on down scroll, show on up scroll or top
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) setHidden(true);
    else setHidden(false);
  });

  // 1. Define Motion Values
  const opacityVal = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const blurVal = useTransform(scrollY, [0, 100], [8, 20]); // Numbers, not strings
  const borderAlpha = useTransform(scrollY, [0, 100], [0, 1]);
  const widthConstraint = useTransform(scrollY, [0, 100], ["100%", "95%"]);
  const topPosition = useTransform(scrollY, [0, 100], ["0rem", "1rem"]);

  // 2. Create Dynamic Templates (Fixes animation not updating)
  const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${opacityVal})`;
  const backdropFilter = useMotionTemplate`blur(${blurVal}px)`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderAlpha})`;

  // 3. SAFETY FIX: Ensure 't' is always an object to prevent crashes
  const t = dictionary || {};

  const currentLinks: NavLinkItem[] = [
    { id: "home", label: t.home || "Home", href: "/" },
    {
      id: "packages",
      label: t.packages || "Packages",
      href: "/packages",
      subMenu: [
        { id: "europe", label: t.europe || "Europe", href: "/packages/europe" },
        { id: "mongolia", label: t.mongolia || "Mongolia", href: "/packages/mongolia" },
      ],
    },
    { id: "blog", label: t.blog || "Blog", href: "/blog" },
    { id: "about", label: t.about || "About", href: "/about" },
    { id: "contact", label: t.contact || "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* ──────────────── Top Bar (Disappears on Scroll) ──────────────── */}
      <motion.div
        style={{ opacity: useTransform(scrollY, [0, 50], [1, 0]), pointerEvents: hidden ? 'none' : 'auto' }}
        className="fixed inset-x-0 top-0 z-50 bg-slate-900 text-white h-10 flex items-center justify-center overflow-hidden"
      >
         <div className="w-full max-w-screen-2xl px-6 flex justify-between items-center text-xs font-medium text-slate-300">
            <div className="flex items-center gap-4">
               <span className="flex items-center gap-2"><FaPlane className="text-sky-400"/> {t.slogan || "Explore the unseen."}</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex gap-3">
                  <a href="#" className="hover:text-sky-400 transition"><FaFacebookF/></a>
                  <a href="#" className="hover:text-pink-400 transition"><FaInstagram/></a>
               </div>
               <div className="h-3 w-px bg-white/20"/>
               <LanguageDropdown language={language} setLanguage={setLanguage} />
            </div>
         </div>
      </motion.div>

      {/* ──────────────── Main Floating Navbar ──────────────── */}
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed inset-x-0 z-40 flex justify-center pointer-events-none"
        style={{ top: topPosition }}
      >
        <motion.nav
          ref={navRef}
          initial="hidden"
          animate="show"
          variants={navContainerVariants}
          style={{
            width: widthConstraint,
            // Applied fixed templates here
            backgroundColor, 
            backdropFilter,
            borderColor
          }}
          className="relative pointer-events-auto flex items-center justify-between max-w-screen-2xl mx-auto px-4 md:px-8 py-2.5 rounded-full shadow-lg shadow-sky-900/5 border transition-shadow duration-300"
        >
          {/* Logo */}
          <motion.div variants={navItemVariants} className="flex-shrink-0 z-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-sky-500 to-blue-600 rounded-xl text-white shadow-lg shadow-sky-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
                <FaPlane className="relative z-10 group-hover:-rotate-12 transition-transform duration-300" size={18} />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="block text-lg font-black text-slate-800 tracking-tight">MONGOL</span>
                <span className="block text-xs font-bold text-sky-600 uppercase tracking-widest">Trail</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 z-10 relative">
             {/* The Hover "Pill" Background */}
             <motion.div
                className="absolute h-9 bg-sky-50 rounded-full -z-10"
                initial={false}
                animate={{
                  width: hoveredLink?.width || 0,
                  left: hoveredLink?.left || 0,
                  opacity: hoveredLink ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            
            {currentLinks.map((link) => (
              <DesktopNavLink
                key={link.id}
                link={link}
                setHoveredLink={setHoveredLink}
                navRef={navRef}
              />
            ))}
          </div>

          {/* Right Side: Auth & Mobile Toggle */}
          <motion.div variants={navItemVariants} className="flex items-center gap-3 z-20">
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <Link href="/sign-in" className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">
                    {t.login || "Login"}
                </Link>
                <Link href="/sign-up" className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2">
                  {t.register || "Register"} <FaUser className="text-xs text-sky-400"/>
                </Link>
              </div>
            </SignedOut>
            
            <SignedIn>
                <Link href="/dashboard" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors">
                    <FaTachometerAlt />
                </Link>
                <div className="hidden md:block">
                  <UserButton afterSignOutUrl="/" />
                </div>
            </SignedIn>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <AnimatedHamburgerIcon isOpen={mobileOpen} />
            </button>
          </motion.div>
        </motion.nav>
      </motion.header>

      {/* ──────────────── Mobile Menu (Bottom Sheet) ──────────────── */}
      <MobileMenu
        isOpen={mobileOpen}
        closeMenu={() => setMobileOpen(false)}
        links={currentLinks}
        t={t}
        language={language}
        setLanguage={setLanguage}
      />
    </>
  );
};

/* ────────────────────── Helper Components ────────────────────── */

const DesktopNavLink: React.FC<any> = ({ link, setHoveredLink, navRef }) => {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Calculate position relative to the nav container
  const handleMouseEnter = () => {
    if (linkRef.current && navRef.current) {
      const linkRect = linkRef.current.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      setHoveredLink({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    }
    if (link.subMenu) setOpen(true);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setHoveredLink(null);
        setOpen(false);
      }}
      className="relative"
    >
      <Link
        ref={linkRef}
        href={link.href}
        className={`flex items-center gap-1.5 px-4 py-2 text-[15px] font-bold transition-colors ${open ? "text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
      >
        {link.label}
        {link.subMenu && <FaChevronDown className={`text-[10px] transition-transform ${open ? 'rotate-180 text-sky-500' : 'text-slate-400'}`} />}
      </Link>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && link.subMenu && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60"
          >
            <div className="bg-white rounded-2xl p-2 shadow-xl shadow-sky-900/10 border border-slate-100 ring-1 ring-slate-900/5 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500"/>
              {link.subMenu.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <FaUmbrellaBeach size={12} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-700 group-hover:text-slate-900">
                      {item.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Explore</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LanguageDropdown = ({ language, setLanguage }: any) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative z-50" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button className="flex items-center gap-1 uppercase hover:text-white transition">
                <FaGlobe className="text-sky-400"/>
                {language}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 text-slate-800 overflow-hidden"
                    >
                        {LANGUAGES.map(lang => (
                            <button 
                                key={lang.code}
                                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-sky-50 ${language === lang.code ? 'font-bold text-sky-600' : ''}`}
                            >
                                <span>{lang.flag}</span> {lang.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const MobileMenu: React.FC<any> = ({ isOpen, closeMenu, links, t, language, setLanguage }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 z-[1000] bg-white rounded-t-[2rem] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="w-full flex justify-center py-4 cursor-pointer" onClick={closeMenu}>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-6 pb-8 overflow-y-auto flex-1">
                {/* Header */}
              <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{t.menu || "Menu"}</h3>
                </div>
                <button onClick={closeMenu} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition">
                  <FaTimes size={16} />
                </button>
              </div>

                {/* Auth */}
              <div className="mb-8">
                <SignedOut>
                  <div className="flex flex-col gap-3">
                    <Link href="/sign-in" onClick={closeMenu} className="w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-bold text-center border border-slate-100">
                      {t.login || "Log In"}
                    </Link>
                    <Link href="/sign-up" onClick={closeMenu} className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-center shadow-lg shadow-sky-500/20">
                      {t.register || "Create Account"}
                    </Link>
                  </div>
                </SignedOut>
                <SignedIn>
                   <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase">Signed in as</span>
                            <span className="font-bold text-slate-800">Traveler</span>
                        </div>
                   </div>
                </SignedIn>
              </div>

                {/* Links */}
              <nav className="space-y-2 mb-8">
                {links.map((link: any) => (
                  <MobileNavLink key={link.id} link={link} closeMenu={closeMenu} />
                ))}
              </nav>

                {/* Footer Controls */}
              <div className="pt-6 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map(lang => (
                        <button 
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${language === lang.code ? 'bg-sky-50 border-sky-200 text-sky-700 ring-2 ring-sky-100' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                            <span className="text-xl mb-1">{lang.flag}</span>
                            <span className="text-[10px] font-bold uppercase">{lang.code}</span>
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MobileNavLink: React.FC<any> = ({ link, closeMenu }) => {
  const [open, setOpen] = useState(false);
  const hasSub = link.subMenu && link.subMenu.length > 0;

  return (
    <div className="border-b border-slate-50 last:border-0">
      <div
        onClick={() => hasSub ? setOpen(!open) : null}
        className="flex justify-between items-center py-4 cursor-pointer"
      >
        <Link
          href={!hasSub ? link.href : "#"}
          onClick={!hasSub ? closeMenu : undefined}
          className={`text-lg font-bold transition-colors ${open ? 'text-sky-600' : 'text-slate-700'}`}
        >
          {link.label}
        </Link>
        {hasSub && (
            <FaChevronDown className={`text-slate-300 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        )}
      </div>
      <AnimatePresence>
        {open && hasSub && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <div className="bg-slate-50 rounded-xl mb-4 p-2 space-y-1">
                    {link.subMenu.map((sub: any) => (
                        <Link 
                            key={sub.id} 
                            href={sub.href}
                            onClick={closeMenu}
                            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white hover:text-sky-600 transition-colors"
                        >
                            {sub.label}
                        </Link>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="stroke-current">
    <motion.path strokeWidth="3" strokeLinecap="round" animate={isOpen ? { d: "M 6 18 L 18 6" } : { d: "M 4 6 L 20 6" }} />
    <motion.path strokeWidth="3" strokeLinecap="round" animate={isOpen ? { opacity: 0 } : { opacity: 1 }} d="M 4 12 L 20 12" />
    <motion.path strokeWidth="3" strokeLinecap="round" animate={isOpen ? { d: "M 6 6 L 18 18" } : { d: "M 4 18 L 20 18" }} />
  </svg>
);

export default Navbar;