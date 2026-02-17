import { motion } from 'framer-motion';
import { FaVideo, FaEye, FaMapMarkedAlt } from 'react-icons/fa';

const ValueSection = () => {
    const values = [
        {
            icon: <FaVideo className="text-4xl" />,
            title: 'Control en Tiempo Real',
            description: 'Supervisa todas las rondas de patrullaje en vivo desde cualquier dispositivo.',
        },
        {
            icon: <FaEye className="text-4xl" />,
            title: 'Supervisión Centralizada',
            description: 'Panel único para gestionar múltiples instalaciones y equipos de seguridad.',
        },
        {
            icon: <FaMapMarkedAlt className="text-4xl" />,
            title: 'Evidencia Digital con GPS',
            description: 'Registro automático de ubicación y hora exacta en cada checkpoint escaneado.',
        }
    ];

    return (
        <section className="py-20 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Propuesta de <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Valor</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Tecnología de punta para la seguridad moderna
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group"
                        >
                            <div className="glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 h-full border border-secondary/20 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/20">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg shadow-secondary/50">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{value.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueSection;
