import { dbPool } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const createReview = async (
    id: string, requestId: string, reviewerId: string, revieweeId: string,
    rating: number, comment: string, isRiskFlag: boolean
): Promise<void> => {
    const query = `
        INSERT INTO reviews (id, request_id, reviewer_id, reviewee_id, rating, comment, is_risk_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query<ResultSetHeader>(query, [id, requestId, reviewerId, revieweeId, rating, comment, isRiskFlag]);
};

export const markUserAsRisk = async (userId: string): Promise<void> => {
    await dbPool.query('UPDATE users SET is_risk_user = TRUE WHERE id = ?', [userId]);
};

export const checkRiskFlagsCount = async (userId: string): Promise<number> => {
    const [rows] = await dbPool.query<any[]>('SELECT COUNT(*) as flags FROM reviews WHERE reviewee_id = ? AND is_risk_flag = TRUE', [userId]);
    return rows[0].flags;
};
