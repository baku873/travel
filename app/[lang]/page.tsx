import { Suspense } from "react";
import HeroWrapper from "../components/HeroWrapper";
import FeaturedTripsWrapper from "../components/FeaturedTripsWrapper";
import WhyChooseUs from "../components/WhyChooseUs";
import TopDestinations from "../components/TopDestinations";
import FAQ from "../components/FAQ";
import TripReviews from "../components/TripReviews";
import { Metadata } from 'next';
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import StructuredData from "../components/seo/StructuredData";

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  const titles = {
    en: 'Mongolia Travel & Tours - Visit Mongolia with Mongol Trail | Local Expert Guides',
    mn: 'Монгол аялал - Mongol Trail | Орон нутгийн мэргэжлийн хөтөч',
    ko: '몽골 여행 및 투어 - Mongol Trail과 함께 몽골 방문'
  };

  const descriptions = {
    en: 'Discover authentic Mongolia travel experiences with Mongol Trail. Expert local guides, custom tours to the Gobi Desert, Altai Mountains & more. 100% locally-owned tour operator.',
    mn: 'Монголын аяллаар бидэнтэй хамт. Орон нутгийн туршлагатай хөтөч, Говь, Алтай, Орхон хөндийн аяллууд.',
    ko: 'Mongol Trail과 함께 진정한 몽골 여행을 경험하세요. 현지 전문 가이드, 고비 사막, 알타이 산맥 맞춤 투어.'
  };

  const baseUrl = 'https://www.mongoltrail.com';
  return {
    title: titles[params.lang] || titles.en,
    description: descriptions[params.lang] || descriptions.en,
    keywords: [
      'Mongolia travel',
      'Mongolia tours',
      'visit Mongolia',
      'Gobi Desert tours',
      'Mongolia tour operator',
      'Altai Mountains',
      'Orkhon Valley',
      'Mongolia visa',
      'best time to visit Mongolia',
      'Mongolia travel guide'
    ],
    alternates: {
      canonical: `${baseUrl}/${params.lang}`,
      languages: {
        'mn': `${baseUrl}/mn`,
        'en': `${baseUrl}/en`,
        'ko': `${baseUrl}/ko`,
        'x-default': `${baseUrl}/en`,
      }
    },
    openGraph: {
      title: titles[params.lang] || titles.en,
      description: descriptions[params.lang] || descriptions.en,
      type: 'website',
      locale: params.lang === 'mn' ? 'mn_MN' : params.lang === 'ko' ? 'ko_KR' : 'en_US',
      url: `${baseUrl}/${params.lang}`,
      siteName: 'Mongol Trail'
    }
  };
}

export default async function Home(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  return (
    <>
      {/* Organization Schema - Knowledge Graph */}
      <StructuredData
        type="Organization"
        data={{
          name: 'Mongol Trail',
          url: 'https://www.mongoltrail.com',
          logo: 'https://www.mongoltrail.com/logo.png',
          sameAs: [
            'https://www.facebook.com/mongoltrail',
            'https://www.instagram.com/mongoltrail'
          ],
          priceRange: '$$-$$$',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ulaanbaatar',
            addressCountry: 'MN'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+976-99123456',
            contactType: 'customer service',
            areaServed: 'MN',
            availableLanguage: ['en', 'mn', 'de']
          },
          description: 'Mongol Trail is Mongolia\'s premier local tour operator offering authentic, sustainable Mongolia tours and custom travel experiences. Expert local guides, flexible itineraries, and responsible tourism.'
        }}
      />

      {/* WebSite Schema - Search Action */}
      <StructuredData
        type="WebSite"
        data={{
          name: 'Mongol Trail',
          url: 'https://www.mongoltrail.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.mongoltrail.com/packages?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      {/* TouristDestination Schema */}
      <StructuredData
        type="TouristDestination"
        data={{
          '@id': 'https://www.mongoltrail.com/#mongolia',
          name: 'Mongolia',
          description: 'Discover Mongolia\'s legendary landscapes, from the Gobi Desert to the Altai Mountains, with expert local guides from Mongol Trail.',
          touristType: ['Adventure Traveler', 'Cultural Explorer', 'Luxury Tourist'],
          includesAttraction: [
            {
              '@type': 'TouristAttraction',
              name: 'Gobi Desert',
              description: 'Mongolia\'s legendary southern desert featuring singing sand dunes, flaming cliffs, and unique wildlife.'
            },
            {
              '@type': 'TouristAttraction',
              name: 'Altai Mountains',
              description: 'Majestic mountain range in western Mongolia, home to eagle hunters and pristine alpine landscapes.'
            },
            {
              '@type': 'TouristAttraction',
              name: 'Orkhon Valley',
              description: 'UNESCO World Heritage Site and historical heart of the Mongol Empire, featuring ancient capitals and monasteries.'
            }
          ]
        }}
      />

      {/* FAQ Schema - Enhanced with all questions */}
      <StructuredData
        type="FAQPage"
        data={{
          mainEntity: (dict as any).faq?.questions?.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer
            }
          })) || []
        }}
      />

      {/* Load Hero independently */}
      <Suspense fallback={<div className="h-screen w-full bg-slate-900 animate-pulse" />}>
        <HeroWrapper lang={params.lang} />
      </Suspense>

      {/* Load Featured Trips independently */}
      <Suspense fallback={<div className="min-h-[800px] w-full flex items-center justify-center bg-slate-50 animate-pulse">Loading Trips...</div>}>
        <FeaturedTripsWrapper lang={params.lang} dictionary={dict.featured} />
      </Suspense>

      <WhyChooseUs dictionary={dict.whyChooseUs} />

      {/* Top Destinations Section */}
      {(dict as any).topDestinations && <TopDestinations dictionary={(dict as any).topDestinations} />}

      <TripReviews />

      {/* FAQ Section */}
      {(dict as any).faq && <FAQ dictionary={(dict as any).faq} />}
    </>
  );
}