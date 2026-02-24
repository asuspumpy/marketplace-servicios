import React, { useState } from 'react';
import { Search, SlidersHorizontal, UserCheck } from 'lucide-react';
import { ProfessionalCard } from '../components/ui/ProfessionalCard';
import type { ProfessionalData } from '../components/ui/ProfessionalCard';

// MOCK DATA: En entorno real, esto viene de la API REST via GET /api/professionals?category=...&gender=...
const MOCK_PROFESSIONALS: ProfessionalData[] = [
    { id: '1', firstName: 'Carlos', lastName: 'Rodríguez', category: 'Electricidad', rating: 4.9, totalJobs: 132, priceRate: '$15.000', isVerified: true, gender: 'male' },
    { id: '2', firstName: 'María', lastName: 'González', category: 'Plomería', rating: 5.0, totalJobs: 89, priceRate: '$18.000', isVerified: true, gender: 'female' },
    { id: '3', firstName: 'Laura', lastName: 'Martínez', category: 'Gasista', rating: 4.7, totalJobs: 45, priceRate: '$25.000', isVerified: true, gender: 'female' },
    { id: '4', firstName: 'Roberto', lastName: 'Díaz', category: 'Cerrajería', rating: 4.8, totalJobs: 210, priceRate: '$12.000', isVerified: true, gender: 'male' },
];

export const ProfessionalSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [femaleOnly, setFemaleOnly] = useState(false);

    const categories = ['Todas', 'Plomería', 'Electricidad', 'Gasista', 'Cerrajería', 'Climatización'];

    // Lógica de Filtado en el Cliente (idealmente en Servidor)
    const filteredProfessionals = MOCK_PROFESSIONALS.filter(pro => {
        const matchesSearch = `${pro.firstName} ${pro.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Todas' || pro.category === categoryFilter;
        const matchesGender = femaleOnly ? pro.gender === 'female' : true;
        return matchesSearch && matchesCategory && matchesGender;
    });

    const handleViewProfile = (id: string) => {
        alert(`Navegar al perfil: /profile/${id}`); // TBD: Implementar Profile Page
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Cabecera & Buscador */}
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Encuentra <span className="text-primary">Especialistas Verificados</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mb-8">Todos nuestros profesionales atraviesan un riguroso control de identidad. Escrow activo en todas las contrataciones.</p>

                    <div className="flex flex-col md:flex-row gap-4 glass p-4 rounded-2xl items-center border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="¿Qué servicio necesitas hoy?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-transparent rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg"
                            />
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                        <button className="bg-primary hover:bg-accent text-black font-bold py-4 px-8 rounded-xl transition-all w-full md:w-auto uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                            <SlidersHorizontal size={18} /> Explorar
                        </button>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Panel de Filtros Laterales */}
                    <aside className="w-full lg:w-1/4">
                        <div className="glass p-6 rounded-3xl sticky top-28 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <SlidersHorizontal className="text-primary" size={20} /> Filtros de Búsqueda
                            </h3>

                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Categoría de Servicio</h4>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${categoryFilter === cat ? 'bg-primary text-black' : 'text-gray-300 hover:bg-white/5'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl border border-secondary/30 bg-secondary/5">
                                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><UserCheck size={16} className="text-secondary" /> Espacio Seguro</h4>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={femaleOnly} onChange={() => setFemaleOnly(!femaleOnly)} />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${femaleOnly ? 'bg-secondary' : 'bg-gray-700'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${femaleOnly ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Mujeres para Mujeres</span>
                                </label>
                                <p className="text-xs text-secondary/80 mt-2">Filtra para mostrar únicamente profesionales mujeres verificadas.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Grilla de Resultados */}
                    <main className="w-full lg:w-3/4">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-bold text-white">Resultados <span className="text-gray-500 text-lg font-normal ml-2">({filteredProfessionals.length})</span></h2>
                        </div>

                        {filteredProfessionals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredProfessionals.map((pro) => (
                                    <ProfessionalCard
                                        key={pro.id}
                                        professional={pro}
                                        onViewProfile={handleViewProfile}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass p-12 rounded-3xl text-center border border-white/5 flex flex-col items-center justify-center">
                                <Search className="text-gray-600 mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-white mb-2">Sin resultados</h3>
                                <p className="text-gray-400 max-w-md mx-auto">No hemos encontrado profesionales que coincidan con tu búsqueda. Intenta modificar los filtros de categoría o destildar el espacio seguro.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
