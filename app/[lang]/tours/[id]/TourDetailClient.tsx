"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import Router
import { useUser } from "@clerk/nextjs"; // 2. Import Clerk Hook
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaArrowLeft,
  FaPlane,
  FaUtensils,
  FaPassport,
  FaUsers,
  FaCheckCircle,
  FaClipboardList,
  FaTimes,
  FaCheck,
  FaCog
} from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

/* ────────────────────── Types ────────────────────── */
interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
}

interface LocalizedPrice {
  mn: number;
  en: number;
  ko: number;
}

interface ItineraryItem {
  day: number;
  title: LocalizedString;
  desc: LocalizedString;
  imageUrl?: string;
}

interface Trip {
  _id: string;
  image: string;
  title: LocalizedString;
  category: string;
  rating: number;
  location: LocalizedString;
  duration: LocalizedString;
  description?: LocalizedString;
  perks?: string[];
  highlights?: LocalizedString[];       // New
  includedServices?: LocalizedString[]; // New
  excludedServices?: LocalizedString[]; // New
  itinerary?: ItineraryItem[];
  price: LocalizedPrice | number;
  priceAdult?: LocalizedPrice; // New: Adult Price
  priceChild?: LocalizedPrice; // New: Child Price
  salePrice?: LocalizedPrice;  // New: Discounted Price
  oldPrice?: LocalizedPrice | number;
  seatsLeft?: number;
  map_image_url?: string; // New: Route Map
}

const TourDetailClient = ({ trip }: { trip: Trip }) => {
  const { language } = useLanguage();

  // 3. Initialize Auth and Router
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // ─── STATE FOR MODAL & BOOKING ───
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: 1
  });

  // 4. BONUS: Auto-fill form if user is logged in
  useEffect(() => {
    if (isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isSignedIn, user]);

  // Helper to safely get numeric price
  const getLocalizedPrice = (priceObj: any) => {
    if (typeof priceObj === 'number') return priceObj;
    if (typeof priceObj === 'object' && priceObj !== null) {
      // @ts-ignore
      return priceObj[language] || priceObj.mn || 0;
    }
    return 0;
  };

  // ─── PRICE CALCULATION LOGIC ───
  const adultPriceBase = getLocalizedPrice(trip.priceAdult) || getLocalizedPrice(trip.price);
  const childPrice = getLocalizedPrice(trip.priceChild);
  const salePrice = getLocalizedPrice(trip.salePrice);

  // Determine if there is a discount
  const hasDiscount = salePrice > 0 && salePrice < adultPriceBase;
  const finalAdultPrice = hasDiscount ? salePrice : adultPriceBase;
  const discountPercentage = hasDiscount
    ? Math.round(((adultPriceBase - salePrice) / adultPriceBase) * 100)
    : 0;

  const formatMoney = (amount: number) => {
    if (language === 'en') return `$${amount.toLocaleString()}`;
    if (language === 'ko') return `₩${amount.toLocaleString()}`;
    return `${amount.toLocaleString()}₮`;
  };

  // ─── TRANSLATIONS ───
  const t = {
    mn: {
      back: "Буцах",
      about: "Аяллын тухай",
      highlights: "Аяллын онцлог",
      included: "Үнэд багтсан зүйлс",
      excluded: "Үнэд багтаагүй зүйлс",
      itineraryTitle: "Аяллын хөтөлбөр",
      itineraryEmpty: "Дэлгэрэнгүй хөтөлбөр удахгүй орно.",
      priceLabel: "Нийт үнэ (1 хүн)",
      adultLabel: "Том хүн (12+)",
      childLabel: "Хүүхэд (3-11)",
      saveBadge: "ХЯМДРАЛ",
      typeLabel: "Аяллын төрөл:",
      durationLabel: "Хугацаа:",
      seatsLabel: "Боломжит суудал:",
      seatsLeft: "Суудал үлдсэн",
      open: "Нээлттэй",
      bookBtn: "Захиалга өгөх",
      terms: "Захиалга өгснөөр та манай үйлчилгээний нөхцөлийг зөвшөөрч байна.",
      questionTitle: "Асуух зүйл байна уу?",
      questionDesc: "Манай менежертэй холбогдож дэлгэрэнгүй мэдээлэл аваарай.",
      modalTitle: "Аялал захиалах",
      formName: "Таны нэр",
      formEmail: "Имэйл хаяг",
      formPhone: "Утасны дугаар",
      formDate: "Явах өдөр",
      formGuests: "Хүний тоо",
      submitBtn: "Захиалах",
      submitting: "Илгээж байна...",
      successTitle: "Захиалга амжилттай!",
      successMsg: "Таны аяллын цаг баталгаажлаа. Бид таны имэйл рүү мэдээлэл илгээлээ.",
      errorMsg: "Алдаа гарлаа. Дахин оролдоно уу.",
      mapTitle: "Аяллын карт"
    },
    en: {
      back: "Back",
      about: "About the Trip",
      highlights: "Trip Highlights",
      included: "What's Included",
      excluded: "What's Not Included",
      itineraryTitle: "Itinerary",
      itineraryEmpty: "Detailed itinerary coming soon.",
      priceLabel: "Total Price (per person)",
      adultLabel: "Adult (12+)",
      childLabel: "Child (3-11)",
      saveBadge: "OFF",
      typeLabel: "Trip Type:",
      durationLabel: "Duration:",
      seatsLabel: "Available Seats:",
      seatsLeft: "Seats Left",
      open: "Open",
      bookBtn: "Book Now",
      terms: "By booking, you agree to our terms of service.",
      questionTitle: "Have Questions?",
      questionDesc: "Contact our manager for more information.",
      modalTitle: "Book This Trip",
      formName: "Full Name",
      formEmail: "Email Address",
      formPhone: "Phone Number",
      formDate: "Preferred Date",
      formGuests: "Number of Guests",
      submitBtn: "Confirm Booking",
      submitting: "Sending...",
      successTitle: "Booking Confirmed!",
      successMsg: "Your appointment is set. We have sent confirmation to your email.",
      errorMsg: "Something went wrong. Please try again.",
      mapTitle: "Route Map"
    },
    ko: {
      back: "뒤로가기",
      about: "여행 정보",
      highlights: "여행 하이라이트",
      included: "포함 사항",
      excluded: "불포함 사항",
      itineraryTitle: "여행 일정",
      itineraryEmpty: "자세한 일정은 곧 제공됩니다.",
      priceLabel: "총 가격 (1인당)",
      adultLabel: "성인 (12+)",
      childLabel: "아동 (3-11)",
      saveBadge: "할인",
      typeLabel: "여행 유형:",
      durationLabel: "기간:",
      seatsLabel: "남은 좌석:",
      seatsLeft: "남은 좌석",
      open: "오픈",
      bookBtn: "지금 예약",
      terms: "예약함으로써 귀하는 당사의 서비스 약관에 동의하게 됩니다.",
      questionTitle: "질문이 있으신가요?",
      questionDesc: "자세한 정보를 원하시면 매니저에게 문의하세요.",
      modalTitle: "여행 예약하기",
      formName: "성함",
      formEmail: "이메일 주소",
      formPhone: "전화번호",
      formDate: "희망 날짜",
      formGuests: "인원수",
      submitBtn: "예약 확정",
      submitting: "전송 중...",
      successTitle: "예약 완료!",
      successMsg: "예약이 확정되었습니다. 이메일로 확인 메세지를 보냈습니다.",
      errorMsg: "오류가 발생했습니다. 다시 시도해 주세요.",
      mapTitle: "노선도"
    }
  };

  const text = t[language];
  const itinerary = trip.itinerary || [];

  // 5. NEW: Check auth before opening modal
  const handleBookClick = () => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (!isSignedIn) {
      // Redirect to sign in, then return to this page
      const currentUrl = window.location.href;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // If signed in, open the modal
    setModalOpen(true);
  };

  // ─── HANDLE SUBMIT ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip._id,
          date: formData.date,
          travelers: formData.guests,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          language: language,
          totalPrice: (finalAdultPrice * formData.guests) // Simplified calculation for now
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setModalOpen(false);
          setStatus('idle');
          // Don't clear name/email if user is logged in, just reset other fields
          setFormData(prev => ({
            ...prev,
            phone: "",
            date: "",
            guests: 1
          }));
        }, 4000);
      } else {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
        setStatus('error');
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* ────────────────── HERO HEADER ────────────────── */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {trip.image && <img src={trip.image} alt={trip.title[language]} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-slate-200 animate-pulse -z-10" /> {/* Fallback/Loading background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        <div className="absolute top-24 left-4 md:left-10 z-20 flex gap-3">
          <Link href="/">
            <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 transition-all font-bold text-sm border border-white/30">
              <FaArrowLeft /> {text.back}
            </button>
          </Link>

          {/* Admin Edit Button */}
          {user?.publicMetadata?.role === 'admin' && (
            <Link href="/admin/trips">
              <button className="flex items-center gap-2 bg-red-500/80 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all font-bold text-sm border border-red-400/30">
                <FaCog /> Admin Dashboard
              </button>
            </Link>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight shadow-sm">
              {trip.title[language]}
            </h1>
            <div className="flex items-center gap-6 text-slate-200 font-bold text-sm md:text-base">
              <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-sky-400" /> {trip.location[language]}</span>
              <span className="flex items-center gap-2"><FaClock className="text-sky-400" /> {trip.duration[language]}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ────────────────── MAIN CONTENT ────────────────── */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT COLUMN (Details & Itinerary) */}
        <div className="lg:col-span-2 space-y-10">

          {/* ABOUT, HIGHLIGHTS & MAP */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Story & Highlights */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{text.about}</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">{trip.description?.[language]}</p>
                </div>

                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100">
                    <h3 className="text-lg font-bold text-sky-900 mb-4 flex items-center gap-2">
                      <FaStar className="text-sky-500" /> {text.highlights}
                    </h3>
                    <ul className="space-y-3">
                      {trip.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                          <span className="text-sm font-medium leading-relaxed">{highlight[language] || highlight.mn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Route Map (Very High) */}
              {trip.map_image_url && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-sky-500" /> {text.mapTitle}
                  </h3>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group shadow-lg shadow-sky-100/50">
                    <img src={trip.map_image_url} alt="Route Map" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center mt-2">Expedition Route Map</p>
                </div>
              )}
            </div>

            {/* INCLUDED / EXCLUDED GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              {/* Included */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> {text.included}
                </h3>
                <ul className="space-y-3">
                  {trip.includedServices?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <FaCheck className="text-green-500 mt-1 shrink-0 text-xs" />
                      <span>{item[language] || item.mn}</span>
                    </li>
                  )) || (
                      // Fallback content if empty
                      <>
                        <li className="flex items-start gap-3 text-sm text-slate-600"><FaCheck className="text-green-500 mt-1 shrink-0 text-xs" /> Accommodation</li>
                        <li className="flex items-start gap-3 text-sm text-slate-600"><FaCheck className="text-green-500 mt-1 shrink-0 text-xs" /> Transportation</li>
                      </>
                    )}
                </ul>
              </div>

              {/* Excluded */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaTimes className="text-red-500" /> {text.excluded}
                </h3>
                <ul className="space-y-3">
                  {trip.excludedServices?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <FaTimes className="text-red-400 mt-1 shrink-0 text-xs" />
                      <span>{item[language] || item.mn}</span>
                    </li>
                  )) || (
                      // Fallback content if empty
                      <>
                        <li className="flex items-start gap-3 text-sm text-slate-600"><FaTimes className="text-red-400 mt-1 shrink-0 text-xs" /> International Flights</li>
                        <li className="flex items-start gap-3 text-sm text-slate-600"><FaTimes className="text-red-400 mt-1 shrink-0 text-xs" /> Personal Expenses</li>
                      </>
                    )}
                </ul>
              </div>
            </div>
          </div>

          {/* ITINERARY SECTION */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">{text.itineraryTitle}</h2>
            {itinerary.length > 0 ? (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-10">
                {itinerary.map((day, i) => (
                  <div key={i} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-sky-500 shadow-sm" />

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
                        Day {day.day}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800">{day.title[language]}</h4>
                    </div>

                    <div className="text-slate-600 text-sm leading-7 bg-slate-50/50 p-4 rounded-xl border border-slate-50">
                      {day.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden h-48 w-full relative">
                          <img src={day.imageUrl} alt={day.title[language] || `Day ${day.day}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {day.desc[language]}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-center py-8">{text.itineraryEmpty}</p>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (Price & Booking) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 h-fit">
            <motion.div
              className="bg-white rounded-3xl p-6 shadow-2xl shadow-sky-100 border border-slate-100"
            >
              {/* PRICE CARD HEADER */}
              <div className="mb-6">
                {hasDiscount && (
                  <div className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 w-fit shadow-md shadow-rose-200">
                    {discountPercentage}% {text.saveBadge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Adult Price */}
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">{text.adultLabel}</p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-slate-900">{formatMoney(finalAdultPrice)}</span>
                      {hasDiscount && (
                        <span className="text-lg text-slate-400 line-through mb-1 decoration-rose-400 decoration-2">
                          {formatMoney(adultPriceBase)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Child Price (if exists) */}
                  {childPrice > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">{text.childLabel}</p>
                      <span className="text-xl font-bold text-slate-700">{formatMoney(childPrice)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. UPDATED BUTTON: Uses handleBookClick */}
              <button
                onClick={handleBookClick}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-lg hover:bg-sky-600 transition-all active:scale-95 mb-3"
              >
                {text.bookBtn}
              </button>

              <p className="text-xs text-center text-slate-400">{text.terms}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ────────────────── BOOKING MODAL ────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden"
            >

              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FaPlane className="text-sky-400" /> {text.modalTitle}
                </h3>
                <button onClick={() => setModalOpen(false)} className="hover:text-sky-400 transition"><FaTimes size={20} /></button>
              </div>

              {/* Modal Body */}
              <div className="p-6">

                {status === 'success' ? (
                  // SUCCESS STATE
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <FaCheckCircle size={40} />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-2">{text.successTitle}</h4>
                    <p className="text-slate-500">{text.successMsg}</p>
                  </div>
                ) : (
                  // FORM STATE
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{text.formName}</label>
                      <input
                        required type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{text.formEmail}</label>
                      <input
                        required type="email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{text.formPhone}</label>
                        <input
                          required type="tel"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                          value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{text.formGuests}</label>
                        <input
                          required type="number" min="1"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                          value={formData.guests} onChange={e => setFormData({ ...formData, guests: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{text.formDate}</label>
                      <input
                        required
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                        value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{text.errorMsg}</p>
                    )}

                    <button
                      disabled={loading}
                      className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl shadow-lg hover:bg-sky-500 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {loading ? text.submitting : text.submitBtn}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

const FeatureIcon = ({ icon: Icon, label }: any) => (
  <div className="flex flex-col items-center gap-2 text-center">
    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
      <Icon />
    </div>
    <span className="text-xs font-bold text-slate-600 leading-tight">{label}</span>
  </div>
);

export default TourDetailClient;