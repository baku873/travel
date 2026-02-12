import Script from 'next/script';

interface Offer {
    '@type': 'Offer';
    name: string;
    description?: string;
    price?: string | number;
    priceCurrency?: string;
}

interface TravelAgencySchemaProps {
    name?: string;
    description?: string;
    url?: string;
    logo?: string;
    telephone?: string;
    priceRange?: string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
    sameAs?: string[];
    offers?: Offer[];
    image?: string;
}

export default function TravelAgencySchema({
    name = 'Mongol Trail',
    description = 'Premier travel agency specializing in authentic Mongolia tours, Gobi Desert adventures, and cultural experiences.',
    url = 'https://www.mongoltrail.com',
    logo = 'https://www.mongoltrail.com/logo.jpg',
    telephone = '+976-99123456',
    priceRange = '$$$',
    streetAddress = 'Peace Avenue', // Update with actual
    addressLocality = 'Ulaanbaatar',
    addressRegion = 'Ulaanbaatar',
    postalCode = '14210',
    addressCountry = 'MN',
    sameAs = [
        'https://www.facebook.com/mongoltrail',
        'https://www.instagram.com/mongoltrail',
        'https://x.com/mongoltrail'
    ],
    image = 'https://www.mongoltrail.com/hero.jpg', // Default hero image
    offers = [
        {
            '@type': 'Offer',
            name: 'Gobi Desert Tours',
            description: 'Expeditions to the singing dunes and flaming cliffs.',
            priceCurrency: 'USD'
        },
        {
            '@type': 'Offer',
            name: 'Eagle Festival Tours',
            description: 'Experience the ancient tradition of eagle hunting.',
            priceCurrency: 'USD'
        }
    ]
}: TravelAgencySchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name,
        description,
        url,
        logo,
        image,
        telephone,
        priceRange,
        address: {
            '@type': 'PostalAddress',
            streetAddress,
            addressLocality,
            addressRegion,
            postalCode,
            addressCountry
        },
        sameAs,
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Tour Packages',
            itemListElement: offers
        }
    };

    return (
        <Script
            id="travel-agency-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
            }}
        />
    );
}
