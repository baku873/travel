"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trip } from "@/lib/mongo/trips"; 
import { useLanguage } from "@/app/context/LanguageContext"; 
import { useState } from "react";
import { FaArrowRight, FaClock, FaFire, FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";

/* ────────────────────── Static Constants ────────────────────── */
const categories = [
  { id: "all", label: { mn: "Бүгд", en: "All", ko: "전체" } },
  { id: "nature", label: { mn: "Байгаль", en: "Nature", ko: "자연" } },
  { id: "city", label: { mn: "Хотын аялал", en: "City Tours", ko: "도시 투어" } },
  { id: "beach", label: { mn: "Далайн эрэг", en: "Beach", ko: "해변" } },
  { id: "culture", label: { mn: "Соёл", en: "Culture", ko: "문화" } },
  { id: "theme_park", label: { mn: "Парк", en: "Theme Parks", ko: "테마파크" } },
  { id: "resort", label: { mn: "Амралт", en: "Resort", ko: "리조트" } },
];

/* ────────────────────── Interfaces ────────────────────── */
interface PackagesListProps {
  packages: Trip[];
  title?: { mn: string; en: string; ko: string };
  subtitle?: { mn: string; en: string; ko: string };
}

/* ────────────────────── Main Component ────────────────────── */
const PackagesList = ({ 
  packages, 
  title, 
  subtitle
}: PackagesListProps) => {
  
  const { language } = useLanguage(); 
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Default texts based on language
  const displayTitle = title 
    ? title[language] 
    : (language === "mn" ? "Аяллын Багцууд" : language === "ko" ? "여행 패키지" : "Travel Packages");

  const displaySubtitle = subtitle 
    ? subtitle[language] 
    : (language === "mn" 
      ? "Таны дараагийн адал явдал эндээс эхэлнэ." 
      : language === "ko"
      ? "다음 모험이 여기에서 시작됩니다."
      : "Your next adventure starts here.");

  const noResultsText = language === "mn" ? "Илэрц олдсонгүй" : language === "ko" ? "결과 없음" : "No results found";
  const searchPlaceholder = language === "mn" ? "Аялал хайх..." : language === "ko" ? "여행 검색..." : "Search trips...";

  // Filtering Logic
  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory = activeTab === "all" || pkg.category === activeTab;
    
    // Safe access for trilingual titles/locations
    const currentTitle = pkg.title?.[language] || ""; 
    const currentLocation = pkg.location?.[language] || "";
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      currentTitle.toLowerCase().includes(searchLower) || 
      currentLocation.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      
      {/* ────────────────── HEADER ────────────────── */}
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h1 
            key={language} 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              {displayTitle}
            </span>
          </motion.h1>
          <motion.p 
             key={`${language}-sub`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg"
          >
            {displaySubtitle}
          </motion.p>
        </div>
      </div>

      {/* ────────────────── FILTER BAR ────────────────── */}
      <div className="relative md:sticky md:top-24 z-40 px-4 mb-8 md:mb-12">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] p-2 shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row items-center gap-3">
          
          <div className="flex-1 flex gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide p-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === cat.id ? "text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {activeTab === cat.id && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-sky-500 rounded-full shadow-md shadow-sky-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {/* Safe access for category label */}
                <span className="relative z-10">{cat.label[language] || cat.label.mn}</span>
              </button>
            ))}
          </div>

          <div className="w-full md:w-72 relative group">
             <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
             <input 
               type="text" 
               placeholder={searchPlaceholder}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-slate-100/50 border border-slate-200 rounded-full pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all"
             />
          </div>
        </div>
      </div>

      {/* ────────────────── PACKAGE GRID ────────────────── */}
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} language={language} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
                  <FaSearch />
                </div>
                <h3 className="text-xl font-bold text-slate-700">
                  {noResultsText}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
};

/* ────────────────────── PACKAGE CARD (FIXED PRICE LOGIC) ────────────────────── */
const PackageCard = ({ pkg, language }: { pkg: Trip, language: "mn" | "en" | "ko" }) => {
  
  // 1. Helper to extract numeric price safely
  const getPriceValue = (priceObj: any) => {
    if (typeof priceObj === 'number') return priceObj; // Handle legacy data
    if (typeof priceObj === 'object') return priceObj[language] || priceObj.mn; // Handle new data
    return 0;
  };

  const priceValue = getPriceValue(pkg.price);
  const oldPriceValue = pkg.oldPrice ? getPriceValue(pkg.oldPrice) : null;

  // 2. Format with Currency Symbol
  const formatMoney = (amount: number) => {
    if (language === 'en') return `$${amount.toLocaleString()}`;
    if (language === 'ko') return `₩${amount.toLocaleString()}`;
    return `${amount.toLocaleString()}₮`; // Default MN
  };

  const imageSrc = pkg.image && pkg.image.trim() !== "" ? pkg.image : "/try.png";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-sky-100 border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <Link href={`/tours/${pkg._id}`}>
          <img 
            src={imageSrc} 
            alt={pkg.title[language] || "Trip"} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer" 
          />
        </Link>
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
           {pkg.tags?.slice(0, 2).map((tag, i) => (
             <span key={i} className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide shadow-sm border border-white/50">
               {tag}
             </span>
           ))}
        </div>
        {pkg.featured && (
           <div className="absolute bottom-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30">
              <FaFire /> {language === "mn" ? "Шилдэг" : "Featured"}
           </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <FaStar /> {pkg.rating} <span className="text-slate-300 font-medium">({pkg.reviews || 0})</span>
           </div>
           <div className="flex items-center gap-1 text-sky-500 text-xs font-bold bg-sky-50 px-2 py-1 rounded-md">
              <FaClock /> {pkg.duration[language]}
           </div>
        </div>

        <Link href={`/tours/${pkg._id}`}>
          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[56px]">
            {pkg.title[language]}
          </h3>
        </Link>

        <p className="flex items-center gap-2 text-slate-500 text-sm mb-6">
           <FaMapMarkerAlt className="text-slate-300" /> {pkg.location[language]}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
           <div>
              {/* FIXED: Old Price Logic */}
              {oldPriceValue && (
                <span className="block text-xs text-slate-400 line-through decoration-red-400">
                  {formatMoney(oldPriceValue)}
                </span>
              )}
              
              {/* FIXED: Current Price Logic */}
              <span className="text-lg font-black text-slate-900">
                {formatMoney(priceValue)}
              </span>
           </div>
           <Link href={`/tours/${pkg._id}`}>
             <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-sky-300">
                <FaArrowRight className="text-sm -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
             </button>
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackagesList;