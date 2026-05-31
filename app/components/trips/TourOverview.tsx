"use client";

import React from "react";
import {
    Info,
    Clock,
    Calendar,
    Navigation,
    Tag,
    Printer,
    FileDown,
    Map as MapIcon,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

interface TourOverviewProps {
    trip: {
        tour_code: string;
        duration: { en: string; mn: string; ko: string };
        availability_text: string;
        start_location: string;
        price: { mn: number; en: number; ko: number };
        map_image_url: string;
        gallery?: string[];
        title: { en: string; mn: string; ko: string };
    };
}

const TourOverview: React.FC<TourOverviewProps> = ({ trip }) => {
    const quickFacts = [
        { icon: Info, label: "Tour Code", value: trip.tour_code || "N/A" },
        { icon: Clock, label: "Duration", value: trip.duration?.en || "Contact for info" },
        { icon: Calendar, label: "Availability", value: trip.availability_text || "Flexible" },
        { icon: Navigation, label: "Start Location", value: trip.start_location || "Ulaanbaatar" },
        { icon: Tag, label: "Base Price", value: `$${trip.price?.en?.toLocaleString() || "2,880"}` },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 space-y-16 font-sans">
            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left Column: Quick Facts & Inquiry */}
                <div className="space-y-10 lg:sticky lg:top-24">
                    <header>
                        <span className="text-[#4B5E4A] font-bold uppercase tracking-[0.2em] text-xs">Essential Trip Details</span>
                        <h2 className="text-4xl font-serif text-[#2C362B] mt-2">Tour Overview</h2>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                        {quickFacts.map((fact, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-5 p-5 bg-[#FDFBF7] rounded-[24px] border border-[#E8E2D9] group hover:border-[#D2B48C]/50 transition-colors shadow-sm"
                            >
                                <div className="p-3 bg-white rounded-2xl text-[#4B5E4A] border border-[#E8E2D9] group-hover:scale-110 transition-transform">
                                    <fact.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-0.5">{fact.label}</span>
                                    <span className="text-lg font-serif text-[#2C362B] truncate block">{fact.value}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[#E8E2D9] text-[#2C362B] rounded-full font-bold hover:bg-slate-50 transition-all text-sm uppercase tracking-widest">
                                <Printer size={18} /> Print
                            </button>
                            <a
                                href="/gobi-desert-packing-list.pdf"
                                download
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[#E8E2D9] text-[#2C362B] rounded-full font-bold hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
                            >
                                <FileDown size={18} /> Download PDF
                            </a>
                        </div>
                        <button className="w-full py-5 bg-[#800000] text-white rounded-[24px] font-serif text-xl hover:bg-[#660000] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-300 flex items-center justify-center gap-3">
                            INQUIRE THIS TRIP
                        </button>
                        <p className="text-center text-xs text-slate-400 italic">Customization available for private parties. Our experts will respond within 24 hours.</p>
                    </div>
                </div>

                {/* Right Column: Route Map */}
                <div className="space-y-6">
                    <div className="relative bg-white rounded-[40px] border border-[#E8E2D9] overflow-hidden shadow-sm aspect-[4/5] lg:aspect-auto lg:h-[750px] flex items-center justify-center p-8 bg-slate-50">
                        {trip.map_image_url ? (
                            <img
                                src={trip.map_image_url}
                                alt={`${trip.title.en} Route Map`}
                                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                <MapIcon size={120} strokeWidth={0.5} />
                                <span className="font-serif italic text-lg text-slate-400">Route visualization pending...</span>
                            </div>
                        )}

                        {/* Decorative elements */}
                        <div className="absolute top-8 left-8 p-4 bg-white/60 backdrop-blur rounded-2xl border border-white/40 shadow-sm hidden md:block">
                            <span className="text-[10px] font-black uppercase text-[#4B5E4A] tracking-widest">Digital Expedition Map</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gallery Slider/Carousel Section */}
            {trip.gallery && trip.gallery.length > 0 && (
                <div className="pt-12 border-t border-[#E8E2D9]">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-[#4B5E4A] font-bold uppercase tracking-[0.2em] text-xs">Visual Highlights</span>
                            <h3 className="text-3xl font-serif text-[#2C362B] mt-2">Atmospheric Discovery</h3>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 bg-white border border-[#E8E2D9] rounded-full hover:bg-[#D2B48C]/10 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-3 bg-[#D2B48C] text-white rounded-full hover:bg-[#b89a74] transition-colors shadow-lg">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                        {trip.gallery.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="min-w-[300px] md:min-w-[450px] aspect-[16/10] rounded-[30px] overflow-hidden border border-[#E8E2D9] snap-center relative group"
                            >
                                <img src={img} alt="Tour Highlight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default TourOverview;
