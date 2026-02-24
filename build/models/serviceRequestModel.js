"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestStatus = exports.updateRequestComplexity = exports.createServiceRequest = void 0;
const db_1 = require("../config/db");
const createServiceRequest = async (request) => {
    const query = `
        INSERT INTO service_requests (id, client_id, property_id, title, description, complexity, preferred_gender)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db_1.dbPool.query(query, [
        request.id, request.client_id, request.property_id, request.title,
        request.description, request.complexity, request.preferred_gender
    ]);
    return request.id;
};
exports.createServiceRequest = createServiceRequest;
const updateRequestComplexity = async (id, complexity) => {
    await db_1.dbPool.query('UPDATE service_requests SET complexity = ? WHERE id = ?', [complexity, id]);
};
exports.updateRequestComplexity = updateRequestComplexity;
const updateRequestStatus = async (id, status) => {
    await db_1.dbPool.query('UPDATE service_requests SET status = ? WHERE id = ?', [status, id]);
};
exports.updateRequestStatus = updateRequestStatus;
