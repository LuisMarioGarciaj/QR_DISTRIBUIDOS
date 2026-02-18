import { useState } from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineBackground() {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
        console.log('✅ Spline loaded successfully');
    };

    const handleError = (error) => {
        console.error('❌ Spline loading error:', error);
        setHasError(true);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
            {/* Always show gradient background as fallback */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 20% 30%, rgba(41, 128, 185, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0, 77, 115, 0.3) 0%, #001a2e 100%)',
                }}
            />

            {/* Spline Animation overlay */}
            {!hasError && (
                <Spline
                    scene="https://prod.spline.design/g4O0lMSafv1PvEgOQqJ867UG/scene.splinecode"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: isLoading ? 0 : 0.8,
                        transition: 'opacity 0.8s ease-in-out',
                    }}
                />
            )}

            {/* Loading indicator */}
            {isLoading && !hasError && (
                <div className="absolute bottom-10 right-10 text-white/50 text-sm">
                    Cargando animación 3D...
                </div>
            )}
        </div>
    );
}
