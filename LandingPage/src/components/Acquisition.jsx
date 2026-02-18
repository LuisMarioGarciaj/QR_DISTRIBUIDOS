import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const Acquisition = () => {
    const steps = [
        { number: '1', title: 'Contacto Inicial', description: 'Completa el formulario o contáctanos por email/teléfono' },
        { number: '2', title: 'Análisis de Requerimientos', description: 'Evaluamos tus necesidades y diseñamos la solución' },
        { number: '3', title: 'Propuesta Comercial', description: 'Presentamos el plan de implementación y cotización' },
        { number: '4', title: 'Implementación', description: 'Instalación del sistema, capacitación y puesta en marcha' },
        { number: '5', title: 'Soporte Continuo', description: 'Mantenimiento y actualizaciones constantes del sistema' }
    ];

    return (
        <section className="py-20 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        ¿Cómo Adquirir el <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Servicio?</span>
                    </h2>
                    <p className="text-gray-400 text-lg">Proceso simple y guiado para implementar el sistema</p>
                </motion.div>

                <div className="space-y-6 mb-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative"
                        >
                            <div className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300">
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-secondary/50">
                                            {step.number}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{step.description}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <FaCheckCircle className="text-2xl text-secondary" />
                                    </div>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="flex justify-center my-2">
                                    <div className="w-1 h-6 bg-gradient-to-b from-secondary/50 to-transparent"></div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-5 bg-gradient-to-r from-secondary to-primary text-white text-xl font-bold rounded-2xl shadow-2xl shadow-secondary/50 hover:shadow-secondary/70 transition-all duration-300"
                    >
                        Solicitar Implementación
                    </motion.button>

                    <p className="mt-6 text-gray-500 text-sm">
                        Respuesta en menos de 24 horas • Sin compromiso • Consulta gratuita
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Acquisition;
