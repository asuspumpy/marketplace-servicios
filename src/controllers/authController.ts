import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, createUser } from '../models/userModel';

export const register = async (req: Request, res: Response) => {
    try {
        const { role, email, password, first_name, last_name, gender, phone_number } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await createUser({
            id: userId,
            role,
            email,
            password_hash,
            first_name,
            last_name,
            gender,
            phone_number
        });

        // NOTA: Acá iría el registro de "legal_agreements" (Blindaje Legal)

        res.status(201).json({
            message: 'Usuario registrado exitosamente. Estado: pending_kyc',
            userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, is_risk_user: user.is_risk_user },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
