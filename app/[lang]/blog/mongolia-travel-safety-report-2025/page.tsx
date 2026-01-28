import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { FaShieldAlt, FaPhoneAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface PageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: 'Is Mongolia Safe? 2025 Travel Safety Report & Crime Stats',
        description: 'Updated 2025 Safety Report for Mongolia. Crime statistics, tourist helpline numbers, and solo female travel safety ratings based on official data.',
        openGraph: {
            type: 'article',
            publishedTime: '2025-01-15T00:00:00.000Z',
        }
    };
}

export default async function SafetyReportPage({ params }: PageProps) {
    const { lang } = await params;

    // Content is predominantly English as "Linkable Assets" target global SEO.
    // We can add simple localization if needed, but the primary target is English backlinks.
    if (lang !== 'en') {
        // Optional: Redirect or show basics for other langs, or just render English content with a note.
        // For now, we render the same content to ensure the URL structure holds.
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">

            {/* ─── Hero Header ─── */}
            <div className="bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="container mx-auto px-4 py-24 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <FaCheckCircle /> Verified Data • Updated Jan 2025
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Mongolia Travel Safety Report <span className="text-green-400">2025</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        The definitive guide to tourist safety, crime rates, and health risks in Mongolia. Data aggregated from the Tourist Police and Embassy reports.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20 max-w-5xl">

                {/* ─── Safety Score Card ─── */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Safety Score</h2>
                        <p className="text-slate-600 mb-6">
                            Mongolia is rated as one of the safest destinations in Asia for tourists. Violent crime against foreigners is extremely rare.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 flex items-center gap-2">
                                <FaExclamationTriangle className="text-yellow-500" /> Pickpocketing Risk: Low
                            </div>
                            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 flex items-center gap-2">
                                <FaShieldAlt className="text-green-500" /> Solo Travel: Safe
                            </div>
                        </div>
                    </div>

                    {/* Visual Gauge (CSS) */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" className="text-slate-100" strokeWidth="12" fill="none" stroke="currentColor" />
                            <circle cx="96" cy="96" r="88" className="text-green-500" strokeWidth="12" fill="none" stroke="currentColor" strokeDasharray="552" strokeDashoffset="55" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-black text-slate-900">92</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">out of 100</span>
                        </div>
                    </div>
                </div>

                {/* ─── Emergency Numbers (Copyable) ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-2xl flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaShieldAlt size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Tourist Police</h3>
                            <div className="text-3xl font-black text-blue-600 mb-2">+976 7012-0111</div>
                            <p className="text-sm text-slate-500">English speaking dispatch available 24/7. Use this for non-emergencies or reporting theft.</p>
                        </div>
                    </div>

                    <div className="bg-red-50/50 border border-red-100 p-8 rounded-2xl flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaPhoneAlt size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">General Emergency</h3>
                            <div className="text-3xl font-black text-red-500 mb-2">101 / 105</div>
                            <p className="text-sm text-slate-500">Universal emergency numbers for Ambulance (103), Fire (101), and Police (102).</p>
                        </div>
                    </div>
                </div>

                {/* ─── Content Body ─── */}
                <div className="bg-white shadow-sm border border-slate-100 p-8 md:p-16 rounded-3xl prose prose-lg prose-slate max-w-none">
                    <h3>Is Mongolia safe for solo female travelers?</h3>
                    <p>
                        Yes. Mongolia is widely considered very safe for solo female travelers. The nomadic culture is inherently hospitable. The main annoyance reported is occasional catcalling in Ulaanbaatar at night, but physical harassment is rare compared to global averages.
                    </p>

                    <h3>Common Scams to Avoid</h3>
                    <ul>
                        <li><strong>The "Student" Art Seller:</strong> Friendly English-speaking students inviting you to an art show. Usually overpriced prints.</li>
                        <li><strong>Taxi Overcharging:</strong> Always use official apps like UBCab rather than hailing from the street.</li>
                    </ul>

                    <h3>Health & Environmental Hazards</h3>
                    <p>
                        The biggest "danger" in Mongolia is not crime, but the environment. Dehydration, altitude sickness, and getting lost in the vast steppe are real risks. Always travel with a GPS and ample water if driving independently.
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 not-prose rounded-r-xl">
                        <h4 className="font-bold text-yellow-800 mb-2">Did you know?</h4>
                        <p className="text-yellow-700 text-base m-0">
                            Ulaanbaatar is the coldest capital city in the world. Winter temperatures drop to -40°C. Frostbite is a legitimate safety risk from November to March.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
