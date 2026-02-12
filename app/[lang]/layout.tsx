// app/[lang]/layout.tsx
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import '../globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ClerkProvider } from '@clerk/nextjs';
import { i18n } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { SafeAreaProvider } from '../components/SafeAreaProvider';
import { AppInitializer } from '../components/AppInitializer';
import { MobileWrapper } from '../components/MobileWrapper';
import { ExternalLinkHandler } from '../components/ExternalLinkHandler';
import { MobileLayout } from '../components/MobileLayout';
import TravelAgencySchema from '../components/seo/TravelAgencySchema';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const baseUrl = 'https://www.mongoltrail.com';

  const localizedTitle = lang === 'mn'
    ? 'Албан ёсны Mongol Trail | Адал явдалт аялал'
    : lang === 'ko'
      ? '공식 Mongol Trail | 몽골 프리미엄 여행 & 트레킹'
      : 'Official Mongol Trail | Your Gateway to Adventure';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: localizedTitle,
      template: '%s | Mongol Trail',
    },
    description: dict.featured.desc || 'Experience the ultimate adventure with Mongol Trail. Premier tours across Mongolia and the world.',
    keywords: [
      'Mongolia Travel', 'Gobi Desert Tours', 'Nomadic Expeditions',
      'Mongolia Hiking', 'Adventure Travel Mongolia', 'Horseback Riding Mongolia',
      'Mongol Trail', 'Visit Mongolia', 'Mongolia Tourism'
    ],
    authors: [{ name: 'Mongol Trail Team' }],
    creator: 'Mongol Trail',
    publisher: 'Mongol Trail',
    formatDetection: {
      email: false,
      address: true,
      telephone: true,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'mn': `${baseUrl}/mn`,
        'ko': `${baseUrl}/ko`,
        'x-default': `${baseUrl}/en`
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'mn' ? 'mn_MN' : lang === 'ko' ? 'ko_KR' : 'en_US',
      url: `${baseUrl}/${lang}`,
      title: localizedTitle,
      description: dict.featured.desc || 'Experience the ultimate adventure with Mongol Trail.',
      siteName: 'Mongol Trail',
      images: [
        {
          url: '/logo.jpg',
          width: 1200,
          height: 630,
          alt: 'Mongol Trail Adventure',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description: dict.featured.desc || 'Experience the ultimate adventure with Mongol Trail.',
      creator: '@mongoltrail',
      images: ['/logo.jpg'],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Mongol Trail',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/image.png',
      shortcut: '/image.png',
      apple: '/image.png',
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const { children } = props;
  const dict = await getDictionary(params.lang as any);

  return (
    <ClerkProvider signInUrl={`/${params.lang}/sign-in`}
      signUpUrl={`/${params.lang}/sign-up`}>
      <html lang={params.lang}>
        <head>
          <link rel="preconnect" href="https://api.dicebear.com" />
          <link rel="preconnect" href="https://touching-gobbler-96.clerk.accounts.dev" />
          <link rel="preconnect" href="https://www.transparenttextures.com" />
          {/* SEO Schema */}
          <TravelAgencySchema />
        </head>
        <body className={inter.className}>
          <SafeAreaProvider>
            <MobileWrapper>
              <MobileLayout>
                <AppInitializer />
                <ExternalLinkHandler />
                <LanguageProvider initialLang={params.lang as any}>
                  <CurrencyProvider>
                    <Navbar dictionary={dict.nav} />
                    <main className="min-h-screen pt-20">
                      {children}
                    </main>
                    <Footer dictionary={dict.footer} navDictionary={dict.nav} />
                  </CurrencyProvider>
                </LanguageProvider>
              </MobileLayout>
            </MobileWrapper>
          </SafeAreaProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
