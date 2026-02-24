"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEscrowPayment = exports.updateVisitStatus = exports.createQuoteAndVisit = void 0;
const db_1 = require("../config/db");
const createQuoteAndVisit = async (id, requestId, professionalId, visitFee) => {
    const query = `
        INSERT INTO quotes_and_visits (id, request_id, professional_id, visit_fee, visit_status)
        VALUES (?, ?, ?, ?, 'pending_payment')
    `;
    await db_1.dbPool.query(query, [id, requestId, professionalId, visitFee]);
};
exports.createQuoteAndVisit = createQuoteAndVisit;
const updateVisitStatus = async (id, status) => {
    await db_1.dbPool.query('UPDATE quotes_and_visits SET visit_status = ? WHERE id = ?', [status, id]);
};
exports.updateVisitStatus = updateVisitStatus;
const createEscrowPayment = async (id, requestId, payerId, payeeId, amount, purpose, mpPrefId, status) => {
    const query = `
        INSERT INTO escrow_payments (id, request_id, payer_id, payee_id, amount, purpose, mp_preference_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db_1.dbPool.query(query, [id, requestId, payerId, payeeId, amount, purpose, mpPrefId, status]);
};
exports.createEscrowPayment = createEscrowPayment;
