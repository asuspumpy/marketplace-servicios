"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRiskFlagsCount = exports.markUserAsRisk = exports.createReview = void 0;
const db_1 = require("../config/db");
const createReview = async (id, requestId, reviewerId, revieweeId, rating, comment, isRiskFlag) => {
    const query = `
        INSERT INTO reviews (id, request_id, reviewer_id, reviewee_id, rating, comment, is_risk_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db_1.dbPool.query(query, [id, requestId, reviewerId, revieweeId, rating, comment, isRiskFlag]);
};
exports.createReview = createReview;
const markUserAsRisk = async (userId) => {
    await db_1.dbPool.query('UPDATE users SET is_risk_user = TRUE WHERE id = ?', [userId]);
};
exports.markUserAsRisk = markUserAsRisk;
const checkRiskFlagsCount = async (userId) => {
    const [rows] = await db_1.dbPool.query('SELECT COUNT(*) as flags FROM reviews WHERE reviewee_id = ? AND is_risk_flag = TRUE', [userId]);
    return rows[0].flags;
};
exports.checkRiskFlagsCount = checkRiskFlagsCount;
