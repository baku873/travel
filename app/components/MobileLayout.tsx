'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useAndroidBackButton } from '@/app/hooks/useAndroidBackButton';

/**
 * MobileLayout - Configures native mobile features
 * - Android status bar color
 * - Hardware back button handling
 * - Platform-specific behaviors
 */
export function MobileLayout({ children }: { children: React.ReactNode }) {
    // Handle Android back button
    useAndroidBackButton();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        async function configureNativeUI() {
            try {
                // Configure status bar to match app theme
                await StatusBar.setStyle({ style: Style.Dark });
                await StatusBar.setBackgroundColor({ color: '#1e293b' }); // slate-900

                // Show status bar (important for Android)
                if (Capacitor.getPlatform() === 'android') {
                    await StatusBar.show();
                }

                // Prevent status bar overlay on content
                await StatusBar.setOverlaysWebView({ overlay: false });
            } catch (error) {
                console.error('Failed to configure native UI:', error);
            }
        }

        configureNativeUI();
    }, []);

    return <>{children}</>;
}
