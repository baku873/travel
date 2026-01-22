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
      {/* Load Hero independently */}
      <Suspense fallback={<div className="h-screen bg-slate-900" />}>
        <HeroWrapper />
      </Suspense>

      {/* Load Featured Trips independently */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading Trips...</div>}>
        <FeaturedTripsWrapper lang={params.lang} dictionary={dict.featured} />
      </Suspense>

      <WhyChooseUs dictionary={dict.whyChooseUs} />
      <TripReviews />
    </>
  );
}