"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft, FaCalendarAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLink, FaChevronRight
} from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";
/* ────────────────────── Types ────────────────────── */
interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
  de: string;
}

interface BlogPost {
  _id: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  // 👇 FIX: Allow content to be an object OR a string (for safety)
  content: LocalizedString | string; 
  category: string;
  image: string;
  author: string;
  authorImg: string;
  date: string;
  readTime: LocalizedString;
}

const BlogPostClient = ({ post }: { post: BlogPost }) => {
  const { language } = useLanguage();

  // Translations
  const t = {
    mn: {
      back: "Нийтлэл рүү буцах",
      read: "унших",
      authorRole: "Аялал, нийтлэлч",
      share: "Хуваалцах",
      ctaTitle: "Танд энэ нийтлэл таалагдсан уу?",
      ctaDesc: "Манай мэдээллийн товхимолд бүртгүүлж, шинэ аяллын мэдээг цаг алдалгүй аваарай.",
      emailPlace: "И-мэйл хаяг",
      subscribe: "Бүртгүүлэх"
    },
    en: {
      back: "Back to Blog",
      read: "read",
      authorRole: "Travel Writer",
      share: "Share",
      ctaTitle: "Did you enjoy this article?",
      ctaDesc: "Subscribe to our newsletter to get the latest travel updates instantly.",
      emailPlace: "Email address",
      subscribe: "Subscribe"
    },
    ko: {
      back: "블로그로 돌아가기",
      read: "읽기",
      authorRole: "여행 작가",
      share: "공유하기",
      ctaTitle: "이 기사가 마음에 드셨나요?",
      ctaDesc: "최신 여행 업데이트를 즉시 받으려면 뉴스레터를 구독하세요.",
      emailPlace: "이메일 주소",
      subscribe: "구독하기"
    },
    de: {
      back: "Zurück zum Blog",
      read: "lesen",
      authorRole: "Reisejournalist",
      share: "Teilen",
      ctaTitle: "Hat Ihnen dieser Artikel gefallen?",
      ctaDesc: "Abonnieren Sie unseren Newsletter, um sofort die neuesten Reise-Updates zu erhalten.",
      emailPlace: "E-Mail-Adresse",
      subscribe: "Abonnieren"
    }
  };

  const text = t[language];

  // 👇 FIX: safely extract the content string based on language
  // If it's an object {mn, en}, pick the language. If it's just a string, use it as is.
  const displayContent = typeof post.content === 'object' 
    ? (post.content as LocalizedString)[language] 
    : post.content;

  return (
    <div className="bg-white min-h-screen pb-20 pt-24">
      
      {/* ────────────────── HEADER SECTION ────────────────── */}
      <div className="container mx-auto px-4 max-w-4xl mb-10">
        
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold text-sm">
          <FaArrowLeft /> {text.back}
        </Link>

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
         
          <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <FaCalendarAlt /> {post.date}
          </span>
        </div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8"
        >
          {post.title[language]}
        </motion.h1>

        {/* Author */}
        <div className="flex items-center gap-4 border-y border-slate-100 py-6">
          <img 
            src={post.authorImg} 
            alt={post.author} 
            className="w-12 h-12 rounded-full bg-slate-100"
          />
          <div>
            <div className="font-bold text-slate-800">{post.author}</div>
            <div className="text-slate-500 text-sm">{text.authorRole}</div>
          </div>
          
          {/* Social Share */}
          <div className="ml-auto flex gap-3">
             <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"><FaFacebookF/></button>
             <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-sky-400 hover:text-white flex items-center justify-center transition-all"><FaTwitter/></button>
          </div>
        </div>
      </div>

      {/* ────────────────── FEATURED IMAGE ────────────────── */}
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-xl"
        >
          <Image 
            src={post.image} 
            alt={post.title[language]} 
            fill 
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* ────────────────── CONTENT BODY ────────────────── */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700">
            {/* Excerpt */}
            <p className="lead font-medium text-xl text-slate-600 mb-8 border-l-4 border-blue-500 pl-4 italic">
              {post.excerpt[language]}
            </p>

            {/* 👇 FIX: Use the calculated displayContent string */}
            {displayContent ? (
              <div dangerouslySetInnerHTML={{ __html: displayContent }} />
            ) : (
              // Fallback Dummy Content (Translated)
              <div className="text-slate-600 space-y-6">
                <p>
                  {language === "mn" 
                    ? "Аялал жуулчлал бол зөвхөн шинэ газар үзэх тухай биш, харин өөрийгөө шинээр нээх боломж юм." 
                    : language === "de"
                    ? "Reisen bedeutet nicht nur, neue Orte zu sehen, sondern sich selbst neu zu entdecken."
                    : "Tourism is not just about seeing new places, but about discovering yourself anew."}
                </p>
                <h3>
                  {language === "mn" ? "Яагаад энд очих хэрэгтэй вэ?" : language === "de" ? "Warum hierher kommen?" : "Why visit here?"}
                </h3>
                <p>
                   {language === "mn" 
                    ? "Байгалийн үзэсгэлэн, түүх соёлын үнэт өвүүд болон нутгийн иргэдийн найрсаг зочломтгой зан таныг угтах болно." 
                    : language === "de"
                    ? "Sie werden von natürlicher Schönheit, reichem historischem Erbe und der Gastfreundschaft der Einheimischen begrüßt."
                    : "You will be welcomed by natural beauty, rich historical heritage, and the hospitality of the locals."}
                </p>
                <ul>
                  <li>{language === "mn" ? "Өвөрмөц хоолны соёл" : language === "de" ? "Einzigartige Essenskultur" : "Unique food culture"}</li>
                  <li>{language === "mn" ? "Түүхэн дурсгалт газрууд" : language === "de" ? "Historische Sehenswürdigkeiten" : "Historical landmarks"}</li>
                  <li>{language === "mn" ? "Адал явдалт үйл ажиллагаанууд" : language === "de" ? "Abenteueraktivitäten" : "Adventure activities"}</li>
                </ul>
              </div>
            )}
        </div>

        {/* ────────────────── AUTHOR BIO (E-E-A-T) ────────────────── */}
        <div className="mt-16 bg-blue-50/50 rounded-2xl p-8 border border-blue-100 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img 
            src={post.authorImg} 
            alt={post.author} 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
          />
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Written by {post.author}</h3>
            <p className="text-slate-600">
              {language === 'mn' 
                ? 'Монгол Трэйл компанийн ахлах хөтөч, аялал жуулчлалын салбарт 10 гаруй жил ажилласан туршлагатай. Монгол орныхоо байгаль, соёлын өвийг дэлхийд таниулах зорилготой.'
                : language === 'ko'
                ? 'Mongol Trail의 수석 가이드로 10년 이상의 여행 업계 경험을 보유한 전문가입니다. 고비 사막과 알타이 산맥 원정을 이끄는 데 특화되어 있습니다.'
                : language === 'de'
                ? 'Ein erfahrener mongolischer Reiseleiter und Reisejournalist mit über 10 Jahren Erfahrung in der Leitung von Expeditionen durch die Wüste Gobi und das Altai-Gebirge.'
                : 'An expert Mongolian tour guide and travel writer with over 10 years of experience leading expeditions across the Gobi Desert and Altai Mountains. Dedicated to sharing authentic nomadic culture with the world.'}
            </p>
          </div>
        </div>
        
        {/* Footer CTA */}
        <div className="mt-16 bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
           <h3 className="text-2xl font-bold text-slate-800 mb-2">{text.ctaTitle}</h3>
           <p className="text-slate-500 mb-6">{text.ctaDesc}</p>
           <div className="flex justify-center gap-2 max-w-md mx-auto">
              <input type="email" placeholder={text.emailPlace} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">{text.subscribe}</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default BlogPostClient;