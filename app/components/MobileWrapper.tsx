'use client';
import { useCapacitor } from '@/app/hooks/useCapacitor';
import { useEffect } from 'react';

/**
 * MobileWrapper - Detects native environment and applies mobile-specific behavior
 * - Hides large footer in native apps
 * - Forces MobileBottomNav to be persistent
 * - Disables pull-to-refresh gesture
 */
export function MobileWrapper({ children }: { children: React.ReactNode }) {
    const { isNative, platform } = useCapacitor();

    useEffect(() => {
        if (isNative) {
            // Disable pull-to-refresh in native apps
            // This prevents the webview from showing a refresh spinner on drag
            document.body.style.overscrollBehavior = 'none';

            // Also disable on html element
            document.documentElement.style.overscrollBehavior = 'none';

            // Add a class to body for native-specific styling
            document.body.classList.add('native-app');
            document.body.classList.add(`platform-${platform}`);
        }

        return () => {
            if (isNative) {
                document.body.classList.remove('native-app');
                document.body.classList.remove(`platform-${platform}`);
            }
        };
    }, [isNative, platform]);

    return <>{children}</>;
}
