import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaUserShield, FaCheckCircle, FaExclamationCircle, FaQrcode, FaClock, FaRoute } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const Metrics = () => {
    const [metrics, setMetrics] = useState({
        activeGuards: 0,
        completedRoundsToday: 0,
        openIncidents: 0,
        monitoredCheckpoints: 0,
        activeShifts: 0,
        totalRoutes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/metrics/dashboard`);
                if (!response.ok) {
                    throw new Error('Error al cargar métricas');
                }
                const data = await response.json();

                // Mapeo de datos del backend a la estructura del frontend
                setMetrics({
                    activeGuards: 0, // No disponible en backend aún
                    completedRoundsToday: data.totalRounds || 0,
                    openIncidents: 0, // No disponible en backend aún
                    monitoredCheckpoints: data.totalScans || 0,
                    activeShifts: data.totalShifts || 0,
                    totalRoutes: 0 // No disponible en backend aún
                });
            } catch (err) {
                console.error("Error fetching metrics:", err);
                setError(err.message);
                // Fallback to zeros or previous state on error
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const metricsConfig = [
        { key: 'activeGuards', label: 'Guardias Activos', icon: <FaUserShield />, gradient: 'from-secondary to-primary' },
        { key: 'completedRoundsToday', label: 'Rondas Completadas', icon: <FaCheckCircle />, gradient: 'from-primary to-secondary' },
        { key: 'openIncidents', label: 'Incidencias Abiertas', icon: <FaExclamationCircle />, gradient: 'from-secondary to-primary' },
        { key: 'monitoredCheckpoints', label: 'Escaneos Totales', icon: <FaQrcode />, gradient: 'from-primary to-secondary' },
        { key: 'activeShifts', label: 'Turnos Registrados', icon: <FaClock />, gradient: 'from-secondary to-primary' },
        { key: 'totalRoutes', label: 'Rutas Programadas', icon: <FaRoute />, gradient: 'from-primary to-secondary' }
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
                        Datos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Tiempo Real</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-4">Panel de métricas del sistema MIS</p>
                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-secondary'}`}></div>
                        <span className={`text-sm font-semibold ${error ? 'text-red-400' : 'text-secondary'}`}>
                            {error ? 'Error de conexión' : 'Conectado al sistema'}
                        </span>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-dark rounded-2xl p-6 border border-white/10 animate-pulse">
                                <div className="h-12 w-12 bg-secondary/20 rounded-xl mb-4"></div>
                                <div className="h-4 bg-secondary/20 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-secondary/20 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metricsConfig.map((metric, index) => (
                            <motion.div
                                key={metric.key}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-white text-xl mb-4 shadow-lg shadow-secondary/30`}>
                                    {metric.icon}
                                </div>
                                <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="text-4xl font-bold text-white"
                                >
                                    {metrics[metric.key] !== undefined ? metrics[metric.key].toLocaleString() : 0}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        * Datos obtenidos en tiempo real desde la API REST.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Metrics;
