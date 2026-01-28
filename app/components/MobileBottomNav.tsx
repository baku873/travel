"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, History, User } from "lucide-react";

import { Locale } from "@/i18n-config";

interface MobileBottomNavProps {
    language: Locale;
    dictionary: any;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language, dictionary }) => {
    const pathname = usePathname();
    const t = dictionary || {};

    const tabs = useMemo(() => [
        { id: "home", label: t.home || "Home", href: `/${language}`, icon: Home },
        { id: "search", label: t.packages || t.course || "Search", href: `/${language}/packages`, icon: Search },
        { id: "history", label: t.about || "About", href: `/${language}/about`, icon: History },
        { id: "profile", label: t.myAccount || "Profile", href: `/${language}/dashboard`, icon: User },
    ], [language, t]);

    const activeIndex = tabs.findIndex(tab =>
        pathname === tab.href || (tab.id === 'home' && pathname === `/${language}`)
    );

    const safeIndex = activeIndex !== -1 ? activeIndex : 0;

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden native-app:block flex justify-center pb-8 px-4 mobile-bottom-nav">
            <div className="relative w-full max-w-md h-[85px] flex items-center justify-around bg-transparent overflow-visible">

                {/* THE SVG NOTCH BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <svg
                        viewBox="0 -40 400 140"
                        className="w-full h-full fill-white filter drop-shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            animate={{
                                d: generatePath(safeIndex, tabs.length)
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </svg>
                </div>

                {/* TAB ICONS */}
                {tabs.map((tab, idx) => {
                    const isActive = safeIndex === idx;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="relative z-20 w-16 h-full flex flex-col items-center justify-end pb-4"
                        >
                            {/* FLOATING CIRCLE */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCircle"
                                        className="absolute -top-10 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-slate-50/10"
                                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                    >
                                        <div className="w-13 h-13 bg-sky-500 rounded-full flex items-center justify-center shadow-inner shadow-sky-600/20">
                                            <Icon className="text-white w-7 h-7 fill-current" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ICON AND LABEL */}
                            <motion.div
                                animate={{
                                    opacity: isActive ? 0 : 1,
                                    y: isActive ? 20 : 0
                                }}
                                className="flex flex-col items-center gap-1.5 transition-colors"
                            >
                                <Icon className={`w-7 h-7 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                                <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-sky-500' : 'text-slate-400'}`}>
                                    {tab.label}
                                </span>
                            </motion.div>

                            {/* ACTIVE LABEL UNDER CIRCLE */}
                            {isActive && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-[11px] font-black text-sky-500 uppercase tracking-wider mb-2"
                                >
                                    {tab.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Generates an SVG path for a bar with a smooth U-shaped notch
 */
function generatePath(index: number, totalTabs: number) {
    const width = 400;
    const tabWidth = width / totalTabs;
    const centerX = tabWidth * index + tabWidth / 2;

    const dipWidth = 50;
    const dipDepth = -35;
    const radius = 40; // Corner radius for the whole bar

    return `
    M ${radius} 0
    L ${centerX - dipWidth} 0
    C ${centerX - dipWidth + 10} 0, ${centerX - 25} ${dipDepth}, ${centerX} ${dipDepth}
    C ${centerX + 25} ${dipDepth}, ${centerX + dipWidth - 10} 0, ${centerX + dipWidth} 0
    L ${width - radius} 0
    Q ${width} 0, ${width} ${radius}
    L ${width} 100
    L 0 100
    L 0 ${radius}
    Q 0 0, ${radius} 0
    Z
  `;
}

export default MobileBottomNav;
