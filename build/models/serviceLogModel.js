"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceLog = void 0;
const db_1 = require("../config/db");
const createServiceLog = async (id, requestId, professionalId, actionType, description, mediaUrls) => {
    const query = `
        INSERT INTO service_logs (id, request_id, professional_id, action_type, description, media_urls)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db_1.dbPool.query(query, [id, requestId, professionalId, actionType, description, JSON.stringify(mediaUrls)]);
};
exports.createServiceLog = createServiceLog;
