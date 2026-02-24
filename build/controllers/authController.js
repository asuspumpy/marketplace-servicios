"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const userModel_1 = require("../models/userModel");
const register = async (req, res) => {
    try {
        const { role, email, password, first_name, last_name, gender, phone_number } = req.body;
        const existingUser = await (0, userModel_1.getUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)();
        await (0, userModel_1.createUser)({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, userModel_1.getUserByEmail)(email);
        if (!user || !(await bcryptjs_1.default.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, is_risk_user: user.is_risk_user }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.login = login;
