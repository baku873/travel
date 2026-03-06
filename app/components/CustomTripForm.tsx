"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Hotel,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    MessageSquare,
    User,
    Mail,
    Flag,
    Phone,
    Plus,
    Minus,
    Check
} from "lucide-react";

const CustomTripForm = ({ dictionary }: { dictionary: any }) => {
    const t = dictionary || {};

    const [formData, setFormData] = useState({
        adults: 2,
        children: 0,
        infants: 0,
        ages: [] as string[],
        hotel: "4stars",
        interests: [] as string[],
        arrivalDate: "",
        isFlexible: false,
        duration: "",
        budget: "",
        otherIdeas: "",
        fullName: "",
        email: "",
        nationality: "",
        phone: ""
    });

    const handleCounter = (field: "adults" | "children" | "infants", delta: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: Math.max(0, prev[field] + delta)
        }));
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const hotelOptions = [
        { id: "5stars", title: t.hotelStyle?.options?.["5stars"]?.title || "5 Stars", desc: t.hotelStyle?.options?.["5stars"]?.desc || "Premium luxury" },
        { id: "4stars", title: t.hotelStyle?.options?.["4stars"]?.title || "4 Stars", desc: t.hotelStyle?.options?.["4stars"]?.desc || "High comfort" },
        { id: "3stars", title: t.hotelStyle?.options?.["3stars"]?.title || "3 Stars", desc: t.hotelStyle?.options?.["3stars"]?.desc || "Reliable standards" },
        { id: "self", title: t.hotelStyle?.options?.["self"]?.title || "Self-booking", desc: t.hotelStyle?.options?.["self"]?.desc || "I will organize my own" },
    ];

    const interestItems = t.interests?.items || {
        nature: "Nature and Wild",
        iconic: "Iconic Sites",
        adventure: "Adventure",
        history: "History",
        local: "Local Life",
        photography: "Photography",
        hiking: "Hiking"
    };


    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [recommendations, setRecommendations] = useState<any[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch("/api/custom-trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            const data = await res.json();
            setRecommendations(data.recommendations || []);
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Inquiry Received!</h2>
                    <p className="text-slate-600 text-lg">
                        Thank you, {formData.fullName}. Our travel consultants will review your preferences and craft a custom itinerary for you shortly. We will contact you at {formData.email}.
                    </p>

                    <button
                        onClick={() => {
                            setStatus("idle");
                            setRecommendations([]);
                            setFormData({
                                adults: 2,
                                children: 0,
                                infants: 0,
                                ages: [],
                                hotel: "4stars",
                                interests: [],
                                arrivalDate: "",
                                isFlexible: false,
                                duration: "",
                                budget: "",
                                otherIdeas: "",
                                fullName: "",
                                email: "",
                                nationality: "",
                                phone: ""
                            });
                        }}
                        className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                    >
                        Create Another Inquiry
                    </button>
                </div>

                {recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-black text-slate-800 text-center">
                            Based on your interests, you might like:
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommendations.map((trip) => (
                                <a key={trip._id} href={`/tours/${trip._id}`} target="_blank" rel="noopener noreferrer" className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                    <div className="relative h-48">
                                        <img
                                            src={trip.image || "/try.png"}
                                            alt={trip.title?.en}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase">
                                            {trip.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-black text-xl text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                                            {trip.title?.en || "Trip Title"}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-sky-400" /> {trip.duration?.en} days</span>
                                            {trip.price?.en && <span className="flex items-center gap-1 font-bold text-slate-700">${trip.price.en}</span>}
                                        </div>
                                        <div className="text-sky-500 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            View Details <Check className="w-4 h-4" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-sky-100/50 overflow-hidden border border-sky-50 transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-br from-sky-600 to-sky-400 p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-white rounded-3xl p-3 shadow-2xl shadow-sky-900/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src="https://res.cloudinary.com/dc127wztz/image/upload/w_200,f_auto,q_auto/v1770961573/hero-poster_c2nbaw.png" alt="Mongol Trail Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black mb-3 tracking-tight">{t.header?.title || "Create Your Masterpiece"}</h1>
                        <p className="text-sky-50 font-medium text-lg italic opacity-90 max-w-xl">
                            {t.header?.subtitle || "Tailor-made expeditions designed around your curiosity and pace."}
                        </p>
                    </div>
                </div>
                {/* Decorative gradients */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-800/20 rounded-full blur-[80px]" />
            </div>

            <form className="p-8 md:p-12 space-y-12" onSubmit={handleSubmit}>
                {/* Section 1: Travel Party */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                            <Users className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{t.travelParty?.title || "Travel Party"}</h2>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.travelParty?.subtitle || "Who is exploring?"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: "adults", label: t.travelParty?.adults || "Adults", sub: t.travelParty?.adultsSub || "12+ years" },
                            { id: "children", label: t.travelParty?.children || "Children", sub: t.travelParty?.childrenSub || "2-11 years" },
                            { id: "infants", label: t.travelParty?.infants || "Infants", sub: t.travelParty?.infantsSub || "Under 2y" }
                        ].map((item) => (
                            <div key={item.id} className="group relative p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-sky-300 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <p className="font-black text-slate-800 text-lg">{item.label}</p>
                                <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">{item.sub}</p>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => handleCounter(item.id as any, -1)}
                                        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-90"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="text-2xl font-black text-slate-700 w-8 text-center">
                                        {formData[item.id as keyof typeof formData] as number}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCounter(item.id as any, 1)}
                                        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Hotel & Style */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                            <Hotel className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{t.hotelStyle?.title || "Sanctuary Style"}</h2>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.hotelStyle?.subtitle || "Where do you rest?"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hotelOptions.map((opt) => (
                            <label
                                key={opt.id}
                                className={`relative flex flex-col p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 ${formData.hotel === opt.id
                                    ? "border-sky-500 bg-sky-50/20 ring-4 ring-sky-50"
                                    : "border-slate-50 bg-slate-50/30 hover:border-sky-200"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    id={`hotel-${opt.id}`}
                                    name="hotel"
                                    className="hidden"
                                    value={opt.id}
                                    checked={formData.hotel === opt.id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hotel: e.target.value }))}
                                />
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{opt.title}</p>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.hotel === opt.id ? 'bg-sky-500 border-sky-500' : 'border-slate-300'}`}>
                                        {formData.hotel === opt.id && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-400 italic leading-tight">{opt.desc}</p>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Section 3: Interests */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                            <MapPin className="w-6 h-6 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">{t.interests?.title || "Curiosities"}</h2>
                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest">{t.interests?.subtitle || "What sparks your interest?"}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(interestItems).map(([key, label]: [string, any]) => (
                            <button
                                type="button"
                                key={key}
                                onClick={() => toggleInterest(label)}
                                className={`px-8 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-300 ${formData.interests.includes(label)
                                    ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-200"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-sky-300"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section 4: Details & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1" htmlFor="arrival-date">{t.details?.arrivalDate || "Arrival Date"}</label>
                            <input
                                id="arrival-date"
                                name="arrivalDate"
                                type="date"
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all font-bold text-slate-700"
                                value={formData.arrivalDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, arrivalDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1" htmlFor="budget">{t.details?.budget || "Budget Per Soul ($)"}</label>
                            <input
                                id="budget"
                                name="budget"
                                type="number"
                                placeholder={t.details?.budgetPlaceholder || "e.g. 2500"}
                                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                value={formData.budget}
                                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1" htmlFor="narrative">{t.details?.narrative || "The Narrative"}</label>
                        <textarea
                            id="narrative"
                            name="otherIdeas"
                            rows={6}
                            placeholder={t.details?.narrativePlaceholder || "Share your specific dreams or requirements for this journey..."}
                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                            value={formData.otherIdeas}
                            onChange={(e) => setFormData(prev => ({ ...prev, otherIdeas: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="p-8 bg-sky-50 rounded-[40px] border border-sky-100 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white text-sky-500 rounded-xl shadow-sm">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase tracking-tight">{t.contact?.title || "Personal Details"}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="fullName"
                            placeholder={t.contact?.namePlaceholder || "Full Name"}
                            className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 font-bold transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            required
                            aria-label="Full Name"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder={t.contact?.emailPlaceholder || "Email Address"}
                            className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 font-bold transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            aria-label="Email Address"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder={t.contact?.phonePlaceholder || "Phone Number"}
                            className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 font-bold transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            aria-label="Phone Number"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative w-full py-6 bg-slate-900 overflow-hidden rounded-[30px] font-black text-white uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 group-hover:text-white transition-colors">
                        {status === "submitting" ? "Dispatching..." : (t.submit || "Dispatch Inquiry")}
                    </span>
                </button>
                {status === "error" && (
                    <p className="text-red-500 text-center font-bold">Something went wrong. Please try again.</p>
                )}
            </form>
        </div>
    );
};


export default CustomTripForm;
