"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaSignOutAlt,
  FaSuitcaseRolling,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaUserShield,
} from "react-icons/fa";
import { useClerk } from "@clerk/nextjs";
import { useLanguage } from "@/app/context/LanguageContext";
import { Booking } from "@/lib/mongo/bookings";

interface DashboardProps {
  bookings: Booking[];
  userName: string;
  userImage: string;
  isAdmin?: boolean;
}

export default function DashboardClient({ 
  bookings = [], 
  userName, 
  userImage,
  isAdmin = false,
}: DashboardProps) {
  const { language } = useLanguage();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Filter Bookings
  const today = new Date().toISOString().split("T")[0];
  
  const upcomingTrips = bookings.filter((b) => b.date >= today && b.status !== "cancelled");
  const pastTrips = bookings.filter((b) => b.date < today || b.status === "completed" || b.status === "cancelled");

  const currentList = activeTab === "upcoming" ? upcomingTrips : pastTrips;

  const t = {
    mn: {
      welcome: `Сайн байна уу, ${userName}!`,
      subtitle: "Таны аяллын түүх болон захиалгууд.",
      tabs: { upcoming: "Ирээдүйн аялал", past: "Аяллын түүх" },
      empty: "Одоогоор захиалга алга байна.",
      browseBtn: "Аялал хайх",
      status: { confirmed: "Баталгаажсан", pending: "Хүлээгдэж буй", completed: "Дууссан", cancelled: "Цуцлагдсан" },
      travelers: "Аялагч",
      total: "Нийт дүн",
      logout: "Гарах",
      viewBtn: "Дэлгэрэнгүй",
      adminPanel: "Админ хэсэг"
    },
    en: {
      welcome: `Welcome back, ${userName}!`,
      subtitle: "Your travel history and bookings.",
      tabs: { upcoming: "Upcoming Trips", past: "Travel History" },
      empty: "No bookings found.",
      browseBtn: "Browse Trips",
      status: { confirmed: "Confirmed", pending: "Pending", completed: "Completed", cancelled: "Cancelled" },
      travelers: "Travelers",
      total: "Total",
      logout: "Sign Out",
      viewBtn: "View Details",
      adminPanel: "Admin Panel"
    },
    ko: {
      welcome: `환영합니다, ${userName}님!`,
      subtitle: "여행 기록 및 예약 내역.",
      tabs: { upcoming: "다가오는 여행", past: "여행 기록" },
      empty: "예약 내역이 없습니다.",
      browseBtn: "여행 찾아보기",
      status: { confirmed: "확정됨", pending: "대기 중", completed: "완료됨", cancelled: "취소됨" },
      travelers: "여행자",
      total: "총 금액",
      logout: "로그아웃",
      viewBtn: "상세 보기",
      adminPanel: "관리자 패널"
    }
  };

  const text = t[language as "mn" | "en" | "ko"] || t.mn;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="relative">
               <img src={userImage} alt={userName} className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-md" />
               <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800">{text.welcome}</h1>
              <p className="text-slate-500">{text.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-50 text-sky-600 font-bold hover:bg-sky-100 transition-colors">
                  <FaUserShield /> {text.adminPanel}
                </button>
              </Link>
            )}
            <button 
              onClick={() => signOut({ redirectUrl: '/' })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt /> {text.logout}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-2 text-lg font-bold transition-all relative ${
              activeTab === "upcoming" ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {text.tabs.upcoming}
            {activeTab === "upcoming" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-sky-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-3 px-2 text-lg font-bold transition-all relative ${
              activeTab === "past" ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {text.tabs.past}
            {activeTab === "past" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-sky-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* List */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {currentList.length > 0 ? (
              currentList.map((booking) => (
                <BookingCard key={booking._id} booking={booking} text={text} language={language} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FaSuitcaseRolling size={30} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">{text.empty}</h3>
                <Link href="/packages">
                  <button className="text-sky-600 font-bold hover:underline">{text.browseBtn} →</button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

const BookingCard = ({ booking, text, language }: { booking: Booking; text: any; language: string }) => {
  const statusColors: any = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusIcons: any = {
    confirmed: <FaCheckCircle />,
    pending: <FaClock />,
    completed: <FaCheckCircle />,
    cancelled: <FaTimesCircle />,
  };

  const langKey = language as "mn" | "en" | "ko";
  const tripTitle = booking.tripTitle ? (booking.tripTitle[langKey] || booking.tripTitle.mn) : "Unknown Trip";
  const tripDuration = booking.tripDuration ? (booking.tripDuration[langKey] || booking.tripDuration.mn) : null;
  const tripLocation = booking.tripLocation ? (booking.tripLocation[langKey] || booking.tripLocation.mn) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center group"
    >
      <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0">
        <img src={booking.tripImage} alt={tripTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-2 left-2">
           <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider shadow-sm ${statusColors[booking.status]}`}>
              {statusIcons[booking.status]} {text.status[booking.status]}
           </span>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">{tripTitle}</h3>
            {tripLocation && (
              <p className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                <FaMapMarkerAlt className="text-sky-400" /> {tripLocation}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Date</span>
              <div className="flex items-center gap-2 text-slate-700">
                <FaCalendarAlt className="text-sky-500 text-xs" />
                <span className="text-sm font-bold">{booking.date}</span>
              </div>
           </div>
           
           <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</span>
              <div className="flex items-center gap-2 text-slate-700">
                <FaClock className="text-sky-500 text-xs" />
                <span className="text-sm font-bold">{tripDuration || "N/A"}</span>
              </div>
           </div>

           <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{text.travelers}</span>
              <div className="flex items-center gap-2 text-slate-700">
                <FaUser className="text-sky-500 text-xs" />
                <span className="text-sm font-bold">{booking.travelers}</span>
              </div>
           </div>

           <div className="flex flex-col gap-1 bg-sky-50 p-3 rounded-xl border border-sky-100 md:text-right">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">{text.total}</span>
              <span className="text-sm font-black text-sky-700">{booking.totalPrice.toLocaleString()}₮</span>
           </div>
        </div>
      </div>

      <div className="w-full md:w-auto shrink-0">
         <Link href={`/tours/${booking.tripId}`}>
           <button className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition-all shadow-lg shadow-slate-200 hover:shadow-sky-200 active:scale-95">
             {text.viewBtn}
           </button>
         </Link>
      </div>
    </motion.div>
  );
};