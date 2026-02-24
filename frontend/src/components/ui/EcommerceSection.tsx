import React, { useRef } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        title: 'Taladro Percutor Bosch 800W',
        description: 'Herramienta profesional ideal para instalaciones domésticas. Incluye maletín y set de 15 brocas.',
        price: 45000,
        image_url: '',
        in_stock: true,
        zona_disponible: 'CABA y GBA'
    },
    {
        id: 'p2',
        title: 'Detector de Fugas de Gas Testo',
        description: 'Sensor ultrasensible homologado para gasistas matriculados. Pantalla digital y alarma.',
        price: 125000,
        image_url: '',
        in_stock: true,
        zona_disponible: 'Todo el País'
    },
    {
        id: 'p3',
        title: 'Set Llaves Tubo Bahco 94 Pzs',
        description: 'Caja de herramientas esencial de acero cromo vanadio. Garantía de por vida.',
        price: 89000,
        image_url: '',
        in_stock: false,
        zona_disponible: 'CABA'
    },
    {
        id: 'p4',
        title: 'Bomba de Vacío Value 1/3 HP',
        description: 'Especial para instalación de Aires Acondicionados. Doble etapa con vacuómetro.',
        price: 95000,
        image_url: '',
        in_stock: true,
        zona_disponible: 'GBA Norte'
    }
];

export const EcommerceSection: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Ancho aproximado de la tarjeta + gap
            const currentScroll = scrollContainerRef.current.scrollLeft;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-20 mt-10 relative z-20">
            {/* Header de la Tienda */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-2">Equipamiento Profesional</h2>
                    <p className="text-gray-400">Herramientas avaladas para tus reparaciones en casa</p>
                </div>

                {/* Controles del Carrusel */}
                <div className="flex gap-3 hidden md:flex">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-md"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-md"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {/* Carrusel Deslizable */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {MOCK_PRODUCTS.map((prod) => (
                    <div key={prod.id} className="min-w-[300px] md:min-w-[340px] snap-center shrink-0">
                        <ProductCard product={prod} />
                    </div>
                ))}
            </div>
        </section>
    );
};
