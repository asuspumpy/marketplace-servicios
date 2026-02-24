import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    in_stock: boolean;
    zona_disponible: string;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="glass group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(32,227,178,0.2)] hover:border-secondary/40">
            {/* Efecto de Iluminación Interna Oscura */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60 group-hover:opacity-80 transition-opacity z-0"></div>

            {/* Imagen del Producto */}
            <div className="relative h-48 w-full mb-4 z-10 overflow-hidden rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="object-cover h-full w-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
                ) : (
                    <WrenchPlaceholder />
                )}

                {/* Badge de Stock */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${product.in_stock ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {product.in_stock ? 'En Stock' : 'Agotado'}
                </div>
            </div>

            {/* Información del Producto */}
            <div className="relative z-10 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-white">${product.price}</span>
                    </div>

                    <button
                        disabled={!product.in_stock}
                        className={`p-3 rounded-xl transition-all ${product.in_stock ? 'bg-white text-black hover:bg-secondary hover:text-black shadow-[0_4px_15px_rgba(255,255,255,0.2)]' : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'}`}
                        title={product.in_stock ? "Añadir al carrito" : "Sin stock disponible"}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>

                {/* Zona de Cobertura Logística */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center text-xs text-gray-500">
                    <Package size={14} className="mr-1 opacity-70" />
                    <span>Envío exprés en: <strong className="text-gray-300">{product.zona_disponible}</strong></span>
                </div>
            </div>
        </div>
    );
};

// SVG Placeholder para la imagen cuando no hay URL real (Diseño elegante para encajar)
const WrenchPlaceholder = () => (
    <svg className="w-16 h-16 text-gray-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);
