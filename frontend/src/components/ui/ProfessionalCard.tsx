import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import axios from 'axios';

export interface ProfessionalData {
    id: string;
    firstName: string;
    lastName: string;
    category: string;
    rating: number;
    totalJobs: number;
    priceRate: string;
    avatarUrl?: string;
    isVerified: boolean;
    gender: 'male' | 'female' | 'other';
}

interface ProfessionalCardProps {
    professional: ProfessionalData;
    onViewProfile: (id: string) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onViewProfile }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Evitamos disparar el ViewProfile
        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${API_URL}/api/payments/create-preference`, {
                title: `Visita Técnica - ${professional.firstName} ${professional.lastName}`,
                unit_price: parseInt(professional.priceRate.replace(/\D/g, '')), // Formateamos '$15.000' -> 15000
                quantity: 1,
                service_id: `REQ-${Date.now()}`,
                payee_id: professional.id
            });

            // Redirigir al usuario al Checkout Pro de Mercado Pago
            if (response.data && response.data.init_point) {
                window.location.href = response.data.init_point;
            }
        } catch (error) {
            console.error("Error al generar checkout:", error);
            alert("Hubo un problema procesando el pago temporalmente.");
            setIsLoading(false);
        }
    };

    return (
        <div className="glass p-6 rounded-3xl w-full border border-white/10 hover:border-primary/40 transition-all duration-300 group cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(12,235,235,0.2)]" onClick={() => onViewProfile(professional.id)}>
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    {professional.avatarUrl ? (
                        <img src={professional.avatarUrl} alt={`${professional.firstName} ${professional.lastName}`} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-primary/20 flex items-center justify-center text-xl font-bold text-white">
                            {professional.firstName[0]}{professional.lastName[0]}
                        </div>
                    )}
                    {professional.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" title="Identidad de Alto Riesgo Verificada y Aprobada">
                            <ShieldCheck className="text-secondary fill-secondary/20" size={20} />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors">
                        {professional.firstName} {professional.lastName}
                    </h3>
                    <p className="text-primary font-medium text-sm">{professional.category}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                        <MapPin size={14} /> Zona de Cobertura Activa
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="font-bold text-white text-lg">{professional.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{professional.totalJobs} reseñas completadas</p>
                </div>
                <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5 flex flex-col justify-center">
                    <span className="text-xs text-gray-400">Tarifa Visita</span>
                    <span className="font-bold text-white text-lg">{professional.priceRate}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onViewProfile(professional.id)}
                    className="w-1/2 bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all text-sm"
                >
                    Ver Perfil
                </button>
                <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-1/2 bg-gradient-to-r from-primary to-accent text-black font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(12,235,235,0.3)] disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <><CreditCard size={16} /> Contratar Visita</>
                    )}
                </button>
            </div>
        </div>
    );
};
