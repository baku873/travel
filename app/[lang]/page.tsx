import { Suspense } from "react";
import HeroWrapper from "../components/HeroWrapper";
import FeaturedTripsWrapper from "../components/FeaturedTripsWrapper";
import WhyChooseUs from "../components/WhyChooseUs";
import TripReviews from "../components/TripReviews";
import { Metadata } from 'next';
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  const titles = {
    en: 'Official Mongol Trail | Premier Adventure & Hiking Tours in Mongolia',
    mn: 'Албан ёсны Mongol Trail | Монголын шилдэг явган аялал, адал явдалт аялал',
    ko: '공식 Mongol Trail | 몽골 최고의 하이킹 및 어드벤처 투어'
  };

  const baseUrl = 'https://www.mongoltrail.com';
  return {
    title: titles[params.lang] || titles.en,
    description: dict.featured.desc,
    alternates: {
      canonical: `${baseUrl}/${params.lang}`,
      languages: {
        'mn': `${baseUrl}/mn`,
        'en': `${baseUrl}/en`,
        'ko': `${baseUrl}/ko`,
        'x-default': `${baseUrl}/mn`,
      }
    }

  };
}

export default async function Home(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  return (
    <>
      {/* Organization Schema - Knowledge Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'Mongol Trail',
            url: 'https://www.mongoltrail.com',
            logo: 'https://www.mongoltrail.com/logo.png',
            sameAs: [
              'https://www.facebook.com/mongoltrail',
              'https://www.instagram.com/mongoltrail'
            ],
            priceRange: '$$$',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ulaanbaatar',
              addressCountry: 'MN'
            }
          })
        }}
      />

      {/* WebSite Schema - Search Action */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Mongol Trail',
            url: 'https://www.mongoltrail.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.mongoltrail.com/packages?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is the best time to visit Mongolia?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The best time to visit Mongolia is from June to August for warm weather and festivals like Naadam. For winter adventure lovers, February is great for the Ice Festival.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do I need a visa for Mongolia?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Many countries, including South Korea and several European nations, have visa-free access to Mongolia for tourism. Check the latest regulations or contact us for assistance.'
                }
              },
              {
                '@type': 'Question',
                name: 'Are Mongol Trail tours suitable for families?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! We offer specialized family packages with kid-friendly activities, comfortable transport, and flexible itineraries.'
                }
              }
            ]
          })
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
      <TripReviews />
    </>
  );
}