import { dbPool } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const createQuoteAndVisit = async (id: string, requestId: string, professionalId: string, visitFee: number): Promise<void> => {
    const query = `
        INSERT INTO quotes_and_visits (id, request_id, professional_id, visit_fee, visit_status)
        VALUES (?, ?, ?, ?, 'pending_payment')
    `;
    await dbPool.query<ResultSetHeader>(query, [id, requestId, professionalId, visitFee]);
};

export const updateVisitStatus = async (id: string, status: string): Promise<void> => {
    await dbPool.query('UPDATE quotes_and_visits SET visit_status = ? WHERE id = ?', [status, id]);
};

export const createEscrowPayment = async (
    id: string, requestId: string, payerId: string, payeeId: string, amount: number, purpose: string, mpPrefId: string, status: string
): Promise<void> => {
    const query = `
        INSERT INTO escrow_payments (id, request_id, payer_id, payee_id, amount, purpose, mp_preference_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query<ResultSetHeader>(query, [id, requestId, payerId, payeeId, amount, purpose, mpPrefId, status]);
};
