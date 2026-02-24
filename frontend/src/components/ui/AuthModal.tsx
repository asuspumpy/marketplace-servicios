import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            if (isLogin) {
                const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
                setSuccessMessage('¡Inicio de sesión exitoso! Ingresando...');
                setTimeout(() => {
                    login(res.data.token, res.data.user.id);
                    setIsLoading(false);
                    onClose();
                    navigate('/dashboard');
                }, 1500);
            } else {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email, password, first_name: firstName, last_name: lastName, role: 'client', gender: 'other'
                });
                setSuccessMessage('Registro casi listo. Configurando tu perfil...');
                setTimeout(() => {
                    setIsLogin(true);
                    setSuccessMessage('');
                    setIsLoading(false);
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error de autenticación');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="glass w-full max-w-md p-8 rounded-3xl relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    ✕
                </button>
                <h2 className="text-3xl font-bold mb-2 tracking-tight text-white">
                    {isLogin ? 'Inicia Sesión' : 'Únete a la Comunidad'}
                </h2>
                <p className="text-gray-400 mb-6 text-sm">
                    {isLogin ? 'Accede a precios, perfiles verificados y reseñas.' : 'Regístrate para ver profesionales de confianza.'}
                </p>

                {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">{error}</div>}
                {successMessage && <div className="p-3 mb-4 text-sm text-secondary bg-secondary/10 border border-secondary/20 rounded-lg">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="flex gap-4">
                            <input type="text" placeholder="Nombre" required value={firstName} onChange={e => setFirstName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                            <input type="text" placeholder="Apellido" required value={lastName} onChange={e => setLastName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                        </div>
                    )}
                    <input type="email" placeholder="Correo Electrónico" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />
                    <input type="password" placeholder="Contraseña" required value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors" />

                    <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            isLogin ? 'Continuar' : 'Crear Cuenta'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};
