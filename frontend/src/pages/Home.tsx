import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/ui/AuthModal';
import { CategoryButton } from '../components/ui/CategoryButton';
import { EcommerceSection } from '../components/ui/EcommerceSection';
import { Zap, Droplets, Wrench, ThermometerSun, ShieldCheck, Lock } from 'lucide-react';

export const Home: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [femaleOnly, setFemaleOnly] = useState(false);

    const categories = [
        { id: 'electrician', title: 'Electricidad', icon: <Zap size={32} /> },
        { id: 'plumber', title: 'Plomería', icon: <Droplets size={32} /> },
        { id: 'locksmith', title: 'Cerrajería', icon: <Wrench size={32} /> },
        { id: 'hvac', title: 'Climatización', icon: <ThermometerSun size={32} /> },
    ];

    const handleCategoryClick = (id: string) => {
        setSelectedCategory(id);
    };

    const handleProtectedAction = () => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center -mt-10">
            {/* Efectos de Iluminación de Fondo */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-[128px] opacity-50"></div>

            <main className="relative z-10 w-full max-w-5xl px-6 text-center">
                {/* Hero Section: Pregunta Maestra */}
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-white to-gray-500 text-transparent bg-clip-text">
                    ¿Qué necesitas solucionar hoy?
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-8">
                    Encuentra profesionales expertos para tu hogar. Con Escrow, Trazabilidad y Seguridad garantizada.
                </p>

                <div className="flex justify-center mb-12">
                    <button
                        onClick={() => navigate('/search')}
                        className="bg-primary text-black font-extrabold py-4 px-10 rounded-full hover:bg-accent transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(12,235,235,0.4)]"
                    >
                        Explorar Catálogo Público
                    </button>
                </div>

                {/* Switch de Privacidad / Curaduría de Género */}
                <div className="flex items-center justify-center space-x-3 mb-10">
                    <span className="text-gray-400 font-medium">Cualquier Profesional</span>
                    <button
                        onClick={() => setFemaleOnly(!femaleOnly)}
                        className={`w-14 h-7 rounded-full transition-colors duration-300 relative ${femaleOnly ? 'bg-primary' : 'bg-surface'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 ${femaleOnly ? 'translate-x-8' : 'translate-x-1 shadow-md'}`}></div>
                    </button>
                    <span className={`font-medium ${femaleOnly ? 'text-primary' : 'text-gray-400'}`}>Solo Mujeres (Sector Especial)</span>
                </div>

                {/* Categorías */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {categories.map((cat) => (
                        <CategoryButton
                            key={cat.id}
                            title={cat.title}
                            icon={cat.icon}
                            isActive={selectedCategory === cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                        />
                    ))}
                </div>

                {/* Preview Result / Paywall */}
                {selectedCategory && (
                    <div className="glass p-8 rounded-3xl max-w-3xl mx-auto text-left relative overflow-hidden transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Profesionales Disponibles</h3>
                            <div className="flex items-center text-primary text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full">
                                <ShieldCheck size={16} className="mr-1" />
                                Identidad Validada
                            </div>
                        </div>

                        {/* Fila Protegida (Paywall) */}
                        <div className="relative">
                            <div className={`space-y-4 ${!isLoggedIn ? 'filter blur-[8px] opacity-40 select-none pointer-events-none' : ''}`}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-white/5">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                                            <div>
                                                <h4 className="font-bold text-lg">Profesional Confiable #{i}</h4>
                                                <p className="text-sm text-gray-400">⭐⭐⭐⭐⭐ (120 Reseñas)</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-sm">Visita Técnica</p>
                                            <p className="text-2xl font-bold text-white">$ {i * 15}00</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Overlayer del Paywall */}
                            {!isLoggedIn && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <Lock size={48} className="text-white mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Precios y Perfiles Ocultos</h3>
                                    <p className="text-gray-300 mb-6 text-center max-w-sm">Únete a la comunidad para ver tarifas, perfiles verificados y contactar profesionales.</p>
                                    <button
                                        onClick={handleProtectedAction}
                                        className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105"
                                    >
                                        Desbloquear Accesos
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Separador Sutil */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10 relative z-20"></div>

            {/* Nueva Sección Tienda Integrada */}
            <EcommerceSection />

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};
