"use client";

import { motion } from "framer-motion";
import { FaMountain, FaMapMarkedAlt, FaLandmark } from "react-icons/fa";
import Link from "next/link";

interface TopDestinationsProps {
    dictionary: any;
}

const TopDestinations: React.FC<TopDestinationsProps> = ({ dictionary }) => {
    const t = dictionary;

    const destinations = [
        {
            icon: FaMapMarkedAlt,
            title: t.gobi.title,
            description: t.gobi.description,
            bestTime: t.gobi.bestTime,
            perfectFor: t.gobi.perfectFor,
            gradient: "from-orange-500 to-yellow-500",
            bgGradient: "from-orange-50 to-yellow-50",
        },
        {
            icon: FaMountain,
            title: t.altai.title,
            description: t.altai.description,
            bestTime: t.altai.bestTime,
            perfectFor: t.altai.perfectFor,
            gradient: "from-blue-600 to-purple-600",
            bgGradient: "from-blue-50 to-purple-50",
        },
        {
            icon: FaLandmark,
            title: t.orkhon.title,
            description: t.orkhon.description,
            bestTime: t.orkhon.bestTime,
            perfectFor: t.orkhon.perfectFor,
            gradient: "from-green-600 to-teal-600",
            bgGradient: "from-green-50 to-teal-50",
        },
    ];

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-widest">
                            {t.badge}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
                    >
                        {t.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-xl leading-relaxed"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                {/* Destination Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group relative"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${dest.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />

                            <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dest.gradient} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                    <dest.icon size={32} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    {dest.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                                    {dest.description}
                                </p>

                                {/* Meta Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mt-1">
                                            {t.bestTimeLabel}
                                        </span>
                                        <span className="text-sm text-slate-700 font-semibold">
                                            {dest.bestTime}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mt-1">
                                            {t.perfectForLabel}
                                        </span>
                                        <span className="text-sm text-slate-700">
                                            {dest.perfectFor}
                                        </span>
                                    </div>
                                </div>

                                {/* CTA Link */}
                                <Link
                                    href="/packages/mongolia"
                                    className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${dest.gradient} text-transparent bg-clip-text group-hover:gap-3 transition-all`}
                                >
                                    {t.exploreLink}
                                    <span className="text-slate-400">→</span>
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopDestinations;
