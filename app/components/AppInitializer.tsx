'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { useRouter } from 'next/navigation';

/**
 * AppInitializer - Handles app lifecycle, deep linking, and splash screen
 * Must be placed inside a Client Component
 */
export function AppInitializer() {
    const router = useRouter();

    useEffect(() => {
        // Only run in native environment
        if (!Capacitor.isNativePlatform()) return;

        async function initializeApp() {
            try {
                // Hide splash screen after app loads
                await SplashScreen.hide();
            } catch (error) {
                console.log('Splash screen error:', error);
            }
        }

        // Initialize app
        initializeApp();

        // Listen for deep link events
        let listenerHandle: any = null;

        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            try {
                const url = new URL(event.url);
                let path = url.pathname;

                // Handle different URL schemes
                // mongoltrail://tours/123 or https://mongoltrail.com/en/tours/123
                if (url.protocol === 'mongoltrail:') {
                    // Custom scheme: mongoltrail://tours/123
                    path = url.pathname;
                } else {
                    // HTTPS scheme: use the full path
                    path = url.pathname;
                }

                console.log('Deep link received:', path);

                // Navigate to the path
                if (path && path !== '/') {
                    router.push(path);
                }
            } catch (error) {
                console.error('Error handling deep link:', error);
            }
        }).then(handle => {
            listenerHandle = handle;
        });

        // Cleanup listener on unmount
        return () => {
            if (listenerHandle) {
                listenerHandle.remove();
            }
        };
    }, [router]);

    return null; // This component doesn't render anything
}
