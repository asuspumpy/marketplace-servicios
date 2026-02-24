import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Camera, FileText, Send, Image as ImageIcon, Star } from 'lucide-react';
import { EvidenceUploader } from '../components/ui/EvidenceUploader';
import { RatingSystem } from '../components/ui/RatingSystem';

export const Dashboard: React.FC = () => {
    const { token: authToken, userId, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('bitacora');

    // Estado del Formulario de Bitácora
    const [actionType, setActionType] = useState('arrival');
    const [description, setDescription] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [requestId, setRequestId] = useState(''); // MOCK: En un caso real vendría de una lista de requests

    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ type: '', text: '' });

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            await axios.post(
                `${API_URL}/api/logs/bitacora`,
                {
                    request_id: requestId || "REQ-MOCK-123", // Fallback por si no pone ID
                    action_type: actionType,
                    description,
                    media_urls: mediaUrl ? [mediaUrl] : []
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            );

            setStatusMessage({ type: 'success', text: '¡Reporte anexado a la Bitácora con Trazabilidad Total!' });
            setDescription('');
            setMediaUrl('');
        } catch (error: any) {
            setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error al guardar reporte.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-6 relative overflow-hidden">
            {/* Efecto Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-[128px] opacity-70"></div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 relative z-10">
                {/* Sidebar Izquierda */}
                <aside className="w-full md:w-1/4 glass p-6 rounded-3xl h-fit">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
                            PR
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
                            <p className="text-sm text-primary">Profesional Verificado</p>
                        </div>
                    </div>

                    <nav className="space-y-4">
                        <button
                            onClick={() => setActiveTab('bitacora')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'bitacora' ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(12,235,235,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <FileText size={20} /> Entradas de Bitácora
                        </button>
                        <button
                            onClick={() => setActiveTab('evidencia')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'evidencia' ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(12,235,235,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ImageIcon size={20} /> Carga de Evidencia
                        </button>
                        <button
                            onClick={() => setActiveTab('calificar')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'calificar' ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(12,235,235,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Star size={20} /> Mis Calificaciones
                        </button>
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-3 rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-3"
                        >
                            Cerrar Sesión
                        </button>
                    </nav>
                </aside>

                {/* Área Principal (Bitácora Form) */}
                <main className="w-full md:w-3/4">
                    {activeTab === 'bitacora' && (
                        <div className="glass p-8 rounded-3xl animate-fade-in-up">
                            <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Bitácora de Trazabilidad</h2>
                            <p className="text-gray-400 mb-8">Registra tus acciones y sube evidencia fotográfica para asegurar la liberación del Escrow.</p>

                            {statusMessage.text && (
                                <div className={`p-4 mb-6 rounded-xl border ${statusMessage.type === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                                    {statusMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleLogSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Select Tipo Acción */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Hito del Servicio</label>
                                        <select
                                            value={actionType}
                                            onChange={(e) => setActionType(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                        >
                                            <option value="arrival" className="bg-black"> Llegada al Hogar</option>
                                            <option value="diagnosis" className="bg-black"> Diagnóstico y Revisión</option>
                                            <option value="quote_submitted" className="bg-black"> Cotización Extra Entregada</option>
                                            <option value="work_started" className="bg-black"> Inicio de Reparaciones</option>
                                            <option value="work_finished" className="bg-black"> Trabajo Terminado (Éxito)</option>
                                        </select>
                                    </div>

                                    {/* Mock Request ID */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">ID de Solicitud (Ticket)</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: REQ-12345"
                                            value={requestId}
                                            onChange={(e) => setRequestId(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Descripción Textarea */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Detalles del Reporte</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe la situación actual de forma clara..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
                                    />
                                </div>

                                {/* URL Media (Mock Photo Upload) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                        <Camera size={16} /> Evidencia Fotográfica (URL)
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://imgur.com/tu-foto.jpg"
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">La evidencia es obligatoria para la Política de Confianza Cero.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto bg-primary text-black font-bold py-3 px-8 rounded-xl hover:bg-accent transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <><Send size={18} /> Registrar Trazabilidad</>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'evidencia' && (
                        <div className="animate-fade-in-up">
                            <EvidenceUploader
                                serviceId="REQ-MOCK-456"
                                userId={userId || "USER-001"}
                                onUploadSuccess={(urls) => alert(`Fotos subidas a la nube con éxito:\n${urls.join('\n')}`)}
                            />
                        </div>
                    )}

                    {activeTab === 'calificar' && (
                        <div className="animate-fade-in-up">
                            <RatingSystem
                                serviceId="REQ-MOCK-789"
                                professionalId="PRO-MOCK-001"
                                serviceStatus="completed"
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
