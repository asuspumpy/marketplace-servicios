"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEscrowStatus = exports.createDispute = void 0;
const db_1 = require("../config/db");
const createDispute = async (id, requestId, escrowId, initiatorId, reasonCategory, description) => {
    const query = `
        INSERT INTO disputes (id, request_id, escrow_id, initiator_id, reason_category, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db_1.dbPool.query(query, [id, requestId, escrowId, initiatorId, reasonCategory, description]);
};
exports.createDispute = createDispute;
const updateEscrowStatus = async (id, status) => {
    await db_1.dbPool.query('UPDATE escrow_payments SET status = ? WHERE id = ?', [status, id]);
};
exports.updateEscrowStatus = updateEscrowStatus;
