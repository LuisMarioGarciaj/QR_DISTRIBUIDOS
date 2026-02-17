import { motion } from 'framer-motion';
import { FaUserShield, FaQrcode } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import img1 from '../assets/img1.jpeg';
import img2 from '../assets/img2.jpeg';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaUserShield />,
            title: 'Inicia Sesión',
            description: 'Accede con tus credenciales seguras',
            number: 1,
            image: img1
        },
        {
            icon: <FaQrcode />,
            title: 'Escanea QR',
            description: 'Registra tu ronda en cada punto',
            number: 2,
            image: img2
        }
    ];

    const [activeStep, setActiveStep] = useState(0);

    // Auto-rotate steps every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <section className="min-h-screen py-20 px-6 relative flex items-center">
            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Sistema Inteligente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Patrullaje</span>
                    </h2>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Gestión eficiente en solo dos pasos.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Steps List - LEFT SIDE */}
                    <div className="space-y-6 order-1">
                        <h3 className="text-3xl font-bold text-white mb-8">
                            ¿Cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Funciona?</span>
                        </h3>
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`glass-dark rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${activeStep === index
                                    ? 'border-secondary bg-white/5 scale-105 shadow-lg shadow-secondary/10'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                                onClick={() => setActiveStep(index)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-colors duration-300 ${activeStep === index
                                        ? 'bg-gradient-to-br from-secondary to-primary text-white'
                                        : 'bg-white/10 text-gray-400'
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`font-bold text-xl transition-colors duration-300 ${activeStep === index ? 'text-secondary' : 'text-gray-500'
                                                }`}>
                                                0{step.number}
                                            </span>
                                        </div>
                                        <h3 className={`font-bold text-lg mb-1 transition-colors duration-300 ${activeStep === index ? 'text-white' : 'text-gray-300'
                                            }`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{step.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Phone Simulation - RIGHT SIDE */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative order-2 flex justify-center"
                    >
                        <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-900/50">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 flex justify-center">
                                <div className="w-32 h-4 bg-gray-800 rounded-b-xl"></div>
                            </div>

                            {/* Screen Content */}
                            <div className="relative w-full h-full bg-gray-900">
                                {steps.map((step, index) => (
                                    <motion.img
                                        key={index}
                                        src={step.image}
                                        alt={step.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: activeStep === index ? 1 : 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                ))}

                                {/* Overlay/UI Simulation elements (Optional) */}
                                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Decoration bloos */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-gradient-to-br from-secondary/20 to-primary/20 blur-3xl rounded-full"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
