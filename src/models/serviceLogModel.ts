import { dbPool } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const createServiceLog = async (
    id: string, requestId: string, professionalId: string,
    actionType: string, description: string, mediaUrls: string[]
): Promise<void> => {
    const query = `
        INSERT INTO service_logs (id, request_id, professional_id, action_type, description, media_urls)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query<ResultSetHeader>(query, [id, requestId, professionalId, actionType, description, JSON.stringify(mediaUrls)]);
};
