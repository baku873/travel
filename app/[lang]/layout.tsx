// app/[lang]/layout.tsx
import { Inter, Montserrat, Noto_Sans_KR } from 'next/font/google';
import { Metadata } from 'next';
import '../globals.css';
import { LanguageProvider, Language } from '../context/LanguageContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { UserProvider } from '../context/UserContext';
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
import MobileBottomNav from '../components/MobileBottomNav';
import ScrollProgressBar from '../components/ui/ScrollProgressBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const baseUrl = 'https://www.mongoltrail.com';

  const localizedTitle = lang === 'mn'
    ? 'Албан ёсны Mongol Trail | Адал явдалт аялал'
    : lang === 'ko'
      ? '공식 Mongol Trail | 몽골 프리미엄 여행 & 트레킹'
      : 'Mongolia Travel & Tours | The Official Mongol Trail';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: localizedTitle,
      template: '%s | Mongol Trail',
    },
    description: (dict.featured as any).desc || 'Looking for authentic Mongol travel experiences? Mongol Trail offers premier Mongolian travel packages, hiking trails, overland tours, and cultural trips. Book your Mongolia adventure today!',
    keywords: lang === 'mn'
      ? [
        'Монгол аялал', 'Говийн аялал', 'Хөвсгөл нуур',
        'Монголд аялах', 'Жуулчлал', 'Аялал жуулчлал',
        'Mongol Trail', 'Морин аялал', 'Явган аялал'
      ]
      : [
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
      description: (dict.featured as any).desc || 'Looking for authentic Mongol travel experiences? Mongol Trail offers premier Mongolian travel packages, hiking trails, overland tours, and cultural trips. Book your Mongolia adventure today!',
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
      description: (dict.featured as any).desc || 'Looking for authentic Mongol travel experiences? Mongol Trail offers premier Mongolian travel packages, hiking trails, overland tours, and cultural trips. Book your Mongolia adventure today!',
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
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
      shortcut: '/favicon.ico',
    },
    manifest: '/site.webmanifest',
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

  // Clerk Localization for Mongolian
  const mnLocalization = {
    signIn: {
      start: {
        title: 'Монгол Трэйлд тавтай морил',
        subtitle: 'Аяллаа төлөвлөж, захиалгаа удирдаарай',
        actionText: 'Бүртгэлгүй юу?',
        actionLink: 'Бүртгүүлэх'
      }
    },
    signUp: {
      start: {
        title: 'Монгол Трэйлд бүртгүүлэх',
        subtitle: 'Шинэ аялалд нэгдээрэй',
        actionText: 'Бүртгэлтэй юу?',
        actionLink: 'Нэвтрэх'
      }
    },
    userButton: {
      action__manageAccount: 'Бүртгэл удирдах',
      action__signOut: 'Системээс гарах'
    }
  };

  return (
    <ClerkProvider
      signInUrl={`/${params.lang}/sign-in`}
      signUpUrl={`/${params.lang}/sign-up`}
      localization={params.lang === 'mn' ? mnLocalization : undefined}
      appearance={{
        variables: {
          colorPrimary: '#2563eb', // Brand Blue
          fontFamily: 'var(--font-inter)',
          borderRadius: '12px',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30',
          card: 'shadow-none',
          userButtonPopoverCard: 'w-[calc(100vw-32px)] max-w-[360px] mx-auto font-[var(--font-inter)]',
          userButtonPopoverActionButton: 'text-blue-600 hover:text-blue-700',
          userButtonPopoverActionButtonIcon: 'text-blue-600'
        }
      }}
    >
      <html lang={params.lang}>
        <head>
          {/* Critical preconnects: only LCP-relevant origins */}
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://touching-gobbler-96.clerk.accounts.dev" />
          {/* Non-critical: dns-prefetch for below-fold resources */}
          <link rel="dns-prefetch" href="https://api.dicebear.com" />
          {/* SEO Schema */}
          <TravelAgencySchema />
        </head>
        <body className={`${inter.variable} ${montserrat.variable} ${notoSansKr.variable} font-sans bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-sky-200 selection:text-sky-900`}>
          <AppInitializer />
          <LanguageProvider initialLang={params.lang as Language}>
            <CurrencyProvider>
              <UserProvider>
                <SafeAreaProvider>
                  <MobileLayout>
                    <ExternalLinkHandler />
                    <ScrollProgressBar />

                    {/* Fixed Navbars */}
                    <Navbar dictionary={dict.nav} />

                    {/* Main Content Area */}
                    <main className="min-h-screen w-full relative z-0 pb-20 md:pb-0">
                      {children}
                    </main>

                    {/* Footer - Hidden on pages that don't need it (like map view if applicable) */}
                    <Footer dictionary={dict} navDictionary={dict.nav} />

                    {/* Mobile Bottom Navigation */}
                    <MobileBottomNav language={params.lang as any} dictionary={dict.nav} />
                  </MobileLayout>
                </SafeAreaProvider>
              </UserProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
