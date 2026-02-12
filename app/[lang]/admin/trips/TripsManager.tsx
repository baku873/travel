"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaTrash, FaEdit, FaTimes, FaCloudUploadAlt, FaSpinner,
  FaMapSigns, FaCalendarAlt, FaUserPlus, FaSearch, FaUserCircle, FaMinusCircle
} from "react-icons/fa";
import { useRouter } from "next/navigation";
// --- Types ---
interface LocalizedString {
  mn: string;
  en: string;
  ko: string;
}
interface LocalizedPrice {
  mn: number;
  en: number;
  ko: number;
}
interface ItineraryItem {
  day: number;
  title: LocalizedString;
  desc: LocalizedString;
  imageUrl?: string;
}
interface TripDate {
  id: string;
  startDate: string;
  endDate: string;
  maxSeats: number;
  bookedSeats: number;
}
interface FlexibleDate {
  date: string;
  status: string;
  isFull?: boolean;
}
interface Trip {
  _id: string;
  title: LocalizedString;
  location: LocalizedString;
  description: LocalizedString;
  duration: LocalizedString;
  ageGroup: LocalizedString;
  price: LocalizedPrice;
  priceChild?: LocalizedPrice;
  salePrice?: LocalizedPrice;
  salePriceChild?: LocalizedPrice;
  discountPercentage?: number;
  rating: number;
  featured: boolean;
  type: string;
  region: string;
  category: string;
  image: string;
  perks: string[];
  tags: string[];
  highlights?: LocalizedString[];
  includedServices?: LocalizedString[];
  excludedServices?: LocalizedString[];
  map_image_url?: string;
  tour_code?: string;
  availability_text?: string;
  start_location?: string;
  itinerary: ItineraryItem[];
  availableDates?: FlexibleDate[];
  allowCustomDate?: boolean;
  dates: TripDate[];
}
interface ClerkUser {
  id: string;
  name: string;
  email: string;
  image: string;
}
interface Passenger {
  _id: string;
  userName: string;
  userEmail: string;
  status: string;
}
type Language = 'mn' | 'en' | 'ko';
interface TrilingualInputProps {
  label: string;
  field?: keyof Trip;
  value: { mn: string; en: string; ko: string };
  onChange: (field: keyof Trip, lang: Language, value: string) => void;
  isTextarea?: boolean;
}
interface TrilingualItinProps {
  label: string;
  value: { mn: string; en: string; ko: string };
  onChange: (lang: Language, value: string) => void;
  isTextarea?: boolean;
}
const BLANK_FORM_DATA: Partial<Trip> = {
  title: { mn: "", en: "", ko: "" },
  location: { mn: "", en: "", ko: "" },
  description: { mn: "", en: "", ko: "" },
  duration: { mn: "", en: "", ko: "" },
  ageGroup: { mn: "Бүх нас", en: "All Ages", ko: "전연령" },
  price: { mn: 0, en: 0, ko: 0 },
  priceChild: { mn: 0, en: 0, ko: 0 },
  salePrice: { mn: 0, en: 0, ko: 0 },
  discountPercentage: 0,
  rating: 5.0,
  type: "standard",
  region: "europe",
  category: "nature",
  featured: false,
  perks: [],
  tags: [],
  highlights: [],
  includedServices: [],
  excludedServices: [],
  image: "",
  map_image_url: "",
  tour_code: "",
  availability_text: "",
  start_location: "",
  itinerary: [],
  availableDates: [],
  allowCustomDate: true,
  dates: [],
};
// Helper for Trilingual Arrays (Highlights, etc)
const TrilingualArrayInput: React.FC<{
  label: string;
  items: LocalizedString[];
  activeLang: Language;
  onChange: (index: number, lang: Language, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}> = ({ label, items, activeLang, onChange, onAdd, onRemove }) => (
  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
    <div className="flex justify-between items-center">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{label}</label>
      <button type="button" onClick={onAdd} className="text-blue-600 hover:text-blue-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 p-1 px-2 bg-blue-50 rounded-md">
        <FaPlus size={8} /> Add Entry
      </button>
    </div>
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={item.mn} onChange={e => onChange(idx, 'mn', e.target.value)} placeholder="MONGOLIAN" className={`w-full border p-2 rounded text-xs transition-all ${activeLang === 'mn' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} />
            <input value={item.en} onChange={e => onChange(idx, 'en', e.target.value)} placeholder="ENGLISH" className={`w-full border p-2 rounded text-xs transition-all ${activeLang === 'en' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} />
            <input value={item.ko} onChange={e => onChange(idx, 'ko', e.target.value)} placeholder="KOREAN" className={`w-full border p-2 rounded text-xs transition-all ${activeLang === 'ko' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} />
          </div>
          <button type="button" onClick={() => onRemove(idx)} className="mt-1 text-red-300 hover:text-red-500 transition-colors p-1"><FaTrash size={12} /></button>
        </div>
      ))}
      {items.length === 0 && <p className="text-[10px] text-slate-400 italic">No entries yet.</p>}
    </div>
  </div>
);

export default function TripsManager({ initialTrips }: { initialTrips: Trip[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeAdminLang, setActiveAdminLang] = useState<Language>('en');
  const [trips, setTrips] = useState(initialTrips);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState<Partial<Trip>>(BLANK_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDayIndex, setUploadingDayIndex] = useState<number | null>(null);
  const [uploadingMap, setUploadingMap] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<{ USD: number; KRW: number }>({ USD: 0, KRW: 0 });

  // Fetch Exchange Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://monxansh.appspot.com/xansh.json");
        const data = await response.json();
        const usdRate = data.find((r: any) => r.code === "USD")?.rate_float || 3450;
        const krwRate = data.find((r: any) => r.code === "KRW")?.rate_float || 2.5;
        setExchangeRates({ USD: usdRate, KRW: krwRate });
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      }
    };
    fetchRates();
  }, []);

  // --- PASSENGER MANAGEMENT STATE ---
  const [managingDate, setManagingDate] = useState<TripDate | null>(null);
  const [passengerSearchQuery, setPassengerSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<ClerkUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [currentPassengers, setCurrentPassengers] = useState<Passenger[]>([]);
  const [loadingPassengers, setLoadingPassengers] = useState(false);
  // Prevent background scrolling when any modal is open
  useEffect(() => {
    if (isModalOpen || managingDate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen, managingDate]);
  // --- Handlers (Standard) ---
  const handleOpenCreate = () => {
    setEditingTrip(null);
    setFormData(BLANK_FORM_DATA);
    setIsModalOpen(true);
  };
  const handleOpenEdit = async (tripSummary: Trip) => {
    setEditingTrip(tripSummary); // Set initial summary data
    setIsModalOpen(true);
    setLoading(true); // Reuse loading state or create a specific one if needed

    try {
      // Fetch full details
      const res = await fetch(`/api/trips?id=${tripSummary._id}`);
      if (!res.ok) throw new Error("Failed to load trip details");
      const fullTrip = await res.json();

      setEditingTrip(fullTrip);
      setFormData({
        ...BLANK_FORM_DATA,
        ...fullTrip,
        itinerary: fullTrip.itinerary || [],
        dates: fullTrip.dates || [],
        highlights: fullTrip.highlights || [],
        includedServices: fullTrip.includedServices || [],
        excludedServices: fullTrip.excludedServices || [],
        availableDates: fullTrip.availableDates || []
      });
    } catch (err) {
      console.error("Error loading trip details:", err);
      alert("Failed to load full trip details. Please try again.");
      setIsModalOpen(false); // Close on error
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleTrilingualChange = (field: keyof Trip, lang: Language, value: string) => {
    setFormData(prev => ({ ...prev, [field]: { ...(prev[field] as any), [lang]: value } }));
  };

  const calculateSalePrice = (baseMnt: number, discount: number) => {
    if (discount <= 0) return null;
    const saleMnt = Math.round(baseMnt * (1 - discount / 100));
    return {
      mn: saleMnt,
      en: exchangeRates.USD > 0 ? Math.round(saleMnt / exchangeRates.USD) : 0,
      ko: exchangeRates.KRW > 0 ? Math.round(saleMnt / exchangeRates.KRW) : 0
    };
  };

  const handlePriceChange = (field: 'price' | 'priceChild' | 'salePrice', lang: Language, value: string) => {
    const numValue = Number(value) || 0;
    if (lang !== 'mn') return;

    setFormData(prev => {
      const updatedPrice = {
        mn: numValue,
        en: exchangeRates.USD > 0 ? Math.round(numValue / exchangeRates.USD) : 0,
        ko: exchangeRates.KRW > 0 ? Math.round(numValue / exchangeRates.KRW) : 0
      };

      let nextState = { ...prev, [field]: updatedPrice };

      // If Base Price or Discount changes, auto-calculate Sale Price
      if (field === 'price' && prev.discountPercentage && prev.discountPercentage > 0) {
        const newSalePrice = calculateSalePrice(numValue, prev.discountPercentage);
        if (newSalePrice) nextState.salePrice = newSalePrice;
      }

      // Handle Child Sale Price calculation when child base price changes
      if (field === 'priceChild' && prev.discountPercentage && prev.discountPercentage > 0) {
        const newSalePriceChild = calculateSalePrice(numValue, prev.discountPercentage);
        if (newSalePriceChild) nextState.salePriceChild = newSalePriceChild;
      }

      return nextState;
    });
  };

  const handleDiscountChange = (value: string) => {
    const discount = Number(value) || 0;
    setFormData(prev => {
      const baseMnt = prev.price?.mn || 0;
      const baseChildMnt = prev.priceChild?.mn || 0;

      const newSalePrice = calculateSalePrice(baseMnt, discount);
      const newSalePriceChild = calculateSalePrice(baseChildMnt, discount);

      return {
        ...prev,
        discountPercentage: discount,
        salePrice: newSalePrice || { mn: 0, en: 0, ko: 0 },
        salePriceChild: newSalePriceChild || { mn: 0, en: 0, ko: 0 }
      };
    });
  };
  const handleLocalizedArrayChange = (field: 'highlights' | 'includedServices' | 'excludedServices', index: number, lang: Language, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = { ...newArray[index], [lang]: value };
      return { ...prev, [field]: newArray };
    });
  };
  const addLocalizedArrayItem = (field: 'highlights' | 'includedServices' | 'excludedServices') => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), { mn: "", en: "", ko: "" }] }));
  };
  const removeLocalizedArrayItem = (field: 'highlights' | 'includedServices' | 'excludedServices', index: number) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
  };
  const addFlexibleDate = () => {
    setFormData(prev => ({ ...prev, availableDates: [...(prev.availableDates || []), { date: "", status: "open", isFull: false }] }));
  };
  const updateFlexibleDate = (index: number, field: keyof FlexibleDate, value: any) => {
    setFormData(prev => {
      const newDates = [...(prev.availableDates || [])];
      newDates[index] = { ...newDates[index], [field]: value };
      return { ...prev, availableDates: newDates };
    });
  };
  const removeFlexibleDate = (index: number) => {
    setFormData(prev => ({ ...prev, availableDates: (prev.availableDates || []).filter((_, i) => i !== index) }));
  };
  const handleArrayInput = (field: 'perks' | 'tags', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
  };
  const handleItineraryChange = (index: number, lang: Language, field: 'title' | 'desc', value: string) => {
    setFormData(prev => {
      const newItinerary = [...(prev.itinerary || [])];
      newItinerary[index] = { ...newItinerary[index], [field]: { ...(newItinerary[index][field]), [lang]: value } };
      return { ...prev, itinerary: newItinerary };
    });
  };
  const handleItineraryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDayIndex(index);
    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: "POST", body: formPayload });
      const data = await res.json();
      setFormData(prev => {
        const newItinerary = [...(prev.itinerary || [])];
        newItinerary[index] = { ...newItinerary[index], imageUrl: data.secure_url };
        return { ...prev, itinerary: newItinerary };
      });
    } catch (err) {
      console.error("Itinerary upload error:", err);
      alert("Image upload failed.");
    } finally {
      setUploadingDayIndex(null);
    }
  };
  const addItineraryDay = () => {
    setFormData(prev => ({ ...prev, itinerary: [...(prev.itinerary || []), { day: (prev.itinerary?.length || 0) + 1, title: { mn: '', en: '', ko: '' }, desc: { mn: '', en: '', ko: '' } }] }));
  };
  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({ ...prev, itinerary: (prev.itinerary || []).filter((_, i) => i !== index) }));
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: "POST", body: formPayload });
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed.");
    }
    finally { setUploadingImage(false); }
  };

  const handleMapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMap(true);
    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "euro_trails");
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: "POST", body: formPayload });
      const data = await res.json();
      setFormData(prev => ({ ...prev, map_image_url: data.secure_url }));
    } catch (err) {
      console.error("Map upload error:", err);
      alert("Map upload failed.");
    }
    finally { setUploadingMap(false); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingTrip ? "PATCH" : "POST";
    const body = editingTrip ? { ...formData, _id: editingTrip._id } : formData;
    try {
      const res = await fetch("/api/admin/trips", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Save failure:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          alert(`Error: ${errorJson.error || "Failed to save"}`);
        } catch {
          alert(`Server Error: ${res.status} ${res.statusText}`);
        }
        return;
      }

      handleCloseModal();
      router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("Save error:", err);
      alert("An network error occurred while saving.");
    }
    finally { setLoading(false); }
  };
  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch("/api/admin/trips", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _id }) });
      setTrips(prev => prev.filter(t => t._id !== _id));
      router.refresh();
    } catch (err) { alert("An error occurred."); }
  };
  // --- DATE GROUP LOGIC ---
  const addDateGroup = () => {
    const newGroup: TripDate = { id: crypto.randomUUID(), startDate: "", endDate: "", maxSeats: 20, bookedSeats: 0 };
    setFormData(prev => ({ ...prev, dates: [...(prev.dates || []), newGroup] }));
  };
  const updateDateGroup = (index: number, field: keyof TripDate, value: string | number) => {
    setFormData(prev => {
      const newDates = [...(prev.dates || [])];
      newDates[index] = { ...newDates[index], [field]: value };
      return { ...prev, dates: newDates };
    });
  };
  const removeDateGroup = (index: number) => {
    setFormData(prev => ({ ...prev, dates: (prev.dates || []).filter((_, i) => i !== index) }));
  };
  // --- PASSENGER MANAGEMENT HANDLERS ---
  // 1. Open Passenger Modal & Fetch Data
  const handleManagePassengers = async (date: TripDate) => {
    if (!editingTrip?._id) {
      alert("Please save the trip first before managing passengers.");
      return;
    }
    setManagingDate(date);
    setLoadingPassengers(true);
    setPassengerSearchQuery("");
    setUserSearchResults([]);
    try {
      const res = await fetch(`/api/admin/bookings?tripId=${editingTrip._id}&dateId=${date.id}`);
      const data = await res.json();
      setCurrentPassengers(data);
    } catch (error) {
      console.error("Failed to load passengers", error);
    } finally {
      setLoadingPassengers(false);
    }
  };
  // 2. Search Clerk Users
  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passengerSearchQuery.length < 3) return;
    setIsSearchingUsers(true);
    try {
      const res = await fetch(`/api/admin/users/search?query=${passengerSearchQuery}`);
      const data = await res.json();
      setUserSearchResults(data);
    } catch (error) {
      alert("Search failed");
    } finally {
      setIsSearchingUsers(false);
    }
  };
  // 3. Add User to Date (Create Booking)
  const handleAddPassenger = async (user: ClerkUser) => {
    if (!managingDate || !editingTrip) return;
    if (!confirm(`Add ${user.name} to this trip?`)) return;
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: editingTrip._id,
          dateId: managingDate.id,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          tripTitle: editingTrip.title,
          price: editingTrip.price?.mn || 0,
          tripImage: editingTrip.image
        })
      });
      if (!res.ok) throw new Error("Failed");
      // Refresh Lists
      const refreshRes = await fetch(`/api/admin/bookings?tripId=${editingTrip._id}&dateId=${managingDate.id}`);
      const refreshData = await refreshRes.json();
      setCurrentPassengers(refreshData);
      // Update UI Count
      const dateIndex = formData.dates?.findIndex(d => d.id === managingDate.id);
      if (dateIndex !== undefined && dateIndex > -1) {
        updateDateGroup(dateIndex, 'bookedSeats', (formData.dates![dateIndex].bookedSeats || 0) + 1);
      }
      alert("Passenger added successfully");
      setUserSearchResults([]);
      setPassengerSearchQuery("");
    } catch (error) {
      alert("Failed to add passenger");
    }
  };
  // 4. DELETE Passenger Handler (NEW)
  const handleRemovePassenger = async (bookingId: string, userName: string) => {
    if (!managingDate || !editingTrip) return;
    if (!confirm(`Are you sure you want to remove ${userName} from this group?`)) return;
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });
      if (!res.ok) throw new Error("Failed");
      // Refresh List (Remove from UI)
      setCurrentPassengers(prev => prev.filter(p => p._id !== bookingId));
      // Update UI Count (Decrease)
      const dateIndex = formData.dates?.findIndex(d => d.id === managingDate.id);
      if (dateIndex !== undefined && dateIndex > -1) {
        const currentSeats = formData.dates![dateIndex].bookedSeats || 0;
        updateDateGroup(dateIndex, 'bookedSeats', Math.max(0, currentSeats - 1));
      }
    } catch (error) {
      alert("Failed to remove passenger");
    }
  };
  return (
    <div>
      {/* Header & Main List */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Trips</h1>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['mn', 'en', 'ko'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveAdminLang(lang)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${activeAdminLang === lang ? 'bg-white shadow text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-sm">
            <FaPlus /> Create New Trip
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Title ({activeAdminLang.toUpperCase()})</th>
              <th className="p-4">Dates</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips.map((trip) => (
              <tr key={trip._id} className="hover:bg-slate-50">
                <td className="p-2">
                  {trip.image ? (
                    <img src={trip.image} className="w-16 h-12 rounded object-cover bg-slate-100" />
                  ) : (
                    <div className="w-16 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-300">
                      <FaCloudUploadAlt size={16} />
                    </div>
                  )}
                </td>
                <td className="p-4 font-bold text-slate-800">{trip.title[activeAdminLang] || trip.title.en}</td>
                <td className="p-4 text-sm text-slate-600">
                  {trip.dates?.length > 0 ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      {trip.dates.length} Groups
                    </span>
                  ) : <span className="text-slate-400">No dates</span>}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleOpenEdit(trip)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FaEdit /></button>
                  <button onClick={() => handleDelete(trip._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TRIP EDITOR MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingTrip ? "Edit Trip" : "Create New Trip"}</h2>
                <button onClick={handleCloseModal}><FaTimes /></button>
              </div>
              <form id="tripForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-3">{activeAdminLang === 'mn' ? 'Нүүр зураг' : 'Cover Image'}</label>
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed h-40 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all relative overflow-hidden bg-slate-50 shadow-sm">
                      {uploadingImage ? <FaSpinner className="animate-spin text-2xl text-blue-500" /> : formData.image ? <img src={formData.image} className="w-full h-full object-contain" /> : <div className="text-slate-400 text-center"><FaCloudUploadAlt className="text-3xl mx-auto mb-1" /><p className="text-[10px] font-bold uppercase">{activeAdminLang === 'mn' ? 'Зураг хуулах' : 'Main Photo'}</p></div>}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-3">{activeAdminLang === 'mn' ? 'Замын зураг' : 'Route Map Image'}</label>
                    <div
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file'; input.accept = 'image/*';
                        input.onchange = (e) => handleMapUpload(e as any);
                        input.click();
                      }}
                      className="border-2 border-dashed h-40 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white hover:border-green-400 transition-all relative overflow-hidden bg-white shadow-sm"
                    >
                      {uploadingMap ? <FaSpinner className="animate-spin text-2xl text-green-500" /> : formData.map_image_url ? <img src={formData.map_image_url} className="w-full h-full object-contain p-2" /> : <div className="text-slate-400 text-center"><FaMapSigns className="text-3xl mx-auto mb-1" /><p className="text-[10px] font-bold uppercase">{activeAdminLang === 'mn' ? 'Газрын зураг' : 'Upload Map'}</p></div>}
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Тур код' : 'Tour Code'}</label>
                      <input className="w-full border p-2 rounded-lg text-sm bg-white border-slate-200 font-bold" placeholder="e.g. P10-1" value={formData.tour_code || ''} onChange={e => setFormData({ ...formData, tour_code: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Эхлэх цэг' : 'Start Location'}</label>
                      <input className="w-full border p-2 rounded-lg text-sm bg-white border-slate-200" placeholder="e.g. Ulaanbaatar" value={formData.start_location || ''} onChange={e => setFormData({ ...formData, start_location: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Боломжит хугацаа' : 'Availability'}</label>
                      <input className="w-full border p-2 rounded-lg text-sm bg-white border-slate-200" placeholder="e.g. 1 Jun - 20 Sep" value={formData.availability_text || ''} onChange={e => setFormData({ ...formData, availability_text: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Үнэлгээ' : 'Rating'}</label>
                      <input type="number" step="0.1" className="w-full border p-2 rounded-lg text-sm bg-white border-slate-200" value={formData.rating || ''} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Төрөл' : 'Package Category'}</label>
                    <select
                      className="w-full border p-2 rounded-lg text-sm bg-white border-slate-200"
                      value={formData.type || 'standard'}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="standard">Standard</option>
                      <option value="family">Family</option>
                      <option value="solo">Solo</option>
                      <option value="club">Club</option>
                      <option value="honeymoon">Honeymoon</option>
                    </select>
                  </div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Бүс' : 'Region'}</label><input className="w-full border p-2 rounded-lg text-sm border-slate-200" value={formData.region || ''} onChange={e => setFormData({ ...formData, region: e.target.value })} /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Ангилал' : 'Category'}</label><input className="w-full border p-2 rounded-lg text-sm border-slate-200" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} /></div>
                  <div className="flex items-center gap-3 pt-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeAdminLang === 'mn' ? 'Онцлох' : 'Featured'}</label>
                    <button type="button" onClick={() => setFormData({ ...formData, featured: !formData.featured })} className={`w-10 h-5 rounded-full transition-colors relative ${formData.featured ? 'bg-orange-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.featured ? 'left-5.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
                {/* 2. Trilingual & Details */}
                <div className="space-y-4 border-t pt-6">
                  <TrilingualInput label={activeAdminLang === 'mn' ? 'Аяллын нэр' : 'Trip Title'} field="title" value={formData.title || { mn: '', en: '', ko: '' }} activeLang={activeAdminLang} onChange={handleTrilingualChange} />
                  <TrilingualInput label={activeAdminLang === 'mn' ? 'Байршил' : 'Location'} field="location" value={formData.location || { mn: '', en: '', ko: '' }} activeLang={activeAdminLang} onChange={handleTrilingualChange} />
                  <TrilingualInput label={activeAdminLang === 'mn' ? 'Тайлбар' : 'Description'} field="description" value={formData.description || { mn: '', en: '', ko: '' }} activeLang={activeAdminLang} onChange={handleTrilingualChange} isTextarea={true} />
                  <TrilingualInput label={activeAdminLang === 'mn' ? 'Үргэлжлэх хугацаа' : 'Duration'} field="duration" value={formData.duration || { mn: '', en: '', ko: '' }} activeLang={activeAdminLang} onChange={handleTrilingualChange} />
                  <TrilingualInput label={activeAdminLang === 'mn' ? 'Насны ангилал' : 'Age Group'} field="ageGroup" value={formData.ageGroup || { mn: '', en: '', ko: '' }} activeLang={activeAdminLang} onChange={handleTrilingualChange} />
                </div>

                <div className="space-y-4 border-t pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{activeAdminLang === 'mn' ? 'Үнийн мэдээлэл' : 'Pricing Details'}</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                      Rates: 1 USD = {exchangeRates.USD}₮ | 1 KRW = {exchangeRates.KRW}₮
                    </div>
                  </div>

                  {/* Pricing Calculator Integration */}


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Base Price (Adult)</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="number" value={formData.price?.mn || ''} onChange={(e) => handlePriceChange('price', 'mn', e.target.value)} placeholder="MNT" className="w-full border p-2 rounded text-sm bg-blue-50 border-blue-200" />
                        <input type="number" value={formData.price?.en || ''} readOnly placeholder="USD" className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
                        <input type="number" value={formData.price?.ko || ''} readOnly placeholder="KRW" className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Child Price</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="number" value={formData.priceChild?.mn || ''} onChange={(e) => handlePriceChange('priceChild', 'mn', e.target.value)} placeholder="MNT" className="w-full border p-2 rounded text-sm bg-blue-50 border-blue-200" />
                        <input type="number" value={formData.priceChild?.en || ''} readOnly placeholder="USD" className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
                        <input type="number" value={formData.priceChild?.ko || ''} readOnly placeholder="KRW" className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-500 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Discount Percentage (%)</label>
                      <input
                        type="number"
                        className="w-full border p-2 rounded text-sm bg-white border-blue-300 ring-2 ring-blue-50"
                        value={formData.discountPercentage || ''}
                        onChange={e => handleDiscountChange(e.target.value)}
                        placeholder="e.g. 20"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-green-600 mb-1 uppercase tracking-wider">Adult Sale Price</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="number" value={formData.salePrice?.mn || ''} readOnly className="w-full border p-2 rounded text-sm bg-green-50 text-green-700 font-bold border-green-200" />
                          <input type="number" value={formData.salePrice?.en || ''} readOnly className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-400" />
                          <input type="number" value={formData.salePrice?.ko || ''} readOnly className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-green-600 mb-1 uppercase tracking-wider">Child Sale Price</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="number" value={formData.salePriceChild?.mn || ''} readOnly className="w-full border p-2 rounded text-sm bg-green-50 text-green-700 font-bold border-green-200" />
                          <input type="number" value={formData.salePriceChild?.en || ''} readOnly className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-400" />
                          <input type="number" value={formData.salePriceChild?.ko || ''} readOnly className="w-full border p-2 rounded text-sm bg-slate-50 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-800">{activeAdminLang === 'mn' ? 'Онцлох болон Үйлчилгээ' : 'Highlights & Services'}</h3>
                  <TrilingualArrayInput label={activeAdminLang === 'mn' ? 'Аяллын онцлох' : 'Trip Highlights'} items={formData.highlights || []} activeLang={activeAdminLang} onChange={(i, l, v) => handleLocalizedArrayChange('highlights', i, l, v)} onAdd={() => addLocalizedArrayItem('highlights')} onRemove={(i) => removeLocalizedArrayItem('highlights', i)} />
                  <TrilingualArrayInput label={activeAdminLang === 'mn' ? 'Багтсан үйлчилгээ' : "What's Included"} items={formData.includedServices || []} activeLang={activeAdminLang} onChange={(i, l, v) => handleLocalizedArrayChange('includedServices', i, l, v)} onAdd={() => addLocalizedArrayItem('includedServices')} onRemove={(i) => removeLocalizedArrayItem('includedServices', i)} />
                  <TrilingualArrayInput label={activeAdminLang === 'mn' ? 'Багтаагүй үйлчилгээ' : "What's Not Included"} items={formData.excludedServices || []} activeLang={activeAdminLang} onChange={(i, l, v) => handleLocalizedArrayChange('excludedServices', i, l, v)} onAdd={() => addLocalizedArrayItem('excludedServices')} onRemove={(i) => removeLocalizedArrayItem('excludedServices', i)} />
                </div>

                <div className="space-y-4 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700">Allow Custom Date Request</label>
                    <button type="button" onClick={() => setFormData({ ...formData, allowCustomDate: !formData.allowCustomDate })} className={`w-12 h-6 rounded-full transition-colors relative ${formData.allowCustomDate ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.allowCustomDate ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Perks (comma separated)</label>
                    <input className="w-full border p-2 rounded text-sm" value={formData.perks?.join(', ') || ''} onChange={e => handleArrayInput('perks', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tags (comma separated)</label>
                    <input className="w-full border p-2 rounded text-sm" value={formData.tags?.join(', ') || ''} onChange={e => handleArrayInput('tags', e.target.value)} />
                  </div>
                </div>

                <div className="border-t pt-6 bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-600" /> {activeAdminLang === 'mn' ? 'Боломжит өдрүүд' : 'Available Dates'}
                    </h3>
                    <button type="button" onClick={addFlexibleDate} className="flex items-center gap-2 text-sm bg-purple-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-purple-700 shadow-sm">
                      <FaPlus /> {activeAdminLang === 'mn' ? 'Өдөр нэмэх' : 'Add Date'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {formData.availableDates?.map((d, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded border border-purple-200 shadow-sm">
                        <input type="text" value={d.date} onChange={e => updateFlexibleDate(idx, 'date', e.target.value)} placeholder="e.g. 2026.02.15" className="flex-1 border p-1.5 rounded text-sm" />
                        <select value={d.status} onChange={e => updateFlexibleDate(idx, 'status', e.target.value)} className="border p-1.5 rounded text-sm">
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <input type="checkbox" checked={d.isFull} onChange={e => updateFlexibleDate(idx, 'isFull', e.target.checked)} /> Full
                        </label>
                        <button type="button" onClick={() => removeFlexibleDate(idx)} className="text-red-400 hover:text-red-600"><FaTrash size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. DATE GROUPS SECTION (Legacy) */}
                <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" /> {activeAdminLang === 'mn' ? 'Товлосон аялал' : 'Fixed Departure Groups'}
                    </h3>
                    <button type="button" onClick={addDateGroup} className="flex items-center gap-2 text-sm bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm">
                      <FaPlus /> {activeAdminLang === 'mn' ? 'Өдөр нэмэх' : 'Add Date'}
                    </button>
                  </div>
                  {formData.dates && formData.dates.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {formData.dates.map((date, index) => (
                        <div key={date.id || index} className="flex flex-wrap items-center gap-3 bg-white p-3 rounded border border-blue-200 shadow-sm">
                          <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500 block">Start Date</label>
                            <input type="date" value={date.startDate} onChange={(e) => updateDateGroup(index, 'startDate', e.target.value)} className="w-full border p-1 rounded text-sm" />
                          </div>
                          <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500 block">End Date</label>
                            <input type="date" value={date.endDate} onChange={(e) => updateDateGroup(index, 'endDate', e.target.value)} className="w-full border p-1 rounded text-sm" />
                          </div>
                          <div className="w-20">
                            <label className="text-xs font-bold text-slate-500 block">Max</label>
                            <input type="number" value={date.maxSeats} onChange={(e) => updateDateGroup(index, 'maxSeats', Number(e.target.value))} className="w-full border p-1 rounded text-sm" />
                          </div>
                          <div className="w-20">
                            <label className="text-xs font-bold text-slate-500 block">Booked</label>
                            <input type="number" value={date.bookedSeats} readOnly className="w-full bg-slate-100 border p-1 rounded text-sm text-slate-500 cursor-not-allowed" />
                          </div>
                          {/* MANAGE PASSENGERS BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleManagePassengers(date)}
                            disabled={!editingTrip}
                            className="mt-4 flex items-center gap-1 text-xs bg-slate-800 text-white px-3 py-2 rounded hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            <FaUserPlus /> Passengers
                          </button>
                          <button type="button" onClick={() => removeDateGroup(index)} className="mt-4 p-2 text-red-400 hover:bg-red-50 rounded">
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No dates added yet.</p>
                  )}
                </div>
                {/* 4. Itinerary (Standard) */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FaMapSigns /> {activeAdminLang === 'mn' ? 'Аяллын хөтөлбөр' : 'Itinerary'}</h3>
                    <button type="button" onClick={addItineraryDay} className="flex items-center gap-2 text-sm bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg hover:bg-slate-200">
                      <FaPlus /> {activeAdminLang === 'mn' ? 'Өдөр нэмэх' : 'Add Day'}
                    </button>
                  </div>
                  {formData.itinerary && formData.itinerary.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {formData.itinerary.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                          <h4 className="text-md font-bold mb-4">{activeAdminLang === 'mn' ? `Өдөр ${item.day}` : `Day ${item.day}`}</h4>
                          <div className="space-y-4">
                            <TrilingualItinInput label={activeAdminLang === 'mn' ? 'Гарчиг' : 'Title'} value={item.title} activeLang={activeAdminLang} onChange={(lang, value) => handleItineraryChange(index, lang, 'title', value)} />
                            <TrilingualItinInput label={activeAdminLang === 'mn' ? 'Тайлбар' : 'Description'} value={item.desc} activeLang={activeAdminLang} onChange={(lang, value) => handleItineraryChange(index, lang, 'desc', value)} isTextarea={true} />

                            {/* Itinerary Image Upload */}
                            <div className="mt-4">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{activeAdminLang === 'mn' ? 'Зураг (Заавал биш)' : 'Upload Image (Optional)'}</label>
                              {item.imageUrl ? (
                                <div className="relative w-full max-w-sm h-32 rounded-lg border border-slate-200 overflow-hidden group bg-slate-50">
                                  <img src={item.imageUrl} alt="Day preview" className="w-full h-full object-contain" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => {
                                          const newItin = [...(prev.itinerary || [])];
                                          newItin[index] = { ...newItin[index], imageUrl: "" };
                                          return { ...prev, itinerary: newItin };
                                        });
                                      }}
                                      className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => handleItineraryImageUpload(index, e as any);
                                    input.click();
                                  }}
                                  className="border-2 border-dashed border-slate-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-all"
                                >
                                  {uploadingDayIndex === index ? (
                                    <FaSpinner className="animate-spin text-blue-500" />
                                  ) : (
                                    <>
                                      <FaCloudUploadAlt className="text-slate-400 text-xl mb-1" />
                                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{activeAdminLang === 'mn' ? 'Зураг оруулах' : 'Add Image'}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button type="button" onClick={() => removeItineraryDay(index)} className="p-2 text-red-400 hover:bg-red-50 rounded">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">{activeAdminLang === 'mn' ? 'Хөтөлбөр ороогүй байна.' : 'No days added yet.'}</p>
                  )}
                </div>
              </form>
              <div className="p-6 border-t mt-auto flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded">{activeAdminLang === 'mn' ? 'Болих' : 'Cancel'}</button>
                <button type="submit" form="tripForm" disabled={loading || uploadingImage} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50">
                  {loading ? (activeAdminLang === 'mn' ? "Хадгалж байна..." : "Saving...") : (activeAdminLang === 'mn' ? "Хадгалах" : "Save Trip")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* --- PASSENGER MANAGEMENT MODAL --- */}
      <AnimatePresence>
        {managingDate && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Manage Passengers</h3>
                  <p className="text-sm text-slate-500">
                    Trip: {editingTrip?.title.en} <br />
                    Date: {managingDate.startDate} - {managingDate.endDate}
                  </p>
                </div>
                <button onClick={() => setManagingDate(null)} className="p-2 hover:bg-slate-200 rounded-full"><FaTimes /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {/* 1. Search Section */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Add New Passenger (Search Clerk)</label>
                  <form onSubmit={handleSearchUsers} className="flex gap-2">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={passengerSearchQuery}
                        onChange={(e) => setPassengerSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <button type="submit" disabled={isSearchingUsers} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                      {isSearchingUsers ? "..." : "Search"}
                    </button>
                  </form>
                  {/* Search Results */}
                  {userSearchResults.length > 0 && (
                    <div className="mt-2 bg-white border rounded-lg shadow-sm divide-y">
                      {userSearchResults.map(user => (
                        <div key={user.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200 object-cover" />
                            ) : (
                              <FaUserCircle className="w-8 h-8 text-slate-300" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-800">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <button onClick={() => handleAddPassenger(user)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold hover:bg-green-200">
                            Add +
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* 2. Current Passengers List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-700">Passenger List</h4>
                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                      Total: {currentPassengers.length}
                    </span>
                  </div>
                  {loadingPassengers ? (
                    <div className="text-center py-10 text-slate-400"><FaSpinner className="animate-spin inline mr-2" /> Loading...</div>
                  ) : currentPassengers.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed text-slate-400">
                      No passengers booked yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentPassengers.map((passenger) => (
                        <div key={passenger._id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                              <FaUserCircle size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{passenger.userName}</p>
                              <p className="text-xs text-slate-500">{passenger.userEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs uppercase font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                              {passenger.status}
                            </span>
                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => handleRemovePassenger(passenger._id, passenger.userName)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Remove Passenger"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
// Helper (Standard)
const TrilingualInput: React.FC<TrilingualInputProps & { activeLang: Language }> = ({ label, field, value, onChange, activeLang, isTextarea = false }) => {
  const currentField = field || 'title';
  const InputComponent = isTextarea ? 'textarea' : 'input';
  return (
    <div className="mb-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InputComponent value={value?.mn || ''} onChange={(e) => onChange(currentField, 'mn', e.target.value)} placeholder="MONGOLIAN" className={`w-full border p-2 rounded text-sm transition-all outline-none ${activeLang === 'mn' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} rows={isTextarea ? 3 : undefined} />
        <InputComponent value={value?.en || ''} onChange={(e) => onChange(currentField, 'en', e.target.value)} placeholder="ENGLISH" className={`w-full border p-2 rounded text-sm transition-all outline-none ${activeLang === 'en' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} rows={isTextarea ? 3 : undefined} />
        <InputComponent value={value?.ko || ''} onChange={(e) => onChange(currentField, 'ko', e.target.value)} placeholder="KOREAN" className={`w-full border p-2 rounded text-sm transition-all outline-none ${activeLang === 'ko' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} rows={isTextarea ? 3 : undefined} />
      </div>
    </div>
  );
};

const TrilingualItinInput: React.FC<TrilingualItinProps & { activeLang: Language }> = ({ label, value, onChange, activeLang, isTextarea = false }) => {
  const InputComponent = isTextarea ? 'textarea' : 'input';
  return (
    <div className="mb-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InputComponent value={value?.mn || ''} onChange={(e: any) => onChange('mn', e.target.value)} placeholder="MONGOLIAN" className={`w-full border p-2 rounded text-sm transition-all outline-none ${activeLang === 'mn' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} rows={isTextarea ? 3 : undefined} />
        <InputComponent value={value?.en || ''} onChange={(e: any) => onChange('en', e.target.value)} placeholder="ENGLISH" className={`w-full border p-2 rounded text-sm transition-all outline-none ${activeLang === 'en' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} rows={isTextarea ? 3 : undefined} />
        <InputComponent value={value?.ko || ''} onChange={(e: any) => onChange('ko', e.target.value)} placeholder="KOREAN" className={`w-full border p-2 rounded text-sm transition-all outline-none ${activeLang === 'ko' ? 'ring-2 ring-blue-500/20 border-blue-400 bg-blue-50/10' : 'bg-white'}`} rows={isTextarea ? 3 : undefined} />
      </div>
    </div>
  );
};