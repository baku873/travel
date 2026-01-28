import type { CapacitorConfig } from '@capacitor/cli';

// Determine server URL based on environment
const getServerUrl = () => {
    // For development: use your local IP address
    // For production: use your deployed URL
    if (process.env.NODE_ENV === 'production') {
        return 'https://www.mongoltrail.com';
    }

    // Development - replace with your actual local IP
    // Find your IP: `ip addr show` or `hostname -I`
    return process.env.CAPACITOR_SERVER_URL || 'http://192.168.11.53:3000';
};

const config: CapacitorConfig = {
    appId: 'com.mongoltrail.app',
    appName: 'Mongol Trail',

    // Server-based approach for SSR apps
    server: {
        url: getServerUrl(),
        cleartext: process.env.NODE_ENV !== 'production', // Allow HTTP in dev
        androidScheme: 'https',
        iosScheme: 'capacitor', // iOS uses custom scheme
        hostname: 'mongoltrail.com' // For Clerk allowed origins
    },

    // Plugin configuration
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            launchFadeOutDuration: 300,
            backgroundColor: '#1e293b',
            androidSplashResourceName: 'splash',
            androidScaleType: 'CENTER_CROP',
            splashFullScreen: false,
            splashImmersive: false,
            showSpinner: false
        },
        StatusBar: {
            style: 'DARK' as any,
            backgroundColor: '#1e293b'
        },
        Keyboard: {
            resize: 'native' as any,
            style: 'DARK' as any,
            resizeOnFullScreen: true
        }
    },

    // Android specific
    android: {
        buildOptions: {
            keystorePath: process.env.ANDROID_KEYSTORE_PATH,
            keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
            keystoreAlias: process.env.ANDROID_KEY_ALIAS,
            keystoreAliasPassword: process.env.ANDROID_KEY_PASSWORD,
            releaseType: 'APK'
        },
        allowMixedContent: process.env.NODE_ENV !== 'production'
    },

    // iOS specific
    ios: {
        contentInset: 'always',
        scheme: 'mongoltrail'
    }
};

export default config;
