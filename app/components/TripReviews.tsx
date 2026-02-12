"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaQuoteRight,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Main Component ────────────────────── */
const TripReviews = () => {
  const { language } = useLanguage();

  // 1. State for Dynamic Data
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Carousel Refs
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  // 3. Static UI Text (Kept hardcoded because this doesn't change)
  const uiText = {
    mn: {
      badge: "Аялагчдын сэтгэгдэл",
      titlePrefix: "Бидний тухай",
      titleSuffix: "Тэд юу хэлэв?",
      desc: "Мянга мянган аялагчид Mongolia Trails Agency-г сонгон дэлхийгээр аялж, мартагдашгүй дурсамжийг бүтээсэн байна.",
      drag: "Чирж үзэх",
      empty: "Одоогоор сэтгэгдэл байхгүй байна."
    },
    en: {
      badge: "Traveler Reviews",
      titlePrefix: "What do they say",
      titleSuffix: "About Us?",
      desc: "Thousands of travelers choose Mongolia Trails Agency to explore the world and create unforgettable memories.",
      drag: "Drag to view",
      empty: "No reviews yet."
    },
    ko: {
      badge: "여행자 리뷰",
      titlePrefix: "그들이 말하는",
      titleSuffix: "우리에게?",
      desc: "수천 명의 여행자들이 Mongolia Trails Agency를 선택하여 세상을 탐험하고 잊지 못할 추억을 만듭니다.",
      drag: "드래그하여 보기",
      empty: "아직 리뷰가 없습니다."
    }
  };

  const t = uiText[language as keyof typeof uiText] || uiText.en;

  // 4. FETCH DATA FROM API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Fetch only approved comments for the current language
        const res = await fetch(`/api/comments?lang=${language}`, { cache: 'no-store' });
        const data = await res.json();

        if (data.success) {
          setReviews(data.comments);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [language]);

  // 5. Recalculate Carousel Width when reviews change
  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [reviews, loading]); // Important: Re-run when data loads

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">

      {/* ─── Background Decoration ─── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-center bg-no-repeat bg-cover" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200 rounded-full blur-[80px] opacity-60" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full blur-[80px] opacity-60" />

      <div className="container mx-auto px-4 relative z-10">

        {/* ─── Header ─── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <FaStar className="text-yellow-400" /> {t.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            {t.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">{t.titleSuffix}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            {t.desc}
          </motion.p>
        </div>

        {/* ─── Content Area ─── */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-sky-500 text-3xl" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-slate-400 italic">
            {t.empty}
          </div>
        ) : (
          <>
            {/* ─── Draggable Slider ─── */}
            <motion.div
              ref={carousel}
              className="cursor-grab active:cursor-grabbing overflow-hidden"
              whileTap={{ cursor: "grabbing" }}
            >
              <motion.div
                drag="x"
                dragConstraints={{ right: 0, left: -width }}
                className="flex gap-6 pb-10 pl-4"
              >
                {reviews && Array.isArray(reviews) && reviews.map((review, i) => (
                  <ReviewCard key={review._id || i} review={review} index={i} />
                ))}
              </motion.div>
            </motion.div>

            {/* ─── Visual Scroll Indicator ─── */}
            <div className="flex justify-center items-center gap-2 mt-4 text-slate-300 text-sm font-medium">
              <FaChevronLeft className="animate-pulse" />
              <span>{t.drag}</span>
              <FaChevronRight className="animate-pulse" />
            </div>
          </>
        )}

      </div>
    </section>
  );
};

/* ────────────────────── Individual Review Card ────────────────────── */
const ReviewCard = ({ review, index }: { review: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, rotate: 0 }}
      className="min-w-[320px] md:min-w-[400px] relative group"
    >
      {/* Glass Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-lg shadow-slate-200/50 group-hover:shadow-sky-200/50 group-hover:border-sky-100 transition-all duration-300 h-full flex flex-col">

        <div className="absolute top-6 right-8 text-slate-100 text-6xl group-hover:text-sky-50 transition-colors pointer-events-none">
          <FaQuoteRight />
        </div>

        {/* Header: User Info */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden">
              {/* Generate Avatar based on Name */}
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`}
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <FaCheckCircle className="text-sky-500 text-lg" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-lg leading-tight">{review.name}</h4>
            <span className="text-xs text-slate-400 font-semibold">{review.dateStr || "Recently"}</span>
          </div>
        </div>

        {/* Rating & Trip Tag */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${i < (review.rating || 5) ? "text-yellow-400" : "text-slate-200"}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            {review.trip || "General Trip"}
          </span>
        </div>

        {/* Review Text */}
        <p className="text-slate-600 leading-relaxed italic mb-6 relative z-10 flex-grow min-h-[80px]">
          "{review.text}"
        </p>

        {/* Footer: Location */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
          <FaMapMarkerAlt className="text-slate-300 group-hover:text-sky-400 transition-colors" />
          <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
            {review.location || "Earth"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default TripReviews;