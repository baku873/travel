'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * SafeAreaProvider - Handles safe area insets and status bar for native apps
 * Applies CSS variables for iOS notch and Android navigation bar
 */
export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        async function setupNativeUI() {
            // Only run in native environment
            if (!Capacitor.isNativePlatform()) return;

            try {
                // Configure status bar for native apps
                await StatusBar.setStyle({ style: Style.Dark });
                await StatusBar.setBackgroundColor({ color: '#1e293b' });

                // On Android, show the status bar
                if (Capacitor.getPlatform() === 'android') {
                    await StatusBar.show();
                }

                // Apply safe area CSS variables
                // These handle iOS notch and Android navigation bar
                const root = document.documentElement;
                root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 0px)');
                root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');
                root.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left, 0px)');
                root.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right, 0px)');
            } catch (error) {
                console.log('Native UI setup failed:', error);
            }
        }

        setupNativeUI();
    }, []);

    return <>{children}</>;
}
