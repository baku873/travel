'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * ExternalLinkHandler - Intercepts external links and opens them in system browser
 * This prevents external sites from loading inside the app webview
 */
export function ExternalLinkHandler() {
    useEffect(() => {
        // Only run in native environment
        if (!Capacitor.isNativePlatform()) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (!anchor) return;

            const href = anchor.href;
            if (!href) return;

            // Check if it's an external link (different domain)
            const currentDomain = window.location.hostname;
            const linkUrl = new URL(href, window.location.origin);

            // List of external domains to open in system browser
            const externalDomains = [
                'facebook.com',
                'instagram.com',
                'twitter.com',
                'youtube.com',
                'google.com',
                'maps.google.com',
                // Add any booking/flight sites
                'booking.com',
                'expedia.com',
                'skyscanner.com'
            ];

            const isExternal =
                linkUrl.hostname !== currentDomain &&
                linkUrl.hostname !== 'www.' + currentDomain &&
                linkUrl.hostname !== currentDomain.replace('www.', '');

            // Also check if explicitly marked as external
            const isExplicitlyExternal =
                anchor.target === '_blank' ||
                anchor.rel?.includes('external') ||
                externalDomains.some(domain => linkUrl.hostname.includes(domain));

            if (isExternal || isExplicitlyExternal) {
                e.preventDefault();

                // Open in system browser
                Browser.open({ url: href });
            }
        };

        // Add click listener
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return null;
}
