

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Info, User, Heart } from "lucide-react";
import { Locale } from "@/i18n-config";
import { UserButton, useUser } from "@clerk/nextjs";

interface MobileBottomNavProps {
  language: Locale;
  dictionary: any;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language, dictionary }) => {
  const pathname = usePathname();
  const t = dictionary || {};
  const { isSignedIn, user } = useUser();
  const wishlistCount = Array.isArray(user?.publicMetadata?.wishlist)
    ? (user?.publicMetadata?.wishlist as string[]).length
    : 0;

  const tabs = useMemo(() => [
    { id: "home", label: t.home || "Нүүр", href: `/${language}`, icon: Home },
    { id: "packages", label: t.packages || "Багцууд", href: `/${language}/packages`, icon: Search },
    { id: "about", label: t.about || "Бидний тухай", href: `/${language}/about`, icon: Info },
    { id: "wishlist", label: t.wishlist || "Хүслийн жагсаалт", href: `/${language}/dashboard/wishlist`, icon: Heart },
    { id: "profile", label: t.myAccount || "Миний бүртгэл", href: `/${language}/dashboard`, icon: User },
  ], [language, t]);

  const activeIndex = tabs.findIndex(tab =>
    pathname === tab.href || (tab.id === 'home' && pathname === `/${language}`)
  );

  const activeTabId = activeIndex !== -1 ? tabs[activeIndex].id : null;

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 inset-x-0 z-[var(--z-navbar)] md:hidden pb-6 pb-[env(safe-area-inset-bottom)] mobile-bottom-nav"
      role="navigation"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="mx-4 mb-6 rounded-2xl bg-white/70 backdrop-blur-md border-t border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] px-6 py-3 min-h-[80px]">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            const Icon = tab.icon;

            // 1. If it's the Profile tab and user is Signed In -> Show Clerk UserButton
            if (tab.id === 'profile' && isSignedIn) {
              return (
                <div key={tab.id} className="relative flex flex-col items-center gap-1 p-2 min-w-[44px] min-h-[44px] justify-center" aria-label="Profile" role="button">
                  <div className={`p-0.5 rounded-full border-2 ${isActive ? 'border-blue-500' : 'border-transparent'}`}>
                    <UserButton
                      afterSignOutUrl={`/`}
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7 mx-auto",
                          userButtonPopoverCard: "w-[calc(100vw-32px)] max-w-[360px] mx-auto font-[var(--font-inter)]",
                          userButtonPopoverActionButton: "text-blue-600 hover:text-blue-700",
                          userButtonPopoverActionButtonIcon: "text-blue-600"
                        },
                        variables: {
                          colorPrimary: '#2563eb',
                          fontFamily: 'var(--font-inter)'
                        }
                      }}
                    />
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center gap-1 p-2 group min-w-[44px] min-h-[44px] justify-center"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative z-10 p-1 transition-colors duration-300 ${isActive ? "text-blue-600 drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                  >
                    <Icon size={28} strokeWidth={isActive ? 2.5 : 1.5} />
                  </motion.div>

                  {/* Badge Polish */}
                  {tab.id === "wishlist" && wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={wishlistCount} // Trigger animation on count change
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm border border-white min-w-[16px] text-center flex items-center justify-center h-4"
                    >
                      {wishlistCount}
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                    </motion.span>
                  )}
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;

