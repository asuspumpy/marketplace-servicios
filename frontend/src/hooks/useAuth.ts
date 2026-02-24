import { useState } from 'react';

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

    // Función para iniciar sesión y guardar los datos
    const login = (newToken: string, newUserId: string) => {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userId', newUserId);
        setToken(newToken);
        setUserId(newUserId);
        setIsLoggedIn(true);
    };

    // Función para cerrar sesión (Limpieza)
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
        setIsLoggedIn(false);
    };

    return { token, userId, isLoggedIn, login, logout };
};
