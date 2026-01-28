import { getTripById } from "@/lib/mongo/trips";
import { notFound } from "next/navigation";
import TourDetailClient from "./TourDetailClient";
import { Metadata } from 'next';
import { Locale } from "@/i18n-config";

interface PageProps {
  params: Promise<{
    id: string;
    lang: Locale;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, lang } = await params;
  const trip = await getTripById(id);

  if (!trip) return {};

  const title = `${trip.title[lang] || trip.title.en}`;

  // Smart description logic: Use custom description or auto-generate
  let description: string;

  if (trip.description?.[lang] || trip.description?.en) {
    description = trip.description[lang] || trip.description.en || '';
  } else {
    // Auto-generate description from highlights
    const tourName = trip.title[lang] || trip.title.en;
    const duration = trip.duration[lang] || trip.duration.en;

    let highlightsText = '';
    if (trip.highlights && trip.highlights.length > 0) {
      const keyHighlights = trip.highlights
        .slice(0, 2)
        .map(h => h[lang] || h.en)
        .join(', ');
      highlightsText = ` including ${keyHighlights}`;
    }

    description = `Explore ${tourName} with Mongol Trail. ${duration} private expedition${highlightsText}. Book your 2025 adventure today.`;
  }

  const baseUrl = 'https://www.mongoltrail.com';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tours/${id}`,
      languages: {
        'mn': `${baseUrl}/mn/tours/${id}`,
        'en': `${baseUrl}/en/tours/${id}`,
        'ko': `${baseUrl}/ko/tours/${id}`,
      }
    },
    openGraph: {
      title,
      description,
      images: [trip.image],
      url: `${baseUrl}/${lang}/tours/${id}`,
      siteName: 'Mongol Trail',
      locale: lang === 'mn' ? 'mn_MN' : lang === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [trip.image],
    },
  };
}

export default async function TourPage({ params }: PageProps) {
  const { id, lang } = await params;
  const trip = await getTripById(id);

  if (!trip) {
    return notFound();
  }

  const baseUrl = 'https://www.mongoltrail.com';

  // JSON-LD for Tour/Product SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: trip.title[lang] || trip.title.en,
    image: trip.image,
    description: trip.description?.[lang] || trip.description?.en || trip.title[lang] || trip.title.en,
    brand: {
      '@type': 'Brand',
      name: 'Mongol Trail',
    },
    offers: {
      '@type': 'Offer',
      price: typeof trip.price === 'number' ? trip.price : (trip.price?.[lang] || trip.price?.en || 0),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/${lang}/tours/${id}`,
      offeredBy: {
        '@type': 'TravelAgency',
        name: 'Mongol Trail',
        url: 'https://www.mongoltrail.com'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: trip.rating || 5,
      reviewCount: 10,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Packages',
        item: `${baseUrl}/${lang}/packages`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: trip.title[lang] || trip.title.en,
        item: `${baseUrl}/${lang}/tours/${id}`,
      },
    ],
  };

  const tripJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title[lang] || trip.title.en,
    description: trip.description?.[lang] || trip.description?.en,
    image: trip.image,
    touristType: [trip.ageGroup?.[lang] || trip.ageGroup?.en || "Everyone"],
    itinerary: trip.itinerary?.map(item => ({
      '@type': 'City',
      name: item.title[lang] || item.title.en,
      description: item.desc[lang] || item.desc.en
    })),
    offers: {
      '@type': 'Offer',
      price: typeof trip.price === 'number' ? trip.price : (trip.price?.[lang] || trip.price?.en || 0),
      priceCurrency: 'USD',
      url: `${baseUrl}/${lang}/tours/${id}`
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Mongol Trail',
      url: 'https://www.mongoltrail.com'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripJsonLd) }}
      />
      <TourDetailClient trip={trip} />
    </>
  );
}
