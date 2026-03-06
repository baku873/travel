"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPaperPlane,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPlane
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../content";

const Footer: React.FC<{ dictionary: any, navDictionary: any }> = ({ dictionary, navDictionary }) => {
  const { language } = useLanguage();
  const activeLang = language;

  // Helper to safely get content
  const getContent = (key: keyof typeof content.footer) => {
    const item = content.footer[key];
    // @ts-ignore
    return item[activeLang] || item.en;
  };

  const getNavContent = (key: keyof typeof content.navbar) => {
    const item = content.navbar[key];
    // @ts-ignore
    return item[activeLang] || item.en;
  };

  // 1. Force English for International Presentation (as requested)
  const t = {
    newsletterTitle: getContent('newsletterTitle'),
    newsletterDesc: getContent('newsletterDesc'),
    emailPlaceholder: getContent('emailPlaceholder'),
    brandDesc: getContent('brandDesc'),
    menuTitle: getContent('menuTitle'),
    trendingTitle: getContent('trendingTitle'),
    contactTitle: getContent('contactTitle'),
    address: getContent('address'),
    copyright: getContent('copyright'),
    policy: getContent('policy'),
    terms: getContent('terms'),
    europe: getContent('europe'),
    switzerland: getContent('switzerland')
  };

  const navT = {
    home: getNavContent('home'),
    packages: getNavContent('packages'),
    blog: getNavContent('blog'),
    about: getNavContent('about'),
    contact: getNavContent('contact')
  };

  const navLinks = [
    { label: navT.home, href: "/" },
    { label: navT.packages, href: "/packages" },
    { label: navT.blog, href: "/blog" },
    { label: navT.about, href: "/about" },
    { label: navT.contact, href: "/contact" },
  ];

  return (
    <footer className="relative bg-slate-900 pt-32 pb-10 overflow-hidden hide-in-native-app">

      {/* ─── 1. CURVED TOP WAVE ─── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px] fill-slate-50">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* ─── 2. FLOATING NEWSLETTER ─── */}
      <div className="container mx-auto px-4 relative z-20 -mt-24 mb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-blue-600/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded-full" />
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

          <div className="text-white relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black mb-2 font-[var(--font-montserrat)] tracking-tight">{t.newsletterTitle}</h3>
            <p className="text-blue-100 font-medium font-[var(--font-inter)]">{t.newsletterDesc}</p>
          </div>

          <div className="flex w-full md:w-auto relative z-10 bg-white/10 p-1.5 rounded-full border border-white/20 backdrop-blur-sm group hover:bg-white/15 transition-colors">
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              className="bg-transparent border-none text-white placeholder:text-blue-200 focus:ring-0 px-6 py-3 w-full md:w-80 outline-none font-[var(--font-inter)] font-light"
            />
            <button className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ─── 3. MAIN FOOTER CONTENT ─── */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                <FaPlane size={20} />
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-[var(--font-montserrat)]">
                Mongol Trail
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-[var(--font-inter)] font-light">
              {t.brandDesc}
            </p>

            {/* 👇 UPDATED SOCIAL ICONS WITH LINKS */}
            <div className="flex gap-4">
              {[
                {
                  Icon: FaFacebookF,
                  href: "https://www.facebook.com/profile.php?id=61580867289571"
                },
                {
                  Icon: FaInstagram,
                  href: "https://www.instagram.com/euro.trails/"
                },
                // Placeholder for others if needed
                { Icon: FaTwitter, href: "#" },
                { Icon: FaYoutube, href: "#" }
              ].map(({ Icon, href }, idx) => (
                <SocialIcon key={idx} icon={Icon} href={href} />
              ))}
            </div>

          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-[var(--font-inter)] font-semibold text-sm uppercase tracking-[0.2em] mb-6">{t.menuTitle}</h4>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors text-sm font-[var(--font-inter)] font-light flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Destinations */}
          <div>
            <h4 className="text-white font-[var(--font-inter)] font-semibold text-sm uppercase tracking-[0.2em] mb-6">{t.trendingTitle}</h4>
            <ul className="space-y-4">
              {/* Hardcoding trending items logic or using simple dictionary lookup if available */}
              {/* mn.json: "europe": "Европ", "switzerland": "Швейцарь" */}
              <li>
                <Link href="/packages/europe" className="text-slate-400 hover:text-white transition-colors text-sm font-[var(--font-inter)] font-light">
                  {t.europe}
                </Link>
              </li>
              <li>
                <Link href="/packages/europe" className="text-slate-400 hover:text-white transition-colors text-sm font-[var(--font-inter)] font-light">
                  {t.switzerland}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-[var(--font-inter)] font-semibold text-sm uppercase tracking-[0.2em] mb-6">{t.contactTitle}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm font-[var(--font-inter)] font-light">
                <FaMapMarkerAlt className="text-sky-500 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">{t.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm font-[var(--font-inter)] font-light">
                <FaPhoneAlt className="text-sky-500 flex-shrink-0" />
                <span>+976 7766-1626</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm font-[var(--font-inter)] font-light">
                <FaEnvelope className="text-sky-500 flex-shrink-0" />
                <span>info@mongoltrail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ─── 4. BOTTOM BAR ─── */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px] font-[var(--font-inter)] font-light">
          <p>{t.copyright}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">{t.policy}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t.terms}</Link>
            <Link href="#" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="#" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>

      {/* ─── 5. BACKGROUND DECORATION ─── */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-cover mix-blend-overlay" />

      <motion.div
        animate={{ x: ["-10vw", "110vw"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-0 text-slate-800 opacity-20 pointer-events-none"
      >
        <FaPlane size={150} />
      </motion.div>

    </footer>
  );
};

/* ─── Social Icon Helper (UPDATED WITH HREF) ─── */
const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -5, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-white/10"
  >
    <Icon size={14} />
  </motion.a>
);

export default Footer;