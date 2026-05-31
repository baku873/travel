
import { ImageResponse } from 'next/og';
import { getTripById } from '@/lib/mongo/trips';

export const runtime = 'nodejs';

// Image metadata
export const alt = 'Mongol Trail Tour Detail';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const trip = await getTripById(params.id);

    if (!trip) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 48,
                        background: 'white',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Mongol Trail
                </div>
            ),
            { ...size }
        );
    }

    // Use the first available title (English fallback)
    const title = trip.title.en || trip.title.mn || 'Tour Detail';
    const duration = trip.duration.en || trip.duration.mn || '';
    const price = trip.price?.en || trip.price?.mn || '';
    const bgImage = trip.image || 'https://www.mongoltrail.com/og-bg-default.jpg'; // Fallback

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {/* Background Image with Overlay */}
                <img
                    src={bgImage}
                    alt={title}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6,
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '60px',
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                    }}
                >
                    {/* Logo / Brand */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: 'white',
                            fontSize: 32,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Mongol Trail
                    </div>

                    {/* Main Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 900,
                                color: 'white',
                                lineHeight: 1.1,
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            }}
                        >
                            {title}
                        </div>

                        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                            {/* Duration Badge */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                padding: '12px 24px',
                                borderRadius: '100px',
                                color: 'white',
                                fontSize: 24,
                                fontWeight: 600,
                            }}>
                                ⏱ {duration}
                            </div>

                            {/* Price Badge */}
                            {price && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: '#0ea5e9', // Sky 500
                                    padding: '12px 24px',
                                    borderRadius: '100px',
                                    color: 'white',
                                    fontSize: 24,
                                    fontWeight: 700,
                                }}>
                                    Start at ${price}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
