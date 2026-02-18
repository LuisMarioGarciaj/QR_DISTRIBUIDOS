import { motion } from 'framer-motion';
import { FaShieldAlt, FaFileAlt, FaMapMarkerAlt, FaBell, FaClipboardCheck, FaTools } from 'react-icons/fa';

const Benefits = () => {
    const benefits = [
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: 'Reducción de Riesgos',
            description: 'Minimiza incidentes de seguridad con supervisión continua y alertas tempranas.',
        },
        {
            icon: <FaFileAlt className="text-3xl" />,
            title: 'Eliminación de Reportes en Papel',
            description: 'Digitalización completa de reportes, ahorrando tiempo y recursos.',
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl" />,
            title: 'Evidencia con GPS',
            description: 'Geolocalización precisa de cada evento registrado en el sistema.',
        },
        {
            icon: <FaBell className="text-3xl" />,
            title: 'Alertas en Tiempo Real',
            description: 'Notificaciones instantáneas ante cualquier incidencia o anomalía.',
        },
        {
            icon: <FaClipboardCheck className="text-3xl" />,
            title: 'Auditoría Completa de Rondas',
            description: 'Registro detallado de todas las actividades de patrullaje realizadas.',
        },
        {
            icon: <FaTools className="text-3xl" />,
            title: 'Registro Técnico de Fallas',
            description: 'Documentación automática de problemas técnicos y mantenimiento de dispositivos.',
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
                        Beneficios del <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Servicio</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Transforma la manera en que gestionas la seguridad de tus instalaciones
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300 h-full">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{benefit.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
