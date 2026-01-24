"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  FaCalendarAlt,
  FaArrowRight,
  FaCheckCircle,
  FaUserFriends,
  FaShieldAlt,
  FaArrowLeft,
  FaPlane,
} from "react-icons/fa";
import { Trip } from "@/lib/mongo/trips";
import { useLanguage } from "@/app/context/LanguageContext";

export default function BookingForm({ trip }: { trip: Trip }) {
  const { language } = useLanguage();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // State
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // New State for Form Inputs
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    phone: "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    customRequest: "" // New field for custom dates
  });

  // Calculate Display Price
  const currentLangKey = language as 'mn' | 'en' | 'ko';
  const unitPrice = trip.price[currentLangKey] || trip.price.mn;
  const totalPrice = unitPrice * travelers;

  const formatMoney = (amount: number) => {
    if (language === 'en') return `$${amount.toLocaleString()}`;
    if (language === 'ko') return `₩${amount.toLocaleString()}`;
    return `${amount.toLocaleString()}₮`;
  };

  const content = {
    mn: {
      header: "Захиалга баталгаажуулах",
      successTitle: "Захиалга амжилттай!",
      successDesc: "Таны захиалгыг хүлээн авлаа. Та 'Миний аяллууд' цэснээс харах боломжтой.",
      backHome: "Нүүр хуудас руу буцах",
      viewDashboard: "Миний захиалгууд",
      // ... keep existing translations ...
      travelerInfo: "Аялагчийн мэдээлэл",
      nameLabel: "Овог нэр",
      phoneLabel: "Утасны дугаар",
      emailLabel: "И-мэйл хаяг",
      tripSchedule: "Аяллын тов",
      selectDate: "Эхлэх өдөр сонгох",
      travelerCount: "Аялагчийн тоо",
      submitBtn: "Захиалга илгээх",
      pricePerPerson: "Нэг хүний үнэ:",
      travelerCountLabel: "Аялагчийн тоо:",
      totalLabel: "Нийт дүн:",
      errorDate: "Эхлэх өдрөө сонгоно уу.",
      trustTitle: "Төлбөрийн баталгаа",
      trustDesc: "Таны захиалга илгээгдсэний дараа манай менежер холбогдож төлбөрийн нөхцөлийг танилцуулна."
    },
    en: {
      header: "Confirm Booking",
      successTitle: "Booking Successful!",
      successDesc: "Booking received! You can check it in your dashboard.",
      backHome: "Back to Home",
      viewDashboard: "My Bookings",
      // ... keep existing translations ...
      travelerInfo: "Traveler Information",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      tripSchedule: "Trip Schedule",
      selectDate: "Select Start Date",
      travelerCount: "Travelers",
      submitBtn: "Submit Booking",
      pricePerPerson: "Price per person:",
      travelerCountLabel: "Travelers:",
      totalLabel: "Total Amount:",
      errorDate: "Please select a start date.",
      trustTitle: "Payment Security",
      trustDesc: "After submitting, our manager will contact you."
    },
    ko: {
      header: "예약 확인",
      successTitle: "예약 성공!",
      successDesc: "예약이 접수되었습니다. 대시보드에서 확인할 수 있습니다.",
      backHome: "홈으로",
      viewDashboard: "내 예약",
      // ... keep existing translations ...
      travelerInfo: "여행자 정보",
      nameLabel: "성명",
      phoneLabel: "전화번호",
      emailLabel: "이메일 주소",
      tripSchedule: "여행 일정",
      selectDate: "시작 날짜 선택",
      travelerCount: "여행자 수",
      submitBtn: "예약 제출",
      pricePerPerson: "1인당 가격:",
      travelerCountLabel: "여행자 수:",
      totalLabel: "총 금액:",
      errorDate: "시작 날짜를 선택하세요.",
      trustTitle: "결제 보안",
      trustDesc: "제출 후 매니저가 연락드립니다."
    }
  };

  const t = content[language];
  const upcomingDates = ["2025-06-15", "2025-07-20", "2025-08-10"];

  // ─── HANDLER: SEND DATA TO API ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to book.");
      router.push("/sign-in");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip._id,
          date: selectedDate,
          travelers: travelers,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{t.successTitle}</h2>
          <p className="text-slate-500 mb-8">{t.successDesc}</p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <button className="w-full py-4 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200">
                {t.viewDashboard}
              </button>
            </Link>
            <Link href="/">
              <button className="w-full py-4 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                {t.backHome}
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/tours/${trip._id}`}>
            <button className="p-3 bg-white rounded-full text-slate-500 hover:text-sky-600 shadow-sm border border-slate-200 transition-colors">
              <FaArrowLeft />
            </button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">{t.header}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FaUserFriends className="text-sky-500" /> {t.travelerInfo}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">{t.nameLabel}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">{t.phoneLabel}</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      placeholder="9911-XXXX"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600">{t.emailLabel}</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-sky-500" /> {t.tripSchedule}
                </h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-600">{t.selectDate}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {upcomingDates.map((date) => (
                        <div 
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                            selectedDate === date 
                              ? "border-sky-500 bg-sky-50 text-sky-700" 
                              : "border-slate-100 hover:border-sky-200 text-slate-600"
                          }`}
                        >
                          <div className="text-sm font-bold">{date}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">{t.travelerCount}</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors">-</button>
                      <span className="text-2xl font-black text-slate-800 w-12 text-center">{travelers}</span>
                      <button type="button" onClick={() => setTravelers(Math.min(10, travelers + 1))} className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors">+</button>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={loading || !selectedDate}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>{t.submitBtn} <FaPlane /></>}
                  </button>
                  {!selectedDate && <p className="text-red-500 text-xs mt-2 text-center">{t.errorDate}</p>}
                </div>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 h-fit">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200">
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 relative">
                  <img src={trip.image} alt={trip.title[language]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{trip.title[language]}</h3>
                <div className="space-y-3 py-4 border-t border-dashed border-slate-200">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{t.pricePerPerson}</span>
                    <span className="font-bold">{formatMoney(unitPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{t.travelerCountLabel}</span>
                    <span className="font-bold">x {travelers}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-500">{t.totalLabel}</span>
                    <span className="text-3xl font-black text-sky-600">{formatMoney(totalPrice)}</span>
                  </div>
                </div>
              </motion.div>
              <div className="bg-sky-50 rounded-2xl p-4 flex items-start gap-3 border border-sky-100">
                <FaShieldAlt className="text-sky-500 text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sky-900 text-sm">{t.trustTitle}</h4>
                  <p className="text-xs text-sky-700 mt-1 leading-relaxed">{t.trustDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}