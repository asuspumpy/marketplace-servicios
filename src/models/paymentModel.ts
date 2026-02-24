import { dbPool } from '../config/db';
import { ResultSetHeader } from 'mysql2';
import { updateEscrowStatus } from './disputeModel';

export const submitFinalQuote = async (id: string, requestId: string, laborCost: number, materialsCost: number): Promise<void> => {
    // El profesional envía el presupuesto final tras el diagnóstico complejo
    const query = `
        UPDATE quotes_and_visits 
        SET final_labor_cost = ?, materials_cost = ?, quote_status = 'submitted'
        WHERE request_id = ? AND id = ?
    `;
    await dbPool.query(query, [laborCost, materialsCost, requestId, id]);
};

export const updateFinalQuoteStatus = async (requestId: string, offerId: string, status: string): Promise<void> => {
    const query = `
        UPDATE quotes_and_visits 
        SET quote_status = ?
        WHERE request_id = ? AND id = ?
    `;
    await dbPool.query(query, [status, requestId, offerId]);
};

// Se reusa createEscrowPayment desde visitModel.ts

// Liberar fondos en MP (Simulado por la Skill o webhook real de MP)
export const releaseEscrowFunds = async (escrowId: string): Promise<void> => {
    const query = `
        UPDATE escrow_payments 
        SET status = 'released', released_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    await dbPool.query(query, [escrowId]);
};
