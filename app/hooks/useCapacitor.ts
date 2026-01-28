'use client';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to detect if app is running in Capacitor native environment
 * @returns {Object} - isNative and platform detection
 */
export function useCapacitor() {
    const [isNative, setIsNative] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
        setPlatform(Capacitor.getPlatform() as any);
    }, []);

    return { isNative, platform };
}
