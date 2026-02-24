import { dbPool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ServiceRequest extends RowDataPacket {
    id: string;
    client_id: string;
    property_id: string;
    title: string;
    description: string;
    complexity: 'simple' | 'complex' | 'pending_triage';
    preferred_gender: 'any' | 'female_only';
    status: 'open' | 'quoting' | 'visit_scheduled' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
}

export const createServiceRequest = async (request: Omit<ServiceRequest, 'status' | 'created_at'>): Promise<string> => {
    const query = `
        INSERT INTO service_requests (id, client_id, property_id, title, description, complexity, preferred_gender)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query<ResultSetHeader>(query, [
        request.id, request.client_id, request.property_id, request.title,
        request.description, request.complexity, request.preferred_gender
    ]);
    return request.id;
};

export const updateRequestComplexity = async (id: string, complexity: string): Promise<void> => {
    await dbPool.query('UPDATE service_requests SET complexity = ? WHERE id = ?', [complexity, id]);
};

export const updateRequestStatus = async (id: string, status: string): Promise<void> => {
    await dbPool.query('UPDATE service_requests SET status = ? WHERE id = ?', [status, id]);
};
