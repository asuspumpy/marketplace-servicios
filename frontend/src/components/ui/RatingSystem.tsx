import React, { useState } from 'react';
import { Star, MessageSquareQuote, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface RatingSystemProps {
    serviceId: string;
    professionalId: string;
    serviceStatus: 'open' | 'in_progress' | 'completed' | 'disputed';
}

export const RatingSystem: React.FC<RatingSystemProps> = ({ serviceId, professionalId, serviceStatus }) => {
    const { token } = useAuth();
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [error, setError] = useState('');

    // Prevenir validaciones si el servicio no ha sido completado
    if (serviceStatus !== 'completed') {
        return (
            <div className="glass p-6 rounded-2xl border border-white/5 opacity-80 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="text-gray-500 mb-3" size={32} />
                <h4 className="text-lg font-bold text-gray-300">Reseña No Disponible</h4>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                    Para mantener la integridad de la plataforma, solo puedes calificar a un profesional
                    una vez que el trabajo ha concluido y el pago ha sido liberado del Escrow.
                </p>
            </div>
        );
    }

    if (feedbackSent) {
        return (
            <div className="glass p-8 rounded-3xl border border-primary/20 bg-primary/5 text-center flex flex-col items-center animate-fade-in-up">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Star className="text-primary fill-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por tu reseña!</h3>
                <p className="text-gray-400">Tu retroalimentación ayuda a mantener la calidad y confianza en la comunidad.</p>
            </div>
        );
    }

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Por favor, selecciona una calificación.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            await axios.post(
                `${API_URL}/api/reviews`,
                {
                    request_id: serviceId,
                    reviewee_id: professionalId,
                    rating,
                    comment,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setFeedbackSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ocurrió un error al enviar tu reseña.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass p-8 rounded-3xl w-full max-w-xl mx-auto border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Califica el Servicio</h3>
            <p className="text-sm text-gray-400 mb-8">El trabajo ha sido marcado como Completado. ¿Qué te pareció el desempeño del profesional?</p>

            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <div className="flex flex-col items-center mb-8">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                size={40}
                                className={`transition-all duration-300 ${(hoverRating || rating) >= star
                                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                                    : 'text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <div className="h-6 mt-2">
                    {rating > 0 && <span className="text-yellow-400 font-semibold text-sm">
                        {['Pésimo', 'Malo', 'Regular', 'Buen trabajo', '¡Excelente!'][rating - 1]}
                    </span>}
                </div>
            </div>

            <div className="mb-6 relative">
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <MessageSquareQuote size={16} /> Comentario (Opcional)
                </label>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe tu experiencia de forma constructiva..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all resize-none"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-extrabold py-4 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
                {isSubmitting ? 'Procesando Feedback...' : 'Publicar Reseña Pública'}
            </button>
        </div>
    );
};
