"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSave, FaGlobe, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// --- Type Definition for Settings ---
interface Settings {
  siteName: { mn: string; en: string; ko: string };
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  announcementBar: { mn: string; en: string; ko: string };
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- Fetch Initial Settings ---
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success) {
          setSettings(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // --- Handlers ---
  const handleTrilingualChange = (field: 'siteName' | 'announcementBar', lang: 'mn' | 'en' | 'ko', value: string) => {
    setSettings(prev => ({ ...prev, [field]: { ...(prev[field] as any), [lang]: value } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      setMessage({ type: 'success', text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);

    } catch (err) {
      setMessage({ type: 'error', text: "Error saving settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Feedback Message */}
      {message && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{message.text}</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* --- General Information --- */}
        <Section title="General Information" icon={FaGlobe}>
            <TrilingualInput label="Application Name" field="siteName" value={settings.siteName} onChange={handleTrilingualChange} />
            <Input label="Support Email" value={settings.supportEmail} onChange={v => setSettings({...settings, supportEmail: v})} type="email" />
            <TrilingualInput label="Global Announcement (Banner)" field="announcementBar" value={settings.announcementBar} onChange={handleTrilingualChange} />
        </Section>

        {/* --- System Controls --- */}
        <Section title="System Controls" icon={FaShieldAlt}>
            <Toggle label="Allow New Registrations" description="If disabled, new users cannot sign up." enabled={settings.allowRegistration} onChange={v => setSettings({...settings, allowRegistration: v})} />
            <Toggle label="Maintenance Mode" description="Show a maintenance page to all non-admin users." enabled={settings.maintenanceMode} onChange={v => setSettings({...settings, maintenanceMode: v})} danger />
        </Section>

        {/* --- Save Button --- */}
        <div className="flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50">
                {saving ? "Saving..." : <><FaSave /> Save Changes</>}
            </button>
        </div>
      </form>
    </div>
  );
}

// --- Helper Components ---
const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Icon className="text-blue-600" />
            <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

const TrilingualInput = ({ label, field, value, onChange }: { 
    label: string; 
    field: 'siteName' | 'announcementBar'; 
    value: { mn: string; en: string; ko: string } | undefined; 
    onChange: (field: 'siteName' | 'announcementBar', lang: 'mn' | 'en' | 'ko', value: string) => void;
}) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={value?.mn || ''} onChange={(e) => onChange(field, 'mn', e.target.value)} placeholder="MN" className="w-full border p-2 rounded" />
            <input value={value?.en || ''} onChange={(e) => onChange(field, 'en', e.target.value)} placeholder="EN" className="w-full border p-2 rounded" />
            <input value={value?.ko || ''} onChange={(e) => onChange(field, 'ko', e.target.value)} placeholder="KO" className="w-full border p-2 rounded" />
        </div>
    </div>
);

const Input = ({ label, value, onChange, type="text" }: {
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    type?: string;
}) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        {/* The 'e' is now correctly typed as a React ChangeEvent */}
        <input type={type} value={value || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} className="w-full border p-2 rounded" />
    </div>
);

const Toggle = ({ label, description, enabled, onChange, danger = false }: {
    label: string;
    description: string;
    enabled: boolean | undefined;
    onChange: (enabled: boolean) => void;
    danger?: boolean;
}) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="font-bold text-slate-800">{label}</h4>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                enabled ? (danger ? 'bg-red-500' : 'bg-green-500') : 'bg-slate-300'
            }`}
        >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
    </div>
);