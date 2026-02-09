"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaQuestionCircle } from "react-icons/fa";

interface FAQProps {
    dictionary: any;
}

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ: React.FC<FAQProps> = ({ dictionary }) => {
    const t = dictionary;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <FaQuestionCircle />
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
                        className="text-slate-500 text-lg leading-relaxed"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {t.questions.map((faq: FAQItem, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50"
                                aria-expanded={openIndex === index}
                            >
                                <h3 className="text-lg font-bold text-slate-900 pr-4">
                                    {faq.question}
                                </h3>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <FaChevronDown className="text-sky-600" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 pt-2">
                                            <p className="text-slate-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center p-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl border border-sky-100"
                >
                    <p className="text-slate-700 mb-4 font-medium">
                        {t.stillHaveQuestions}
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        {t.contactUs}
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
