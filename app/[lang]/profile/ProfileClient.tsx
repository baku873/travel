"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Trip } from "@/lib/mongo/trips";
import { Booking } from "@/lib/mongo/bookings";
import Link from "next/link";
import {
    Calendar,
    Heart,
    History,
    Map,
    Settings,
    LogOut,
    ChevronRight,
    Loader2,
    Clock
} from "lucide-react";

interface ProfileClientProps {
    lang: "mn" | "en" | "ko" | "de";
}

const translations = {
    mn: {
        title: "Миний Профайл",
        welcome: "Тавтай морилно уу",
        upcoming: "Удахгүй болох аялал",
        past: "Өмнөх аялалууд",
        favorites: "Хадгалсан",
        settings: "Тохиргоо",
        logout: "Гарах",
        viewDetails: "Дэлгэрэнгүй",
        noUpcoming: "Танд удахгүй болох аялал алга байна.",
        noPast: "Танд өмнөх аялалын түүх алга байна.",
        noFavorites: "Танд хадгалсан аялал алга байна.",
        explore: "Аялал хайх",
        guests: "Зорчигч",
    },
    en: {
        title: "My Profile",
        welcome: "Welcome back",
        upcoming: "Upcoming Trips",
        past: "Past Trips",
        favorites: "Favorites",
        settings: "Settings",
        logout: "Sign Out",
        viewDetails: "View Details",
        noUpcoming: "You have no upcoming trips.",
        noPast: "You have no past trips.",
        noFavorites: "You haven't saved any trips yet.",
        explore: "Explore Trips",
        guests: "Guests",
    },
    ko: {
        title: "내 프로필",
        welcome: "환영합니다",
        upcoming: "다가오는 여행",
        past: "지난 여행",
        favorites: "즐겨찾기",
        settings: "설정",
        logout: "로그아웃",
        viewDetails: "자세히 보기",
        noUpcoming: "다가오는 여행이 없습니다.",
        noPast: "지난 여행 기록이 없습니다.",
        noFavorites: "저장된 여행이 없습니다.",
        explore: "여행 둘러보기",
        guests: "명",
    },
    de: {
        title: "Mein Profil",
        welcome: "Willkommen zurück",
        upcoming: "Anstehende Reisen",
        past: "Vergangene Reisen",
        favorites: "Favoriten",
        settings: "Einstellungen",
        logout: "Abmelden",
        viewDetails: "Details ansehen",
        noUpcoming: "Sie haben keine anstehenden Reisen.",
        noPast: "Sie haben keine vergangenen Reisen.",
        noFavorites: "Sie haben noch keine Reisen gespeichert.",
        explore: "Reisen erkunden",
        guests: "Gäste",
    }
};

type Tab = "upcoming" | "past" | "favorites";

export default function ProfileClient({ lang }: ProfileClientProps) {
    const { isLoaded, isSignedIn, user } = useUser();
    const t = translations[lang];

    const [activeTab, setActiveTab] = useState<Tab>("upcoming");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [wishlist, setWishlist] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchData();
        }
    }, [isLoaded, isSignedIn]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [bookingsRes, wishlistRes] = await Promise.all([
                fetch("/api/user/bookings"),
                fetch("/api/user/wishlist")
            ]);

            if (bookingsRes.ok) {
                const data = await bookingsRes.json();
                setBookings(data.bookings || []);
            }

            if (wishlistRes.ok) {
                const data = await wishlistRes.json();
                setWishlist(data.trips || []);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#D2B48C]" />
            </div>
        );
    }

    if (!isSignedIn) {
        return null; // Should be redirected by layout/middleware, but just in case
    }

    const now = new Date();
    const upcomingTrips = bookings.filter(b => {
        const tripDate = new Date(b.date);
        return tripDate >= now && (b.status === "confirmed" || b.status === "pending");
    });

    const pastTrips = bookings.filter(b => {
        const tripDate = new Date(b.date);
        return tripDate < now || b.status === "completed";
    });

    const tabs = [
        { id: "upcoming" as Tab, label: t.upcoming, icon: Calendar, count: upcomingTrips.length },
        { id: "past" as Tab, label: t.past, icon: History, count: pastTrips.length },
        { id: "favorites" as Tab, label: t.favorites, icon: Heart, count: wishlist.length }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800 pt-24 pb-20">

            {/* HEADER SECTION */}
            <div className="max-w-6xl mx-auto px-4 md:px-8 mb-12">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#E8E2D9] relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Map size={240} className="text-[#D2B48C]" />
                    </div>

                    <div className="relative z-10 shrink-0">
                        <div className="w-32 h-32 rounded-full border-4 border-[#FDFBF7] shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                            {user?.imageUrl ? (
                                <img src={user.imageUrl} alt={user.fullName || "Profile"} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl text-slate-300 font-serif">{user?.firstName?.[0] || "?"}</span>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 text-center md:text-left">
                        <p className="text-[#D2B48C] font-bold tracking-widest uppercase text-xs mb-2">
                            {t.welcome}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif text-[#2C362B] mb-2">
                            {user?.fullName || "Traveler"}
                        </h1>
                        <p className="text-slate-500 font-sans">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto mt-6 md:mt-0">
                        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors font-bold text-sm">
                            <Settings size={18} /> {t.settings}
                        </button>
                        <SignOutButton>
                            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-sm">
                                <LogOut size={18} /> {t.logout}
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-6xl mx-auto px-4 md:px-8">

                {/* TAB NAVIGATION */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-4 border-b border-[#E8E2D9]">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 ${isActive
                                    ? "bg-[#2C362B] text-white shadow-lg"
                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-[#E8E2D9]"
                                    }`}
                            >
                                <tab.icon size={18} className={isActive ? "text-[#D2B48C]" : "text-slate-400"} />
                                {tab.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Loader2 className="w-8 h-8 animate-spin text-[#D2B48C] mb-4" />
                            <p className="font-serif italic text-slate-500">Loading your profile data...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* UPCOMING TRIPS */}
                                {activeTab === "upcoming" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {upcomingTrips.length > 0 ? (
                                            upcomingTrips.map((booking) => (
                                                <BookingCard key={booking._id} booking={booking} lang={lang} t={t} />
                                            ))
                                        ) : (
                                            <EmptyState message={t.noUpcoming} actionText={t.explore} link={`/${lang}/tours`} icon={Calendar} />
                                        )}
                                    </div>
                                )}

                                {/* PAST TRIPS */}
                                {activeTab === "past" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {pastTrips.length > 0 ? (
                                            pastTrips.map((booking) => (
                                                <BookingCard key={booking._id} booking={booking} lang={lang} t={t} />
                                            ))
                                        ) : (
                                            <EmptyState message={t.noPast} actionText={t.explore} link={`/${lang}/tours`} icon={History} />
                                        )}
                                    </div>
                                )}

                                {/* FAVORITES */}
                                {activeTab === "favorites" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlist.length > 0 ? (
                                            wishlist.map((trip) => (
                                                <WishlistCard key={trip._id} trip={trip} lang={lang} t={t} />
                                            ))
                                        ) : (
                                            <EmptyState message={t.noFavorites} actionText={t.explore} link={`/${lang}/tours`} icon={Heart} />
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

            </div>
        </div>
    );
}

// Subcomponents

const BookingCard = ({ booking, lang, t }: { booking: Booking, lang: "mn" | "en" | "ko" | "de", t: any }) => {
    const tripTitle = (booking.tripTitle as any)?.[lang] || booking.tripTitle.en || "Untitled Trip";
    const tripLocation = (booking.tripLocation as any)?.[lang] || booking.tripLocation?.en || "";
    const tripDuration = (booking.tripDuration as any)?.[lang] || booking.tripDuration?.en || "";

    const isConfirmed = booking.status === "confirmed" || booking.status === "completed";

    return (
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-[#E8E2D9] flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-full sm:w-1/3 h-48 sm:h-auto rounded-2xl overflow-hidden relative shrink-0">
                <img src={booking.tripImage || '/assets/placeholder.jpg'} alt={tripTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${isConfirmed ? "bg-green-500/80 text-white" : "bg-amber-500/80 text-white"
                    }`}>
                    {booking.status}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                    <p className="text-xs font-black uppercase text-[#D2B48C] tracking-widest mb-1 flex items-center gap-1">
                        <Map size={12} /> {tripLocation}
                    </p>
                    <h3 className="text-2xl font-serif text-[#2C362B] mb-2 leading-tight">{tripTitle}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-bold mt-4">
                        <span className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> {booking.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> {tripDuration}</span>
                        <span className="flex items-center gap-1.5"><Users size={16} className="text-slate-400" /> {booking.travelers} {t.guests}</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#FDFBF7] pt-4">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Price</p>
                        <p className="font-serif text-xl font-bold text-[#4B5E4A]">${booking.totalPrice?.toLocaleString()}</p>
                    </div>
                    <Link href={`/${lang}/tours/${booking.tripId}`} className="w-10 h-10 rounded-full bg-[#FDFBF7] flex items-center justify-center text-[#4B5E4A] hover:bg-[#D2B48C] hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

// SVG Icon wrapper workaround since Users is missing from my lucide import list earlier
const Users = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const WishlistCard = ({ trip, lang, t }: { trip: Trip, lang: "mn" | "en" | "ko" | "de", t: any }) => {
    const tripTitle = (trip.title as any)?.[lang] || trip.title?.en || "Untitled Trip";
    const tripLocation = (trip.location as any)?.[lang] || trip.location?.en || "";
    const price = trip.salePrice?.[lang] || trip.price?.[lang] || 0;

    return (
        <Link href={`/${lang}/tours/${trip._id}`} className="block group">
            <div className="bg-white rounded-[2rem] p-4 border border-[#E8E2D9] shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 relative">
                    <img src={trip.image || '/assets/placeholder.jpg'} alt={tripTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm border border-white/40">
                        <Heart className="fill-current w-5 h-5 animate-pulse" />
                    </div>
                </div>
                <div className="px-2 pb-2">
                    <p className="text-xs font-black uppercase text-[#D2B48C] tracking-widest mb-1 flex items-center gap-1">
                        <Map size={12} /> {tripLocation}
                    </p>
                    <h3 className="font-serif text-xl text-[#2C362B] mb-3 line-clamp-1">{tripTitle}</h3>
                    <div className="flex items-center justify-between border-t border-[#FDFBF7] pt-3">
                        <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> {(trip.duration as any)?.[lang] || trip.duration?.en}</div>
                        <div className="font-serif text-lg font-bold text-[#4B5E4A]">${price.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const EmptyState = ({ message, actionText, link, icon: Icon }: { message: string, actionText: string, link: string, icon: any }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#E8E2D9]">
            <Icon size={40} className="text-[#D2B48C]/50" />
        </div>
        <h3 className="text-2xl font-serif text-[#2C362B] mb-2">{message}</h3>
        <p className="text-slate-500 mb-8 max-w-md">Discover beautiful destinations and begin your next adventure with our curated selection of Mongolian tours.</p>
        <Link href={link} className="bg-[#4B5E4A] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#3A4A39] transition-colors shadow-lg shadow-[#4B5E4A]/20">
            {actionText}
        </Link>
    </div>
);
