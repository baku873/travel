import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { getFeaturedTrips } from '@/lib/mongo/trips';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import AiFactSheet from '@/app/components/ui/AiFactSheet';

interface PageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: 'Ultimate Mongolian Travel Guide 2025 | Mongol Trail',
        description: 'The complete Wikipedia-style guide to traveling in Mongolia. Covers Visa requirements, Gobi Desert tours, safety tips, costs, and cultural etiquette.',
        alternates: {
            canonical: `https://www.mongoltrail.com/${lang}/mongolia-travel-guide`
        }
    };
}

export default async function MongoliaTravelGuide({ params }: PageProps) {
    const { lang } = await params;
    const featuredTrips = await getFeaturedTrips();
    const dict = await getDictionary(lang);

    const breadcrumbs = [
        { label: 'Resources', href: `/${lang}/blog` },
        { label: 'Mongolia Travel Guide', href: `/${lang}/mongolia-travel-guide` }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header Image */}
            <div className="relative h-[400px] w-full">
                <Image
                    src="/hero.jpg" // Assuming this exists, or use a placeholder
                    alt="Mongolia Travel Guide Header"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl px-4">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            Mongolia Travel Guide
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-slate-100">
                            The Definitive Resource for Your 2025 Expedition
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Column */}
                <main className="lg:col-span-8">
                    <Breadcrumbs items={breadcrumbs} lang={lang} />

                    <article className="prose prose-lg prose-slate max-w-none">
                        <p className="lead text-xl text-slate-600 mb-8">
                            Ranking as one of the last true frontiers of adventure travel, Mongolia offers a landscape where nomadic culture thrives amidst vast steppes. Whether you are seeking authentic <strong>Mongol travel</strong> experiences, hiking pristine <strong>Mongolian trails</strong>, or embarking on overland expeditions, this guide covers everything from <strong>Gobi Desert tours</strong> to <strong>safety tips</strong> for solo travelers planning their ultimate <strong>Mongolian travel</strong> adventure.
                        </p>

                        {/* SECTION 1: Best Time */}
                        <h2 id="best-time" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6">Best Time for Mongolia Travel</h2>
                        <p>
                            The optimal window for visiting Mongolia is <strong>June through August</strong>. During these months, the weather is pleasant (20°C - 25°C), and the country comes alive with the <Link href={`/${lang}/tours/naadam-festival`}>Naadam Festival</Link>.
                        </p>
                        <div className="my-8 bg-blue-50 p-6 rounded-xl border border-blue-100 not-prose">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">What is the Naadam Festival?</h3>
                            <p className="text-sm text-slate-700 mb-4">Celebrated annually from July 11-13, Naadam is Mongolia's biggest national holiday and a UNESCO Intangible Cultural Heritage event. It showcases the "Three Manly Games": Mongolian wrestling, horse racing, and archery. Attending Naadam is a must-do for any cultural <strong>Mongol travel</strong> itinerary.</p>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Quick Season Breakdown</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <li className="flex items-center gap-2"><span className="text-xl">☀️</span> <strong>Summer (Jun-Aug):</strong> Best for hiking, Gobi tours, and festivals.</li>
                                <li className="flex items-center gap-2"><span className="text-xl">🍂</span> <strong>Autumn (Sep-Oct):</strong> Best for Eagle Festival and photography.</li>
                                <li className="flex items-center gap-2"><span className="text-xl">❄️</span> <strong>Winter (Nov-Mar):</strong> Extreme cold, but unique Ice Festival experiences.</li>
                            </ul>
                        </div>

                        {/* SECTION 2: Visa Requirements */}
                        <h2 id="visa" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6">Mongolia Travel Visa Requirements</h2>
                        <p>
                            As of 2025, Mongolia has significantly relaxed its visa policy to boost tourism. Citizens from <strong>34 European countries</strong>, South Korea, and several others can visit visa-free for up to 30 days.
                        </p>
                        <AiFactSheet
                            title="Visa Quick Facts"
                            className="my-6 float-right md:ml-6 md:w-72"
                            data={[
                                { label: "Visa-Free Countries", value: "34+ Nations (EU, KR, USA)" },
                                { label: "E-Visa Available", value: "Yes (evisa.mn)" },
                                { label: "Processing Time", value: "3-5 Business Days" },
                                { label: "Cost", value: "~$50 USD (if required)" },
                            ]}
                        />
                        <p>
                            Always check the official immigration website before departure. If you are booking a <Link href={`/${lang}/packages`}>tour package</Link> with us, we provide visa support letters free of charge.
                        </p>

                        {/* SECTION 3: Safety */}
                        <h2 id="safety" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6 py-4 clear-both">Is Mongolia Travel Safe?</h2>
                        <p>
                            Yes, Mongolia is widely considered one of the safest destinations in Asia for tourists. Violent crime against foreigners is extremely rare. However, petty theft can occur in crowded markets in Ulaanbaatar.
                        </p>
                        <p>
                            For solo female travelers, Mongolia is safe, though hiring a guide for remote regions is recommended due to the language barrier and lack of cell service.
                        </p>

                        {/* SECTION 4: Gobi Desert vs. Altai Mountains */}
                        <h2 id="gobi-vs-altai" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6 py-4 clear-both">Gobi Desert vs. Altai Mountains: Which is better?</h2>
                        <p>
                            A common question for anyone planning their <strong>Mongol travel</strong> itinerary is whether to head south to the Gobi or west to the Altai Mountains.
                        </p>
                        <p>
                            <strong>The Gobi Desert</strong> is famous for its vast sand dunes (Khongoryn Els), flaming cliffs (dinosaur fossils), and nomadic camel herders. It is generally more accessible from Ulaanbaatar and ideal for first-time visitors seeking classic overland tours.
                        </p>
                        <p>
                            <strong>The Altai Mountains</strong>, located in the far west, offer snow-capped peaks, deep valleys, and the unique Kazakh eagle hunting culture. It is the premier destination for trekking <strong>Mongolian trails</strong>, but requires domestic flights and more rugged travel.
                        </p>
                        <p>
                            If you have 10-14 days, focus on one region. If you have 3+ weeks, you can combine both for the ultimate expedition.
                        </p>

                        {/* SECTION 5: Cost */}
                        <h2 id="cost" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6">Cost of Mongolia Travel</h2>
                        <p>
                            Mongolia fits various budgets. Budget travelers can survive on $40-60/day using local transport and hostels, while mid-range guided tours average $150-250/day including private drivers, meals, and ger camps.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                            {featuredTrips.slice(0, 2).map(trip => (
                                <Link href={`/${lang}/tours/${trip._id}`} key={trip._id} className="group block bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-48 w-full">
                                        <Image src={trip.image} alt="Tour" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg mb-1">{trip.title[lang] || trip.title.en}</h4>
                                        <p className="text-blue-600 font-bold">${typeof trip.price === 'number' ? trip.price : (trip.price[lang] || trip.price.en)} / person</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* SECTION 6: Packing List */}
                        <h2 id="packing-list" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6">Packing list for a Mongolia nomadic tour</h2>
                        <p>
                            Weather on the steppes changes rapidly. The golden rule for <strong>Mongolian travel</strong> is layering.
                        </p>
                        <ul className="list-disc pl-5 mb-8 text-slate-700">
                            <li><strong>Warm Layers:</strong> A windproof/waterproof jacket and a fleece layer are essential, even in summer.</li>
                            <li><strong>Sturdy Footwear:</strong> Comfortable hiking boots for exploring <strong>Mongolian trails</strong> and uneven terrain.</li>
                            <li><strong>Sun Protection:</strong> Sunglasses, wide-brimmed hat, and high-SPF sunscreen (the high altitude means intense sun).</li>
                            <li><strong>Essentials:</strong> Wet wipes, headlamp, portable power bank, and basic first-aid supplies.</li>
                            <li><strong>Cultural Etiquette:</strong> Small gifts for nomadic families (e.g., small toys for children, sweets).</li>
                        </ul>

                        {/* SECTION 7: FAQ (Content Gap Analysis) */}
                        <h2 id="faq" className="scroll-mt-24 text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-6 not-prose">
                            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer open:bg-white open:shadow-md transition-all">
                                <summary className="font-bold text-slate-900 list-none flex justify-between items-center">
                                    Can I drink tap water in Mongolia?
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="pt-2 text-slate-600">No, you should stick to bottled or boiled water. Most tour operators provide unlimited bottled water during expeditions.</div>
                            </details>

                            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer open:bg-white open:shadow-md transition-all">
                                <summary className="font-bold text-slate-900 list-none flex justify-between items-center">
                                    Is there internet in the Gobi Desert?
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="pt-2 text-slate-600">Internet access is spotty. You will have 4G in town centers (sum), but expect to be offline for large portions of the drive. Most tourist camps do not have Wi-Fi.</div>
                            </details>

                            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer open:bg-white open:shadow-md transition-all">
                                <summary className="font-bold text-slate-900 list-none flex justify-between items-center">
                                    What toilets do they use in Mongolia?
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="pt-2 text-slate-600">In Ulaanbaatar and tourist camps, standard western flush toilets are available. However, on the road or in nomadic families, long-drop pit latrines are common.</div>
                            </details>

                            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer open:bg-white open:shadow-md transition-all">
                                <summary className="font-bold text-slate-900 list-none flex justify-between items-center">
                                    Do I need cash or card?
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="pt-2 text-slate-600">Cards are accepted in Ulaanbaatar supermakets and hotels. Once you leave the city (countryside), Cash (Tugrik) is King.</div>
                            </details>

                            <details className="group bg-slate-50 p-4 rounded-lg cursor-pointer open:bg-white open:shadow-md transition-all">
                                <summary className="font-bold text-slate-900 list-none flex justify-between items-center">
                                    What is the food like for vegetarians?
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="pt-2 text-slate-600">Mongolian diet is meat-heavy. However, Mongol Trail provides specialized vegetarian menus (pasta, rice dishes, salads) for all our guests upon request.</div>
                            </details>
                        </div>
                    </article>
                </main>

                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-xl mb-4">Table of Contents</h3>
                        <nav className="flex flex-col space-y-2 text-slate-600">
                            <a href="#best-time" className="hover:text-blue-600 hover:pl-2 transition-all">Best Time to Visit</a>
                            <a href="#visa" className="hover:text-blue-600 hover:pl-2 transition-all">Visa Requirements</a>
                            <a href="#safety" className="hover:text-blue-600 hover:pl-2 transition-all">Safety Guide</a>
                            <a href="#gobi-vs-altai" className="hover:text-blue-600 hover:pl-2 transition-all">Gobi vs. Altai</a>
                            <a href="#cost" className="hover:text-blue-600 hover:pl-2 transition-all">Cost Breakdown</a>
                            <a href="#packing-list" className="hover:text-blue-600 hover:pl-2 transition-all">Packing List</a>
                            <a href="#faq" className="hover:text-blue-600 hover:pl-2 transition-all">Travel FAQ</a>
                        </nav>
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <p className="font-bold text-sm text-slate-400 uppercase mb-2">Ready to plan?</p>
                            <Link href={`/${lang}/custom-trip`} className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                                Start Custom Trip
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
