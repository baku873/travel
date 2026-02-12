import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const locales: string[] = i18n.locales as unknown as string[];

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales
    );

    const locale = matchLocale(languages, locales, i18n.defaultLocale);

    return locale;
}

const isPublicRoute = createRouteMatcher([
    '/',
    '/(mn|en|ko)',
    '/(mn|en|ko)/about(.*)',
    '/(mn|en|ko)/packages(.*)',
    '/(mn|en|ko)/contact(.*)',
    '/(mn|en|ko)/faq(.*)',
    '/(mn|en|ko)/tours/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/(mn|en|ko)/sign-in(.*)',
    '/(mn|en|ko)/sign-up(.*)',
    '/(mn|en|ko)/sso-callback(.*)',
    '/sitemap.xml',
    '/robots.txt'
]);

export default clerkMiddleware(async (auth, request) => {
    const { pathname, search } = request.nextUrl;

    // 1. Skip if it's an API route, has a locale, or is a public file
    if (pathname.startsWith('/api')) return;

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale && pathname !== '/sitemap.xml' && pathname !== '/robots.txt') {
        // 2. Optimized locale detection
        const locale = getLocale(request);

        // 3. Redirect to the localized path, PRESERVING QUERY PARAMS
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname === '/' ? '' : pathname}${search}`,
                request.url
            )
        );
    }

    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|xml|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
