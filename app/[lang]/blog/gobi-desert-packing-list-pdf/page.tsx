"use client";

import { useState } from 'react';
import { FaCheck, FaSnowflake, FaSun, FaDownload, FaPrint } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PACKING_ITEMS = {
    essentials: [
        "Passport (valid for 6+ months)",
        "Visa (if required)",
        "Travel Insurance Policy",
        "Power Bank (20,000mAh+ recommended)",
        "Universal Travel Adapter",
    ],
    clothing_summer: [
        "Lightweight breathable pants",
        "Moisture-wicking t-shirts",
        "Wide-brimmed sun hat",
        "Sunglasses (UV protection)",
        "Light rain jacket (windbreaker)",
        "Hiking boots (broken in)",
    ],
    clothing_winter: [
        "Thermal base layers (Merino wool)",
        "Heavy down jacket (-30°C rated)",
        "Insulated waterproof pants",
        "Wool socks (thick)",
        "Insulated gloves & mittens",
        "Balaclava or scarf",
    ],
    toiletries: [
        "Sunscreen (SPF 50+)",
        "Lip balm (UV protection)",
        "Wet wipes (biodegradable)",
        "Hand sanitizer",
        "Personal medicine kit",
    ]
};

export default function PackingListPage() {
    const [season, setSeason] = useState<'summer' | 'winter'>('summer');
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleCheck = (item: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const progress = Math.round((Object.values(checkedItems).filter(Boolean).length /
        (PACKING_ITEMS.essentials.length + PACKING_ITEMS.toiletries.length + PACKING_ITEMS[`clothing_${season}`].length)) * 100);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* ─── Hero ─── */}
            <div className="bg-slate-900 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">
                        The Ultimate Gobi Desert <br /><span className="text-sky-400">Packing List</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Don't get caught unprepared in the wild. A complete, interactive checklist for your Mongolian adventure.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-full font-bold backdrop-blur-sm"
                        >
                            <FaPrint /> Print Checklist
                        </button>
                        <a
                            href="/gobi-desert-packing-list.pdf"
                            download
                            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 transition-colors px-6 py-3 rounded-full font-bold shadow-lg shadow-sky-500/30 text-white decoration-none"
                        >
                            <FaDownload /> Download PDF
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-3xl px-4 -mt-8 relative z-10">

                {/* ─── Season Toggle ─── */}
                <div className="bg-white rounded-2xl shadow-lg p-2 flex mb-8">
                    <button
                        onClick={() => setSeason('summer')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${season === 'summer' ? 'bg-orange-100 text-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <FaSun /> Summer (Jun-Aug)
                    </button>
                    <button
                        onClick={() => setSeason('winter')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${season === 'winter' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <FaSnowflake /> Winter (Sep-May)
                    </button>
                </div>

                {/* ─── Progress Bar ─── */}
                <div className="bg-white rounded-full h-4 mb-2 overflow-hidden shadow-inner bg-slate-200">
                    <div
                        className="h-full bg-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-right text-xs font-bold text-slate-400 mb-8">{progress}% Packed</p>

                {/* ─── Checklist Sections ─── */}
                <div className="space-y-6">
                    <ChecklistSection title="Essentials" items={PACKING_ITEMS.essentials} checkedItems={checkedItems} onToggle={toggleCheck} />
                    <ChecklistSection
                        title={season === 'summer' ? "Summer Clothing" : "Winter Clothing"}
                        items={PACKING_ITEMS[`clothing_${season}`]}
                        checkedItems={checkedItems}
                        onToggle={toggleCheck}
                    />
                    <ChecklistSection title="Toiletries & First Aid" items={PACKING_ITEMS.toiletries} checkedItems={checkedItems} onToggle={toggleCheck} />
                </div>

            </div>
        </div>
    );
}

const ChecklistSection = ({ title, items, checkedItems, onToggle }: any) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        </div>
        <div className="p-2">
            {items.map((item: string, i: number) => (
                <div
                    key={item}
                    onClick={() => onToggle(item)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checkedItems[item] ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 group-hover:border-sky-400'}`}>
                        {checkedItems[item] && <FaCheck size={12} />}
                    </div>
                    <span className={`font-medium transition-all ${checkedItems[item] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item}
                    </span>
                </div>
            ))}
        </div>
    </div>
);
