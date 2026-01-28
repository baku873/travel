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

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://www.mongoltrail.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'Official Mongol Trail | Your Gateway to Adventure',
      template: '%s | Mongol Trail - Premium Mongolia Private Tours',
    },
    description: 'Experience the ultimate adventure with Mongol Trail. We offer premier tours across Mongolia, Europe, and the world. Book your next hiking, cultural, or overland trip today.',
    keywords: [
      'Mongol Trail', 'Mongolia hiking tours', 'Best trekking routes in Mongolia',
      'Mongolia trail guide', 'Guided hiking Mongolia', 'Horseback riding trails Mongolia',
      'Mongolia adventure travel agency', 'Mongolia Travel', 'Adventure Tours',
      'Hiking Mongolia', 'Euro Trails', 'World Travel', 'Overland Trip'
    ],
    authors: [{ name: 'Mongol Trail Team' }],
    creator: 'Mongol Trail',
    publisher: 'Mongol Trail',
    formatDetection: {
      email: false,
      address: true,
      telephone: true,
    },
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    },
    openGraph: {
      type: 'website',
      locale: lang === 'mn' ? 'mn_MN' : lang === 'ko' ? 'ko_KR' : 'en_US',
      url: `${baseUrl}/${lang}`,
      title: 'Mongol Trail | Your Gateway to Adventure',
      description: 'Experience the ultimate adventure with Mongol Trail. Premier tours across Mongolia and the world.',
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
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'mn-MN': `${baseUrl}/mn`,
        'en-US': `${baseUrl}/en`,
        'ko-KR': `${baseUrl}/ko`,
        'mn': `${baseUrl}/mn`,
        'en': `${baseUrl}/en`,
        'ko': `${baseUrl}/ko`,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mongol Trail | Your Gateway to Adventure',
      description: 'Experience the ultimate adventure with Mongol Trail.',
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
