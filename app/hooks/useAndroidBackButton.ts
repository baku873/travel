'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { useRouter } from 'next/navigation';

/**
 * useAndroidBackButton - Handles Android hardware back button
 * 
 * Behavior:
 * - On homepage: Minimize app (don't exit)
 * - On other pages: Navigate back in history
 */
export function useAndroidBackButton() {
    const router = useRouter();

    useEffect(() => {
        // Only run on Android native
        if (Capacitor.getPlatform() !== 'android') return;

        let listenerHandle: any;

        App.addListener('backButton', ({ canGoBack }) => {
            // Check if we're on the homepage
            const isHomepage = window.location.pathname === '/' ||
                window.location.pathname.match(/^\/[a-z]{2}\/?$/);

            if (!canGoBack || isHomepage) {
                // On homepage or can't go back: minimize app
                App.minimizeApp();
            } else {
                // Navigate back in history
                router.back();
            }
        }).then(handle => {
            listenerHandle = handle;
        });

        return () => {
            if (listenerHandle) {
                listenerHandle.remove();
            }
        };
    }, [router]);
}
