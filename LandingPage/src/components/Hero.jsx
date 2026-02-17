import video from '../assets/video.mp4';

const Hero = () => {
    return (
        <section className="min-h-screen relative overflow-hidden">
            {/* Video Background - Full Screen */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            >
                <source src={video} type="video/mp4" />
            </video>
        </section>
    );
};

export default Hero;
