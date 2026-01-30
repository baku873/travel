"use client";

import Image from "next/image";
import {
    MdLanguage,
    MdDirections,
    MdBookmarkBorder,
    MdCall,
    MdShare,
    MdLocationOn,
    MdAccessTime,
    MdPhone
} from "react-icons/md";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface GoogleBusinessCardProps {
    className?: string;
}

const GoogleBusinessCard = ({ className = "" }: GoogleBusinessCardProps) => {
    return (
        <div className={`w-full max-w-[380px] bg-white rounded-lg border border-gray-200 shadow-md font-sans overflow-hidden ${className}`}>

            {/* ─── Header Images ─── */}
            <div className="relative h-48 w-full flex">
                {/* Main Hero Image (2/3) */}
                <div className="relative w-2/3 h-full overflow-hidden border-r border-white">
                    <Image
                        src="/glacier.png" // Using existing asset as placeholder
                        alt="Mongol Trail Landscape"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Map Snapshot (1/3) */}
                <div className="relative w-1/3 h-full bg-gray-100">
                    {/* Placeholder for map if no static image exists */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-xs text-center font-medium">
                        Map View
                    </div>
                    {/* If you have a map image, uncomment:
           <Image 
             src="/map-placeholder.png"
             alt="Map View"
             fill
             className="object-cover"
           /> 
           */}
                </div>

                {/* "See photos" Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-black/70 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    See photos
                </div>
            </div>

            {/* ─── Content Container ─── */}
            <div className="p-4">

                {/* Title & Reviews */}
                <h2 className="text-xl font-medium text-gray-900 leading-tight mb-1">
                    Mongol Trail (Mongol Ayalal)
                </h2>

                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-orange-500">5.0</span>
                    <div className="flex text-orange-400 text-xs">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <span className="text-sm text-gray-500 hover:underline cursor-pointer">
                        (120 Google reviews)
                    </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Travel agency in Ulaanbaatar, Mongolia
                </p>

                {/* ─── Action Buttons ─── */}
                <div className="flex justify-between mb-6 px-1">
                    <ActionButton icon={<MdLanguage size={24} />} label="Website" active />
                    <ActionButton icon={<MdDirections size={24} />} label="Directions" />
                    <ActionButton icon={<MdBookmarkBorder size={24} />} label="Save" />
                    <ActionButton icon={<MdCall size={24} />} label="Call" />
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* ─── Information List ─── */}
                <div className="space-y-4 text-sm text-gray-700">

                    {/* Address */}
                    <div className="flex items-start gap-3 group cursor-pointer">
                        <MdLocationOn className="text-blue-600 shrink-0 mt-0.5" size={20} />
                        <span className="group-hover:text-blue-600 group-hover:underline">
                            Room 502, 5th Floor, Erkhi Center, West 4 Road, Ulaanbaatar, Mongolia
                        </span>
                    </div>

                    {/* Hours */}
                    <div className="flex items-center gap-3">
                        <MdAccessTime className="text-blue-600 shrink-0" size={20} />
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-green-700">Open</span>
                            <span className="text-gray-600">⋅ Closes 6 PM</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <MdPhone className="text-blue-600 shrink-0" size={20} />
                        <a href="tel:+97699123456" className="text-gray-900 group-hover:text-blue-600 group-hover:underline">
                            +976 9912 3456
                        </a>
                    </div>
                </div>

                <hr className="border-gray-100 my-4" />

                {/* ─── Social Profiles ─── */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Profiles</h3>
                    <div className="flex items-center gap-3">
                        <SocialIcon icon={<FaFacebook />} href="https://facebook.com/mongoltrail" color="text-blue-600" />
                        <SocialIcon icon={<FaInstagram />} href="https://instagram.com/mongoltrail" color="text-pink-600" />
                        <SocialIcon icon={<FaYoutube />} href="https://youtube.com/@mongoltrail" color="text-red-600" />
                        <SocialIcon icon={<FaTwitter />} href="https://twitter.com/mongoltrail" color="text-black" />
                    </div>
                </div>

            </div>

            {/* ─── Footer Action ─── */}
            <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-600">Suggest an edit</span>
            </div>
        </div>
    );
};

// ─── Subcomponents ───

const ActionButton = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
    <button className="flex flex-col items-center gap-1.5 group">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 
      ${active
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                : 'bg-white border-gray-300 text-blue-600 hover:bg-gray-50'
            }`}>
            {icon}
        </div>
        <span className={`text-xs font-medium ${active ? 'text-blue-700' : 'text-blue-600'}`}>
            {label}
        </span>
    </button>
);

const SocialIcon = ({ icon, href, color }: { icon: React.ReactNode; href: string; color: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
    >
        <div className={`text-sm ${color}`}>
            {icon}
        </div>
    </a>
);

export default GoogleBusinessCard;
