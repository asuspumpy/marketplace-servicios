import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface EvidenceUploaderProps {
    serviceId: string;
    userId: string;
    onUploadSuccess?: (mediaUrls: string[]) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ serviceId, userId, onUploadSuccess }) => {
    // Estado local para simular la previsualización y subida de archivos
    const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
    const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    // Mock functions to simulate file selection
    const handleFileSelect = (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulamos la creación de una URL local
            const previewUrl = URL.createObjectURL(file);
            if (type === 'before') setBeforePhoto(previewUrl);
            else setAfterPhoto(previewUrl);
        }
    };

    const handleUpload = () => {
        if (!beforePhoto || !afterPhoto) return;
        setIsUploading(true);
        console.log(`[TrustEngine] Iniciando subida de evidencias para usuario: ${userId}`);

        // Simulamos la latencia de la red (Ej. S3/Cloudinary)
        setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
            if (onUploadSuccess) {
                // Devolvemos URLs mockeadas
                onUploadSuccess(['https://mock.com/before.jpg', 'https://mock.com/after.jpg']);
            }
        }, 2000);
    };

    return (
        <div className="glass p-6 rounded-3xl w-full max-w-2xl mx-auto shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <ImageIcon className="text-primary" /> Evidencia del Servicio
                </h3>
                <p className="text-gray-400 text-sm mt-1">Sube las fotos de estado inicial y resultado final. Esto blinda el Escrow y aumenta tu reputación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Dropzone Antes */}
                <div className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${beforePhoto ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-white/40 bg-white/5'}`}>
                    {beforePhoto ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                            <img src={beforePhoto} alt="Estado Antes" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white text-sm font-semibold">Cambiar Foto</p>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileSelect('before', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    ) : (
                        <>
                            <UploadCloud size={36} className="text-gray-400 mb-3" />
                            <p className="text-sm font-semibold text-white">Foto del Antes</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-[150px] text-center">Formato inicial del problema</p>
                            <input type="file" accept="image/*" onChange={(e) => handleFileSelect('before', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </>
                    )}
                </div>

                {/* Dropzone Después */}
                <div className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${afterPhoto ? 'border-accent bg-accent/5' : 'border-white/20 hover:border-white/40 bg-white/5'}`}>
                    {afterPhoto ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden group border border-accent/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <img src={afterPhoto} alt="Estado Después" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white text-sm font-semibold">Cambiar Foto</p>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileSelect('after', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    ) : (
                        <>
                            <UploadCloud size={36} className="text-gray-400 mb-3" />
                            <p className="text-sm font-semibold text-white">Foto del Después</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-[150px] text-center">Trabajo finalizado y pulcro</p>
                            <input type="file" accept="image/*" onChange={(e) => handleFileSelect('after', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </>
                    )}
                </div>
            </div>

            {uploadComplete ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center justify-center gap-2 animate-fade-in-up">
                    <CheckCircle size={20} />
                    <span className="font-semibold">¡Evidencia vinculada correctamente al Ticket #{serviceId}!</span>
                </div>
            ) : (
                <button
                    onClick={handleUpload}
                    disabled={!beforePhoto || !afterPhoto || isUploading}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-black rounded-full animate-spin"></div>
                            Sincronizando con la nube...
                        </>
                    ) : (
                        'Anexar Evidencia a la Bitácora'
                    )}
                </button>
            )}
        </div>
    );
};
