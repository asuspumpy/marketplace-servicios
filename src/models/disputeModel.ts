import { dbPool } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const createDispute = async (
    id: string, requestId: string, escrowId: string,
    initiatorId: string, reasonCategory: string, description: string
): Promise<void> => {
    const query = `
        INSERT INTO disputes (id, request_id, escrow_id, initiator_id, reason_category, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query<ResultSetHeader>(query, [id, requestId, escrowId, initiatorId, reasonCategory, description]);
};

export const updateEscrowStatus = async (id: string, status: string): Promise<void> => {
    await dbPool.query('UPDATE escrow_payments SET status = ? WHERE id = ?', [status, id]);
};
