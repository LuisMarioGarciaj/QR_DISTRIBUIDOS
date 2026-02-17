import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="py-12 px-6 relative border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">SP</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Smart Patrol</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sistema inteligente de patrullaje con control QR para la gestión moderna de seguridad.
                        </p>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
                        <div className="space-y-3">
                            <a href="mailto:info@smartpatrol.com" className="flex items-center gap-3 text-gray-400 hover:text-secondary transition-colors text-sm group">
                                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:bg-secondary/20 transition-all">
                                    <FaEnvelope className="text-secondary" />
                                </div>
                                info@Dqr.com
                            </a>
                            <a href="tel:+123456789" className="flex items-center gap-3 text-gray-400 hover:text-secondary transition-colors text-sm group">
                                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:bg-secondary/20 transition-all">
                                    <FaPhone className="text-secondary" />
                                </div>
                                +591 75777779
                            </a>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                                    <FaMapMarkerAlt className="text-secondary" />
                                </div>
                                Cochabamba, Bolivia
                            </div>
                        </div>
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Síguenos</h3>
                        <div className="flex gap-3">
                            <a href="https://github.com/LuisMarioGarciaj/QR_DISTRIBUIDOS/tree/LuisGarcia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-secondary/20 transition-all group">
                                <FaGithub className="text-gray-400 group-hover:text-secondary transition-colors" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2026 Smart Patrol System. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Desarrollado con</span>
                            <span className="text-secondary">React</span>
                            <span>•</span>
                            <span className="text-primary">Vite</span>
                            <span>•</span>
                            <span className="text-secondary">Tailwind CSS</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
