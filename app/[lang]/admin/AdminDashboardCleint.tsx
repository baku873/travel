"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaPlaneDeparture, FaBlog, FaUsers, FaShoppingCart } from "react-icons/fa";

interface DashboardProps {
  stats: {
    trips: number;
    blogs: number;
    users: number;
    bookings: number;
  };
}

export default function AdminDashboardClient({ stats }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        icon={FaPlaneDeparture} 
        label="Total Trips" 
        value={stats.trips} 
        color="bg-blue-500" 
      />
      <StatCard 
        icon={FaBlog} 
        label="Blog Posts" 
        value={stats.blogs} 
        color="bg-green-500" 
      />
      <StatCard 
        icon={FaUsers} 
        label="Registered Users" 
        value={stats.users} 
        color="bg-purple-500"
        note="(Connect to 'users' collection)"
      />
      <StatCard 
        icon={FaShoppingCart} 
        label="Total Bookings" 
        value={stats.bookings} 
        color="bg-orange-500"
        note="(Connect to 'bookings' collection)"
      />
    </div>
  );
}

// Helper StatCard component
const StatCard = ({ icon: Icon, label, value, color, note }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
        <div className={`p-4 rounded-lg text-white ${color}`}>
            <Icon className="text-2xl" />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}
        </div>
    </motion.div>
);