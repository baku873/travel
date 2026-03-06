"use client";

import Image from "next/image";
import {
    MdLanguage,
    MdDirections,
    MdBookmarkBorder,
    MdCall,
    MdLocationOn,
    MdAccessTime,
    MdPhone
} from "react-icons/md";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaStar, FaChevronDown } from "react-icons/fa";

export interface GoogleCardLabels {
    title: string;
    subtitle: string;
    reviews: string;
    website: string;
    directions: string;
    save: string;
    call: string;
    share: string;
    mapView: string;
    seePhotos: string;
    address: string;
    hours: string;
    phone: string;
    suggestEdit: string;
    ownThisBusiness: string;
    openStatus: string;
    opensAt: string;
}

interface GoogleBusinessCardProps {
    className?: string;
    labels?: GoogleCardLabels;
}

const defaultLabels: GoogleCardLabels = {
    title: "Mongol Trail (Mongol Ayalal)",
    subtitle: "Travel agency in Ulaanbaatar, Mongolia",
    reviews: "120 Google reviews",
    website: "Website",
    directions: "Directions",
    save: "Save",
    call: "Call",
    share: "Share",
    mapView: "Map View",
    seePhotos: "See photos",
    address: "Room 502, 5th Floor, Erkhi Center, West 4 Intersection, Ulaanbaatar",
    hours: "Open",
    phone: "+976 7766-1626",
    suggestEdit: "Suggest an edit",
    ownThisBusiness: "Own this business?",
    openStatus: "Open",
    opensAt: "Closes 6PM"
};

const GoogleBusinessCard = ({ className = "", labels = defaultLabels }: GoogleBusinessCardProps) => {
    return (
        <div className={`w-full max-w-[380px] bg-white rounded-lg border border-gray-200 shadow-md font-sans overflow-hidden ${className}`}>

            {/* --- Header Images --- */}
            <div className="relative h-48 w-full flex">
                {/* Main Hero Image (2/3) */}
                <div className="relative w-2/3 h-full overflow-hidden border-r border-white">
                    <Image
                        src="/glacier.png"
                        alt="Mongolian travel glacier tour landscape"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Map Snapshot (1/3) */}
                <div className="relative w-1/3 h-full bg-gray-100">
                    {/* Placeholder for map if no static image exists */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-xs text-center font-medium">
                        {labels.mapView}
                    </div>
                </div>

                {/* "See photos" Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-black/70 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {labels.seePhotos}
                </div>
            </div>

            {/* --- Content Container --- */}
            <div className="p-4">

                {/* Title & Reviews */}
                <h2 className="text-xl font-medium text-gray-900 leading-tight mb-1">
                    {labels.title}
                </h2>

                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-orange-500">5.0</span>
                    <div className="flex text-orange-400 text-xs">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <span className="text-sm text-gray-500 hover:underline cursor-pointer">
                        ({labels.reviews})
                    </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    {labels.subtitle}
                </p>

                {/* --- Action Buttons --- */}
                <div className="flex justify-between mb-6 px-1">
                    <ActionButton icon={<MdLanguage size={24} />} label={labels.website} active />
                    <ActionButton icon={<MdDirections size={24} />} label={labels.directions} />
                    <ActionButton icon={<MdBookmarkBorder size={24} />} label={labels.save} />
                    <ActionButton icon={<MdCall size={24} />} label={labels.call} />
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* --- Information List --- */}
                <div className="space-y-4 text-sm text-gray-700">

                    {/* Address */}
                    <div className="flex gap-4 items-start group cursor-pointer">
                        <MdLocationOn className="text-gray-400 mt-0.5 shrink-0" size={20} />
                        <span className="group-hover:underline">
                            {labels.address}
                        </span>
                    </div>

                    {/* Hours */}
                    <div className="flex gap-4 items-center group cursor-pointer">
                        <MdAccessTime className="text-gray-400 shrink-0" size={20} />
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 font-medium">{labels.openStatus}</span>
                            <span className="text-gray-500">⋅ {labels.opensAt}</span>
                            <FaChevronDown className="text-gray-400 text-xs" />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex gap-4 items-center group cursor-pointer">
                        <MdPhone className="text-gray-400 shrink-0" size={20} />
                        <span className="group-hover:underline">
                            {labels.phone}
                        </span>
                        <div className="ml-auto px-1.5 py-0.5 border border-gray-200 rounded text-xs text-blue-700 font-bold hidden group-hover:block">
                            {labels.call}
                        </div>
                    </div>

                    {/* KG MID */}
                    <div className="pt-2 flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500 border border-gray-300">
                            /
                        </div>
                        <span className="uppercase tracking-wider font-bold text-[10px] text-gray-400">Claim this profile</span>
                    </div>

                </div>
                <hr className="border-gray-100 my-4" />

                {/* --- Social Profiles --- */}
                <div className="pb-2">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Profiles</h3>
                    <div className="flex gap-4">
                        <SocialIcon icon={<FaFacebook />} />
                        <SocialIcon icon={<FaInstagram />} />
                        <SocialIcon icon={<FaYoutube />} />
                        <SocialIcon icon={<FaTwitter />} />
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex gap-4 text-xs font-medium text-gray-500">
                <span className="hover:text-gray-800 cursor-pointer">{labels.suggestEdit}</span>
                <span className="hover:text-gray-800 cursor-pointer">{labels.ownThisBusiness}</span>
            </div>

        </div>
    );
};

const ActionButton = ({ icon, label, active }: any) => (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${active ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-blue-600 group-hover:bg-blue-50'}`}>
            {icon}
        </div>
        <span className={`text-xs font-medium ${active ? 'text-blue-700' : 'text-blue-700'}`}>{label}</span>
    </div>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
        {icon}
    </div>
);

export default GoogleBusinessCard;
