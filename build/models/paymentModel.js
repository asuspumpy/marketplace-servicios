"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseEscrowFunds = exports.updateFinalQuoteStatus = exports.submitFinalQuote = void 0;
const db_1 = require("../config/db");
const submitFinalQuote = async (id, requestId, laborCost, materialsCost) => {
    // El profesional envía el presupuesto final tras el diagnóstico complejo
    const query = `
        UPDATE quotes_and_visits 
        SET final_labor_cost = ?, materials_cost = ?, quote_status = 'submitted'
        WHERE request_id = ? AND id = ?
    `;
    await db_1.dbPool.query(query, [laborCost, materialsCost, requestId, id]);
};
exports.submitFinalQuote = submitFinalQuote;
const updateFinalQuoteStatus = async (requestId, offerId, status) => {
    const query = `
        UPDATE quotes_and_visits 
        SET quote_status = ?
        WHERE request_id = ? AND id = ?
    `;
    await db_1.dbPool.query(query, [status, requestId, offerId]);
};
exports.updateFinalQuoteStatus = updateFinalQuoteStatus;
// Se reusa createEscrowPayment desde visitModel.ts
// Liberar fondos en MP (Simulado por la Skill o webhook real de MP)
const releaseEscrowFunds = async (escrowId) => {
    const query = `
        UPDATE escrow_payments 
        SET status = 'released', released_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    await db_1.dbPool.query(query, [escrowId]);
};
exports.releaseEscrowFunds = releaseEscrowFunds;
