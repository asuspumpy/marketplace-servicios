"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserByEmail = void 0;
const db_1 = require("../config/db");
const getUserByEmail = async (email) => {
    const [rows] = await db_1.dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
};
exports.getUserByEmail = getUserByEmail;
const createUser = async (user) => {
    const query = `
        INSERT INTO users (id, role, email, password_hash, first_name, last_name, gender, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db_1.dbPool.query(query, [
        user.id, user.role, user.email, user.password_hash,
        user.first_name, user.last_name, user.gender, user.phone_number || null
    ]);
    return user.id;
};
exports.createUser = createUser;
