import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { createServiceLog } from '../models/serviceLogModel';

export const addLogToBitacora = async (req: AuthRequest, res: Response) => {
    try {
        const { request_id, action_type, description, media_urls } = req.body;
        const professionalId = req.user!.id;
        const logId = uuidv4();

        // Validamos que el actionType sea correcto de acuerdo a la Trazabilidad definida
        const allowedActions = ['arrival', 'diagnosis', 'quote_submitted', 'work_started', 'milestone_reached', 'work_finished'];
        if (!allowedActions.includes(action_type)) {
            return res.status(400).json({ message: 'Tipo de acción no permitida en la bitácora.' });
        }

        await createServiceLog(logId, request_id, professionalId, action_type, description, media_urls || []);

        res.status(201).json({
            message: 'Registro añadido a la bitácora de servicio',
            logId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar avance en la bitácora' });
    }
};
