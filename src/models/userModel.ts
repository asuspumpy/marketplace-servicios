import { dbPool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User extends RowDataPacket {
    id: string;
    role: 'client' | 'professional' | 'admin';
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    gender: 'male' | 'female' | 'other';
    phone_number?: string;
    status: 'pending_kyc' | 'active' | 'suspended';
    is_risk_user: boolean;
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await dbPool.query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (user: Omit<User, 'status' | 'is_risk_user' | 'created_at' | 'updated_at'>): Promise<string> => {
    const query = `
        INSERT INTO users (id, role, email, password_hash, first_name, last_name, gender, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query<ResultSetHeader>(query, [
        user.id, user.role, user.email, user.password_hash,
        user.first_name, user.last_name, user.gender, user.phone_number || null
    ]);
    return user.id;
};
