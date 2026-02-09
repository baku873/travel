import Script from 'next/script';

type SchemaType = 'Organization' | 'WebSite' | 'Product' | 'TouristTrip' | 'BreadcrumbList' | 'FAQPage' | 'TravelAgency' | 'TouristDestination';

interface StructuredDataProps {
    id?: string;
    type: SchemaType;
    data: Record<string, any>;
}

export default function StructuredData({ id, type, data }: StructuredDataProps) {
    // Ensure @context and @type are set correctly
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };

    return (
        <Script
            id={id || `json-ld-${type.toLowerCase()}`}
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData),
            }}
        />
    );
}
